from __future__ import annotations

import json
import logging
import os
import secrets

from django.contrib.auth.decorators import login_required, user_passes_test
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST

from .clients import ApolloClient, IntegrationNotConfigured, ProviderAPIError, SmartleadClient

logger = logging.getLogger(__name__)


def _staff_check(user):
    return user.is_authenticated and user.is_staff


@require_GET
@login_required
@user_passes_test(_staff_check)
def integration_health(request):
    return JsonResponse({
        'apollo_configured': bool(os.environ.get('APOLLO_API_KEY')),
        'smartlead_configured': bool(os.environ.get('SMARTLEAD_API_KEY')),
        'webhook_secret_configured': bool(os.environ.get('SMARTLEAD_WEBHOOK_SECRET')),
    })


@require_POST
@login_required
@user_passes_test(_staff_check)
def apollo_people_search(request):
    try:
        payload = json.loads(request.body or b'{}')
        filters = payload.get('filters', {})
        if not isinstance(filters, dict):
            return JsonResponse({'error': 'filters must be an object'}, status=400)
        filters['per_page'] = min(max(int(filters.get('per_page', 25)), 1), 100)
        if not any(filters.get(k) for k in ('person_titles', 'person_locations', 'q_organization_domains_list', 'organization_num_employees_ranges', 'q_keywords')):
            return JsonResponse({'error': 'Provide at least one prospect filter.'}, status=400)
        result = ApolloClient().search_people(filters)
        return JsonResponse({'provider': 'apollo', 'result': result})
    except (ValueError, TypeError, json.JSONDecodeError):
        return JsonResponse({'error': 'Invalid JSON or filter values.'}, status=400)
    except IntegrationNotConfigured as exc:
        return JsonResponse({'error': str(exc)}, status=503)
    except ProviderAPIError as exc:
        logger.warning('Apollo request failed with status %s', exc.status_code)
        return JsonResponse({'error': 'Apollo request failed.', 'status': exc.status_code}, status=502)


@require_GET
@login_required
@user_passes_test(_staff_check)
def smartlead_campaigns(request):
    try:
        result = SmartleadClient().list_campaigns()
        return JsonResponse({'provider': 'smartlead', 'result': result}, safe=False)
    except IntegrationNotConfigured as exc:
        return JsonResponse({'error': str(exc)}, status=503)
    except ProviderAPIError as exc:
        logger.warning('Smartlead request failed with status %s', exc.status_code)
        return JsonResponse({'error': 'Smartlead request failed.', 'status': exc.status_code}, status=502)


@csrf_exempt
@require_POST
def smartlead_webhook(request):
    expected = os.environ.get('SMARTLEAD_WEBHOOK_SECRET', '')
    supplied = request.headers.get('X-ExpressEarth-Webhook-Secret', '')
    if not expected or not supplied or not secrets.compare_digest(expected, supplied):
        return JsonResponse({'error': 'Unauthorized webhook'}, status=401)
    try:
        payload = json.loads(request.body or b'{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    # Receipt only. Persist idempotently after confirming Smartlead's webhook schema.
    logger.info('Smartlead webhook received: event=%s campaign_id=%s',
                str(payload.get('event_type', payload.get('event', 'unknown')))[:80],
                str(payload.get('campaign_id', ''))[:80])
    return JsonResponse({'received': True})
