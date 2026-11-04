# Lead generation: Apollo + Smartlead + EmpFly CRM

A self-contained Django app (`integrations.apollo_smartlead`, label `apollo_smartlead`). It turns
Apollo prospects into approved Smartlead outreach and pushes interested replies into EmpFly CRM,
with a follow-up task for the assigned sales executive.

It replaces the earlier scaffold on branch `feature/apollo-smartlead-django-integration`
(`integrations/django_apollo_smartlead/`).

```
Manager filters (industry / NCR / size)
  → Apollo company search → Apollo people search (free)       services/prospect_search.py
  → enrich chosen contacts (credits, daily cap)                services/contact_enrichment.py
  → dedupe + suppression + score → manager approves/assigns    services/lead_qualification.py
  → enroll into an approved ExpressEarth campaign (gated)      services/campaign_manager.py
  → Smartlead sends → webhooks update status                   webhooks.py
  → positive reply → outbox job → EmpFly CRM                   services/crm_sync.py, tasks.py
       company → lead (assigned, status) → note → follow-up task
```

This folder is **not** part of the React build. `react-scripts` only builds `src/`, and
`integrations/` is in the repo's `.dockerignore`, so it never reaches the website image.

## Installing into the Django backend

The app needs Django ≥ 5.1, Django REST framework, SimpleJWT and `requests`. The ExpressEarth
backend already has all of them; no new dependency is needed.

1. Copy `integrations/__init__.py` and `integrations/apollo_smartlead/` into the backend's root,
   keeping the `integrations/` package.
2. Add `"integrations.apollo_smartlead"` to `INSTALLED_APPS`.
3. Add `path("api/integrations/", include("integrations.apollo_smartlead.urls"))` to the root
   URLconf.
4. Run `python manage.py migrate`. It only creates new `apollo_smartlead_*` tables.
5. Run `python manage.py leadgen_setup_roles` once (see [Roles](#roles)).
6. Provide the configuration below through Secret Manager / env vars, then run
   `python manage.py leadgen_check`.

Nothing is read at import time, so a missing key never breaks startup. The endpoint that needs
the key returns **503** naming the missing variable.

## Local development in this repo

`integrations/devserver/` is a minimal Django project (dev and tests only, never deployed). It
mirrors the backend's Django/DRF/JWT setup.

```sh
python -m venv .venv && . .venv/bin/activate
pip install -r integrations/requirements.txt
cp integrations/.env.example integrations/.env      # then fill in keys; .env is gitignored
python integrations/devserver/manage.py migrate
python integrations/devserver/manage.py createsuperuser
python integrations/devserver/manage.py leadgen_check
python integrations/devserver/manage.py runserver     # /admin/ and /api/integrations/
python integrations/devserver/manage.py test integrations.apollo_smartlead
```

Notes:
- The devserver uses SQLite by default. Set `DATABASE_HOST` (plus `DATABASE_NAME`, `_USER`,
  `_PASSWORD`, `_PORT`) to use Postgres like the backend.
- `integrations/.env` is loaded for every command **except** `test`. Tests never see real keys
  and mock every HTTP call.

## The Smartlead account is shared

ExpressEarth, EmpFly and Indo Exhibits all use the same Smartlead account. It has 100+ campaigns,
none separated by Smartlead "client", and campaign names are not consistent. So the app decides
what belongs to ExpressEarth by **sender mailbox**: a campaign is ExpressEarth's only if every
mailbox it sends from is on `SMARTLEAD_SENDER_DOMAINS` (default
`expressearth.com,expressearth.in`).

- **Sync from Smartlead** imports only ACTIVE/PAUSED/DRAFTED campaigns that pass this test.
  Other brands' campaigns are skipped and counted.
- **Every write re-checks this live** before calling Smartlead. That includes pause and stop,
  because pausing another brand's live campaign is harmful too. If someone later attaches a
  non-ExpressEarth mailbox, the campaign is refused.
- **Only ExpressEarth mailboxes can be attached** to campaigns created through the app.
- **Mailbox passwords never leave the client.** Smartlead's mailbox API returns SMTP/IMAP
  passwords; `clients/smartlead.py` strips them.
- **The block list is opt-in.** Smartlead's block list is account-wide, so local suppressions are
  pushed there only if `SMARTLEAD_PUSH_BLOCKLIST=1`. The app itself never enrolls a suppressed
  contact either way.

## Safety gates

Everything that writes to Smartlead or the CRM is **off by default**.

| Action | Requires |
|---|---|
| Create/configure a campaign | `SMARTLEAD_WRITE_ENABLED=1` + the campaign passes the ExpressEarth mailbox test |
| Enroll leads | write flag + admin ran **Verify sender mailboxes** (passed) + admin approved the campaign + a live re-check of mailbox scope, SPF/DKIM/DMARC and SMTP + every lead approved, `verified` email, not suppressed, not active in another campaign |
| Start a campaign / resume a lead | all of the above + `SMARTLEAD_SENDING_ENABLED=1` + no enrolled lead has since become suppressed |
| Pause/stop a campaign, pause/remove a lead | ExpressEarth mailbox test only (no flags: these are safety actions) |
| Write to EmpFly CRM | `EMPFLY_CRM_SYNC_ENABLED=1`. Queued jobs wait, without using retries, until it is on. |

**Sender verification uses Smartlead's own data.** For each mailbox on the campaign, the app reads:

- `dns_validation_status` (SPF, DKIM, DMARC);
- `is_smtp_success`.

The result is stored per mailbox on the campaign and shown in the admin. A failed check revokes
approval.

Some changes also need a fresh approval:

- changing sequences or mailboxes;
- a change in the set of sender domains.

## Configuration

| Variable | Secret? | Purpose |
|---|---|---|
| `APOLLO_API_KEY` | yes | Apollo API key. People search needs a master key; `leadgen_check` tells you. |
| `APOLLO_WEBHOOK_SECRET` | yes | Random token in the Apollo phone-webhook URL. If unset, phones are not requested. |
| `APOLLO_DAILY_CREDIT_LIMIT` | no | Enrichment refuses to start past this many credits per UTC day. Default `100`. |
| `SMARTLEAD_API_KEY` | yes | Smartlead API key. |
| `SMARTLEAD_WEBHOOK_SECRET` | yes | Random token in the Smartlead webhook URL. |
| `SMARTLEAD_SIGNING_SECRET` | yes | Optional. Also enforces `X-Smartlead-Signature` (HMAC-SHA256). |
| `SMARTLEAD_SENDER_DOMAINS` | no | ExpressEarth's sender domains. Default `expressearth.com,expressearth.in`. |
| `SMARTLEAD_WRITE_ENABLED` / `SMARTLEAD_SENDING_ENABLED` | no | Gates (see above). Default off. |
| `SMARTLEAD_PUSH_BLOCKLIST` | no | Push suppressions to Smartlead's account-wide block list. Default off. |
| `LEADGEN_PUBLIC_BASE_URL` | no | Public https URL of the backend, used to build webhook URLs. |
| `EMPFLY_AUTH_BASE_URL` | no | EmpFly auth service URL. |
| `EMPFLY_CRM_BASE_URL` | no | EmpFly CRM URL (the client adds `/en/api`). |
| `EMPFLY_CRM_EMAIL` | no | Login of the dedicated integration user. |
| `EMPFLY_CRM_PASSWORD` | yes | Its password. |
| `EMPFLY_CRM_ORG_ID` | no | Sent as `X-Org-Id`; only needed if the token has no `org_id`. |
| `EMPFLY_CRM_LEAD_SOURCE_ID` | no | CRM lead-source id for "Apollo / Smartlead". |
| `EMPFLY_CRM_POSITIVE_STATUS` | no | CRM `lead_status` for interested leads. Default `pre_qualified`. |
| `EMPFLY_CRM_USE_CUSTOM_FIELDS` | no | Send Apollo/Smartlead ids as CRM custom fields. Enable only once those keys exist in the CRM. |
| `EMPFLY_CRM_SYNC_ENABLED` | no | Gate (see above). Default off. |

## Checking credentials

```sh
python manage.py leadgen_check     # or GET /api/integrations/health/?live=1
```

The check is read-only and uses no Apollo credits. It calls:

- **Apollo:** `auth/health`, plus a one-result people-search probe (free).
- **Smartlead:** campaign and mailbox listing. It reports campaign count by status and the sender
  domains, never mailbox credentials.
- **EmpFly:** a login.

## EmpFly CRM

EmpFly CRM organisation API keys only cover creating leads in production. They cannot:

- set an assignee or status;
- add notes or tasks;
- dedupe leads.

So the app logs in as a **dedicated integration user** through the EmpFly auth service
(`POST /api/auth/token/`, then refresh) and uses the CRM's normal JWT API.

CRM setup needed:

1. An auth-service user, e.g. `leadgen-integration@expressearth.com`, with:
   - an **admin** role in the ExpressEarth org, so it can assign leads;
   - a **CRM licence**.
2. A lead source "Apollo / Smartlead". Put its id in `EMPFLY_CRM_LEAD_SOURCE_ID`.
3. Optional custom fields:
   - on Lead: `apollo_contact_id`, `apollo_organization_id`, `smartlead_campaign_id`, `lead_score`;
   - on Company: `apollo_organization_id`.

   Then set `EMPFLY_CRM_USE_CUSTOM_FIELDS=1`. Until then the ids go into the description and notes.
4. A `SalesExecutiveProfile` (Django admin) per sales executive, linking their Django user to their
   EmpFly user UUID. Without one, leads sync unassigned.

Per interested contact the app creates:

1. **Company**: found by name, otherwise created.
2. **Lead**: found by stored id, then by email search, otherwise created. Status and assignee are
   always updated.
3. **Note on the lead**: the reply text.
4. **Task**: due on the next follow-up date (default: next business day) and assigned to the
   executive, with the lead details in a task note.

Each CRM id is stored as soon as it exists, so a retry never creates duplicates.

## Roles

`python manage.py leadgen_setup_roles` creates the groups and grants their admin permissions. It
is idempotent.

| Group | Can |
|---|---|
| `Leadgen Admin` (or superuser) | everything below, plus: verify sender mailboxes, approve campaigns for sending, lift suppressions, see API logs |
| `Leadgen Manager` | search, enrich, approve/reject, assign, sync campaigns, configure, enroll, start (gated) / pause, register webhooks, manual CRM sync |
| `Leadgen Executive` | see **only** their assigned leads and set the next follow-up date |

`is_staff` alone grants nothing here. Django admin still needs `is_staff` to log in. In the
ExpressEarth backend, `is_staff` also allows editing website content, so give it only to people
who should have both.

## Dashboards (Django admin)

**Lead discovery & approval** (*Prospect contacts*)
- Filters: approval, outreach and email status, NCR, campaign, assignee, CRM status.
- Actions: Approve, Reject, Assign, Enrich, Enroll into campaign, Sync to EmpFly CRM, Recalculate
  score. Choose the campaign or assignee next to the action dropdown.
- Each lead's page shows its outreach timeline.

**Campaign management** (*Campaigns*)
- **Sync from Smartlead** imports ExpressEarth campaigns only and reports how many other-brand
  campaigns were skipped.
- Each campaign shows a "Ready to send?" checklist and its per-mailbox
  SPF/DKIM/DMARC/SMTP results.
- Actions: Verify sender mailboxes via Smartlead (admin), Approve for sending (admin),
  Start (gated), Pause, Register webhook (gated), Refresh status/stats.

**Logs**: suppressions, webhook events, API call log (status, duration, credits; never keys or
bodies), outbox jobs ("Retry now"), Apollo search history.

## API

The base path is `/api/integrations/`. Auth is the backend's JWT
(`Authorization: Bearer <access>`). List endpoints are paginated with `?page=` and `?page_size=`
(max 100).

| Errors | Meaning |
|---|---|
| `400 {"errors": {...}}` | Validation failed. |
| `403 {"errors": {"blockers": [...]}}` | A safety gate refused the action. |
| `429` | Apollo credit cap reached. |
| `502` | Provider error. |
| `503` | A key is not configured. |

| Method & path | Role | Notes |
|---|---|---|
| `GET health/` | manager | Which keys/flags are set (never values). `?live=1` adds the credential check |
| `GET me/` | any user | `is_leadgen_admin/manager/member` |
| `POST apollo/company-search/` | manager | `{industry_keywords[], locations[], ncr, employee_ranges["51,200"], page, per_page}`. 1 credit/page |
| `POST apollo/people-search/` | manager | `{company_ids[], titles[], seniorities[], person_locations[], page, per_page}`. Free, no emails |
| `POST apollo/enrich/` | manager | `{contact_ids[≤50], reveal_phone, force}`. Uses credits |
| `GET apollo/usage/` | manager | Apollo rate-limit usage plus local credit total |
| `GET companies/` | manager | `?q=&is_ncr=1` |
| `GET leads/` | member | `?approval_status=&outreach_status=&email_status=&crm_sync_status=&campaign=&assigned_to=&company=&min_score=&is_ncr=1&q=` |
| `GET/PATCH leads/<id>/` | member | GET includes `events`. PATCH sets `next_follow_up_date` |
| `POST leads/approve/` | manager | `{contact_ids[], assigned_to?}` → `{approved[], skipped{id: reasons}}` |
| `POST leads/reject/` | manager | `{contact_ids[], reason?}` |
| `POST leads/assign/` | manager | `{contact_ids[], assigned_to}` |
| `GET/POST suppressions/` | manager | `{email or domain, reason, note}` |
| `DELETE suppressions/<id>/` | admin | |
| `GET campaigns/` | manager | `?sync=1` imports ExpressEarth campaigns first; the response adds `sync: {synced, skipped_other_brands}` |
| `POST campaigns/` | manager | `{name, sequences[], settings{}, schedule{}, email_account_ids[]}`. Gated; ExpressEarth mailboxes only |
| `GET/PATCH campaigns/<id>/` | manager | PATCH takes the config fields. Gated, resets approval |
| `POST campaigns/<id>/verify-sender/` | admin | No body. Returns the campaign with `sender_report` and `verification_blockers` |
| `POST campaigns/<id>/approve/` | admin | Requires verified sender mailboxes |
| `POST campaigns/<id>/register-webhook/` | manager | Gated. For campaigns made in the Smartlead UI |
| `POST campaigns/<id>/status/` | manager | `{status: START\|PAUSED\|STOPPED}`. START is gated |
| `POST campaigns/<id>/enroll/` | manager | `{contact_ids[]}` → `{enrolled[], skipped{}}`. Gated |
| `POST campaigns/<id>/leads/<contact_id>/<pause\|resume\|remove>/` | manager | Resume is gated |
| `GET campaigns/<id>/stats/` | manager | Refreshes status, analytics and missing lead ids |
| `POST crm/sync/<contact_id>/` | manager | Runs the CRM sync now, through the same retrying job |
| `GET api-logs/` | admin | `?provider=&errors=1` |
| `POST webhooks/smartlead/<token>/` | provider | See below |
| `POST apollo/phone-webhook/<token>/` | provider | Apollo async phone numbers |

## Webhooks

**Registration.** Campaigns created through the app register their webhook automatically. For a
campaign made in the Smartlead UI, use **Register webhook** (gated). The URL is
`{LEADGEN_PUBLIC_BASE_URL}/api/integrations/webhooks/smartlead/{SMARTLEAD_WEBHOOK_SECRET}/` and it
receives these events:

- `EMAIL_SENT`, `EMAIL_OPEN`, `EMAIL_REPLY`, `EMAIL_BOUNCE`;
- `LEAD_UNSUBSCRIBED`, `LEAD_CATEGORY_UPDATED`.

**Authentication**
- The URL token is compared in constant time. A wrong token gets a plain 404.
- If `SMARTLEAD_SIGNING_SECRET` is set, `X-Smartlead-Signature` must also match.
- The token appears in request logs, so enable the signature check once Smartlead provides a
  signing secret.

**Idempotency and scope**
- Each event is stored in `WebhookEvent`, deduped by `X-Request-Id` or a hash of the body. A
  retried delivery is processed once.
- If processing fails, the webhook returns 500 so Smartlead retries, and the failed event is
  processed again on the retry.
- Events for campaigns not imported into the app (other brands) are acknowledged and ignored.

**Mapping**
- sent → `sent`; open → `opened`; reply → `replied`, with the reply text stored.
- Category Interested / Meeting Request / Information Request → `positive_reply`, follow-up date
  set, CRM sync queued.
- Not Interested → `negative_reply`.
- Do Not Contact, bounce and unsubscribe → status updated and the email suppressed locally.
- A lead's status never moves backwards.

## Background jobs

No Celery is needed: background work goes into the `OutboxJob` table. Run these from the backend
image as **Cloud Run Jobs**, triggered by **Cloud Scheduler**:

| Command | Schedule | Does |
|---|---|---|
| `python manage.py leadgen_run_jobs` | every 5 min | CRM sync jobs. Retry backoff 1m, 5m, 30m, 2h, 12h, then failed. Re-queues stuck jobs |
| `python manage.py leadgen_reconcile` | hourly | For live campaigns the app created or enrolled into: status, stats and missing lead ids (catches missed webhooks) |

Both commands exit cleanly when keys are missing. If the image's entrypoint starts the web server,
override it in the job (e.g. `--command python --args manage.py,leadgen_run_jobs`).

## Deployment (staging first)

The code is safe to deploy as-is: with no keys and all flags off, it only adds tables, the admin
screens and endpoints that answer "not configured".

1. **Secrets** (once per GCP project), in Secret Manager:
   - `apollo-api-key`, `apollo-webhook-secret`;
   - `smartlead-api-key`, `smartlead-webhook-secret`;
   - `empfly-crm-password`.

   Generate the two webhook secrets with `openssl rand -hex 32`. Grant the Cloud Run runtime
   service account `roles/secretmanager.secretAccessor`.
2. **Backend Cloud Build.** Do this only after step 1, because a missing secret fails the deploy.
   - Add to the backend's deploy step:
     ```yaml
     - '--set-secrets'
     - 'APOLLO_API_KEY=apollo-api-key:latest,APOLLO_WEBHOOK_SECRET=apollo-webhook-secret:latest,SMARTLEAD_API_KEY=smartlead-api-key:latest,SMARTLEAD_WEBHOOK_SECRET=smartlead-webhook-secret:latest,EMPFLY_CRM_PASSWORD=empfly-crm-password:latest'
     ```
   - Add the non-secret variables to its `--set-env-vars` block.
   - Plain variables set by hand in the Cloud Run console are wiped by the next `--set-env-vars`
     deploy, so they must live in the build file.
3. **After deploy**, run once (for example as one-off Cloud Run Jobs):
   - `leadgen_setup_roles`, then add users to the groups;
   - `leadgen_check`.
4. **Turn features on gradually**:
   1. Apollo search and enrichment (keys only).
   2. Sync campaigns.
   3. `SMARTLEAD_WRITE_ENABLED=1`.
   4. Verify sender mailboxes and approve one internal test campaign.
   5. `SMARTLEAD_SENDING_ENABLED=1`.
   6. `EMPFLY_CRM_SYNC_ENABLED=1`.

## Staging demonstration checklist

1. `leadgen_check` shows Apollo and Smartlead OK, and EmpFly OK once configured.
2. **Sync from Smartlead** imports only ExpressEarth campaigns.
3. Run a company search (e.g. NCR, 201–1000 employees, a keyword), then a people search
   (titles: HR Head, Admin Head).
4. Enrich 2–3 contacts. The API call log shows the credits used.
5. Approve them and assign an executive.
6. Use a test campaign on ExpressEarth mailboxes whose leads are **internal addresses only**.
   - Verify the sender mailboxes, approve the campaign, enroll the leads, start it.
7. Reply from an internal mailbox and mark the reply "Interested" in Smartlead.
8. Check the app: the lead shows `positive_reply`.
9. Run `leadgen_run_jobs`. The CRM should show the company, the lead (assigned, with status), a
   note, and a task for the executive.

## Provider details still to confirm with live writes

Read-only calls were checked against the real accounts. These need a live write (gated) to
confirm:

- **Smartlead webhook signing secret.** The docs mention it but don't say where it is issued.
  Until then the URL token is the required check.
- **Smartlead webhook endpoint.** The docs show two different paths; the app uses
  `POST /webhook/create` with `event_type_map`, as in Smartlead's webhook guide.
- **Smartlead lead ids.** These arrive through `LEAD_CATEGORY_UPDATED` or the hourly reconcile.
  Pausing or removing a single lead needs that id.
- **Apollo company search.** It costs 1 credit per page, so it has not been live-tested yet.
  People search with the same JSON-body style works.
