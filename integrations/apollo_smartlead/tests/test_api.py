import os
from unittest import mock

from django.test import TestCase
from rest_framework.test import APIClient

from ..models import ProspectContact
from ..permissions import ADMIN_GROUP, EXECUTIVE_GROUP, MANAGER_GROUP
from .helpers import (
    KEYS,
    REQUEST,
    FakeSmartlead,
    ee_campaign_routes,
    mailbox,
    make_campaign,
    make_company,
    make_contact,
    make_user,
)

BASE = "/api/integrations"


class PermissionTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.manager = make_user("manager", MANAGER_GROUP)
        self.executive = make_user("exec", EXECUTIVE_GROUP)
        company = make_company()
        self.mine = make_contact(company=company, assigned_to=self.executive)
        self.other = make_contact(company=company, first_name="Bina", email="bina@acme.com",
                                  apollo_contact_id="person-2")

    def test_anonymous_gets_401(self):
        self.assertEqual(self.api.get(f"{BASE}/leads/").status_code, 401)

    def test_site_staff_without_leadgen_role_gets_403(self):
        self.api.force_authenticate(make_user("editor", is_staff=True))
        self.assertEqual(self.api.get(f"{BASE}/leads/").status_code, 403)

    def test_executive_sees_only_assigned_leads_and_cannot_approve(self):
        self.api.force_authenticate(self.executive)
        ids = [row["id"] for row in self.api.get(f"{BASE}/leads/").json()["results"]]
        self.assertEqual(ids, [self.mine.pk])
        self.assertEqual(self.api.get(f"{BASE}/leads/{self.other.pk}/").status_code, 404)
        response = self.api.post(f"{BASE}/leads/approve/", {"contact_ids": [self.mine.pk]},
                                 format="json")
        self.assertEqual(response.status_code, 403)

    def test_executive_can_set_follow_up_on_own_lead(self):
        self.api.force_authenticate(self.executive)
        response = self.api.patch(f"{BASE}/leads/{self.mine.pk}/",
                                  {"next_follow_up_date": "2026-11-10"}, format="json")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["next_follow_up_date"], "2026-11-10")

    @mock.patch.dict(os.environ, KEYS)
    def test_only_leadgen_admin_can_verify_sender(self):
        campaign = make_campaign()
        url = f"{BASE}/campaigns/{campaign.pk}/verify-sender/"
        self.api.force_authenticate(self.manager)
        self.assertEqual(self.api.post(url).status_code, 403)
        self.api.force_authenticate(make_user("boss", ADMIN_GROUP))
        with mock.patch(REQUEST, side_effect=FakeSmartlead(ee_campaign_routes())):
            data = self.api.post(url).json()
        self.assertTrue(data["sender_verified"])
        self.assertEqual(data["verification_blockers"], [])
        self.assertEqual(data["sender_report"][0]["email"], "sales@expressearth.in")

    @mock.patch.dict(os.environ, KEYS)
    def test_campaign_sync_reports_skipped_other_brands(self):
        self.api.force_authenticate(self.manager)
        api = FakeSmartlead({"GET campaigns": [{"id": 7, "name": "empfly Demo", "status": "ACTIVE"}],
                             "GET campaigns/7/email-accounts": [mailbox(9, "x@empfly.co")]})
        with mock.patch(REQUEST, side_effect=api):
            data = self.api.get(f"{BASE}/campaigns/?sync=1").json()
        self.assertEqual(data["sync"], {"synced": 0, "skipped_other_brands": 1})
        self.assertEqual(data["results"], [])

    def test_me_reports_roles(self):
        self.api.force_authenticate(self.manager)
        data = self.api.get(f"{BASE}/me/").json()
        self.assertTrue(data["is_leadgen_manager"])
        self.assertFalse(data["is_leadgen_admin"])


@mock.patch.dict(os.environ, {"APOLLO_API_KEY": "", "SMARTLEAD_API_KEY": "",
                              "SMARTLEAD_WRITE_ENABLED": "", "SMARTLEAD_SENDING_ENABLED": "",
                              "EMPFLY_CRM_SYNC_ENABLED": ""})
class ManagerFlowTests(TestCase):
    def setUp(self):
        self.api = APIClient()
        self.api.force_authenticate(make_user("manager", MANAGER_GROUP))

    def test_health_without_any_keys(self):
        data = self.api.get(f"{BASE}/health/").json()
        self.assertFalse(data["apollo_configured"])
        self.assertFalse(data["smartlead_configured"])
        self.assertFalse(any(data["flags"].values()))

    def test_search_without_key_is_503_not_a_crash(self):
        response = self.api.post(f"{BASE}/apollo/company-search/",
                                 {"industry_keywords": ["pharma"]}, format="json")
        self.assertEqual(response.status_code, 503)
        self.assertIn("APOLLO_API_KEY", response.json()["errors"]["detail"])

    def test_approve_skips_unverified_with_reason(self):
        good = make_contact()
        bad = make_contact(company=good.company, first_name="Bina", email="bina@acme.com",
                           apollo_contact_id="person-2",
                           email_status=ProspectContact.EmailStatus.UNVERIFIED)
        data = self.api.post(f"{BASE}/leads/approve/", {"contact_ids": [good.pk, bad.pk]},
                             format="json").json()
        self.assertEqual(data["approved"], [good.pk])
        self.assertIn(str(bad.pk), data["skipped"])

    def test_enroll_with_flags_off_returns_blockers(self):
        campaign = make_campaign(ready=True)
        contact = make_contact(approval_status=ProspectContact.Approval.APPROVED)
        response = self.api.post(f"{BASE}/campaigns/{campaign.pk}/enroll/",
                                 {"contact_ids": [contact.pk]}, format="json")
        self.assertEqual(response.status_code, 403)
        self.assertIn("SMARTLEAD_WRITE_ENABLED", response.json()["errors"]["blockers"][0])

    def test_bad_employee_range_is_400(self):
        response = self.api.post(f"{BASE}/apollo/company-search/",
                                 {"employee_ranges": ["50-200"]}, format="json")
        self.assertEqual(response.status_code, 400)
