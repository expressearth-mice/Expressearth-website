"""Paid step: reveal verified emails (and optionally phones) for chosen contacts.

Apollo charges ~1 credit per email found and ~8 more per mobile number, so
this only ever runs on contacts a manager explicitly selected, and refuses to
start once the day's credit budget (``APOLLO_DAILY_CREDIT_LIMIT``) is spent.
"""
from django.db.models import Sum
from django.urls import reverse
from django.utils import timezone

from .. import conf
from ..clients import ApolloClient
from ..clients.apollo import BULK_MATCH_LIMIT
from ..models import ApiCallLog, ProspectContact, normalize_email
from .lead_qualification import rescore
from .prospect_search import upsert_company

MAX_CONTACTS_PER_REQUEST = 50
EMAIL_CREDITS = 1
PHONE_CREDITS = 8

EMAIL_STATUS_MAP = {
    "verified": ProspectContact.EmailStatus.VERIFIED,
    "likely to engage": ProspectContact.EmailStatus.LIKELY_TO_ENGAGE,
    "likely_to_engage": ProspectContact.EmailStatus.LIKELY_TO_ENGAGE,
    "extrapolated": ProspectContact.EmailStatus.UNVERIFIED,
    "guessed": ProspectContact.EmailStatus.UNVERIFIED,
    "unverified": ProspectContact.EmailStatus.UNVERIFIED,
    "unavailable": ProspectContact.EmailStatus.UNAVAILABLE,
    "bounced": ProspectContact.EmailStatus.INVALID,
    "invalid": ProspectContact.EmailStatus.INVALID,
}


class CreditLimitReached(Exception):
    pass


def credits_used_today():
    start = timezone.localtime().replace(hour=0, minute=0, second=0, microsecond=0)
    total = ApiCallLog.objects.filter(provider="apollo", created_at__gte=start) \
        .aggregate(total=Sum("credits_consumed"))["total"]
    return float(total or 0)


def phone_webhook_url():
    secret, base = conf.apollo_webhook_secret(), conf.public_base_url()
    if not (secret and base):
        return ""
    return base + reverse("apollo_smartlead:apollo-phone-webhook", args=[secret])


def _detail_for(contact):
    if contact.apollo_contact_id:
        return {"id": contact.apollo_contact_id}
    detail = {"first_name": contact.first_name, "last_name": contact.last_name}
    if contact.company:
        detail.update({"organization_name": contact.company.name,
                       "domain": contact.company.domain or ""})
    return detail


def apply_match(contact, match):
    """Write one Apollo enrichment match onto ``contact``. Returns True if matched."""
    contact.enrichment_requested_at = timezone.now()
    if not match:
        contact.save(update_fields=["enrichment_requested_at", "updated_at"])
        return False

    email = normalize_email(match.get("email"))
    duplicate = email and ProspectContact.objects.filter(email=email).exclude(pk=contact.pk).first()
    if duplicate:
        # Same person already found via another search: keep the original only.
        contact.approval_status = ProspectContact.Approval.REJECTED
        contact.rejection_reason = f"Duplicate of contact #{duplicate.pk}"
        email = None
    if email:
        contact.email = email
        contact.email_status = EMAIL_STATUS_MAP.get((match.get("email_status") or "").lower(),
                                                    ProspectContact.EmailStatus.UNVERIFIED)
    elif not duplicate:
        contact.email_status = ProspectContact.EmailStatus.UNAVAILABLE
    contact.first_name = match.get("first_name") or contact.first_name
    contact.last_name = match.get("last_name") or contact.last_name
    contact.designation = match.get("title") or contact.designation
    contact.seniority = match.get("seniority") or contact.seniority
    contact.linkedin_url = match.get("linkedin_url") or contact.linkedin_url
    if (match.get("organization") or {}).get("id"):
        contact.company = upsert_company(match["organization"])
    contact.verification_source = "apollo"
    contact.enriched_at = timezone.now()
    rescore(contact, save=False)
    contact.save()
    return True


def enrich_contacts(contacts, *, user, reveal_phone=False, force=False):
    """Enrich ``contacts`` via Apollo bulk_match, 10 per call. Returns a summary dict."""
    contacts = list(contacts)
    if len(contacts) > MAX_CONTACTS_PER_REQUEST:
        raise ValueError(f"Enrich at most {MAX_CONTACTS_PER_REQUEST} contacts at a time.")
    todo = [c for c in contacts if force or not c.enriched_at]
    summary = {"requested": len(contacts), "skipped_already_enriched": len(contacts) - len(todo),
               "enriched": 0, "not_found": 0, "credits_consumed": 0.0,
               "phone_requested": False}
    if not todo:
        return summary

    webhook_url = phone_webhook_url() if reveal_phone else ""
    summary["phone_requested"] = bool(webhook_url)
    estimate = len(todo) * (EMAIL_CREDITS + (PHONE_CREDITS if webhook_url else 0))
    limit, used = conf.apollo_daily_credit_limit(), credits_used_today()
    if used + estimate > limit:
        raise CreditLimitReached(
            f"This needs up to {estimate} Apollo credits but only {max(limit - used, 0):g} "
            f"of today's {limit} remain (APOLLO_DAILY_CREDIT_LIMIT)."
        )

    client = ApolloClient(user)
    for start in range(0, len(todo), BULK_MATCH_LIMIT):
        chunk = todo[start:start + BULK_MATCH_LIMIT]
        data = client.bulk_enrich([_detail_for(c) for c in chunk], webhook_url=webhook_url)
        matches = data.get("matches") or []
        by_id = {m.get("id"): m for m in matches if m}
        for index, contact in enumerate(chunk):
            # Unmatched entries come back as null, so position is the fallback.
            match = by_id.get(contact.apollo_contact_id) if contact.apollo_contact_id else None
            if match is None and index < len(matches):
                match = matches[index]
            summary["enriched" if apply_match(contact, match) else "not_found"] += 1
        summary["credits_consumed"] += float(data.get("credits_consumed") or 0)
    return summary


def _best_phone(numbers):
    def rank(number):
        return (number.get("status_cd") != "valid_number",
                number.get("type_cd") not in ("mobile", "work_direct"),
                number.get("position") or 0)

    usable = [n for n in numbers if n.get("sanitized_number") or n.get("raw_number")]
    return sorted(usable, key=rank)[0] if usable else None


def apply_phone_webhook(payload):
    """Store phone numbers Apollo delivers asynchronously. Returns contacts updated."""
    updated = 0
    for person in payload.get("people") or []:
        contact = ProspectContact.objects.filter(apollo_contact_id=person.get("id")).first()
        best = _best_phone(person.get("phone_numbers") or [])
        if not (contact and best):
            continue
        contact.phone = best.get("sanitized_number") or best.get("raw_number")
        contact.phone_status = "/".join(
            filter(None, (best.get("type_cd"), best.get("status_cd"), best.get("dnc_status_cd")))
        )[:50]
        rescore(contact, save=False)
        contact.save()
        updated += 1
    return updated
