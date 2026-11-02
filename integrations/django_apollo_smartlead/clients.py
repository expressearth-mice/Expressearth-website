from __future__ import annotations

import os
from typing import Any

import requests


class IntegrationNotConfigured(RuntimeError):
    pass


class ProviderAPIError(RuntimeError):
    def __init__(self, provider: str, status_code: int):
        super().__init__(f'{provider} API returned HTTP {status_code}')
        self.provider = provider
        self.status_code = status_code


class ApolloClient:
    def __init__(self) -> None:
        self.api_key = os.environ.get('APOLLO_API_KEY', '').strip()
        self.base_url = os.environ.get('APOLLO_API_BASE_URL', 'https://api.apollo.io/api/v1').rstrip('/')
        if not self.api_key:
            raise IntegrationNotConfigured('APOLLO_API_KEY is not configured')

    def _request(self, method: str, path: str, **kwargs: Any) -> dict[str, Any]:
        response = requests.request(method, f'{self.base_url}/{path.lstrip("/")}', headers={
            'x-api-key': self.api_key,
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache',
        }, timeout=(5, 30), allow_redirects=False, **kwargs)
        if not response.ok:
            raise ProviderAPIError('Apollo', response.status_code)
        return response.json() if response.content else {}

    def health(self) -> dict[str, Any]:
        return self._request('GET', 'auth/health')

    def search_people(self, filters: dict[str, Any]) -> dict[str, Any]:
        return self._request('POST', 'mixed_people/api_search', json=filters)


class SmartleadClient:
    def __init__(self) -> None:
        self.api_key = os.environ.get('SMARTLEAD_API_KEY', '').strip()
        self.base_url = os.environ.get('SMARTLEAD_API_BASE_URL', 'https://server.smartlead.ai/api/v1').rstrip('/')
        if not self.api_key:
            raise IntegrationNotConfigured('SMARTLEAD_API_KEY is not configured')

    def _request(self, method: str, path: str, **kwargs: Any) -> Any:
        params = dict(kwargs.pop('params', {}) or {})
        params['api_key'] = self.api_key
        response = requests.request(method, f'{self.base_url}/{path.lstrip("/")}', params=params,
                                    timeout=(5, 30), allow_redirects=False, **kwargs)
        if not response.ok:
            raise ProviderAPIError('Smartlead', response.status_code)
        return response.json() if response.content else {}

    def list_campaigns(self) -> Any:
        return self._request('GET', 'campaigns/')
