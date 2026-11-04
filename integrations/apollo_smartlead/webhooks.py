"""Inbound webhooks from Smartlead (campaign events) and Apollo (phone numbers).

Security: both URLs carry a secret path token compared in constant time (a
wrong token gets a plain 404). Smartlead requests are additionally checked
against ``X-Smartlead-Signature`` (HMAC-SHA256) when SMARTLEAD_SIGNING_SECRET
is set. Every event is stored in ``WebhookEvent`` under a dedupe key before it
is applied, so provider retries are processed exactly once.

Smartlead retries on 5xx only, so: bad auth/payload -> 4xx, unknown campaign
or lead -> 200 "ignored", our own processing error -> 500 (retried, and the
failed event is re-applied on the retry).
"""
import hashlib
import hmac
import json
import logging
import secrets

from django.db import transaction
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.utils.html import strip_tags
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from . import conf
from .models import (
    Campaign,
    CampaignEnrollment,
    OutreachEvent,
    OutreachStatus,
    ProspectContact,
    SuppressionEntry,
    WebhookEvent,
    normalize_email,
)
from .services.contact_enrichment import apply_phone_webhook
from .services.crm_sync import next_business_day, queue_crm_sync

logger = logging.getLogger(__name__)

MAX_BODY_BYTES = 256 * 1024

POSITIVE_CATEGORIES = {"interested", "meeting request", "meeting booked", "information request"}
NEGATIVE_CATEGORIES = {"not interested", "wrong person"}
DO_NOT_CONTACT_CATEGORIES = {"do not contact"}

# Events never move a lead "backwards" (e.g. a late open after a reply).
_RANK = {
    OutreachStatus.NOT_ENROLLED: 0, OutreachStatus.ENROLLED: 0, OutreachStatus.PAUSED: 0,
    OutreachStatus.REMOVED: 0, OutreachStatus.SENT: 1, OutreachStatus.OPENED: 2,
    OutreachStatus.REPLIED: 3, OutreachStatus.POSITIVE_REPLY: 4,
    OutreachStatus.NEGATIVE_REPLY: 4, OutreachStatus.BOUNCED: 5,
    OutreachStatus.UNSUBSCRIBED: 5,
}


def _token_ok(supplied, expected):
    return bool(expected) and secrets.compare_digest(supplied.encode(), expected.encode())


def _not_found():
    return Response({"errors": {"detail": "Not found."}}, status=status.HTTP_404_NOT_FOUND)


def _parse_body(request):
    """Return ``(payload, error_response)``."""
    if len(request.body) > MAX_BODY_BYTES:
        return None, Response({"errors": {"detail": "Payload too large."}},
                              status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE)
    try:
        payload = json.loads(request.body or b"{}")
    except (ValueError, UnicodeDecodeError):
        payload = None
    if not isinstance(payload, dict):
        return None, Response({"errors": {"detail": "Invalid JSON."}},
                              status=status.HTTP_400_BAD_REQUEST)
    return payload, None


def _body_key(provider, body):
    return f"{provider}:{hashlib.sha256(body).hexdigest()}"


def _store(provider, dedupe_key, event_type, payload):
    """Return ``(event, should_process)``."""
    event, created = WebhookEvent.objects.get_or_create(
        dedupe_key=dedupe_key[:128],
        defaults={"provider": provider, "event_type": event_type[:50], "payload": payload},
    )
    return event, created or event.status == WebhookEvent.Status.FAILED


def _finish(event, outcome):
    event.status = WebhookEvent.Status.IGNORED if outcome.startswith("ignored") \
        else WebhookEvent.Status.PROCESSED
    event.error = outcome if event.status == WebhookEvent.Status.IGNORED else ""
    event.processed_at = timezone.now()
    event.save(update_fields=["status", "error", "processed_at"])


def _fail(event, exc):
    logger.exception("Webhook event %s failed", event.pk)
    event.status = WebhookEvent.Status.FAILED
    event.error = f"{exc.__class__.__name__}: {exc}"[:2000]
    event.save(update_fields=["status", "error"])


## ===== Smartlead event handling ===== ##

def _when(payload, *keys):
    for key in keys:
        value = payload.get(key)
        parsed = parse_datetime(value) if isinstance(value, str) else None
        if parsed:
            return parsed if timezone.is_aware(parsed) else timezone.make_aware(parsed)
    return timezone.now()


def _advance(enrollment, new_status):
    if _RANK[new_status] >= _RANK.get(enrollment.status, 0):
        enrollment.status = new_status


def _suppress(email, reason):
    SuppressionEntry.objects.get_or_create(email=email,
                                           defaults={"reason": reason, "source": "smartlead"})


def _category(payload):
    lead_data = payload.get("lead_data") or {}
    category = lead_data.get("category") if isinstance(lead_data.get("category"), dict) else {}
    name = payload.get("category") or category.get("name") or ""
    return str(name)[:100], str(category.get("sentiment_type") or "").lower()


def _reply_text(payload):
    text = payload.get("reply_body") or payload.get("preview_text") or ""
    last = payload.get("lastReply")
    if not text and isinstance(last, dict):
        text = last.get("email_body") or last.get("text") or ""
    return strip_tags(str(text)).strip()[:5000]


def apply_smartlead_event(event_type, payload, webhook_event=None):
    """Apply one Smartlead event to our records. Returns a short outcome string."""
    try:
        campaign_id = int(payload.get("campaign_id") or 0)
    except (TypeError, ValueError):
        campaign_id = 0
    campaign = Campaign.objects.filter(smartlead_campaign_id=campaign_id).first() \
        if campaign_id else None
    if campaign is None:
        return "ignored: unknown campaign"
    email = normalize_email(payload.get("lead_email") or payload.get("to_email")
                            or (payload.get("lead_data") or {}).get("email"))
    contact = ProspectContact.objects.filter(email=email).first() if email else None
    if contact is None:
        return "ignored: unknown lead"

    enrollment, _ = CampaignEnrollment.objects.get_or_create(contact=contact, campaign=campaign)
    if payload.get("lead_id") and not enrollment.smartlead_lead_id:
        enrollment.smartlead_lead_id = str(payload["lead_id"])
    detail = ""

    if event_type in ("EMAIL_SENT", "FIRST_EMAIL_SENT"):
        enrollment.sent_at = enrollment.sent_at or _when(payload, "time_sent")
        _advance(enrollment, OutreachStatus.SENT)
        detail = f"Step {payload.get('sequence_number') or '-'} sent"
    elif event_type == "EMAIL_OPEN":
        enrollment.opened_at = enrollment.opened_at or _when(payload, "time_opened")
        _advance(enrollment, OutreachStatus.OPENED)
    elif event_type == "EMAIL_LINK_CLICK":
        detail = "Clicked a link"
    elif event_type == "EMAIL_REPLY":
        enrollment.replied_at = _when(payload, "time_replied")
        _advance(enrollment, OutreachStatus.REPLIED)
        contact.last_reply_at = enrollment.replied_at
        contact.last_reply_text = _reply_text(payload)
        detail = contact.last_reply_text[:500]
    elif event_type == "EMAIL_BOUNCE":
        enrollment.bounced_at = timezone.now()
        _advance(enrollment, OutreachStatus.BOUNCED)
        _suppress(email, SuppressionEntry.Reason.BOUNCED)
    elif event_type == "LEAD_UNSUBSCRIBED":
        enrollment.unsubscribed_at = timezone.now()
        _advance(enrollment, OutreachStatus.UNSUBSCRIBED)
        _suppress(email, SuppressionEntry.Reason.UNSUBSCRIBED)
    elif event_type == "LEAD_CATEGORY_UPDATED":
        category, sentiment = _category(payload)
        contact.reply_category = category
        if not contact.last_reply_text:
            contact.last_reply_text = _reply_text(payload)
        key = category.lower()
        if key in DO_NOT_CONTACT_CATEGORIES:
            _advance(enrollment, OutreachStatus.NEGATIVE_REPLY)
            _suppress(email, SuppressionEntry.Reason.DO_NOT_CONTACT)
        elif key in POSITIVE_CATEGORIES or sentiment == "positive":
            _advance(enrollment, OutreachStatus.POSITIVE_REPLY)
            contact.next_follow_up_date = contact.next_follow_up_date or next_business_day()
        elif key in NEGATIVE_CATEGORIES or sentiment == "negative":
            _advance(enrollment, OutreachStatus.NEGATIVE_REPLY)
        detail = f"Category: {category or '-'}"
    else:
        return f"ignored: event {event_type or '-'}"

    enrollment.save()
    if contact.campaign_id in (None, campaign.pk):
        contact.campaign = campaign
        contact.outreach_status = enrollment.status
    contact.save()
    OutreachEvent.objects.create(contact=contact, campaign=campaign, event_type=event_type.lower(),
                                 detail=detail, webhook_event=webhook_event)
    if event_type == "LEAD_CATEGORY_UPDATED" \
            and enrollment.status == OutreachStatus.POSITIVE_REPLY:
        queue_crm_sync(contact)
    return "processed"


class SmartleadWebhookAPIView(APIView):
    """``POST /api/integrations/webhooks/smartlead/<token>/``"""

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request: Request, token: str) -> Response:
        if not _token_ok(token, conf.smartlead_webhook_secret()):
            return _not_found()
        signing_secret = conf.smartlead_signing_secret()
        if signing_secret:
            digest = hmac.new(signing_secret.encode(), request.body, hashlib.sha256).hexdigest()
            supplied = request.headers.get("X-Smartlead-Signature", "").removeprefix("sha256=")
            if not secrets.compare_digest(supplied, digest):
                return Response({"errors": {"detail": "Invalid signature."}},
                                status=status.HTTP_401_UNAUTHORIZED)
        payload, error = _parse_body(request)
        if error:
            return error

        event_type = str(payload.get("event_type") or "").upper()
        request_id = request.headers.get("X-Request-Id", "")
        key = f"smartlead:{request_id}" if request_id else _body_key("smartlead", request.body)
        event, should_process = _store("smartlead", key, event_type, payload)
        if not should_process:
            return Response({"received": True, "status": "duplicate"})
        try:
            with transaction.atomic():
                outcome = apply_smartlead_event(event_type, payload, webhook_event=event)
        except Exception as exc:
            _fail(event, exc)
            return Response({"errors": {"detail": "Processing failed."}},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        _finish(event, outcome)
        return Response({"received": True, "status": outcome})


class ApolloPhoneWebhookAPIView(APIView):
    """``POST /api/integrations/apollo/phone-webhook/<token>/`` -- async phone reveals."""

    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request: Request, token: str) -> Response:
        if not _token_ok(token, conf.apollo_webhook_secret()):
            return _not_found()
        payload, error = _parse_body(request)
        if error:
            return error
        event, should_process = _store("apollo", _body_key("apollo", request.body),
                                       "phone_numbers", payload)
        if not should_process:
            return Response({"received": True, "status": "duplicate"})
        try:
            with transaction.atomic():
                updated = apply_phone_webhook(payload)
        except Exception as exc:
            _fail(event, exc)
            return Response({"errors": {"detail": "Processing failed."}},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        _finish(event, "processed")
        return Response({"received": True, "updated": updated})
