"""Smartlead campaign lifecycle behind the client's safety gates.

The Smartlead account is shared with other brands, so every write first checks
live that the campaign sends only from ExpressEarth mailboxes
(``SMARTLEAD_SENDER_DOMAINS``) -- including pause/stop, since pausing another
brand's live campaign is harmful too. On top of that, nothing is created,
enrolled or started unless the feature flags are on *and* the campaign and
every lead pass their checks. Read-only calls (listing, stats) are always allowed.
"""
import logging

from django.db import transaction
from django.urls import reverse
from django.utils import timezone

from .. import conf
from ..clients import SmartleadClient
from ..clients.smartlead import ADD_LEADS_BATCH
from ..permissions import is_campaign_approver\nfrom ..models import (
    ACTIVE_OUTREACH,
    Campaign,
    CampaignEnrollment,
    OutreachEvent,
    OutreachStatus,
    SuppressionEntry,
)
from .lead_qualification import enrollment_blockers

logger = logging.getLogger(__name__)

WEBHOOK_EVENTS = ("EMAIL_SENT", "EMAIL_OPEN", "EMAIL_REPLY", "EMAIL_BOUNCE",
                  "LEAD_UNSUBSCRIBED", "LEAD_CATEGORY_UPDATED")
STATUS_AFTER = {"START": "ACTIVE", "PAUSED": "PAUSED", "STOPPED": "STOPPED"}
# Only campaigns that can still take leads are imported and reconciled.
LIVE_STATUSES = ("ACTIVE", "PAUSED", "DRAFTED")
_LEADS_PAGE = 100
_MAX_LEAD_PAGES = 50


class GateClosed(Exception):
    """A safety gate refused the action; ``blockers`` says why."""

    def __init__(self, blockers):
        super().__init__("; ".join(blockers))
        self.blockers = list(blockers)


def _require(blockers):
    if blockers:
        raise GateClosed(blockers)


def _domain(email):
    return (email or "").rpartition("@")[2].lower()


## ===== ExpressEarth scope & sender checks (live, from Smartlead) ===== ##

def sender_report(campaign, client):
    """One row per mailbox attached to the campaign, with Smartlead's own checks.

    DNS results only exist on the account-wide mailbox list, so the campaign's
    mailboxes are joined to it by id.
    """
    attached = client.list_campaign_email_accounts(campaign.smartlead_campaign_id)
    dns_by_id = {}
    if attached:
        dns_by_id = {m["id"]: m.get("dns_validation_status") or {}
                     for m in client.list_email_accounts()}
    allowed = conf.smartlead_sender_domains()
    report = []
    for mailbox in attached:
        dns = dns_by_id.get(mailbox["id"]) or {}
        report.append({
            "email": mailbox.get("from_email") or "",
            "allowed_domain": _domain(mailbox.get("from_email")) in allowed,
            "spf": bool(dns.get("isSPFVerified")),
            "dkim": bool(dns.get("isDKIMVerified")),
            "dmarc": bool(dns.get("isDMARCVerified")),
            "smtp_ok": bool(mailbox.get("is_smtp_success")),
            "dns_checked_at": dns.get("lastVerifiedTime") or "",
        })
    return report


def scope_blockers(report):
    """Is this ExpressEarth's campaign? Judged by the mailboxes it sends from."""
    if not report:
        return ["No sender mailbox is attached to this campaign in Smartlead."]
    outside = [row["email"] for row in report if not row["allowed_domain"]]
    if outside:
        domains = ", ".join(sorted(conf.smartlead_sender_domains()))
        return [f"Campaign sends from mailboxes outside ExpressEarth's domains ({domains}): "
                f"{', '.join(outside)}"]
    return []


def auth_blockers(report):
    """SPF/DKIM/DMARC and SMTP health of every attached mailbox, per Smartlead."""
    blockers = []
    unauthenticated = [r["email"] for r in report if not (r["spf"] and r["dkim"] and r["dmarc"])]
    if unauthenticated:
        blockers.append(f"SPF/DKIM/DMARC not verified in Smartlead for: "
                        f"{', '.join(unauthenticated)}")
    failing = [r["email"] for r in report if not r["smtp_ok"]]
    if failing:
        blockers.append(f"SMTP connection failing in Smartlead for: {', '.join(failing)}")
    return blockers


def require_in_scope(campaign, client, allow_empty=False):
    """Live check before any write. ``allow_empty`` lets a campaign we created
    be configured before its mailboxes are attached."""
    if not campaign.smartlead_campaign_id:
        raise GateClosed(["Campaign does not exist in Smartlead yet."])
    report = sender_report(campaign, client)
    if report or not allow_empty:
        _require(scope_blockers(report))
    return report


def _require_own_mailboxes(client, email_account_ids):
    allowed = conf.smartlead_sender_domains()
    by_id = {m["id"]: m for m in client.list_email_accounts()}
    foreign = [str(i) for i in email_account_ids
               if i not in by_id or _domain(by_id[i].get("from_email")) not in allowed]
    if foreign:
        raise GateClosed([f"Mailbox id(s) {', '.join(foreign)} are not ExpressEarth sender "
                          f"mailboxes."])


## ===== Gates (local state) ===== ##

def write_blockers():
    if not conf.smartlead_write_enabled():
        return ["Smartlead writes are disabled (SMARTLEAD_WRITE_ENABLED is off)."]
    return []


def campaign_blockers(campaign):
    """What stops leads being added to (or sent from) this campaign."""
    blockers = write_blockers()
    if not campaign.smartlead_campaign_id:
        blockers.append("Campaign does not exist in Smartlead yet.")
    if not campaign.sender_verified:
        blockers.append("Sender mailboxes not verified (SPF/DKIM/DMARC/SMTP) by an admin.")
    if not campaign.approved_for_sending:
        blockers.append("Campaign not approved for sending by an admin.")
    return blockers


def sending_blockers(campaign):
    """What stops the campaign from being started (local checks; live ones run on START)."""
    blockers = campaign_blockers(campaign)
    if not conf.smartlead_sending_enabled():
        blockers.insert(0, "Sending is disabled (SMARTLEAD_SENDING_ENABLED is off).")
    ineligible = suppressed_enrollment_count(campaign)
    if ineligible:
        blockers.append(f"{ineligible} enrolled lead(s) are now suppressed: remove them first.")
    return blockers


def suppressed_enrollment_count(campaign):
    """Active enrollments whose email or domain is now suppressed (two queries total)."""
    rows = list(campaign.enrollments.filter(status__in=ACTIVE_OUTREACH)
                .values_list("contact__email", "contact__company__domain"))
    if not rows:
        return 0
    emails = {email for email, _ in rows if email}
    domains = {email.split("@", 1)[1] for email in emails if "@" in email}
    domains |= {domain for _, domain in rows if domain}
    blocked_emails = set(SuppressionEntry.objects.filter(email__in=emails)
                         .values_list("email", flat=True))
    blocked_domains = set(SuppressionEntry.objects.filter(domain__in=domains)
                          .values_list("domain", flat=True))
    return sum(1 for email, domain in rows
               if email in blocked_emails or domain in blocked_domains
               or (email and email.split("@", 1)[-1] in blocked_domains))


## ===== Campaigns ===== ##

def sync_campaigns(*, user=None):
    """Import ExpressEarth's campaigns from the shared Smartlead account.

    New campaigns are imported only if they are ACTIVE/PAUSED/DRAFTED and every
    attached mailbox is on an ExpressEarth domain; other brands' campaigns are
    skipped. Campaigns already imported just get their name/status refreshed.
    Returns ``(campaigns, skipped_count)``.
    """
    client = SmartleadClient(user)
    allowed = conf.smartlead_sender_domains()
    known = {c.smartlead_campaign_id: c for c in Campaign.objects.exclude(smartlead_campaign_id=None)}
    campaigns, skipped = [], 0
    for item in client.list_campaigns() or []:
        campaign = known.get(item["id"])
        if campaign is None:
            if item.get("status") not in LIVE_STATUSES:
                continue
            domains = {_domain(m.get("from_email"))
                       for m in client.list_campaign_email_accounts(item["id"])}
            if not domains or not domains <= allowed:
                skipped += 1
                continue
            campaign = Campaign(smartlead_campaign_id=item["id"])
        campaign.name = item.get("name") or campaign.name or f"Campaign {item['id']}"
        campaign.status = item.get("status") or campaign.status
        campaign.last_synced_at = timezone.now()
        campaign.save()
        campaigns.append(campaign)
    return campaigns, skipped


def register_webhook(campaign, client):
    secret, base = conf.smartlead_webhook_secret(), conf.public_base_url()
    if not (secret and base and campaign.smartlead_campaign_id):
        logger.warning("Smartlead webhook not registered for campaign %s: "
                       "SMARTLEAD_WEBHOOK_SECRET or LEADGEN_PUBLIC_BASE_URL missing", campaign.pk)
        return False
    url = base + reverse("apollo_smartlead:smartlead-webhook", args=[secret])
    data = client.create_campaign_webhook(campaign.smartlead_campaign_id,
                                          f"ExpressEarth leadgen #{campaign.pk}", url,
                                          WEBHOOK_EVENTS)
    campaign.smartlead_webhook_id = str((data or {}).get("id") or "")
    campaign.save(update_fields=["smartlead_webhook_id", "updated_at"])
    return True


def enable_webhook(campaign, *, user):
    """Register our webhook on an imported ExpressEarth campaign (a Smartlead write)."""
    _require(write_blockers())
    client = SmartleadClient(user)
    require_in_scope(campaign, client)
    if not register_webhook(campaign, client):
        raise GateClosed(["Set SMARTLEAD_WEBHOOK_SECRET and LEADGEN_PUBLIC_BASE_URL first."])
    return campaign


def create_campaign(*, user, name, email_account_ids=None, **config):
    _require(write_blockers())
    client = SmartleadClient(user)
    if email_account_ids:
        _require_own_mailboxes(client, email_account_ids)  # before anything exists in Smartlead
    data = client.create_campaign(name)
    campaign = Campaign.objects.create(
        smartlead_campaign_id=data["id"], name=data.get("name") or name,
        status=data.get("status") or "DRAFTED", created_by=user,
    )
    configure_campaign(campaign, user=user, client=client, email_account_ids=email_account_ids,
                       **config)
    register_webhook(campaign, client)
    return campaign


def configure_campaign(campaign, *, user, client=None, sequences=None, settings=None,
                       schedule=None, email_account_ids=None):
    """Push sequences/settings/schedule/mailboxes. Changing content needs re-approval."""
    _require(write_blockers())
    client = client or SmartleadClient(user)
    require_in_scope(campaign, client, allow_empty=bool(campaign.created_by_id))
    if email_account_ids:
        _require_own_mailboxes(client, email_account_ids)
    sl_id = campaign.smartlead_campaign_id
    if sequences:
        client.save_sequences(sl_id, sequences)
    if settings:
        client.update_settings(sl_id, settings)
    if schedule:
        client.update_schedule(sl_id, schedule)
    if email_account_ids:
        client.add_email_accounts(sl_id, email_account_ids)
    if sequences or email_account_ids:
        # New content or new mailboxes: both approval and sender checks start over.
        campaign.approved_for_sending = False
        campaign.approved_at = None
        if email_account_ids:
            campaign.spf_verified = campaign.dkim_verified = campaign.dmarc_verified = False
        campaign.save()
    return campaign


def verify_sender(campaign, *, user):
    """Admin check of every attached mailbox using Smartlead's own SPF/DKIM/DMARC and
    SMTP status. Saves the result either way; returns ``(campaign, blockers)``."""
    report = require_in_scope(campaign, SmartleadClient(user))
    blockers = auth_blockers(report)
    domains = ", ".join(sorted({_domain(row["email"]) for row in report}))[:255]
    if blockers or domains != campaign.sender_domain:
        campaign.approved_for_sending = False  # failed check or new domains: approve again
    campaign.sender_domain = domains
    campaign.spf_verified = all(row["spf"] for row in report)
    campaign.dkim_verified = all(row["dkim"] for row in report)
    campaign.dmarc_verified = all(row["dmarc"] for row in report)
    campaign.sender_report = report
    campaign.sender_verified_by = user
    campaign.sender_verified_at = timezone.now()
    campaign.save()
    return campaign, blockers


def approve_for_sending(campaign, *, user):
    if not campaign.sender_verified:
        raise GateClosed(["Verify the sender mailboxes (SPF/DKIM/DMARC/SMTP) before approving."])
    campaign.approved_for_sending = True
    campaign.approved_by = user
    campaign.approved_at = timezone.now()
    campaign.save(update_fields=["approved_for_sending", "approved_by", "approved_at",
                                 "updated_at"])
    return campaign


def set_status(campaign, status, *, user):
    """START is fully gated and re-checks the mailboxes live. PAUSED/STOPPED skip the
    flags (they are safety actions) but still only work on ExpressEarth campaigns."""
    if status not in STATUS_AFTER:
        raise ValueError("status must be START, PAUSED or STOPPED")
    client = SmartleadClient(user)
    if status == "START":
        _require(sending_blockers(campaign))
    report = require_in_scope(campaign, client)
    if status == "START":
        _require(auth_blockers(report))
    client.set_status(campaign.smartlead_campaign_id, status)
    campaign.status = STATUS_AFTER[status]
    campaign.save(update_fields=["status", "updated_at"])
    return campaign


## ===== Leads ===== ##

def lead_payload(contact):
    company = contact.company
    return {
        "email": contact.email,
        "first_name": contact.first_name,
        "last_name": contact.last_name,
        "company_name": company.name if company else "",
        "phone_number": contact.phone,
        "website": company.website if company else "",
        "location": company.location if company else "",
        "linkedin_profile": contact.linkedin_url,
        "custom_fields": {"designation": contact.designation, "ee_contact_id": str(contact.pk)},
    }


def enroll(campaign, contacts, *, user):
    """Add eligible approved contacts to the campaign. Returns enrolled ids + skip reasons.

    An ACTIVE campaign emails new leads straight away, so the mailboxes are
    re-checked live (scope + SPF/DKIM/DMARC/SMTP) before anything is added.
    """
    _require(campaign_blockers(campaign))
    eligible, skipped = [], {}
    for contact in contacts:
        reasons = enrollment_blockers(contact, campaign)
        if reasons:
            skipped[contact.pk] = reasons
        else:
            eligible.append(contact)
    if not eligible:
        return {"enrolled": [], "skipped": skipped}

    client = SmartleadClient(user)
    _require(auth_blockers(require_in_scope(campaign, client)))
    for start in range(0, len(eligible), ADD_LEADS_BATCH):
        batch = eligible[start:start + ADD_LEADS_BATCH]
        client.add_leads(campaign.smartlead_campaign_id, [lead_payload(c) for c in batch])
        with transaction.atomic():
            for contact in batch:
                CampaignEnrollment.objects.create(contact=contact, campaign=campaign,
                                                  enrolled_by=user)
                contact.campaign = campaign
                contact.outreach_status = OutreachStatus.ENROLLED
                contact.save(update_fields=["campaign", "outreach_status", "updated_at"])
                OutreachEvent.objects.create(contact=contact, campaign=campaign,
                                             event_type="enrolled",
                                             detail=f"Enrolled by {user.get_username()}")
    return {"enrolled": [c.pk for c in eligible], "skipped": skipped}


def _lead_id(campaign, enrollment, client):
    if not enrollment.smartlead_lead_id:
        reconcile(campaign, client=client)
        enrollment.refresh_from_db()
    if not enrollment.smartlead_lead_id:
        raise GateClosed(["Smartlead has not assigned a lead id yet; try again shortly."])
    return enrollment.smartlead_lead_id


def lead_action(campaign, contact, action, *, user):
    """pause / remove skip the flags; resume can send, so it is fully gated."""
    if action not in ("pause", "resume", "remove"):
        raise ValueError("action must be pause, resume or remove")
    enrollment = CampaignEnrollment.objects.get(campaign=campaign, contact=contact)
    if action == "resume":
        _require(sending_blockers(campaign) + enrollment_blockers_for_resume(contact))
    client = SmartleadClient(user)
    report = require_in_scope(campaign, client)
    if action == "resume":
        _require(auth_blockers(report))
    lead_id = _lead_id(campaign, enrollment, client)
    {"pause": client.pause_lead, "resume": client.resume_lead,
     "remove": client.remove_lead}[action](campaign.smartlead_campaign_id, lead_id)

    new_status = {"pause": OutreachStatus.PAUSED, "resume": OutreachStatus.ENROLLED,
                  "remove": OutreachStatus.REMOVED}[action]
    enrollment.status = new_status
    enrollment.save(update_fields=["status"])
    if contact.campaign_id == campaign.pk:
        contact.outreach_status = new_status
        contact.save(update_fields=["outreach_status", "updated_at"])
    OutreachEvent.objects.create(contact=contact, campaign=campaign, event_type=action,
                                 detail=f"{action.title()} by {user.get_username()}")
    return enrollment


def enrollment_blockers_for_resume(contact):
    reason = contact.suppression_reason
    return [f"Lead is suppressed ({reason})."] if reason else []


## ===== Reconciliation ===== ##

def reconcile(campaign, *, user=None, client=None):
    """Pull status, analytics and missing lead ids from Smartlead (read-only)."""
    if not campaign.smartlead_campaign_id:
        return campaign
    client = client or SmartleadClient(user)
    sl_id = campaign.smartlead_campaign_id
    details = client.get_campaign(sl_id) or {}
    campaign.status = details.get("status") or campaign.status
    campaign.stats = client.campaign_analytics(sl_id) or {}

    # Only page through the campaign's leads while some of ours still lack an id.
    missing = {e.contact.email: e for e in campaign.enrollments.select_related("contact")
               .filter(smartlead_lead_id="").exclude(contact__email=None)}
    for page in range(_MAX_LEAD_PAGES):
        if not missing:
            break
        data = client.list_campaign_leads(sl_id, offset=page * _LEADS_PAGE, limit=_LEADS_PAGE) or {}
        rows = data.get("data") or []
        for row in rows:
            lead = row.get("lead") or {}
            enrollment = missing.pop((lead.get("email") or "").lower(), None)
            if enrollment and lead.get("id"):
                enrollment.smartlead_lead_id = str(lead["id"])
                enrollment.save(update_fields=["smartlead_lead_id"])
        if len(rows) < _LEADS_PAGE:
            break

    campaign.last_synced_at = timezone.now()
    campaign.save(update_fields=["status", "stats", "last_synced_at", "updated_at"])
    return campaign


def push_suppressions(*, user=None, client=None):
    """Copy local suppressions to Smartlead's block list -- only if SMARTLEAD_PUSH_BLOCKLIST
    is on, because that list is account-wide and would affect the other brands too."""
    if not conf.smartlead_push_blocklist():
        return 0
    pending = list(SuppressionEntry.objects.filter(pushed_to_smartlead=False)[:200])
    if not pending:
        return 0
    client = client or SmartleadClient(user)
    for entry in pending:
        client.block(email=entry.email, domain=None if entry.email else entry.domain)
        entry.pushed_to_smartlead = True
        entry.save(update_fields=["pushed_to_smartlead"])
    return len(pending)
