"""Shared HTTP plumbing for the provider clients.

Every call is written to ``ApiCallLog`` (status, timing, credits, a short error)
-- never the API key, query string or request body, since those can carry
secrets (Smartlead puts its key in the query string) or PII.
"""
import logging
import time
from decimal import Decimal, InvalidOperation

import requests

logger = logging.getLogger(__name__)

# Smartlead allows ~10 requests / 2s; Apollo returns 429 past its hourly quota.
_MAX_RATE_LIMIT_RETRIES = 2


class IntegrationNotConfigured(RuntimeError):
    pass


class ProviderAPIError(RuntimeError):
    def __init__(self, provider, status_code, detail=""):
        super().__init__(f"{provider} API returned HTTP {status_code}: {detail}".strip())
        self.provider = provider
        self.status_code = status_code
        self.detail = detail


def _to_decimal(value):
    if value in (None, ""):
        return None
    try:
        return Decimal(str(value))
    except (InvalidOperation, ValueError):
        return None


class BaseClient:
    provider = ""
    base_url = ""
    timeout = (5, 30)

    def __init__(self, user=None):
        # The user who triggered the calls, recorded on ApiCallLog.
        self.user = user if getattr(user, "is_authenticated", False) else None

    # Subclasses add their auth here.
    def _headers(self):
        return {"Content-Type": "application/json"}

    def _params(self, params):
        return params

    def _credits(self, path, data):
        return None

    def _request(self, method, path, *, params=None, json=None, credits=None):
        url = f"{self.base_url}/{path.lstrip('/')}"
        started = time.monotonic()
        status_code, error, data = None, "", None
        try:
            for attempt in range(_MAX_RATE_LIMIT_RETRIES + 1):
                response = requests.request(
                    method, url, params=self._params(params), json=json,
                    headers=self._headers(), timeout=self.timeout, allow_redirects=False,
                )
                status_code = response.status_code
                if status_code != 429 or attempt == _MAX_RATE_LIMIT_RETRIES:
                    break
                time.sleep(min(int(response.headers.get("Retry-After") or 2), 10))

            if not response.ok:
                error = response.text[:300]
                raise ProviderAPIError(self.provider, status_code, error)
            try:
                data = response.json() if response.content else {}
            except ValueError:
                error = "Non-JSON response"
                raise ProviderAPIError(self.provider, status_code, error)
            return data
        except requests.RequestException as exc:
            # Only the exception class: its message can contain the full URL,
            # including Smartlead's api_key query parameter.
            error = exc.__class__.__name__
            raise ProviderAPIError(self.provider, None, error) from exc
        finally:
            self._log(method, path, status_code, error, started,
                      credits if credits is not None else self._credits(path, data))

    def _log(self, method, path, status_code, error, started, credits):
        from ..models import ApiCallLog

        try:
            ApiCallLog.objects.create(
                provider=self.provider,
                method=method,
                endpoint=path[:255],
                status_code=status_code,
                ok=not error,
                duration_ms=int((time.monotonic() - started) * 1000),
                credits_consumed=_to_decimal(credits),
                error=error[:500],
                triggered_by=self.user,
            )
        except Exception:  # logging must never break the actual call
            logger.exception("Could not write ApiCallLog for %s %s", self.provider, path)
        if error:
            logger.warning("%s %s %s failed: %s %s", self.provider, method, path, status_code,
                           error[:120])
