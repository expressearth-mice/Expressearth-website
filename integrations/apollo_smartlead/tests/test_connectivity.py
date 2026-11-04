import os
from io import StringIO
from unittest import mock

from django.core.management import call_command
from django.test import TestCase

from ..services import connectivity
from .helpers import KEYS, REQUEST, FakeSmartlead, fake_response, mailbox


@mock.patch.dict(os.environ, KEYS)
class ConnectivityTests(TestCase):
    def test_apollo_ok_uses_only_free_endpoints(self):
        responses = [fake_response(data={"healthy": True, "is_logged_in": True}),
                     fake_response(data={"people": [{"id": "p"}]})]
        with mock.patch(REQUEST, side_effect=responses) as request:
            result = connectivity.check_apollo()
        self.assertEqual(result["status"], "ok")
        paths = [call.args[1].rsplit("/v1/", 1)[1] for call in request.call_args_list]
        self.assertEqual(paths, ["auth/health", "mixed_people/api_search"])

    def test_apollo_rejected_key(self):
        with mock.patch(REQUEST, return_value=fake_response(data={"is_logged_in": False})):
            self.assertEqual(connectivity.check_apollo()["status"], "error")

    def test_apollo_without_master_key_is_partial(self):
        responses = [fake_response(data={"is_logged_in": True}),
                     fake_response(403, {"error": "master key required"})]
        with mock.patch(REQUEST, side_effect=responses):
            result = connectivity.check_apollo()
        self.assertEqual(result["status"], "partial")
        self.assertFalse(result["people_search"])

    def test_smartlead_reports_campaigns_and_sender_domains_never_secrets(self):
        api = FakeSmartlead({"GET campaigns": [{"id": 1, "status": "ACTIVE"},
                                               {"id": 2, "status": "PAUSED"}],
                             "GET email-accounts": [mailbox(1), mailbox(2, "x@empfly.co")]})
        with mock.patch(REQUEST, side_effect=api):
            result = connectivity.check_smartlead()
        self.assertEqual(result["campaigns"], 2)
        self.assertEqual(result["sender_domains"], ["empfly.co", "expressearth.in"])
        self.assertNotIn("secret", str(result))
        self.assertEqual(api.writes(), [])

    def test_not_configured_is_reported_not_raised(self):
        with mock.patch.dict(os.environ, {"APOLLO_API_KEY": "", "SMARTLEAD_API_KEY": ""}):
            results = connectivity.check_all()
        self.assertEqual({r["status"] for r in results.values()}, {"not_configured"})

    def test_command_prints_one_line_per_provider(self):
        out = StringIO()
        with mock.patch.dict(os.environ, {"APOLLO_API_KEY": "", "SMARTLEAD_API_KEY": ""}):
            call_command("leadgen_check", stdout=out)
        self.assertEqual([line.split(":")[0] for line in out.getvalue().splitlines()],
                         ["apollo", "smartlead", "empfly_crm"])
