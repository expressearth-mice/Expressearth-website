import os
from unittest import mock

from django.test import TestCase

from ..models import (
    Campaign,
    CampaignEnrollment,
    OutreachStatus,
    ProspectContact,
    SuppressionEntry,
)
from ..services import campaign_manager
from ..services.campaign_manager import GateClosed
from .helpers import (
    GATES_OPEN,
    KEYS,
    REQUEST,
    FakeSmartlead,
    ee_campaign_routes,
    mailbox,
    make_campaign,
    make_contact,
    make_user,
)

EMPFLY_BOX = mailbox(9, "sales@empfly.co")


@mock.patch.dict(os.environ, KEYS)
class GateTests(TestCase):
    """With the default (unset) flags, nothing can be written to or sent from Smartlead."""

    def setUp(self):
        self.user = make_user("manager")

    def test_create_is_blocked_by_default(self):
        with mock.patch(REQUEST) as request:
            with self.assertRaises(GateClosed) as ctx:
                campaign_manager.create_campaign(user=self.user, name="Test")
        request.assert_not_called()
        self.assertIn("SMARTLEAD_WRITE_ENABLED", ctx.exception.blockers[0])

    def test_enroll_is_blocked_until_sender_verified_and_approved(self):
        with mock.patch.dict(os.environ, GATES_OPEN), mock.patch(REQUEST) as request:
            with self.assertRaises(GateClosed) as ctx:
                campaign_manager.enroll(make_campaign(), [make_contact()], user=self.user)
        request.assert_not_called()
        self.assertEqual(len(ctx.exception.blockers), 2)

    def test_start_is_blocked_when_sending_flag_off(self):
        campaign = make_campaign(ready=True)
        with mock.patch.dict(os.environ, {"SMARTLEAD_WRITE_ENABLED": "1"}), \
                mock.patch(REQUEST) as request:
            with self.assertRaises(GateClosed) as ctx:
                campaign_manager.set_status(campaign, "START", user=self.user)
        request.assert_not_called()
        self.assertIn("SMARTLEAD_SENDING_ENABLED", ctx.exception.blockers[0])

    def test_start_is_blocked_while_an_enrolled_lead_is_suppressed(self):
        campaign = make_campaign(ready=True)
        contact = make_contact()
        CampaignEnrollment.objects.create(contact=contact, campaign=campaign)
        SuppressionEntry.objects.create(email=contact.email)
        with mock.patch.dict(os.environ, GATES_OPEN), mock.patch(REQUEST) as request:
            with self.assertRaises(GateClosed):
                campaign_manager.set_status(campaign, "START", user=self.user)
        request.assert_not_called()

    def test_pause_skips_the_flags(self):
        campaign = make_campaign()
        api = FakeSmartlead(ee_campaign_routes())
        with mock.patch(REQUEST, side_effect=api):
            campaign_manager.set_status(campaign, "PAUSED", user=self.user)
        self.assertEqual(api.writes(), [("PATCH", "campaigns/101/status")])
        self.assertEqual(campaign.status, "PAUSED")

    def test_approval_requires_verified_sender(self):
        with self.assertRaises(GateClosed):
            campaign_manager.approve_for_sending(make_campaign(), user=self.user)


@mock.patch.dict(os.environ, {**KEYS, **GATES_OPEN})
class SharedAccountScopeTests(TestCase):
    """The Smartlead account also holds EmpFly / Indo Exhibits campaigns: never touch them."""

    def setUp(self):
        self.user = make_user("manager")

    def test_sync_imports_only_campaigns_on_expressearth_mailboxes(self):
        api = FakeSmartlead({
            "GET campaigns": [
                {"id": 1, "name": "happy raksha bandhan", "status": "PAUSED"},
                {"id": 2, "name": "empfly Demo", "status": "ACTIVE"},
                {"id": 3, "name": "EE: mixed", "status": "ACTIVE"},
                {"id": 4, "name": "EE draft", "status": "DRAFTED"},
                {"id": 5, "name": "ExpressEarth old", "status": "COMPLETED"},
            ],
            "GET campaigns/1/email-accounts": [mailbox(1, "a@expressearth.in"),
                                               mailbox(2, "b@expressearth.com")],
            "GET campaigns/2/email-accounts": [EMPFLY_BOX],
            "GET campaigns/3/email-accounts": [mailbox(1), EMPFLY_BOX],
            "GET campaigns/4/email-accounts": [],
        })
        with mock.patch(REQUEST, side_effect=api):
            campaigns, skipped = campaign_manager.sync_campaigns(user=self.user)
        self.assertEqual([c.smartlead_campaign_id for c in campaigns], [1])
        self.assertEqual(skipped, 3)
        self.assertEqual(Campaign.objects.count(), 1)
        self.assertFalse(api.called("GET", "campaigns/5/email-accounts"))  # finished: not checked
        self.assertEqual(api.writes(), [])

    def test_sync_refreshes_already_imported_campaigns_without_rechecking(self):
        campaign = make_campaign(status="ACTIVE")
        api = FakeSmartlead({"GET campaigns": [{"id": 101, "name": "Renamed", "status": "PAUSED"}]})
        with mock.patch(REQUEST, side_effect=api):
            campaign_manager.sync_campaigns(user=self.user)
        campaign.refresh_from_db()
        self.assertEqual((campaign.name, campaign.status), ("Renamed", "PAUSED"))

    def test_pause_is_refused_on_another_brands_campaign(self):
        campaign = make_campaign()
        api = FakeSmartlead(ee_campaign_routes(mailboxes=[EMPFLY_BOX]))
        with mock.patch(REQUEST, side_effect=api):
            with self.assertRaises(GateClosed) as ctx:
                campaign_manager.set_status(campaign, "PAUSED", user=self.user)
        self.assertIn("outside ExpressEarth", ctx.exception.blockers[0])
        self.assertEqual(api.writes(), [])

    def test_enroll_is_refused_if_mailboxes_changed_to_another_brand(self):
        campaign = make_campaign(ready=True)
        contact = make_contact(approval_status=ProspectContact.Approval.APPROVED)
        api = FakeSmartlead(ee_campaign_routes(mailboxes=[mailbox(1), EMPFLY_BOX]))
        with mock.patch(REQUEST, side_effect=api):
            with self.assertRaises(GateClosed):
                campaign_manager.enroll(campaign, [contact], user=self.user)
        self.assertEqual(api.writes(), [])

    def test_cannot_attach_another_brands_mailbox(self):
        campaign = make_campaign(created_by=self.user)
        api = FakeSmartlead({"GET campaigns/101/email-accounts": [],
                             "GET email-accounts": [mailbox(1), EMPFLY_BOX]})
        with mock.patch(REQUEST, side_effect=api):
            with self.assertRaises(GateClosed) as ctx:
                campaign_manager.configure_campaign(campaign, user=self.user,
                                                    email_account_ids=[1, 9])
        self.assertIn("9", ctx.exception.blockers[0])
        self.assertEqual(api.writes(), [])

    def test_blocklist_is_not_pushed_unless_enabled(self):
        SuppressionEntry.objects.create(domain="client.com")
        with mock.patch(REQUEST) as request:
            self.assertEqual(campaign_manager.push_suppressions(), 0)
        request.assert_not_called()


@mock.patch.dict(os.environ, KEYS)
class SenderVerificationTests(TestCase):
    def setUp(self):
        self.admin = make_user("admin")
        self.campaign = make_campaign()

    def verify(self, mailboxes):
        with mock.patch(REQUEST, side_effect=FakeSmartlead(ee_campaign_routes(mailboxes=mailboxes))):
            return campaign_manager.verify_sender(self.campaign, user=self.admin)

    def test_uses_smartlead_dns_and_smtp_status(self):
        campaign, blockers = self.verify([mailbox(1, "a@expressearth.in"),
                                          mailbox(2, "b@expressearth.com")])
        self.assertEqual(blockers, [])
        self.assertTrue(campaign.sender_verified)
        self.assertEqual(campaign.sender_domain, "expressearth.com, expressearth.in")
        self.assertEqual(campaign.sender_verified_by, self.admin)
        self.assertNotIn("password", str(campaign.sender_report))

    def test_failing_dkim_or_smtp_is_not_verified(self):
        self.campaign.approved_for_sending = True
        self.campaign.save()
        campaign, blockers = self.verify([mailbox(1, dns=False), mailbox(2, "b@expressearth.in",
                                                                          smtp=False)])
        self.assertEqual(len(blockers), 2)
        self.assertFalse(campaign.sender_verified)
        self.assertFalse(campaign.approved_for_sending)  # a failed check revokes approval

    def test_campaign_without_mailboxes_cannot_be_verified(self):
        with self.assertRaises(GateClosed):
            self.verify([])


@mock.patch.dict(os.environ, {**KEYS, **GATES_OPEN})
class EnrollmentTests(TestCase):
    def setUp(self):
        self.user = make_user("manager")
        self.campaign = make_campaign(ready=True)

    def test_only_eligible_contacts_are_sent_to_smartlead(self):
        approved = make_contact(approval_status=ProspectContact.Approval.APPROVED)
        pending = make_contact(company=approved.company, first_name="Bina",
                               email="bina@acme.com", apollo_contact_id="person-2")
        api = FakeSmartlead(ee_campaign_routes())
        with mock.patch(REQUEST, side_effect=api):
            result = campaign_manager.enroll(self.campaign, [approved, pending], user=self.user)
        self.assertEqual(result["enrolled"], [approved.pk])
        self.assertIn("Not approved.", result["skipped"][pending.pk])
        leads = api.called("POST", "campaigns/101/leads")[0]["json"]["lead_list"]
        self.assertEqual([lead["email"] for lead in leads], ["asha@acme.com"])
        approved.refresh_from_db()
        self.assertEqual(approved.outreach_status, OutreachStatus.ENROLLED)
        self.assertEqual(approved.campaign, self.campaign)
        self.assertTrue(CampaignEnrollment.objects.filter(contact=approved).exists())

    def test_enroll_rechecks_mailbox_health_live(self):
        contact = make_contact(approval_status=ProspectContact.Approval.APPROVED)
        api = FakeSmartlead(ee_campaign_routes(mailboxes=[mailbox(smtp=False)]))
        with mock.patch(REQUEST, side_effect=api):
            with self.assertRaises(GateClosed) as ctx:
                campaign_manager.enroll(self.campaign, [contact], user=self.user)
        self.assertIn("SMTP", ctx.exception.blockers[0])
        self.assertEqual(api.writes(), [])

    def test_changing_sequences_needs_reapproval(self):
        api = FakeSmartlead(ee_campaign_routes())
        with mock.patch(REQUEST, side_effect=api):
            campaign_manager.configure_campaign(self.campaign, user=self.user, sequences=[
                {"seq_number": 1, "seq_delay_details": {"delay_in_days": 0},
                 "variants": [{"subject": "Hi", "email_body": "<p>Hi</p>"}]}])
        body = api.called("POST", "campaigns/101/sequences")[0]["json"]
        self.assertIsInstance(body, list)  # bare array body
        self.assertFalse(self.campaign.approved_for_sending)

    def test_create_registers_webhook_with_secret_url(self):
        api = FakeSmartlead({"POST campaigns/create": {"id": 555, "name": "New"},
                             "POST webhook/create": {"id": 9, "ok": True},
                             "GET campaigns/555/email-accounts": [],
                             "GET email-accounts": [mailbox(1)]})
        with mock.patch(REQUEST, side_effect=api):
            campaign = campaign_manager.create_campaign(user=self.user, name="New",
                                                        email_account_ids=[1])
        self.assertEqual(campaign.smartlead_campaign_id, 555)
        self.assertEqual(campaign.smartlead_webhook_id, "9")
        hook = api.called("POST", "webhook/create")[0]["json"]
        self.assertEqual(hook["webhook_url"], "https://backend.example.com/api/integrations/"
                                              "webhooks/smartlead/hook-secret/")
        self.assertTrue(hook["event_type_map"]["EMAIL_REPLY"])
        self.assertEqual(api.called("POST", "campaigns/555/email-accounts")[0]["json"],
                         {"email_account_ids": [1]})


@mock.patch.dict(os.environ, {**KEYS, **GATES_OPEN})
class CEOApprovalTests(TestCase):
    def setUp(self):
        self.manager = make_user("manager")
        self.ceo = make_user("ceo")
        self.campaign = make_campaign(ready=True)

    def test_manager_cannot_approve_even_if_sender_is_verified(self):
        with mock.patch.dict(os.environ, {"LEADGEN_CAMPAIGN_APPROVER_USER_ID": str(self.ceo.pk)}):
            with self.assertRaises(GateClosed) as ctx:
                campaign_manager.approve_for_sending(self.campaign, user=self.manager)
        self.assertIn("Only the configured ExpressEarth CEO", ctx.exception.blockers[0])
        self.assertFalse(self.campaign.approved_for_sending)

    def test_only_configured_ceo_can_approve(self):
        with mock.patch.dict(os.environ, {"LEADGEN_CAMPAIGN_APPROVER_USER_ID": str(self.ceo.pk)}):
            campaign_manager.approve_for_sending(self.campaign, user=self.ceo)
        self.campaign.refresh_from_db()
        self.assertTrue(self.campaign.approved_for_sending)
        self.assertEqual(self.campaign.approved_by, self.ceo)

    def test_unset_approver_fails_closed(self):
        with mock.patch.dict(os.environ, {"LEADGEN_CAMPAIGN_APPROVER_USER_ID": ""}):
            with self.assertRaises(GateClosed):
                campaign_manager.approve_for_sending(self.campaign, user=self.ceo)
