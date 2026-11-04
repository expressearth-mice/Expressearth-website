"""Runtime configuration for the lead-generation integration.

Everything is read from the environment at call time (never at import time),
so a missing key can't break startup or the rest of the site: the endpoint
that needs it answers 503 instead. In Cloud Run the secrets come from GCP
Secret Manager via ``--set-secrets``; see README.md for the full list.
"""
import os

_TRUE = ("1", "true", "yes", "on")


def env(name: str, default: str = "") -> str:
    return (os.getenv(name) or default).strip()


def flag(name: str) -> bool:
    """Feature flags default to OFF; only an explicit truthy value enables one."""
    return env(name).lower() in _TRUE


def integer(name: str, default: int) -> int:
    try:
        return int(env(name) or default)
    except ValueError:
        return default


## ===== Apollo ===== ##

def apollo_api_key() -> str:
    return env("APOLLO_API_KEY")


def apollo_base_url() -> str:
    return env("APOLLO_API_BASE_URL", "https://api.apollo.io/api/v1").rstrip("/")


def apollo_daily_credit_limit() -> int:
    return integer("APOLLO_DAILY_CREDIT_LIMIT", 100)


def apollo_webhook_secret() -> str:
    # Path token for Apollo's async phone-number webhook. Without it (or
    # without a public base URL) enrichment simply doesn't request phones.
    return env("APOLLO_WEBHOOK_SECRET")


## ===== Smartlead ===== ##

def smartlead_api_key() -> str:
    return env("SMARTLEAD_API_KEY")


def smartlead_base_url() -> str:
    return env("SMARTLEAD_API_BASE_URL", "https://server.smartlead.ai/api/v1").rstrip("/")


def smartlead_webhook_secret() -> str:
    return env("SMARTLEAD_WEBHOOK_SECRET")


def smartlead_signing_secret() -> str:
    # Optional HMAC secret for the X-Smartlead-Signature header. When set, the
    # signature is required in addition to the URL token.
    return env("SMARTLEAD_SIGNING_SECRET")


def smartlead_write_enabled() -> bool:
    return flag("SMARTLEAD_WRITE_ENABLED")


def smartlead_sending_enabled() -> bool:
    return flag("SMARTLEAD_SENDING_ENABLED")


def smartlead_sender_domains() -> set:
    # The Smartlead account is shared with other brands (EmpFly, Indo Exhibits).
    # A campaign counts as ExpressEarth's only if every mailbox it sends from is
    # on one of these domains; nothing else is ever imported or touched.
    raw = env("SMARTLEAD_SENDER_DOMAINS", "expressearth.com,expressearth.in")
    return {domain.strip().lower() for domain in raw.split(",") if domain.strip()}


def smartlead_push_blocklist() -> bool:
    # Smartlead's block list is account-wide, so pushing ExpressEarth's
    # suppressions there would also block those people for the other brands.
    return flag("SMARTLEAD_PUSH_BLOCKLIST")


## ===== EmpFly CRM ===== ##

def empfly_auth_base_url() -> str:
    return env("EMPFLY_AUTH_BASE_URL").rstrip("/")


def empfly_crm_base_url() -> str:
    return env("EMPFLY_CRM_BASE_URL").rstrip("/")


def empfly_crm_email() -> str:
    return env("EMPFLY_CRM_EMAIL")


def empfly_crm_password() -> str:
    return env("EMPFLY_CRM_PASSWORD")


def empfly_crm_org_id() -> str:
    return env("EMPFLY_CRM_ORG_ID")


def empfly_crm_lead_source_id() -> str:
    return env("EMPFLY_CRM_LEAD_SOURCE_ID")


def empfly_crm_positive_status() -> str:
    return env("EMPFLY_CRM_POSITIVE_STATUS", "pre_qualified")


def empfly_crm_use_custom_fields() -> bool:
    # The CRM rejects custom-field keys that aren't defined for the org, so
    # only send them once apollo_contact_id etc. exist there.
    return flag("EMPFLY_CRM_USE_CUSTOM_FIELDS")


def empfly_crm_sync_enabled() -> bool:
    return flag("EMPFLY_CRM_SYNC_ENABLED")


## ===== Shared ===== ##

def public_base_url() -> str:
    # Public https URL of this backend, used to build webhook URLs.
    return env("LEADGEN_PUBLIC_BASE_URL").rstrip("/")
