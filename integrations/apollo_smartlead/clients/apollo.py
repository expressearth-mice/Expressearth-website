"""Apollo.io REST client (https://docs.apollo.io)."""
from .. import conf
from .base import BaseClient, IntegrationNotConfigured

# Apollo allows at most 10 people per bulk_match call.
BULK_MATCH_LIMIT = 10


class ApolloClient(BaseClient):
    provider = "apollo"

    def __init__(self, user=None):
        super().__init__(user)
        self.api_key = conf.apollo_api_key()
        self.base_url = conf.apollo_base_url()
        if not self.api_key:
            raise IntegrationNotConfigured("APOLLO_API_KEY is not configured")

    def _headers(self):
        return {
            "x-api-key": self.api_key,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
        }

    def _credits(self, path, data):
        if isinstance(data, dict):
            return data.get("credits_consumed")
        return None

    def health(self):
        """``GET auth/health`` -- free; ``is_logged_in`` says whether the key is valid."""
        return self._request("GET", "auth/health", credits=0)

    def search_companies(self, filters):
        """``POST mixed_companies/search`` -- 1 credit per page of results."""
        return self._request("POST", "mixed_companies/search", json=filters, credits=1)

    def search_people(self, filters):
        """``POST mixed_people/api_search`` -- no credits, no emails/phones."""
        return self._request("POST", "mixed_people/api_search", json=filters, credits=0)

    def bulk_enrich(self, details, webhook_url=""):
        """``POST people/bulk_match`` for up to 10 people.

        Phone numbers are never in the response: with ``webhook_url`` Apollo
        verifies them asynchronously and POSTs them there.
        """
        if len(details) > BULK_MATCH_LIMIT:
            raise ValueError(f"Apollo enriches at most {BULK_MATCH_LIMIT} people per call")
        params = {"reveal_personal_emails": "false"}
        if webhook_url:
            params.update({"reveal_phone_number": "true", "webhook_url": webhook_url})
        return self._request("POST", "people/bulk_match", params=params,
                             json={"details": details})

    def usage_stats(self):
        """``POST usage_stats/api_usage_stats`` -- per-endpoint rate-limit usage."""
        return self._request("POST", "usage_stats/api_usage_stats", credits=0)
