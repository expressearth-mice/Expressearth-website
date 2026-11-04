import os
from unittest import mock

import requests
from django.test import TestCase

from ..clients import (
    ApolloClient,
    EmpflyCrmClient,
    IntegrationNotConfigured,
    ProviderAPIError,
    SmartleadClient,
)
from ..clients import empfly
from ..models import ApiCallLog
from .helpers import KEYS, REQUEST, FakeSmartlead, fake_response, mailbox


@mock.patch.dict(os.environ, KEYS)
class ApolloClientTests(TestCase):
    def test_missing_key_raises_not_configured(self):
        with mock.patch.dict(os.environ, {"APOLLO_API_KEY": ""}):
            with self.assertRaises(IntegrationNotConfigured):
                ApolloClient()

    def test_people_search_uses_header_key_and_logs_zero_credits(self):
        with mock.patch(REQUEST, return_value=fake_response(data={"people": []})) as request:
            ApolloClient().search_people({"person_titles": ["CEO"]})
        args, kwargs = request.call_args
        self.assertEqual(args[0], "POST")
        self.assertTrue(args[1].endswith("/mixed_people/api_search"))
        self.assertEqual(kwargs["headers"]["x-api-key"], "apollo-test-key")
        self.assertFalse(kwargs["allow_redirects"])
        log = ApiCallLog.objects.get()
        self.assertTrue(log.ok)
        self.assertEqual(log.credits_consumed, 0)

    def test_bulk_enrich_logs_credits_and_requests_phone_via_webhook(self):
        data = {"matches": [], "credits_consumed": 3}
        with mock.patch(REQUEST, return_value=fake_response(data=data)) as request:
            ApolloClient().bulk_enrich([{"id": "p1"}], webhook_url="https://x/hook/")
        params = request.call_args.kwargs["params"]
        self.assertEqual(params["reveal_phone_number"], "true")
        self.assertEqual(params["webhook_url"], "https://x/hook/")
        self.assertEqual(ApiCallLog.objects.get().credits_consumed, 3)

    def test_bulk_enrich_refuses_more_than_ten(self):
        with self.assertRaises(ValueError):
            ApolloClient().bulk_enrich([{"id": str(i)} for i in range(11)])


@mock.patch.dict(os.environ, KEYS)
class SmartleadClientTests(TestCase):
    def test_key_goes_in_query_but_never_in_log(self):
        with mock.patch(REQUEST, return_value=fake_response(500, {"error": "boom"})) as request:
            with self.assertRaises(ProviderAPIError) as ctx:
                SmartleadClient().list_campaigns()
        self.assertEqual(ctx.exception.status_code, 500)
        self.assertEqual(request.call_args.kwargs["params"]["api_key"], "smartlead-test-key")
        log = ApiCallLog.objects.get()
        self.assertFalse(log.ok)
        self.assertNotIn("smartlead-test-key", log.endpoint + log.error)

    def test_connection_error_logs_only_exception_class(self):
        error = requests.ConnectionError("https://server/campaigns?api_key=smartlead-test-key")
        with mock.patch(REQUEST, side_effect=error):
            with self.assertRaises(ProviderAPIError):
                SmartleadClient().list_campaigns()
        self.assertEqual(ApiCallLog.objects.get().error, "ConnectionError")

    @mock.patch("integrations.apollo_smartlead.clients.base.time.sleep")
    def test_rate_limited_call_is_retried(self, sleep):
        responses = [fake_response(429, {}), fake_response(200, [])]
        with mock.patch(REQUEST, side_effect=responses) as request:
            self.assertEqual(SmartleadClient().list_campaigns(), [])
        self.assertEqual(request.call_count, 2)
        sleep.assert_called_once()

    def test_add_leads_never_bypasses_block_lists(self):
        with mock.patch(REQUEST, return_value=fake_response(data={"ok": True})) as request:
            SmartleadClient().add_leads(101, [{"email": "a@b.com"}])
        settings = request.call_args.kwargs["json"]["settings"]
        self.assertTrue(all(value is False for value in settings.values()))

    def test_mailbox_passwords_never_leave_the_client(self):
        api = FakeSmartlead({"GET email-accounts": [mailbox(1)],
                             "GET campaigns/5/email-accounts": [mailbox(1)]})
        with mock.patch(REQUEST, side_effect=api):
            client = SmartleadClient()
            rows = client.list_email_accounts() + client.list_campaign_email_accounts(5)
        self.assertEqual(rows[0]["from_email"], "sales@expressearth.in")
        self.assertTrue(all("password" not in row and "imap_password" not in row
                            for row in rows))


@mock.patch.dict(os.environ, {
    "EMPFLY_CRM_BASE_URL": "https://crm.example.com",
    "EMPFLY_AUTH_BASE_URL": "https://auth.example.com",
    "EMPFLY_CRM_EMAIL": "integration@expressearth.com",
    "EMPFLY_CRM_PASSWORD": "pw",
    "EMPFLY_CRM_ORG_ID": "org-uuid",
})
class EmpflyClientTests(TestCase):
    def setUp(self):
        empfly._token_cache.update(access="", refresh="")

    def test_missing_config_lists_what_is_missing(self):
        with mock.patch.dict(os.environ, {"EMPFLY_CRM_PASSWORD": ""}):
            with self.assertRaisesMessage(IntegrationNotConfigured, "EMPFLY_CRM_PASSWORD"):
                EmpflyCrmClient()

    def test_logs_in_then_sends_bearer_and_org_header(self):
        responses = [fake_response(data={"access": "a1", "refresh": "r1"}),
                     fake_response(data={"results": [{"id": 7, "full_name": "Acme"}]})]
        with mock.patch(REQUEST, side_effect=responses) as request:
            rows = EmpflyCrmClient().search_companies("Acme")
        self.assertEqual(rows[0]["id"], 7)
        login, search = request.call_args_list
        self.assertTrue(login.args[1].endswith("/api/auth/token/"))
        self.assertEqual(search.args[1], "https://crm.example.com/en/api/companies/")
        self.assertEqual(search.kwargs["headers"]["Authorization"], "Bearer a1")
        self.assertEqual(search.kwargs["headers"]["X-Org-Id"], "org-uuid")

    def test_expired_token_is_refreshed_once(self):
        empfly._token_cache.update(access="old", refresh="r1")
        responses = [fake_response(401, {"detail": "expired"}),
                     fake_response(data={"access": "a2"}),
                     fake_response(data={"id": 5})]
        with mock.patch(REQUEST, side_effect=responses) as request:
            EmpflyCrmClient().get_lead(5)
        self.assertTrue(request.call_args_list[1].args[1].endswith("/api/auth/token/refresh/"))
        self.assertEqual(request.call_args_list[2].kwargs["headers"]["Authorization"], "Bearer a2")
