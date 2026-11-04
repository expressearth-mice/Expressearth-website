from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from . import conf
from .clients import ApolloClient, IntegrationNotConfigured, ProviderAPIError
from .models import ApiCallLog, Campaign, ProspectCompany, ProspectContact, SuppressionEntry
from .permissions import (
    IsLeadgenAdmin,
    IsLeadgenManager,
    IsLeadgenMember,
    is_leadgen_admin,
    is_leadgen_manager,
    is_leadgen_member,
)
from .serializers import (
    ApiCallLogSerializer,
    ApproveSerializer,
    AssignSerializer,
    CampaignConfigSerializer,
    CampaignCreateSerializer,
    CampaignSerializer,
    CampaignStatusSerializer,
    CompanySearchSerializer,
    ContactIdsSerializer,
    ContactUpdateSerializer,
    EnrichSerializer,
    OutreachEventSerializer,
    PeopleSearchSerializer,
    ProspectCompanySerializer,
    ProspectContactSerializer,
    RejectSerializer,
    SuppressionEntrySerializer,
)
from .services import (
    campaign_manager,
    connectivity,
    contact_enrichment,
    crm_sync,
    prospect_search,
)
from .services.lead_qualification import approval_blockers
from .tasks import claim, run_job


class LeadgenPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = "page_size"
    max_page_size = 100


class LeadgenAPIView(APIView):
    """Maps integration errors to clear HTTP responses in the app's ``{"errors": ...}`` shape."""

    def handle_exception(self, exc):
        if isinstance(exc, IntegrationNotConfigured):
            return Response({"errors": {"detail": str(exc)}},
                            status=status.HTTP_503_SERVICE_UNAVAILABLE)
        if isinstance(exc, ProviderAPIError):
            return Response({"errors": {"detail": f"{exc.provider} request failed.",
                                        "provider_status": exc.status_code}},
                            status=status.HTTP_502_BAD_GATEWAY)
        if isinstance(exc, campaign_manager.GateClosed):
            return Response({"errors": {"blockers": exc.blockers}},
                            status=status.HTTP_403_FORBIDDEN)
        if isinstance(exc, contact_enrichment.CreditLimitReached):
            return Response({"errors": {"detail": str(exc)}},
                            status=status.HTTP_429_TOO_MANY_REQUESTS)
        if isinstance(exc, ValueError):
            return Response({"errors": {"detail": str(exc)}}, status=status.HTTP_400_BAD_REQUEST)
        return super().handle_exception(exc)

    def validated(self, serializer_class, data=None):
        serializer = serializer_class(data=self.request.data if data is None else data)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    def paginated(self, queryset, serializer_class):
        paginator = LeadgenPagination()
        page = paginator.paginate_queryset(queryset, self.request, view=self)
        return paginator.get_paginated_response(serializer_class(page, many=True).data)


def _contacts(ids):
    return list(ProspectContact.objects.select_related("company").filter(pk__in=ids))


## ===== Status ===== ##

class HealthAPIView(LeadgenAPIView):
    """Which credentials and feature flags are present (never their values).

    ``?live=1`` also checks that the keys work, using read-only zero-credit calls.
    """

    permission_classes = [IsLeadgenManager]

    def get(self, request: Request) -> Response:
        live = {}
        if request.query_params.get("live") in ("1", "true"):
            live = {"live": connectivity.check_all(request.user)}
        return Response({
            **live,
            "apollo_configured": bool(conf.apollo_api_key()),
            "apollo_phone_webhook_configured": bool(contact_enrichment.phone_webhook_url()),
            "smartlead_configured": bool(conf.smartlead_api_key()),
            "smartlead_webhook_configured": bool(conf.smartlead_webhook_secret()
                                                 and conf.public_base_url()),
            "smartlead_signature_check": bool(conf.smartlead_signing_secret()),
            "empfly_crm_configured": all((conf.empfly_crm_base_url(), conf.empfly_auth_base_url(),
                                          conf.empfly_crm_email(), conf.empfly_crm_password())),
            "flags": {
                "SMARTLEAD_WRITE_ENABLED": conf.smartlead_write_enabled(),
                "SMARTLEAD_SENDING_ENABLED": conf.smartlead_sending_enabled(),
                "EMPFLY_CRM_SYNC_ENABLED": conf.empfly_crm_sync_enabled(),
            },
            "apollo_credits_used_today": contact_enrichment.credits_used_today(),
            "apollo_daily_credit_limit": conf.apollo_daily_credit_limit(),
        })


class MeAPIView(LeadgenAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = request.user
        return Response({"id": user.pk, "username": user.get_username(),
                         "is_leadgen_admin": is_leadgen_admin(user),
                         "is_leadgen_manager": is_leadgen_manager(user),
                         "is_leadgen_member": is_leadgen_member(user)})


## ===== Apollo ===== ##

class CompanySearchAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def post(self, request: Request) -> Response:
        companies, pagination = prospect_search.search_companies(
            user=request.user, **self.validated(CompanySearchSerializer))
        return Response({"pagination": pagination,
                         "results": ProspectCompanySerializer(companies, many=True).data})


class PeopleSearchAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def post(self, request: Request) -> Response:
        contacts, pagination = prospect_search.search_people(
            user=request.user, **self.validated(PeopleSearchSerializer))
        return Response({"pagination": pagination,
                         "results": ProspectContactSerializer(contacts, many=True).data})


class EnrichAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def post(self, request: Request) -> Response:
        data = self.validated(EnrichSerializer)
        summary = contact_enrichment.enrich_contacts(
            _contacts(data["contact_ids"]), user=request.user,
            reveal_phone=data["reveal_phone"], force=data["force"],
        )
        contacts = _contacts(data["contact_ids"])
        return Response({"summary": summary,
                         "results": ProspectContactSerializer(contacts, many=True).data})


class ApolloUsageAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def get(self, request: Request) -> Response:
        return Response({
            "credits_used_today": contact_enrichment.credits_used_today(),
            "daily_credit_limit": conf.apollo_daily_credit_limit(),
            "apollo": ApolloClient(request.user).usage_stats(),
        })


## ===== Companies & leads ===== ##

class CompanyListAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def get(self, request: Request) -> Response:
        queryset = ProspectCompany.objects.all()
        params = request.query_params
        if params.get("is_ncr") in ("1", "true"):
            queryset = queryset.filter(is_ncr=True)
        if params.get("q"):
            queryset = queryset.filter(Q(name__icontains=params["q"])
                                       | Q(domain__icontains=params["q"]))
        return self.paginated(queryset, ProspectCompanySerializer)


class LeadListAPIView(LeadgenAPIView):
    """Executives only ever see the leads assigned to them."""

    permission_classes = [IsLeadgenMember]

    def get(self, request: Request) -> Response:
        queryset = ProspectContact.objects.select_related("company", "assigned_to", "campaign",
                                                          "approved_by")
        if not is_leadgen_manager(request.user):
            queryset = queryset.filter(assigned_to=request.user)
        params = request.query_params
        for param in ("approval_status", "outreach_status", "email_status", "crm_sync_status",
                      "campaign", "assigned_to", "company"):
            if params.get(param):
                queryset = queryset.filter(**{param: params[param]})
        if params.get("min_score", "").isdigit():
            queryset = queryset.filter(lead_score__gte=int(params["min_score"]))
        if params.get("is_ncr") in ("1", "true"):
            queryset = queryset.filter(company__is_ncr=True)
        if params.get("q"):
            q = params["q"]
            queryset = queryset.filter(Q(first_name__icontains=q) | Q(last_name__icontains=q)
                                       | Q(email__icontains=q) | Q(designation__icontains=q)
                                       | Q(company__name__icontains=q))
        return self.paginated(queryset, ProspectContactSerializer)


class LeadDetailAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenMember]

    def _get(self, request, pk):
        queryset = ProspectContact.objects.select_related("company", "assigned_to", "campaign")
        if not is_leadgen_manager(request.user):
            queryset = queryset.filter(assigned_to=request.user)
        return get_object_or_404(queryset, pk=pk)

    def get(self, request: Request, pk: int) -> Response:
        contact = self._get(request, pk)
        return Response({**ProspectContactSerializer(contact).data,
                         "events": OutreachEventSerializer(contact.events.all()[:100],
                                                           many=True).data})

    def patch(self, request: Request, pk: int) -> Response:
        contact = self._get(request, pk)
        serializer = ContactUpdateSerializer(contact, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(ProspectContactSerializer(contact).data)


class LeadApproveAPIView(LeadgenAPIView):
    """Approve leads for outreach; leads that fail a check are skipped with the reason."""

    permission_classes = [IsLeadgenManager]

    def post(self, request: Request) -> Response:
        data = self.validated(ApproveSerializer)
        approved, skipped = [], {}
        for contact in _contacts(data["contact_ids"]):
            reasons = approval_blockers(contact)
            if reasons:
                skipped[contact.pk] = reasons
                continue
            contact.approval_status = ProspectContact.Approval.APPROVED
            contact.approved_by, contact.approved_at = request.user, timezone.now()
            contact.rejection_reason = ""
            if data.get("assigned_to"):
                contact.assigned_to = data["assigned_to"]
            contact.save()
            approved.append(contact.pk)
        return Response({"approved": approved, "skipped": skipped})


class LeadRejectAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def post(self, request: Request) -> Response:
        data = self.validated(RejectSerializer)
        count = ProspectContact.objects.filter(pk__in=data["contact_ids"]).update(
            approval_status=ProspectContact.Approval.REJECTED,
            rejection_reason=data.get("reason", ""), approved_by=None, approved_at=None,
            updated_at=timezone.now(),
        )
        return Response({"rejected": count})


class LeadAssignAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def post(self, request: Request) -> Response:
        data = self.validated(AssignSerializer)
        count = ProspectContact.objects.filter(pk__in=data["contact_ids"]).update(
            assigned_to=data["assigned_to"], updated_at=timezone.now())
        return Response({"assigned": count})


## ===== Suppression ===== ##

class SuppressionListCreateAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def get(self, request: Request) -> Response:
        queryset = SuppressionEntry.objects.all()
        if request.query_params.get("q"):
            q = request.query_params["q"]
            queryset = queryset.filter(Q(email__icontains=q) | Q(domain__icontains=q))
        return self.paginated(queryset, SuppressionEntrySerializer)

    def post(self, request: Request) -> Response:
        serializer = SuppressionEntrySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        entry = serializer.save(created_by=request.user, source="manual")
        return Response(SuppressionEntrySerializer(entry).data, status=status.HTTP_201_CREATED)


class SuppressionDeleteAPIView(LeadgenAPIView):
    """Lifting a suppression is admin-only (it re-allows emailing someone)."""

    permission_classes = [IsLeadgenAdmin]

    def delete(self, request: Request, pk: int) -> Response:
        get_object_or_404(SuppressionEntry, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


## ===== Campaigns ===== ##

class CampaignListCreateAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def get(self, request: Request) -> Response:
        """``?sync=1`` first imports ExpressEarth campaigns from the shared Smartlead account."""
        sync = None
        if request.query_params.get("sync") in ("1", "true"):
            campaigns, skipped = campaign_manager.sync_campaigns(user=request.user)
            sync = {"synced": len(campaigns), "skipped_other_brands": skipped}
        response = self.paginated(Campaign.objects.all(), CampaignSerializer)
        if sync:
            response.data["sync"] = sync
        return response

    def post(self, request: Request) -> Response:
        campaign = campaign_manager.create_campaign(user=request.user,
                                                    **self.validated(CampaignCreateSerializer))
        return Response(CampaignSerializer(campaign).data, status=status.HTTP_201_CREATED)


class CampaignDetailAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def get(self, request: Request, pk: int) -> Response:
        return Response(CampaignSerializer(get_object_or_404(Campaign, pk=pk)).data)

    def patch(self, request: Request, pk: int) -> Response:
        campaign = campaign_manager.configure_campaign(
            get_object_or_404(Campaign, pk=pk), user=request.user,
            **self.validated(CampaignConfigSerializer))
        return Response(CampaignSerializer(campaign).data)


class CampaignVerifySenderAPIView(LeadgenAPIView):
    """Check the campaign's mailboxes against Smartlead's SPF/DKIM/DMARC/SMTP status."""

    permission_classes = [IsLeadgenAdmin]

    def post(self, request: Request, pk: int) -> Response:
        campaign, blockers = campaign_manager.verify_sender(get_object_or_404(Campaign, pk=pk),
                                                            user=request.user)
        return Response({**CampaignSerializer(campaign).data,
                         "verification_blockers": blockers})


class CampaignWebhookAPIView(LeadgenAPIView):
    """Register our webhook on an imported campaign (gated Smartlead write)."""

    permission_classes = [IsLeadgenManager]

    def post(self, request: Request, pk: int) -> Response:
        campaign = campaign_manager.enable_webhook(get_object_or_404(Campaign, pk=pk),
                                                   user=request.user)
        return Response(CampaignSerializer(campaign).data)


class CampaignApproveAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenAdmin]

    def post(self, request: Request, pk: int) -> Response:
        campaign = campaign_manager.approve_for_sending(get_object_or_404(Campaign, pk=pk),
                                                        user=request.user)
        return Response(CampaignSerializer(campaign).data)


class CampaignStatusAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def post(self, request: Request, pk: int) -> Response:
        campaign = campaign_manager.set_status(
            get_object_or_404(Campaign, pk=pk),
            self.validated(CampaignStatusSerializer)["status"], user=request.user)
        return Response(CampaignSerializer(campaign).data)


class CampaignEnrollAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def post(self, request: Request, pk: int) -> Response:
        campaign = get_object_or_404(Campaign, pk=pk)
        data = self.validated(ContactIdsSerializer)
        return Response(campaign_manager.enroll(campaign, _contacts(data["contact_ids"]),
                                                user=request.user))


class CampaignLeadActionAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenManager]

    def post(self, request: Request, pk: int, contact_id: int, action: str) -> Response:
        campaign = get_object_or_404(Campaign, pk=pk)
        contact = get_object_or_404(ProspectContact, pk=contact_id, enrollments__campaign=campaign)
        enrollment = campaign_manager.lead_action(campaign, contact, action, user=request.user)
        return Response({"contact": contact.pk, "status": enrollment.status})


class CampaignStatsAPIView(LeadgenAPIView):
    """Refresh status/analytics/lead ids from Smartlead, then return the campaign."""

    permission_classes = [IsLeadgenManager]

    def get(self, request: Request, pk: int) -> Response:
        campaign = campaign_manager.reconcile(get_object_or_404(Campaign, pk=pk),
                                              user=request.user)
        return Response(CampaignSerializer(campaign).data)


## ===== CRM & logs ===== ##

class CrmSyncAPIView(LeadgenAPIView):
    """Sync one contact to EmpFly CRM now (same code path and retries as the outbox)."""

    permission_classes = [IsLeadgenManager]

    def post(self, request: Request, contact_id: int) -> Response:
        contact = get_object_or_404(ProspectContact, pk=contact_id)
        job = crm_sync.queue_crm_sync(contact, reason="manual")
        if claim(job):
            job.refresh_from_db()
            run_job(job)
        contact.refresh_from_db()
        return Response({"job_status": job.status, "last_error": job.last_error,
                         "contact": ProspectContactSerializer(contact).data})


class ApiCallLogListAPIView(LeadgenAPIView):
    permission_classes = [IsLeadgenAdmin]

    def get(self, request: Request) -> Response:
        queryset = ApiCallLog.objects.select_related("triggered_by")
        if request.query_params.get("provider"):
            queryset = queryset.filter(provider=request.query_params["provider"])
        if request.query_params.get("errors") in ("1", "true"):
            queryset = queryset.filter(ok=False)
        return self.paginated(queryset, ApiCallLogSerializer)
