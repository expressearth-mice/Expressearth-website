"""Internal dashboards (Django admin) for lead discovery/approval and campaigns.

Lead screen: filter, approve/reject, assign, enrich, enroll, sync to CRM.
Campaign screen: readiness checklist, sender verification, approve, start/pause.
Every action re-checks the lead-gen role and goes through the same services
(and safety gates) as the REST API.
"""
from django import forms
from django.contrib import admin, messages
from django.contrib.admin.helpers import ActionForm
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.urls import path
from django.utils import timezone
from django.utils.html import format_html_join

from .clients import IntegrationNotConfigured, ProviderAPIError
from .models import (
    ApiCallLog,
    Campaign,
    CampaignEnrollment,
    OutboxJob,
    OutreachEvent,
    ProspectCompany,
    ProspectContact,
    ProspectSearch,
    SalesExecutiveProfile,
    SuppressionEntry,
    WebhookEvent,
)
from .permissions import is_leadgen_admin, is_leadgen_manager
from .services import campaign_manager, contact_enrichment, crm_sync
from .services.contact_enrichment import CreditLimitReached
from .services.lead_qualification import approval_blockers, rescore
from .tasks import claim, run_job

User = get_user_model()

_EXPECTED_ERRORS = (IntegrationNotConfigured, ProviderAPIError, campaign_manager.GateClosed,
                    CreditLimitReached, ValueError)


def _guard(modeladmin, request, check=is_leadgen_manager):
    if not check(request.user):
        modeladmin.message_user(request, "You don't have the lead-generation role for this.",
                                messages.ERROR)
        return False
    return True


def _run(modeladmin, request, func):
    try:
        return func()
    except _EXPECTED_ERRORS as exc:
        modeladmin.message_user(request, str(exc), messages.ERROR)
        return None


class ReadOnlyAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


## ===== Leads ===== ##

class LeadActionForm(ActionForm):
    campaign = forms.ModelChoiceField(queryset=Campaign.objects.all(), required=False,
                                      help_text="For “Enroll”.")
    assigned_to = forms.ModelChoiceField(queryset=User.objects.filter(is_active=True),
                                         required=False, help_text="For “Assign”/“Approve”.")


class OutreachEventInline(admin.TabularInline):
    model = OutreachEvent
    fields = ("occurred_at", "event_type", "campaign", "detail")
    readonly_fields = fields
    extra = 0
    can_delete = False
    ordering = ("-occurred_at",)

    def has_add_permission(self, request, obj=None):
        return False


@admin.register(ProspectContact)
class ProspectContactAdmin(admin.ModelAdmin):
    """Lead discovery & approval dashboard."""

    action_form = LeadActionForm
    list_display = ("full_name", "designation", "company", "email", "email_status",
                    "lead_score", "approval_status", "assigned_to", "outreach_status",
                    "campaign", "next_follow_up_date", "crm_sync_status")
    list_filter = ("approval_status", "outreach_status", "email_status", "company__is_ncr",
                   "campaign", "assigned_to", "crm_sync_status", "lead_source")
    search_fields = ("first_name", "last_name", "email", "designation", "company__name",
                     "company__domain")
    list_select_related = ("company", "assigned_to", "campaign")
    autocomplete_fields = ("company",)
    inlines = [OutreachEventInline]
    readonly_fields = (
        "apollo_contact_id", "email_status", "verification_source", "enriched_at",
        "enrichment_requested_at", "lead_score", "score_breakdown", "approval_status",
        "approved_by", "approved_at", "outreach_status", "campaign", "smartlead_lead_id",
        "last_reply_at", "last_reply_text", "reply_category", "crm_company_id", "crm_lead_id",
        "crm_task_id", "crm_sync_status", "crm_sync_error", "crm_synced_at", "suppression",
        "created_by", "created_at", "updated_at",
    )
    actions = ["approve", "reject", "assign", "enrich", "enroll", "sync_to_crm",
               "recalculate_score"]

    @admin.display(description="Suppression")
    def suppression(self, obj):
        return obj.suppression_reason or "-"

    def _picked(self, request, field):
        form = self.action_form(request.POST)
        return form.cleaned_data.get(field) if form.is_valid() else None

    @admin.action(description="Approve selected leads (verified email, not suppressed)")
    def approve(self, request, queryset):
        if not _guard(self, request):
            return
        assignee = self._picked(request, "assigned_to")
        approved, skipped = 0, []
        for contact in queryset.select_related("company"):
            reasons = approval_blockers(contact)
            if reasons:
                skipped.append(f"{contact.full_name}: {' '.join(reasons)}")
                continue
            contact.approval_status = ProspectContact.Approval.APPROVED
            contact.approved_by = request.user
            contact.approved_at = timezone.now()
            contact.rejection_reason = ""
            contact.assigned_to = assignee or contact.assigned_to
            contact.save()
            approved += 1
        self.message_user(request, f"Approved {approved} lead(s).")
        for line in skipped[:20]:
            self.message_user(request, f"Skipped {line}", messages.WARNING)

    @admin.action(description="Reject selected leads")
    def reject(self, request, queryset):
        if _guard(self, request):
            count = queryset.update(approval_status=ProspectContact.Approval.REJECTED,
                                    approved_by=None, approved_at=None,
                                    updated_at=timezone.now())
            self.message_user(request, f"Rejected {count} lead(s).")

    @admin.action(description="Assign selected leads to the chosen sales executive")
    def assign(self, request, queryset):
        if not _guard(self, request):
            return
        assignee = self._picked(request, "assigned_to")
        if not assignee:
            self.message_user(request, "Pick a user in “Assigned to” first.", messages.ERROR)
            return
        self.message_user(request, f"Assigned {queryset.update(assigned_to=assignee)} lead(s).")

    @admin.action(description="Enrich with Apollo (uses credits; max 50)")
    def enrich(self, request, queryset):
        if not _guard(self, request):
            return
        summary = _run(self, request, lambda: contact_enrichment.enrich_contacts(
            queryset.select_related("company")[:contact_enrichment.MAX_CONTACTS_PER_REQUEST],
            user=request.user))
        if summary:
            self.message_user(request, f"Enriched {summary['enriched']}, not found "
                                       f"{summary['not_found']}, skipped "
                                       f"{summary['skipped_already_enriched']}, credits "
                                       f"{summary['credits_consumed']:g}.")

    @admin.action(description="Enroll into the chosen campaign (gated)")
    def enroll(self, request, queryset):
        if not _guard(self, request):
            return
        campaign = self._picked(request, "campaign")
        if not campaign:
            self.message_user(request, "Pick a campaign first.", messages.ERROR)
            return
        result = _run(self, request, lambda: campaign_manager.enroll(
            campaign, list(queryset.select_related("company")), user=request.user))
        if result:
            self.message_user(request, f"Enrolled {len(result['enrolled'])} lead(s).")
            for contact_id, reasons in list(result["skipped"].items())[:20]:
                self.message_user(request, f"Skipped #{contact_id}: {' '.join(reasons)}",
                                  messages.WARNING)

    @admin.action(description="Sync to EmpFly CRM now")
    def sync_to_crm(self, request, queryset):
        if not _guard(self, request):
            return
        results = {}
        for contact in queryset[:50]:
            job = crm_sync.queue_crm_sync(contact, reason="manual")
            if claim(job):
                job.refresh_from_db()
                results[contact.pk] = (run_job(job), job.last_error)
        done = sum(1 for status, _ in results.values() if status == OutboxJob.Status.DONE)
        self.message_user(request, f"Synced {done} of {len(results)} lead(s).")
        for contact_id, (status, error) in results.items():
            if status != OutboxJob.Status.DONE:
                self.message_user(request, f"#{contact_id}: {error}", messages.WARNING)

    @admin.action(description="Recalculate lead score")
    def recalculate_score(self, request, queryset):
        for contact in queryset.select_related("company"):
            rescore(contact)
        self.message_user(request, "Scores updated.")


@admin.register(ProspectCompany)
class ProspectCompanyAdmin(admin.ModelAdmin):
    list_display = ("name", "domain", "industry", "employee_range", "city", "is_ncr",
                    "apollo_organization_id")
    list_filter = ("is_ncr", "employee_range", "industry")
    search_fields = ("name", "domain", "industry")
    readonly_fields = ("apollo_organization_id", "raw", "created_at", "updated_at")


## ===== Campaigns ===== ##

@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    """Campaign management dashboard. Campaigns are created in Smartlead (or via the
    API) and pulled in with "Sync from Smartlead", which only imports campaigns that
    send from ExpressEarth mailboxes (the Smartlead account is shared)."""

    change_list_template = "admin/apollo_smartlead/campaign/change_list.html"
    list_display = ("name", "smartlead_campaign_id", "status", "sender_domain",
                    "sender_ok", "approved_for_sending", "enrolled", "last_synced_at")
    list_filter = ("status", "approved_for_sending")
    search_fields = ("name",)
    fields = ("name", "smartlead_campaign_id", "status", "readiness", "sender_domain",
              "sender_checks", "sender_verified_by", "sender_verified_at",
              "approved_for_sending", "approved_by", "approved_at", "smartlead_webhook_id",
              "stats", "last_synced_at")
    # Everything mirrors Smartlead or is set by an action, so nothing is hand-edited.
    readonly_fields = fields
    actions = ["verify_sender", "approve_sending", "start", "pause", "register_webhook",
               "refresh_from_smartlead"]

    def has_add_permission(self, request):
        return False

    @admin.display(description="Sender mailboxes (from Smartlead)")
    def sender_checks(self, obj):
        if not obj.sender_report:
            return "Not checked yet: run “Verify sender mailboxes”."
        mark = {True: "✓", False: "✗"}
        return format_html_join("", "<div>{} — SPF {} · DKIM {} · DMARC {} · SMTP {}</div>", (
            (row.get("email"), mark[bool(row.get("spf"))], mark[bool(row.get("dkim"))],
             mark[bool(row.get("dmarc"))], mark[bool(row.get("smtp_ok"))])
            for row in obj.sender_report))

    @admin.display(boolean=True, description="Sender verified")
    def sender_ok(self, obj):
        return obj.sender_verified

    @admin.display(description="Enrolled")
    def enrolled(self, obj):
        return obj.enrollments.count()

    @admin.display(description="Ready to send?")
    def readiness(self, obj):
        blockers = campaign_manager.sending_blockers(obj)
        if not blockers:
            return "Ready: all checks pass."
        return format_html_join("", "<div>✗ {}</div>", ((b,) for b in blockers))

    def get_urls(self):
        return [path("sync/", self.admin_site.admin_view(self.sync_view),
                     name="apollo_smartlead_campaign_sync")] + super().get_urls()

    def sync_view(self, request):
        if _guard(self, request):
            result = _run(self, request,
                          lambda: campaign_manager.sync_campaigns(user=request.user))
            if result is not None:
                campaigns, skipped = result
                self.message_user(request, f"Synced {len(campaigns)} ExpressEarth campaign(s); "
                                           f"skipped {skipped} that send from other brands' "
                                           "mailboxes.")
        return redirect("admin:apollo_smartlead_campaign_changelist")

    @admin.action(description="Verify sender mailboxes via Smartlead (admin)")
    def verify_sender(self, request, queryset):
        if not _guard(self, request, check=is_leadgen_admin):
            return
        for campaign in queryset:
            result = _run(self, request,
                          lambda: campaign_manager.verify_sender(campaign, user=request.user))
            if result is None:
                continue
            _, blockers = result
            if blockers:
                self.message_user(request, f"“{campaign}” failed: {' '.join(blockers)}",
                                  messages.WARNING)
            else:
                self.message_user(request, f"“{campaign}”: all sender mailboxes pass.")

    @admin.action(description="Register webhook on campaign (gated)")
    def register_webhook(self, request, queryset):
        if not _guard(self, request):
            return
        for campaign in queryset:
            if _run(self, request, lambda: campaign_manager.enable_webhook(
                    campaign, user=request.user)):
                self.message_user(request, f"Webhook registered on “{campaign}”.")

    @admin.action(description="Approve for sending (admin)")
    def approve_sending(self, request, queryset):
        if not _guard(self, request, check=is_leadgen_admin):
            return
        for campaign in queryset:
            if _run(self, request, lambda: campaign_manager.approve_for_sending(
                    campaign, user=request.user)):
                self.message_user(request, f"Approved “{campaign}” for sending.")

    @admin.action(description="Start campaign (gated)")
    def start(self, request, queryset):
        self._set_status(request, queryset, "START")

    @admin.action(description="Pause campaign")
    def pause(self, request, queryset):
        self._set_status(request, queryset, "PAUSED")

    def _set_status(self, request, queryset, status):
        if not _guard(self, request):
            return
        for campaign in queryset:
            if _run(self, request, lambda: campaign_manager.set_status(
                    campaign, status, user=request.user)):
                self.message_user(request, f"“{campaign}” is now {campaign.status}.")

    @admin.action(description="Refresh status, stats and lead ids from Smartlead")
    def refresh_from_smartlead(self, request, queryset):
        if not _guard(self, request):
            return
        for campaign in queryset:
            _run(self, request, lambda: campaign_manager.reconcile(campaign, user=request.user))
        self.message_user(request, "Refreshed.")


@admin.register(CampaignEnrollment)
class CampaignEnrollmentAdmin(ReadOnlyAdmin):
    list_display = ("contact", "campaign", "status", "smartlead_lead_id", "enrolled_at",
                    "sent_at", "opened_at", "replied_at")
    list_filter = ("status", "campaign")
    search_fields = ("contact__email", "contact__first_name", "contact__last_name")


## ===== Suppression, people, logs ===== ##

@admin.register(SuppressionEntry)
class SuppressionEntryAdmin(admin.ModelAdmin):
    list_display = ("__str__", "reason", "source", "pushed_to_smartlead", "created_by",
                    "created_at")
    list_filter = ("reason", "source", "pushed_to_smartlead")
    search_fields = ("email", "domain", "note")
    fields = ("email", "domain", "reason", "note")

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by, obj.source = request.user, "manual"
        super().save_model(request, obj, form, change)

    def has_delete_permission(self, request, obj=None):
        return is_leadgen_admin(request.user)


@admin.register(SalesExecutiveProfile)
class SalesExecutiveProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "empfly_name", "empfly_email", "empfly_user_uuid", "is_active")
    list_filter = ("is_active",)
    search_fields = ("user__username", "empfly_name", "empfly_email")


@admin.register(OutboxJob)
class OutboxJobAdmin(ReadOnlyAdmin):
    list_display = ("id", "kind", "contact", "status", "attempts", "next_attempt_at",
                    "last_error")
    list_filter = ("kind", "status")
    actions = ["retry_now"]

    def has_change_permission(self, request, obj=None):
        return is_leadgen_manager(request.user)  # needed for the action; fields stay read-only

    def get_readonly_fields(self, request, obj=None):
        return [f.name for f in self.model._meta.fields]

    @admin.action(description="Retry now")
    def retry_now(self, request, queryset):
        count = queryset.exclude(status=OutboxJob.Status.DONE).update(
            status=OutboxJob.Status.PENDING, attempts=0, next_attempt_at=timezone.now())
        self.message_user(request, f"{count} job(s) queued; they run on the next "
                                   "leadgen_run_jobs.")


@admin.register(WebhookEvent)
class WebhookEventAdmin(ReadOnlyAdmin):
    list_display = ("received_at", "provider", "event_type", "status", "error")
    list_filter = ("provider", "event_type", "status")
    search_fields = ("dedupe_key",)


@admin.register(ApiCallLog)
class ApiCallLogAdmin(ReadOnlyAdmin):
    list_display = ("created_at", "provider", "method", "endpoint", "status_code", "ok",
                    "duration_ms", "credits_consumed", "triggered_by")
    list_filter = ("provider", "ok")
    search_fields = ("endpoint", "error")


@admin.register(ProspectSearch)
class ProspectSearchAdmin(ReadOnlyAdmin):
    list_display = ("created_at", "kind", "result_count", "total_available", "created_by")
    list_filter = ("kind",)
