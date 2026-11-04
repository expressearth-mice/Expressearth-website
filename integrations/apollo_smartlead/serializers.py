import re

from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import (
    ApiCallLog,
    Campaign,
    OutreachEvent,
    ProspectCompany,
    ProspectContact,
    SuppressionEntry,
)
from .permissions import is_leadgen_member
from .services.campaign_manager import sending_blockers

User = get_user_model()

_RANGE_RE = re.compile(r"^\d+,\d+$")
SENIORITIES = ["owner", "founder", "c_suite", "partner", "vp", "head", "director", "manager",
               "senior", "entry", "intern"]


def _strings(**kwargs):
    return serializers.ListField(child=serializers.CharField(max_length=200), required=False,
                                 max_length=50, **kwargs)


def _ids(max_length=200):
    return serializers.ListField(child=serializers.IntegerField(min_value=1), allow_empty=False,
                                 max_length=max_length)


## ===== Read serializers ===== ##

class ProspectCompanySerializer(serializers.ModelSerializer):
    location = serializers.ReadOnlyField()

    class Meta:
        model = ProspectCompany
        fields = [
            "id", "name", "domain", "website", "industry", "employee_count", "employee_range",
            "city", "state", "country", "location", "is_ncr", "apollo_organization_id",
            "created_at", "updated_at",
        ]


class ProspectContactSerializer(serializers.ModelSerializer):
    """Read serializer: every required lead field from the client brief."""

    full_name = serializers.ReadOnlyField()
    company = ProspectCompanySerializer(read_only=True)
    assigned_to = serializers.ReadOnlyField(source="assigned_to.username", default=None)
    assigned_to_id = serializers.ReadOnlyField()
    approved_by = serializers.ReadOnlyField(source="approved_by.username", default=None)
    campaign_name = serializers.ReadOnlyField(source="campaign.name", default=None)
    smartlead_campaign_id = serializers.ReadOnlyField(source="campaign.smartlead_campaign_id",
                                                      default=None)
    suppression_status = serializers.ReadOnlyField(source="suppression_reason")

    class Meta:
        model = ProspectContact
        fields = [
            "id", "full_name", "first_name", "last_name", "designation", "seniority",
            "linkedin_url", "company", "email", "email_status", "phone", "phone_status",
            "has_email", "has_phone", "apollo_contact_id", "lead_source", "verification_source",
            "enriched_at", "lead_score", "score_breakdown", "approval_status", "approved_by",
            "approved_at", "rejection_reason", "assigned_to", "assigned_to_id",
            "outreach_status", "campaign", "campaign_name", "smartlead_campaign_id",
            "last_reply_at", "last_reply_text", "reply_category", "next_follow_up_date",
            "suppression_status", "crm_company_id", "crm_lead_id", "crm_task_id",
            "crm_sync_status", "crm_sync_error", "crm_synced_at", "created_at", "updated_at",
        ]


class OutreachEventSerializer(serializers.ModelSerializer):
    campaign_name = serializers.ReadOnlyField(source="campaign.name", default=None)

    class Meta:
        model = OutreachEvent
        fields = ["id", "event_type", "detail", "campaign", "campaign_name", "occurred_at"]


class CampaignSerializer(serializers.ModelSerializer):
    sender_verified = serializers.ReadOnlyField()
    sending_blockers = serializers.SerializerMethodField()
    enrolled_count = serializers.SerializerMethodField()

    class Meta:
        model = Campaign
        fields = [
            "id", "smartlead_campaign_id", "name", "status", "sender_domain", "spf_verified",
            "dkim_verified", "dmarc_verified", "sender_report", "sender_verified",
            "sender_verified_at", "approved_for_sending", "approved_at", "smartlead_webhook_id",
            "stats",
            "last_synced_at", "sending_blockers", "enrolled_count", "created_at", "updated_at",
        ]

    def get_sending_blockers(self, obj):
        return sending_blockers(obj)

    def get_enrolled_count(self, obj):
        return obj.enrollments.count()


class SuppressionEntrySerializer(serializers.ModelSerializer):
    created_by = serializers.ReadOnlyField(source="created_by.username", default=None)

    class Meta:
        model = SuppressionEntry
        fields = ["id", "email", "domain", "reason", "source", "note", "pushed_to_smartlead",
                  "created_by", "created_at"]
        read_only_fields = ["source", "pushed_to_smartlead"]

    def validate(self, attrs):
        if bool(attrs.get("email")) == bool(attrs.get("domain")):
            raise serializers.ValidationError("Give exactly one of email or domain.")
        return attrs


class ApiCallLogSerializer(serializers.ModelSerializer):
    triggered_by = serializers.ReadOnlyField(source="triggered_by.username", default=None)

    class Meta:
        model = ApiCallLog
        fields = ["id", "provider", "method", "endpoint", "status_code", "ok", "duration_ms",
                  "credits_consumed", "error", "triggered_by", "created_at"]


## ===== Write / input serializers ===== ##

class CompanySearchSerializer(serializers.Serializer):
    industry_keywords = _strings()
    locations = _strings()
    ncr = serializers.BooleanField(default=False)
    employee_ranges = _strings(help_text='Apollo ranges like "51,200"')
    page = serializers.IntegerField(min_value=1, max_value=500, default=1)
    per_page = serializers.IntegerField(min_value=1, max_value=100, default=25)

    def validate_employee_ranges(self, value):
        bad = [v for v in value if not _RANGE_RE.match(v)]
        if bad:
            raise serializers.ValidationError(f'Use "min,max" format, e.g. "51,200": {bad}')
        return value


class PeopleSearchSerializer(serializers.Serializer):
    company_ids = serializers.ListField(child=serializers.IntegerField(min_value=1),
                                        required=False, max_length=100)
    titles = _strings()
    seniorities = serializers.ListField(child=serializers.ChoiceField(choices=SENIORITIES),
                                        required=False)
    person_locations = _strings()
    page = serializers.IntegerField(min_value=1, max_value=500, default=1)
    per_page = serializers.IntegerField(min_value=1, max_value=100, default=25)


class EnrichSerializer(serializers.Serializer):
    contact_ids = _ids(max_length=50)
    reveal_phone = serializers.BooleanField(default=False)
    force = serializers.BooleanField(default=False)


class ContactIdsSerializer(serializers.Serializer):
    contact_ids = _ids()


class AssigneeField(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        return User.objects.filter(is_active=True)


class ApproveSerializer(ContactIdsSerializer):
    assigned_to = AssigneeField(required=False, allow_null=True)

    def validate_assigned_to(self, user):
        if user and not is_leadgen_member(user):
            raise serializers.ValidationError("User has no lead-generation role.")
        return user


class RejectSerializer(ContactIdsSerializer):
    reason = serializers.CharField(max_length=255, required=False, allow_blank=True)


class AssignSerializer(ContactIdsSerializer):
    assigned_to = AssigneeField()
    validate_assigned_to = ApproveSerializer.validate_assigned_to


class ContactUpdateSerializer(serializers.ModelSerializer):
    """What an executive may change on their own lead."""

    class Meta:
        model = ProspectContact
        fields = ["next_follow_up_date"]


class CampaignConfigSerializer(serializers.Serializer):
    sequences = serializers.ListField(child=serializers.DictField(), required=False)
    settings = serializers.DictField(required=False)
    schedule = serializers.DictField(required=False)
    email_account_ids = serializers.ListField(child=serializers.IntegerField(min_value=1),
                                              required=False)


class CampaignCreateSerializer(CampaignConfigSerializer):
    name = serializers.CharField(max_length=255)


class CampaignStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=["START", "PAUSED", "STOPPED"])
