import hashlib
import hmac
import json
import os
from unittest import mock

from django.test import TestCase
from rest_framework.test import APIClient

from ..models import (
    OutboxJob,
    OutreachEvent,
    OutreachStatus,
    ProspectContact,
    SuppressionEntry,
    WebhookEvent,
)
from .helpers import KEYS, make_campaign, make_contact

URL = "/api/integrations/webhooks/smartlead/hook-secret/"


@mock.patch.dict(os.environ, KEYS)
class SmartleadWebhookTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.campaign = make_campaign(ready=True)
        self.contact = make_contact(campaign=self.campaign,
                                    approval_status=ProspectContact.Approval.APPROVED,
                                    outreach_status=OutreachStatus.SENT)

    def post(self, payload, url=URL, **headers):
        return self.client.post(url, data=json.dumps(payload), content_type="application/json",
                                **headers)

    def event(self, event_type, **fields):
        return {"event_type": event_type, "campaign_id": 101, "to_email": "asha@acme.com",
                **fields}

    def test_wrong_or_missing_token_is_404(self):
        self.assertEqual(self.post(self.event("EMAIL_OPEN"),
                                   url="/api/integrations/webhooks/smartlead/nope/").status_code,
                         404)
        with mock.patch.dict(os.environ, {"SMARTLEAD_WEBHOOK_SECRET": ""}):
            self.assertEqual(self.post(self.event("EMAIL_OPEN")).status_code, 404)
        self.assertFalse(WebhookEvent.objects.exists())

    def test_signature_is_enforced_when_signing_secret_set(self):
        payload = self.event("EMAIL_OPEN")
        body = json.dumps(payload).encode()
        with mock.patch.dict(os.environ, {"SMARTLEAD_SIGNING_SECRET": "sign"}):
            self.assertEqual(self.post(payload).status_code, 401)
            signature = "sha256=" + hmac.new(b"sign", body, hashlib.sha256).hexdigest()
            self.assertEqual(self.post(payload, HTTP_X_SMARTLEAD_SIGNATURE=signature).status_code,
                             200)

    def test_reply_is_recorded(self):
        response = self.post(self.event("EMAIL_REPLY", reply_body="<p>Sounds good, call me</p>",
                                        time_replied="2026-11-03T10:00:00+05:30"))
        self.assertEqual(response.json()["status"], "processed")
        self.contact.refresh_from_db()
        self.assertEqual(self.contact.outreach_status, OutreachStatus.REPLIED)
        self.assertEqual(self.contact.last_reply_text, "Sounds good, call me")

    def test_interested_category_marks_positive_and_queues_crm_sync(self):
        payload = {"event_type": "LEAD_CATEGORY_UPDATED", "campaign_id": 101, "lead_id": 77,
                   "lead_email": "asha@acme.com",
                   "lead_data": {"category": {"name": "Interested", "sentiment_type": "positive"}}}
        self.post(payload)
        self.contact.refresh_from_db()
        self.assertEqual(self.contact.outreach_status, OutreachStatus.POSITIVE_REPLY)
        self.assertEqual(self.contact.reply_category, "Interested")
        self.assertIsNotNone(self.contact.next_follow_up_date)
        self.assertEqual(self.contact.enrollments.get().smartlead_lead_id, "77")
        job = OutboxJob.objects.get()
        self.assertEqual(job.contact, self.contact)
        self.assertEqual(self.contact.crm_sync_status, ProspectContact.CrmSync.QUEUED)

    def test_retried_delivery_is_processed_once(self):
        payload = self.event("EMAIL_OPEN")
        first = self.post(payload, HTTP_X_REQUEST_ID="req-1")
        second = self.post(payload, HTTP_X_REQUEST_ID="req-1")
        self.assertEqual(first.json()["status"], "processed")
        self.assertEqual(second.json()["status"], "duplicate")
        self.assertEqual(OutreachEvent.objects.count(), 1)

    def test_unsubscribe_suppresses_the_email(self):
        self.post({"event_type": "LEAD_UNSUBSCRIBED", "campaign_id": 101,
                   "lead_email": "asha@acme.com"})
        self.contact.refresh_from_db()
        self.assertEqual(self.contact.outreach_status, OutreachStatus.UNSUBSCRIBED)
        self.assertEqual(SuppressionEntry.objects.get().reason, "unsubscribed")
        self.assertTrue(self.contact.is_suppressed)

    def test_late_open_does_not_downgrade_a_reply(self):
        self.post(self.event("EMAIL_REPLY", reply_body="yes"))
        self.post(self.event("EMAIL_OPEN"))
        self.contact.refresh_from_db()
        self.assertEqual(self.contact.outreach_status, OutreachStatus.REPLIED)

    def test_unknown_campaign_is_acknowledged_but_ignored(self):
        response = self.post({**self.event("EMAIL_OPEN"), "campaign_id": 999})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(WebhookEvent.objects.get().status, WebhookEvent.Status.IGNORED)

    def test_failed_event_is_reprocessed_on_retry(self):
        payload = self.event("EMAIL_OPEN")
        with mock.patch("integrations.apollo_smartlead.webhooks.apply_smartlead_event",
                        side_effect=RuntimeError("db hiccup")):
            self.assertEqual(self.post(payload, HTTP_X_REQUEST_ID="req-2").status_code, 500)
        self.assertEqual(WebhookEvent.objects.get().status, WebhookEvent.Status.FAILED)
        self.assertEqual(self.post(payload, HTTP_X_REQUEST_ID="req-2").json()["status"],
                         "processed")


@mock.patch.dict(os.environ, KEYS)
class ApolloPhoneWebhookTests(TestCase):
    def test_phone_numbers_are_stored(self):
        contact = make_contact()
        payload = {"people": [{"id": "person-1", "phone_numbers": [
            {"sanitized_number": "+919876543210", "type_cd": "mobile",
             "status_cd": "valid_number"}]}]}
        response = APIClient().post("/api/integrations/apollo/phone-webhook/apollo-hook-secret/",
                                    data=payload, format="json")
        self.assertEqual(response.json()["updated"], 1)
        contact.refresh_from_db()
        self.assertEqual(contact.phone, "+919876543210")
