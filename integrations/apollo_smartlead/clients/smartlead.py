"""Smartlead.ai REST client (https://api.smartlead.ai/reference).

This is a thin transport layer only. Whether a write is *allowed* (feature
flags, approvals, suppression) is decided in ``services/campaign_manager.py``.
"""
from .. import conf
from .base import BaseClient, IntegrationNotConfigured

# Smartlead accepts up to 400 leads per call; stay well under it.
ADD_LEADS_BATCH = 100
_MAILBOX_PAGE = 100
_MAX_MAILBOX_PAGES = 20

# Smartlead's mailbox objects include SMTP/IMAP passwords. Only these fields
# ever leave this client.
SAFE_MAILBOX_FIELDS = ("id", "from_email", "from_name", "type", "is_smtp_success",
                       "is_imap_success", "dns_validation_status", "message_per_day",
                       "daily_sent_count", "campaign_count")


def safe_mailboxes(data):
    rows = (data.get("data") or []) if isinstance(data, dict) else (data or [])
    return [{field: row.get(field) for field in SAFE_MAILBOX_FIELDS}
            for row in rows if isinstance(row, dict)]


class SmartleadClient(BaseClient):
    provider = "smartlead"

    def __init__(self, user=None):
        super().__init__(user)
        self.api_key = conf.smartlead_api_key()
        self.base_url = conf.smartlead_base_url()
        if not self.api_key:
            raise IntegrationNotConfigured("SMARTLEAD_API_KEY is not configured")

    def _params(self, params):
        params = dict(params or {})
        params["api_key"] = self.api_key
        return params

    ## ===== Campaigns ===== ##

    def list_campaigns(self):
        return self._request("GET", "campaigns/")

    def get_campaign(self, campaign_id):
        return self._request("GET", f"campaigns/{campaign_id}")

    def create_campaign(self, name):
        return self._request("POST", "campaigns/create", json={"name": name, "client_id": None})

    def save_sequences(self, campaign_id, sequences):
        # The body is a bare JSON array of sequence steps.
        return self._request("POST", f"campaigns/{campaign_id}/sequences", json=sequences)

    def update_settings(self, campaign_id, settings):
        return self._request("POST", f"campaigns/{campaign_id}/settings", json=settings)

    def update_schedule(self, campaign_id, schedule):
        return self._request("POST", f"campaigns/{campaign_id}/schedule", json=schedule)

    def add_email_accounts(self, campaign_id, email_account_ids):
        return self._request("POST", f"campaigns/{campaign_id}/email-accounts",
                             json={"email_account_ids": list(email_account_ids)})

    def set_status(self, campaign_id, status):
        """``status`` is one of START, PAUSED, STOPPED."""
        return self._request("PATCH", f"campaigns/{campaign_id}/status", json={"status": status})

    def campaign_analytics(self, campaign_id):
        return self._request("GET", f"campaigns/{campaign_id}/analytics")

    def list_email_accounts(self):
        """Every sender mailbox in the account (secrets stripped)."""
        mailboxes = []
        for page in range(_MAX_MAILBOX_PAGES):
            rows = safe_mailboxes(self._request("GET", "email-accounts/", params={
                "offset": page * _MAILBOX_PAGE, "limit": _MAILBOX_PAGE}))
            mailboxes += rows
            if len(rows) < _MAILBOX_PAGE:
                break
        return mailboxes

    def list_campaign_email_accounts(self, campaign_id):
        """Mailboxes attached to one campaign (secrets stripped; no DNS status here)."""
        return safe_mailboxes(self._request("GET", f"campaigns/{campaign_id}/email-accounts"))

    ## ===== Leads ===== ##

    def add_leads(self, campaign_id, lead_list):
        if len(lead_list) > ADD_LEADS_BATCH:
            raise ValueError(f"Add at most {ADD_LEADS_BATCH} leads per call")
        return self._request("POST", f"campaigns/{campaign_id}/leads", json={
            "lead_list": lead_list,
            # Never bypass Smartlead's own block/unsubscribe/duplicate protection.
            "settings": {
                "ignore_global_block_list": False,
                "ignore_unsubscribe_list": False,
                "ignore_community_bounce_list": False,
                "ignore_duplicate_leads_in_other_campaign": False,
            },
        })

    def list_campaign_leads(self, campaign_id, offset=0, limit=100):
        return self._request("GET", f"campaigns/{campaign_id}/leads",
                             params={"offset": offset, "limit": limit})

    def pause_lead(self, campaign_id, lead_id):
        return self._request("POST", f"campaigns/{campaign_id}/leads/{lead_id}/pause")

    def resume_lead(self, campaign_id, lead_id):
        return self._request("POST", f"campaigns/{campaign_id}/leads/{lead_id}/resume")

    def remove_lead(self, campaign_id, lead_id):
        return self._request("DELETE", f"campaigns/{campaign_id}/leads/{lead_id}")

    def block(self, email=None, domain=None):
        """Add one email *or* one domain to Smartlead's global block list."""
        body = {"email": email} if email else {"domain": domain}
        return self._request("POST", "leads/add-domain-block-list", json=body)

    ## ===== Webhooks ===== ##

    def create_campaign_webhook(self, campaign_id, name, webhook_url, event_types):
        return self._request("POST", "webhook/create", json={
            "name": name,
            "webhook_url": webhook_url,
            "association_type": "campaign",
            "email_campaign_id": campaign_id,
            "event_type_map": {event: True for event in event_types},
        })
