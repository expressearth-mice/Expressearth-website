"""Lead-generation data: Apollo prospects, Smartlead campaigns, CRM sync state.

Every table here is new and owned by this app (``apollo_smartlead_*``); no
existing model is referenced except ``AUTH_USER_MODEL``.
"""
from django.conf import settings
from django.db import models
from django.db.models import Q
from django.utils import timezone

# Delhi NCR cities, matched case-insensitively against Apollo's city/state.
NCR_LOCATIONS = ("delhi", "new delhi", "gurugram", "gurgaon", "noida", "greater noida",
                 "faridabad", "ghaziabad")


def normalize_email(email):
    return (email or "").strip().lower() or None


def normalize_domain(value):
    """``https://www.Acme.com/about`` -> ``acme.com``."""
    value = (value or "").strip().lower()
    for prefix in ("https://", "http://"):
        if value.startswith(prefix):
            value = value[len(prefix):]
    value = value.split("/")[0].split("?")[0]
    if value.startswith("www."):
        value = value[4:]
    return value or None


class OutreachStatus(models.TextChoices):
    NOT_ENROLLED = "not_enrolled", "Not enrolled"
    ENROLLED = "enrolled", "Enrolled"
    SENT = "sent", "Sent"
    OPENED = "opened", "Opened"
    REPLIED = "replied", "Replied"
    POSITIVE_REPLY = "positive_reply", "Positive reply"
    NEGATIVE_REPLY = "negative_reply", "Negative reply"
    BOUNCED = "bounced", "Bounced"
    UNSUBSCRIBED = "unsubscribed", "Unsubscribed"
    PAUSED = "paused", "Paused"
    REMOVED = "removed", "Removed"


# A contact in one of these states must never be enrolled again.
TERMINAL_OUTREACH = (OutreachStatus.BOUNCED, OutreachStatus.UNSUBSCRIBED)
# A contact in one of these states is still "live" in its current campaign.
ACTIVE_OUTREACH = (OutreachStatus.ENROLLED, OutreachStatus.SENT, OutreachStatus.OPENED,
                   OutreachStatus.PAUSED)


## ===== Prospects ===== ##

class ProspectCompany(models.Model):
    name = models.CharField(max_length=255)
    domain = models.CharField(max_length=255, unique=True, null=True, blank=True)
    website = models.CharField(max_length=500, blank=True)
    industry = models.CharField(max_length=255, blank=True)
    employee_count = models.PositiveIntegerField(null=True, blank=True)
    employee_range = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=120, blank=True)
    state = models.CharField(max_length=120, blank=True)
    country = models.CharField(max_length=120, blank=True)
    is_ncr = models.BooleanField(default=False)
    apollo_organization_id = models.CharField(max_length=64, unique=True, null=True, blank=True)
    raw = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "prospect companies"

    def __str__(self):
        return self.name

    @property
    def location(self):
        return ", ".join(part for part in (self.city, self.state, self.country) if part)


class ProspectContact(models.Model):
    """A decision-maker found via Apollo -- this is the "lead"."""

    class EmailStatus(models.TextChoices):
        UNKNOWN = "unknown", "Unknown"
        VERIFIED = "verified", "Verified"
        LIKELY_TO_ENGAGE = "likely_to_engage", "Likely to engage"
        UNVERIFIED = "unverified", "Unverified"
        UNAVAILABLE = "unavailable", "Unavailable"
        INVALID = "invalid", "Invalid"

    class Approval(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"

    class CrmSync(models.TextChoices):
        NOT_SYNCED = "not_synced", "Not synced"
        QUEUED = "queued", "Queued"
        SYNCED = "synced", "Synced"
        FAILED = "failed", "Failed"

    company = models.ForeignKey(ProspectCompany, on_delete=models.SET_NULL, null=True, blank=True,
                                related_name="contacts")
    first_name = models.CharField(max_length=120, blank=True)
    last_name = models.CharField(max_length=120, blank=True)
    designation = models.CharField(max_length=255, blank=True)
    seniority = models.CharField(max_length=50, blank=True)
    linkedin_url = models.CharField(max_length=500, blank=True)

    email = models.CharField(max_length=254, unique=True, null=True, blank=True)
    email_status = models.CharField(max_length=20, choices=EmailStatus.choices,
                                    default=EmailStatus.UNKNOWN)
    phone = models.CharField(max_length=50, blank=True)
    phone_status = models.CharField(max_length=50, blank=True)
    has_email = models.BooleanField(default=False)  # Apollo's availability hint pre-enrichment
    has_phone = models.BooleanField(default=False)

    apollo_contact_id = models.CharField(max_length=64, unique=True, null=True, blank=True)
    lead_source = models.CharField(max_length=50, default="apollo")
    verification_source = models.CharField(max_length=50, blank=True)
    enriched_at = models.DateTimeField(null=True, blank=True)
    enrichment_requested_at = models.DateTimeField(null=True, blank=True)

    lead_score = models.PositiveSmallIntegerField(default=0)
    score_breakdown = models.JSONField(default=dict, blank=True)

    approval_status = models.CharField(max_length=20, choices=Approval.choices,
                                       default=Approval.PENDING)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name="+")
    approved_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.CharField(max_length=255, blank=True)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True,
                                    related_name="leadgen_assigned_contacts")

    outreach_status = models.CharField(max_length=20, choices=OutreachStatus.choices,
                                       default=OutreachStatus.NOT_ENROLLED)
    campaign = models.ForeignKey("Campaign", on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name="current_contacts")
    smartlead_lead_id = models.CharField(max_length=64, blank=True)
    last_reply_at = models.DateTimeField(null=True, blank=True)
    last_reply_text = models.TextField(blank=True)
    reply_category = models.CharField(max_length=100, blank=True)
    next_follow_up_date = models.DateField(null=True, blank=True)

    crm_company_id = models.CharField(max_length=64, blank=True)
    crm_lead_id = models.CharField(max_length=64, blank=True)
    crm_task_id = models.CharField(max_length=64, blank=True)
    crm_sync_status = models.CharField(max_length=20, choices=CrmSync.choices,
                                       default=CrmSync.NOT_SYNCED)
    crm_sync_error = models.TextField(blank=True)
    crm_synced_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-lead_score", "-created_at"]
        indexes = [
            models.Index(fields=["approval_status", "lead_score"]),
            models.Index(fields=["outreach_status"]),
        ]

    def __str__(self):
        return f"{self.full_name} ({self.company or '-'})"

    def save(self, *args, **kwargs):
        self.email = normalize_email(self.email)
        super().save(*args, **kwargs)

    @property
    def full_name(self):
        return " ".join(part for part in (self.first_name, self.last_name) if part) or "-"

    @property
    def suppression_reason(self):
        """Reason this contact must not be emailed, or ``""``."""
        if self.outreach_status in TERMINAL_OUTREACH:
            return self.outreach_status
        domain = self.email.split("@", 1)[1] if self.email and "@" in self.email else None
        lookup = Q(email=self.email) if self.email else Q(pk__in=[])
        if domain:
            lookup |= Q(domain=domain)
        if self.company and self.company.domain:
            lookup |= Q(domain=self.company.domain)
        entry = SuppressionEntry.objects.filter(lookup).first()
        return entry.reason if entry else ""

    @property
    def is_suppressed(self):
        return bool(self.suppression_reason)


class ProspectSearch(models.Model):
    """Audit trail of Apollo searches (who searched for what)."""

    class Kind(models.TextChoices):
        COMPANY = "company", "Company search"
        PEOPLE = "people", "People search"

    kind = models.CharField(max_length=20, choices=Kind.choices)
    filters = models.JSONField(default=dict, blank=True)
    result_count = models.PositiveIntegerField(default=0)
    total_available = models.PositiveIntegerField(null=True, blank=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "prospect searches"


## ===== Campaigns ===== ##

class Campaign(models.Model):
    """Local mirror of an ExpressEarth Smartlead campaign plus our sending controls."""

    smartlead_campaign_id = models.BigIntegerField(unique=True, null=True, blank=True)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, default="DRAFTED")  # Smartlead's status value

    # Filled by the admin "verify sender" check from Smartlead's own mailbox data.
    sender_domain = models.CharField(max_length=255, blank=True)  # e.g. "expressearth.in"
    spf_verified = models.BooleanField(default=False)
    dkim_verified = models.BooleanField(default=False)
    dmarc_verified = models.BooleanField(default=False)
    sender_report = models.JSONField(default=list, blank=True)  # per-mailbox results
    sender_verified_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                           null=True, blank=True, related_name="+")
    sender_verified_at = models.DateTimeField(null=True, blank=True)

    approved_for_sending = models.BooleanField(default=False)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name="+")
    approved_at = models.DateTimeField(null=True, blank=True)

    smartlead_webhook_id = models.CharField(max_length=64, blank=True)
    stats = models.JSONField(default=dict, blank=True)
    last_synced_at = models.DateTimeField(null=True, blank=True)

    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    @property
    def sender_verified(self):
        smtp_ok = all(row.get("smtp_ok", True) for row in self.sender_report or [])
        return bool(self.sender_domain) and self.spf_verified and self.dkim_verified \
            and self.dmarc_verified and smtp_ok


class CampaignEnrollment(models.Model):
    contact = models.ForeignKey(ProspectContact, on_delete=models.CASCADE,
                                related_name="enrollments")
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name="enrollments")
    smartlead_lead_id = models.CharField(max_length=64, blank=True)
    status = models.CharField(max_length=20, choices=OutreachStatus.choices,
                              default=OutreachStatus.ENROLLED)
    enrolled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                    null=True, blank=True, related_name="+")
    enrolled_at = models.DateTimeField(default=timezone.now)
    sent_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    replied_at = models.DateTimeField(null=True, blank=True)
    bounced_at = models.DateTimeField(null=True, blank=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-enrolled_at"]
        constraints = [
            models.UniqueConstraint(fields=["contact", "campaign"],
                                    name="apollo_smartlead_unique_enrollment"),
        ]


class OutreachEvent(models.Model):
    """Human-readable activity timeline for a contact."""

    contact = models.ForeignKey(ProspectContact, on_delete=models.CASCADE, null=True, blank=True,
                                related_name="events")
    campaign = models.ForeignKey(Campaign, on_delete=models.SET_NULL, null=True, blank=True,
                                 related_name="events")
    event_type = models.CharField(max_length=50)
    detail = models.TextField(blank=True)
    occurred_at = models.DateTimeField(default=timezone.now)
    webhook_event = models.ForeignKey("WebhookEvent", on_delete=models.SET_NULL, null=True,
                                      blank=True, related_name="+")

    class Meta:
        ordering = ["-occurred_at"]


## ===== Webhooks, suppression, logs, jobs ===== ##

class WebhookEvent(models.Model):
    """Raw inbound webhook, stored before processing so replays are idempotent."""

    class Status(models.TextChoices):
        RECEIVED = "received", "Received"
        PROCESSED = "processed", "Processed"
        IGNORED = "ignored", "Ignored"
        FAILED = "failed", "Failed"

    provider = models.CharField(max_length=20)
    event_type = models.CharField(max_length=50, blank=True)
    dedupe_key = models.CharField(max_length=128, unique=True)
    payload = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.RECEIVED)
    error = models.TextField(blank=True)
    received_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-received_at"]


class SuppressionEntry(models.Model):
    """An email address or whole domain that must never be emailed."""

    class Reason(models.TextChoices):
        UNSUBSCRIBED = "unsubscribed", "Unsubscribed"
        BOUNCED = "bounced", "Bounced"
        DO_NOT_CONTACT = "do_not_contact", "Do not contact"
        EXISTING_CLIENT = "existing_client", "Existing client"
        MANUAL = "manual", "Manual"

    email = models.CharField(max_length=254, unique=True, null=True, blank=True)
    domain = models.CharField(max_length=255, unique=True, null=True, blank=True)
    reason = models.CharField(max_length=20, choices=Reason.choices, default=Reason.MANUAL)
    source = models.CharField(max_length=20, default="manual")  # manual / smartlead / apollo
    note = models.CharField(max_length=255, blank=True)
    pushed_to_smartlead = models.BooleanField(default=False)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                   null=True, blank=True, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name_plural = "suppression entries"
        constraints = [
            models.CheckConstraint(
                condition=Q(email__isnull=False) | Q(domain__isnull=False),
                name="apollo_smartlead_suppression_email_or_domain",
            ),
        ]

    def __str__(self):
        return self.email or self.domain or "-"

    def save(self, *args, **kwargs):
        self.email = normalize_email(self.email)
        self.domain = normalize_domain(self.domain)
        super().save(*args, **kwargs)


class ApiCallLog(models.Model):
    """One row per outbound provider call. Never stores keys or request bodies."""

    provider = models.CharField(max_length=20)
    method = models.CharField(max_length=10)
    endpoint = models.CharField(max_length=255)
    status_code = models.PositiveSmallIntegerField(null=True, blank=True)
    ok = models.BooleanField(default=False)
    duration_ms = models.PositiveIntegerField(default=0)
    credits_consumed = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    error = models.CharField(max_length=500, blank=True)
    triggered_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                     null=True, blank=True, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["provider", "created_at"])]


class OutboxJob(models.Model):
    """Background work (CRM sync) processed by ``manage.py leadgen_run_jobs``."""

    class Kind(models.TextChoices):
        CRM_SYNC = "crm_sync", "CRM sync"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        RUNNING = "running", "Running"
        DONE = "done", "Done"
        FAILED = "failed", "Failed"

    kind = models.CharField(max_length=20, choices=Kind.choices)
    contact = models.ForeignKey(ProspectContact, on_delete=models.CASCADE, null=True, blank=True,
                                related_name="jobs")
    payload = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    attempts = models.PositiveSmallIntegerField(default=0)
    max_attempts = models.PositiveSmallIntegerField(default=5)
    next_attempt_at = models.DateTimeField(default=timezone.now)
    last_error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["next_attempt_at"]
        indexes = [models.Index(fields=["status", "next_attempt_at"])]


class SalesExecutiveProfile(models.Model):
    """Maps a Django user to their EmpFly (auth-service) user for CRM assignment."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name="leadgen_profile")
    empfly_user_uuid = models.UUIDField()
    empfly_name = models.CharField(max_length=255, blank=True)
    empfly_email = models.EmailField(blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.empfly_name or self.user.get_username()
