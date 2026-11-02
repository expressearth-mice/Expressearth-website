# Apollo + Smartlead integration for Django

Isolated Django integration scaffold for ExpressEarth. It is not wired into the React build or production deployment.

## Included
- Apollo client using the documented x-api-key header and people search API.
- Smartlead client using the documented api_key query parameter and campaign listing API.
- Staff-protected Django views, URL routes, and a shared-secret webhook receiver.
- No credentials or live campaign-sending functionality.

## Install in the Django backend
1. Copy this directory into the separate Django backend repository.
2. Add requests>=2.31,<3 to the backend requirements.
3. Add integrations.django_apollo_smartlead to INSTALLED_APPS.
4. Include path api/integrations/ with include('integrations.django_apollo_smartlead.urls') in the root URLconf.
5. Set the environment variables below through GCP Secret Manager / Cloud Run.

## Environment variables
- APOLLO_API_KEY
- SMARTLEAD_API_KEY
- SMARTLEAD_WEBHOOK_SECRET (random shared secret; use only if Smartlead supports a custom webhook header, otherwise put webhook behind an authenticated gateway or secret URL)
- Optional APOLLO_API_BASE_URL and SMARTLEAD_API_BASE_URL

## Routes
- GET /api/integrations/health/ — reports credential presence only.
- POST /api/integrations/apollo/people-search/ — staff-only Apollo people search.
- GET /api/integrations/smartlead/campaigns/ — staff-only campaign listing.
- POST /api/integrations/smartlead/webhook/ — shared-secret webhook receiver.

The Apollo people-search endpoint does not return email addresses or phone numbers; enrichment is separate and may consume credits. This scaffold intentionally does not create campaigns, enroll leads, or start sending. Add those only after approval controls, opt-out suppression, duplicate checks, provider plan verification, and sender-domain authentication are implemented.

Operational views use Django login and staff permissions. Adapt to the existing backend's DRF/JWT permissions before exposing them. Add rate limiting and persistent, idempotent webhook storage before production use. Verify Smartlead's exact webhook authentication and payload format for your account.

Provider documentation:
- https://docs.apollo.io/reference/authentication
- https://docs.apollo.io/reference/people-api-search
- https://helpcenter.smartlead.ai/en/articles/125-full-api-documentation
