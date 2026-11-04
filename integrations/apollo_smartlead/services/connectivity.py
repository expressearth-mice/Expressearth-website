"""Read-only, zero-credit checks that the configured keys actually work.

Used by ``manage.py leadgen_check`` and ``GET health/?live=1``. Nothing here
creates, enrolls or sends anything, and no Apollo credits are spent.
"""
from collections import Counter

from ..clients import (
    ApolloClient,
    EmpflyCrmClient,
    IntegrationNotConfigured,
    ProviderAPIError,
    SmartleadClient,
)


def _result(status, detail, **extra):
    return {"status": status, "detail": detail, **extra}


def _failure(exc):
    if isinstance(exc, IntegrationNotConfigured):
        return _result("not_configured", str(exc))
    return _result("error", f"HTTP {exc.status_code or '-'}: {(exc.detail or '')[:200]}")


def _rows(data):
    """Smartlead list endpoints return either a list or ``{"data": [...]}``."""
    if isinstance(data, dict):
        data = data.get("data") or data.get("results") or []
    return [row for row in data or [] if isinstance(row, dict)]


def check_apollo(user=None):
    try:
        client = ApolloClient(user)
        health = client.health() or {}
    except (IntegrationNotConfigured, ProviderAPIError) as exc:
        return _failure(exc)
    if health.get("is_logged_in") is False:
        return _result("error", "Apollo did not accept the API key (is_logged_in=false).")

    # People search is free but needs a master API key: probe it with one result.
    try:
        data = client.search_people({"person_titles": ["director"], "per_page": 1})
    except ProviderAPIError as exc:
        return _result("partial", f"Key is valid, but people search failed with HTTP "
                                  f"{exc.status_code}: it needs a master API key.",
                       people_search=False)
    return _result("ok", "Key is valid and people search works (no credits used).",
                   people_search=True, probe_results=len(data.get("people") or []))


def check_smartlead(user=None):
    try:
        client = SmartleadClient(user)
        campaigns = _rows(client.list_campaigns())
        mailboxes = _rows(client.list_email_accounts())
    except (IntegrationNotConfigured, ProviderAPIError) as exc:
        return _failure(exc)
    domains = sorted({(m.get("from_email") or "").rpartition("@")[2].lower()
                      for m in mailboxes if "@" in (m.get("from_email") or "")})
    return _result("ok", f"Key is valid: {len(campaigns)} campaign(s), {len(mailboxes)} "
                         f"sender mailbox(es).",
                   campaigns=len(campaigns),
                   campaign_statuses=dict(Counter(c.get("status") or "-" for c in campaigns)),
                   sender_mailboxes=len(mailboxes), sender_domains=domains)


def check_empfly(user=None):
    try:
        EmpflyCrmClient(user).verify_login()
    except (IntegrationNotConfigured, ProviderAPIError) as exc:
        return _failure(exc)
    return _result("ok", "Logged in to the EmpFly auth service as the integration user.")


def check_all(user=None):
    return {"apollo": check_apollo(user), "smartlead": check_smartlead(user),
            "empfly_crm": check_empfly(user)}
