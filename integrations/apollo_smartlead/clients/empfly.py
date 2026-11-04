"""EmpFly CRM client.

The CRM's organisation API keys only cover ``POST v2/leads/`` in production
(no assignee, status, notes or tasks), so this client logs in as a dedicated
integration user via the EmpFly auth service and uses the regular JWT API
under ``/en/api/``. The CRM repo itself is not modified.
"""
import threading

from .. import conf
from .base import BaseClient, IntegrationNotConfigured, ProviderAPIError

# Process-wide token cache: access tokens live ~2 days, so log in rarely.
_token_lock = threading.Lock()
_token_cache = {"access": "", "refresh": ""}


class _AuthClient(BaseClient):
    provider = "empfly_auth"

    def __init__(self, base_url):
        super().__init__()
        self.base_url = base_url

    def login(self, email, password):
        return self._request("POST", "api/auth/token/", json={"email": email, "password": password})

    def refresh(self, refresh_token):
        return self._request("POST", "api/auth/token/refresh/", json={"refresh": refresh_token})


class EmpflyCrmClient(BaseClient):
    provider = "empfly_crm"

    def __init__(self, user=None):
        super().__init__(user)
        self.base_url = f"{conf.empfly_crm_base_url()}/en/api" if conf.empfly_crm_base_url() else ""
        self.auth_base_url = conf.empfly_auth_base_url()
        self.email = conf.empfly_crm_email()
        self.password = conf.empfly_crm_password()
        self.org_id = conf.empfly_crm_org_id()
        missing = [name for name, value in (
            ("EMPFLY_CRM_BASE_URL", self.base_url),
            ("EMPFLY_AUTH_BASE_URL", self.auth_base_url),
            ("EMPFLY_CRM_EMAIL", self.email),
            ("EMPFLY_CRM_PASSWORD", self.password),
        ) if not value]
        if missing:
            raise IntegrationNotConfigured(f"{', '.join(missing)} not configured")

    ## ===== Auth ===== ##

    def _login(self, force=False):
        with _token_lock:
            if _token_cache["access"] and not force:
                return _token_cache["access"]
            auth = _AuthClient(self.auth_base_url)
            if _token_cache["refresh"]:
                try:
                    data = auth.refresh(_token_cache["refresh"])
                    _token_cache["access"] = data["access"]
                    _token_cache["refresh"] = data.get("refresh", _token_cache["refresh"])
                    return _token_cache["access"]
                except (ProviderAPIError, KeyError):
                    pass
            data = auth.login(self.email, self.password)
            _token_cache["access"] = data.get("access", "")
            _token_cache["refresh"] = data.get("refresh", "")
            if not _token_cache["access"]:
                raise ProviderAPIError(self.provider, None, "Login returned no access token")
            return _token_cache["access"]

    def verify_login(self):
        """Fresh login with the configured credentials (used by connectivity checks)."""
        return bool(self._login(force=True))

    def _headers(self):
        headers = {"Content-Type": "application/json",
                   "Authorization": f"Bearer {self._login()}"}
        if self.org_id:
            headers["X-Org-Id"] = self.org_id
        return headers

    def _request(self, method, path, **kwargs):
        try:
            return super()._request(method, path, **kwargs)
        except ProviderAPIError as exc:
            if exc.status_code != 401:
                raise
            self._login(force=True)  # expired/rotated token: one retry
            return super()._request(method, path, **kwargs)

    ## ===== Records ===== ##

    @staticmethod
    def _results(data):
        return data.get("results", []) if isinstance(data, dict) else (data or [])

    def search_companies(self, text):
        return self._results(self._request("GET", "companies/", params={"search": text}))

    def create_company(self, payload):
        return self._request("POST", "companies/", json=payload)

    def search_leads(self, text):
        return self._results(self._request("GET", "leads/", params={"search": text}))

    def get_lead(self, lead_id):
        return self._request("GET", f"leads/{lead_id}/")

    def create_lead(self, payload):
        return self._request("POST", "leads/", json=payload)

    def update_lead(self, lead_id, payload):
        return self._request("PATCH", f"leads/{lead_id}/", json=payload)

    def add_note(self, model_name, object_id, text):
        """``model_name`` is the CRM ContentType model, e.g. ``lead`` or ``task``."""
        return self._request("POST", f"notes/{model_name}/{object_id}/", json={"note": text})

    def create_task(self, payload):
        return self._request("POST", "tasks/", json=payload)
