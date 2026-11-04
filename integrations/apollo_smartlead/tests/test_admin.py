import os
from unittest import mock

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from ..models import Campaign, ProspectContact
from .helpers import (
    KEYS,
    REQUEST,
    FakeSmartlead,
    ee_campaign_routes,
    mailbox,
    make_campaign,
    make_contact,
)

MODELS = ("prospectcontact", "prospectcompany", "campaign", "campaignenrollment",
          "suppressionentry", "salesexecutiveprofile", "outboxjob", "webhookevent",
          "apicalllog", "prospectsearch")


class AdminDashboardTests(TestCase):
    def setUp(self):
        self.admin = get_user_model().objects.create_superuser("root", "root@x.com", "x")
        self.client.force_login(self.admin)
        self.contact = make_contact()
        self.campaign = make_campaign()

    def test_every_screen_renders(self):
        for model in MODELS:
            url = reverse(f"admin:apollo_smartlead_{model}_changelist")
            self.assertEqual(self.client.get(url).status_code, 200, model)
        for model, obj in (("prospectcontact", self.contact), ("campaign", self.campaign)):
            url = reverse(f"admin:apollo_smartlead_{model}_change", args=[obj.pk])
            self.assertEqual(self.client.get(url).status_code, 200, model)

    def test_campaign_list_has_sync_button_and_readiness(self):
        response = self.client.get(reverse("admin:apollo_smartlead_campaign_changelist"))
        self.assertContains(response, reverse("admin:apollo_smartlead_campaign_sync"))
        response = self.client.get(reverse("admin:apollo_smartlead_campaign_change",
                                           args=[self.campaign.pk]))
        self.assertContains(response, "Sender mailboxes not verified")

    def test_approve_action(self):
        url = reverse("admin:apollo_smartlead_prospectcontact_changelist")
        self.client.post(url, {"action": "approve", "_selected_action": [self.contact.pk]})
        self.contact.refresh_from_db()
        self.assertEqual(self.contact.approval_status, ProspectContact.Approval.APPROVED)
        self.assertEqual(self.contact.approved_by, self.admin)

    @mock.patch.dict(os.environ, KEYS)
    def test_verify_sender_action_records_smartlead_checks(self):
        url = reverse("admin:apollo_smartlead_campaign_changelist")
        with mock.patch(REQUEST, side_effect=FakeSmartlead(ee_campaign_routes())):
            self.client.post(url, {"action": "verify_sender",
                                   "_selected_action": [self.campaign.pk]})
        self.campaign.refresh_from_db()
        self.assertTrue(self.campaign.sender_verified)
        self.assertEqual(self.campaign.sender_verified_by, self.admin)
        page = self.client.get(reverse("admin:apollo_smartlead_campaign_change",
                                       args=[self.campaign.pk]))
        self.assertContains(page, "sales@expressearth.in")

    @mock.patch.dict(os.environ, KEYS)
    def test_sync_button_skips_other_brands(self):
        api = FakeSmartlead({
            "GET campaigns": [{"id": 1, "name": "EE", "status": "ACTIVE"},
                              {"id": 2, "name": "empfly", "status": "ACTIVE"}],
            "GET campaigns/1/email-accounts": [mailbox(1)],
            "GET campaigns/2/email-accounts": [mailbox(9, "x@empfly.co")],
        })
        with mock.patch(REQUEST, side_effect=api):
            response = self.client.get(reverse("admin:apollo_smartlead_campaign_sync"),
                                       follow=True)
        self.assertContains(response, "skipped 1")
        self.assertTrue(Campaign.objects.filter(smartlead_campaign_id=1).exists())
        self.assertFalse(Campaign.objects.filter(smartlead_campaign_id=2).exists())
