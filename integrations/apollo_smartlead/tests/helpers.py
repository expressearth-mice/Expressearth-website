"""Shared test helpers. No test ever reaches a real provider: every HTTP call
goes through ``requests.request`` in ``clients/base.py``, which tests patch."""
import json
from unittest import mock

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

from ..models import Campaign, ProspectCompany, ProspectContact

REQUEST = "integrations.apollo_smartlead.clients.base.requests.request"

KEYS = {
    "APOLLO_API_KEY": "apollo-test-key",
    "SMARTLEAD_API_KEY": "smartlead-test-key",
    "SMARTLEAD_WEBHOOK_SECRET": "hook-secret",
    "APOLLO_WEBHOOK_SECRET": "apollo-hook-secret",
    "LEADGEN_PUBLIC_BASE_URL": "https://backend.example.com",
    "SMARTLEAD_SENDER_DOMAINS": "expressearth.com,expressearth.in",
}
GATES_OPEN = {"SMARTLEAD_WRITE_ENABLED": "1", "SMARTLEAD_SENDING_ENABLED": "1"}


def fake_response(status_code=200, data=None, headers=None):
    body = b"" if data is None else json.dumps(data).encode()
    response = mock.Mock(status_code=status_code, ok=200 <= status_code < 400, content=body,
                         text=body.decode(), headers=headers or {})
    response.json.side_effect = lambda: json.loads(body)
    return response


def mailbox(mailbox_id=1, email="sales@expressearth.in", dns=True, smtp=True):
    """A Smartlead mailbox as the API returns it -- including the secrets it leaks."""
    return {"id": mailbox_id, "from_email": email, "from_name": "Sales", "type": "SMTP",
            "password": "smtp-secret", "imap_password": "imap-secret",
            "is_smtp_success": smtp, "is_imap_success": True,
            "dns_validation_status": {"isSPFVerified": dns, "isDKIMVerified": dns,
                                      "isDMARCVerified": dns,
                                      "lastVerifiedTime": "2026-11-01T00:00:00+00:00"}}


class FakeSmartlead:
    """Routes patched ``requests.request`` calls by ``"METHOD path"`` and records them.

    ``routes`` maps e.g. ``"GET campaigns/101/email-accounts"`` to a JSON body;
    anything unrouted answers ``{"ok": true}``.
    """

    def __init__(self, routes=None):
        self.routes = routes or {}
        self.calls = []

    def __call__(self, method, url, **kwargs):
        path = url.split("/api/v1/", 1)[-1].rstrip("/")
        self.calls.append((method, path, kwargs))
        return fake_response(data=self.routes.get(f"{method} {path}", {"ok": True}))

    def called(self, method, path):
        return [kwargs for m, p, kwargs in self.calls if m == method and p == path.rstrip("/")]

    def writes(self):
        return [(m, p) for m, p, _ in self.calls if m != "GET"]


def ee_campaign_routes(campaign_id=101, mailboxes=None):
    """Routes for a campaign whose mailboxes are (by default) one healthy ExpressEarth box."""
    mailboxes = [mailbox()] if mailboxes is None else mailboxes
    return {f"GET campaigns/{campaign_id}/email-accounts": mailboxes,
            "GET email-accounts": mailboxes}


def make_user(username, group=None, **extra):
    user = get_user_model().objects.create_user(username=username, password="x", **extra)
    if group:
        user.groups.add(Group.objects.get_or_create(name=group)[0])
    return user


def make_company(**fields):
    defaults = {"name": "Acme Pvt Ltd", "domain": "acme.com", "website": "https://acme.com",
                "employee_count": 200, "employee_range": "51-200", "city": "Gurugram",
                "is_ncr": True, "apollo_organization_id": "org-1"}
    return ProspectCompany.objects.create(**{**defaults, **fields})


def make_contact(company=None, **fields):
    defaults = {"first_name": "Asha", "last_name": "Rao", "designation": "Head of HR",
                "email": "asha@acme.com", "email_status": ProspectContact.EmailStatus.VERIFIED,
                "apollo_contact_id": "person-1"}
    return ProspectContact.objects.create(company=company or make_company(),
                                          **{**defaults, **fields})


def make_campaign(ready=False, **fields):
    defaults = {"name": "NCR HR heads", "smartlead_campaign_id": 101}
    if ready:
        defaults.update({"sender_domain": "mail.expressearth.com", "spf_verified": True,
                         "dkim_verified": True, "dmarc_verified": True,
                         "approved_for_sending": True})
    return Campaign.objects.create(**{**defaults, **fields})
