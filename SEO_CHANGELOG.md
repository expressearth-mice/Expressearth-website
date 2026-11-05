# ExpressEarth SEO / AEO / GEO Changelog

## 2026-10-28

- Fixed the main contact form's success handling so boolean `true` responses are accepted, while an explicit string `"false"` is not; corrected the contact logo URL and removed an unused import.
- Improved the MICE services page heading and service descriptions with clearer corporate-intent language; replaced a nested button/link with one accessible contact link.
- Repaired incentive-travel enquiry links, including a CTA that previously pointed to a missing page fragment.
- Fixed destination-category fetching to use Axios response data; added links from the category index to category pages and route-specific metadata for those pages.
- Extended the sitemap generator to include category URLs returned by the API.
- Added a sitemap safeguard: if any content API fails during the prebuild, an existing sitemap is preserved instead of being overwritten with a potentially incomplete URL list.
- Expanded robots.txt exclusions to cover additional admin/editor route variants.
- Removed the duplicate public route for case-study creation so the existing role-gated route is authoritative.
- Updated the dealer-meet and corporate-offsite FAQs to remove repetitive keyword stuffing and replace unsupported superlatives with concrete service scope and planning considerations.
- Improved the dealer-meet H1 to match the page's service intent.

### Validation and deployment

- Re-fetched every changed file after committing and verified the intended edits.
- A production build and automated tests were not run in this environment: the repository could not be cloned due to unavailable network access, and the repository currently reports no GitHub Actions workflow runs.
- These are repository changes only. Production rendering, Search Console indexing, analytics, and lead outcomes still require validation after the developer copies the changes to the live environment.
- Live crawl finding: the public `/incentive-travel` page returned only the JavaScript app-shell message to the crawler used for this check. This does not prove Google cannot render the page, but it flags a material AEO/GEO risk for crawlers that do not execute JavaScript. A developer-led static-rendering or server-rendering solution should be evaluated before changing production architecture. See [Google's JavaScript rendering guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering).

## 2026-11-02

- Rewrote the conference management page's hero, service descriptions, planning scope, FAQs and CTA in plain language; removed repetitive keyword lists and absolute performance claims.
- Added crawlable internal links from the conference page to corporate events, dealer meets and corporate offsites.
- Reworked dealer meet page copy to clarify the service scope, Delhi NCR/India relevance and programme planning; removed unsupported "flawless", "premium" and absolute reliability claims.
- Added crawlable internal links from the dealer meet page to conference management, corporate events and incentive travel.
- Expanded the main MICE services hub with crawlable cards for dealer/distributor meets, corporate offsites, conference management and international group travel so these commercial pages are easier to discover from the primary service index.
- Updated the corporate offsite page H1 for Delhi NCR intent and added a visible FAQ explaining the confirmed ₹7,000 starting package: 1 night / 2 days, 40–100 people, twin-share stay, all meals, round-trip transportation, taxes extra. The page lists Mussoorie, Jim Corbett, Jaipur, Pushkar, Nainital, Dharamshala, Shimla, Kasauli, Kufri and Manali.
- Updated the offsite route's meta description to match the confirmed offer and its qualifications.
- Updated the sitemap generator to follow same-origin paginated API responses, while detecting loops and refusing pagination links to a different host; failed retrieval still preserves the existing sitemap.
- Fixed the homepage "Home Page Loaded" analytics effect so it fires once on mount rather than after every render.
- Removed duplicate Font Awesome CDN stylesheet requests because the app already imports the installed local Font Awesome package; removed the duplicate Google Fonts preconnect pair and a duplicate Bootstrap CSS import.
- Re-fetched each changed source file after its commit and checked the intended copy, links, package details and effect dependency.

### Validation and outstanding checks

- Repository API reports no GitHub Actions workflow runs. A local clone/build could not be run because this environment could not resolve github.com; no build or test result is claimed.
- A parse-only JavaScript syntax check passed for scripts/generate-sitemap.js. JSX compilation, the full production build and application tests remain unverified because dependencies/source could not be cloned into this environment.
- Review found the current public/index.html loads gtag.js using a GTM- container ID and calls gtag('config', 'GTM-...'). Google's current guidance distinguishes a Google tag ID (for example G-... / GT-...) from a Tag Manager container ID (GTM-...). Do not change this blindly: the owner/developer must confirm whether the intended setup is GA4 gtag.js, Google Tag Manager, or both, and provide the GA4 Measurement ID plus GTM container access/configuration as applicable. Verify with Tag Assistant after correction.
- Changes remain in the development repository only. Production rendering, form submissions, analytics events and Search Console indexing must be checked after the developer deploys the changes.


## 2026-11-02 — Crawl fallback and enquiry form accessibility

- Added an explicit not-found route with useful links to the commercial MICE services hub and contact page. Unknown client-side routes now receive a `noindex, follow` robots directive and have any stale canonical link removed; recognized routes restore the normal index directive and route-specific canonical.
- Made route slug-to-title decoding tolerant of malformed percent-encoding so an unusual URL cannot throw during metadata generation.
- Added not-found handling to dynamic blog, case-study and destination pages: unavailable content is now marked `noindex, follow`, stale canonicals are removed, and the case-study detail route displays a helpful not-found message instead of an indefinite loading skeleton. Detail state is cleared when a route parameter changes to prevent stale content from appearing under a new URL.
- Replaced generic contact-page superlatives with a clear corporate enquiry brief and guidance on the details that help qualify an enquiry.
- Added native required semantics, browser autofill hints, and error-to-field ARIA associations for the name, email and phone fields; added a polite success announcement and an alert role for form errors.
- Improved the requirements prompt so prospective clients can include destination, budget range, dates and production/travel needs without changing the backend payload.
- Corrected the contact submit button's invalid double-hash background colour, set a darker green, and added an accessible loading announcement.
- Replaced the stale Create React App placeholder test with a focused not-found navigation test.

### Validation and deployment

- Checked that each intended source replacement matched exactly once before preparing the commit.
- Automated Jest/build execution is not available in this run because the repository is accessible through GitHub's file API but no local checkout/dependency installation is available here; no build or test pass is claimed.
- No production deployment, redirects, DNS or hosting changes were made.

- Consolidated destination detail and list fallback into one cancellable request flow, matching either the API slug or destination name. This removes the duplicate list request/race that could overwrite a successfully loaded destination with an empty fallback and keeps route changes from applying stale responses.

## 2026-11-04

- Corrected the Google Tag Manager installation: the existing `GTM-WMJCBMGG` container ID now loads through the Tag Manager container bootstrap and noscript iframe rather than being passed to the `gtag.js` URL as if it were a Google tag ID. Retained a small `gtag` data-layer bridge for existing frontend event calls. Container tags, consent configuration and GA4 event receipt still require Tag Assistant verification.
- Expanded the homepage Organization JSON-LD with the public phone, email, Gurugram address, contact point, service area and social profile URLs already displayed in the site's footer. The JSON-LD block parses successfully. The owner should confirm these public contact/profile details remain current before production release.
- Added a reusable Schema.org `Service` component and applied it to the MICE services hub, meetings and conferences, conference management, incentive travel, corporate events, dealer meets, corporate offsites, exhibitions, destination management and international group travel pages. These are machine-readable service descriptions, not a promise of Google rich-result eligibility.
- Registered the existing Meetings & Conferences, Exhibitions & Trade Shows and Destination Management components as public routes. This resolves internal service links that previously pointed to the not-found route; the routes were already represented in route metadata and the sitemap's static route list. Differentiated the Meetings page title/H1 from the separate Conference Management page to reduce overlapping search intent.
- Reworked the homepage around verifiable service scope: removed unverified country/hotel/client/event counters, unsupported group-size/destination counts, named testimonial attributions and the placeholder Fortune 500 quote. Replaced these with corporate MICE programme links, planning capabilities and a published-case-studies pathway.
- Replaced the homepage's repeated generic hero copy and "free consultation" CTA with corporate programme language and a request to discuss the brief. Updated the FAQ answers to explain services, lead-time considerations, customisation and the information needed for an enquiry.
- Improved homepage accessibility and loading behaviour: FAQ questions are real buttons with expanded state and persistent answer targets; the floating enquiry control is keyboard-operable; WhatsApp has an accessible name; the first hero image is prioritised, later slides and card imagery are lazy-loaded, and the decorative video requests metadata rather than full preload. Added a no-JavaScript homepage fallback with core service links and contact details for crawlers and visitors that do not execute the React app.
- Made homepage blog loading tolerate both array and paginated API responses instead of assuming `response.data` is always an array.
- Reworked corporate event, incentive travel, international group travel, exhibition and destination management copy to describe concrete programme scope and planning dependencies rather than unsupported superlatives, luxury positioning or repetitive keyword lists. Also removed unsupported offsite outcome/premium claims. Added related-service links and service structured data.
- Improved the conference management page with matching service schema and aligned its visible description with the structured data.
- Replaced hard-coded placeholder phone numbers in dealer-meet, corporate-offsite, conference-management and international-group-travel FAQ submissions with a required real phone field. Dealer-meet and corporate-offsite newsletter forms now use the existing `/api/subscribe/` endpoint instead of creating contact records with a fabricated number.
- Improved footer conversion and navigation: phone/email are clickable, priority MICE service links are exposed, the corporate-offsite link points to the offsite page, social links have accessible labels, partner-logo alt text is descriptive, and the copyright year updates automatically.
- Hardened dynamic sitemap URL construction by normalising/encoding individual blog, case-study and category path segments and skipping malformed values containing path separators.

### Validation and deployment

- Re-fetched every changed file after its repository update and checked the resulting contents.
- Parsed the homepage Organization JSON-LD with `JSON.parse`; it is valid.
- Parsed `scripts/generate-sitemap.js` with the JavaScript parser; syntax passed.
- Compared internal links in the changed public components against registered React routes; no missing internal targets were found.
- Checked the changed FAQ/contact forms for the known placeholder phone number; it is no longer present in the updated forms.
- A full React production build and Jest suite could not be run because this environment cannot resolve `github.com` for a local checkout. The repository has no GitHub Actions workflow runs to use as an alternative. JSX compilation and live API submission remain unverified.
- No production deployment, DNS/hosting change or redirect was made.
- The SPA still needs a developer-led pre-rendering/server-rendering evaluation for commercial landing pages so crawlers that do not execute JavaScript can receive complete page content. Search Console/GA4 access, Tag Assistant validation, and owner confirmation of the public contact details remain required for production measurement. Genuine approved event assets and verified project facts are still needed before adding new case-study proof.

## 2026-11-04 — Dynamic content reliability and category indexing

- Added a shared API collection normalizer for both plain-array and paginated `{ results: [] }` responses.
- Applied it to blog and case-study listings, recent-post panels, legacy case-study slug lookup, and destination listings. This prevents paginated responses from being treated as arrays or causing `.map()`, `.find()`, `.slice()` or `.sort()` failures.
- Added focused unit tests for plain arrays, paginated responses, and unsupported payloads.
- Reworked destination-category pages to cancel stale requests on navigation, clear previous category results while loading, and handle API errors and empty categories without leaving misleading indexable thin pages.
- Added category-specific title, description, Open Graph/Twitter metadata and canonical URLs for populated categories; empty or failed category results receive `noindex, follow` and have stale canonicals removed.
- Promoted the category heading to an H1, added a concise programme-oriented introduction and contact/browse paths for empty states, and lazy-loaded category destination images.
- Scoped the category page styles to its own component rather than applying generic heading/card styles globally.

### Validation and deployment

- Re-fetched every changed source file and the changelog after the updates and verified the expected imports, normalizer calls, metadata handling, empty states and test cases.
- Ran a standalone Node syntax check and five behavior assertions against the collection normalizer; all passed. The repository Jest suite and React build remain unrun.
- Focused unit tests were added but the Jest suite and React production build have not been run in this environment; the repository is available through GitHub's file API but no local checkout with installed dependencies is available.
- No production deployment, DNS/hosting changes or redirects were made.

## 2026-11-04 — Search performance review and development-host crawl guard

- Added an early `public/index.html` check that sets `noindex, follow` on `dev.expressearth.com` before the React application hydrates. The existing route-aware metadata check remains in place as a second layer.
- Reviewed the latest 28-day Search Console query and page extracts. The visible query rows show clicks concentrated on the brand variants `express earth` and `expressearth`; the returned non-brand MICE queries (including `mice companies in gurgaon`, `mice company in gurugram` and `mice agency for corporate events`) have impressions but no clicks in this extract. The connector's branded/non-branded flag classifies these brand variants as non-branded because it checks for the domain string; future reporting must classify known ExpressEarth brand variants separately.
- Search Console's domain-property page rows still contain host variants, including `http://expressearth.com/`, `https://expressearth.com/about`, and a `dev.expressearth.com` destination URL, alongside the preferred `https://www.expressearth.com/` URLs. A live fetch of the apex HTTP and HTTPS URLs remained on the apex host rather than resolving to the www host. The code's sitemap and route metadata prefer HTTPS + www, but host-level consolidation still needs hosting configuration. No redirects were created, in line with the owner's instruction.
- The development-host noindex script is an incremental client-side safeguard only. A developer should also configure an `X-Robots-Tag: noindex` response header for the dev host so crawlers that do not execute JavaScript cannot index the development copy.
- GA4's latest 28-day extract reports 99 Organic Search sessions and 21 key-event counts by session channel. The specific `ads_conversion_Submit_lead_form_1` event appears 63 times (62 on `/contact`, one on `/contact/`). These are event counts, not verified unique form submissions, people or A1/A2 CRM opportunities.
- Google Business Profile currently has two LIVE posts in the reviewed period: the general MICE post (27 October) and the corporate-offsite post (2 November), each linking to its relevant service page. No additional post was published in this run.
- The GBP service list includes several consumer-travel labels (for example family trips, honeymoons, cruises and destination weddings) alongside corporate MICE services. Do not remove them without the owner's confirmation that those services are no longer offered under this profile.
- The Search Console connector returned no usable sitemap-status record in this pull. Sitemap submission/processing therefore remains unverified and should be checked in the Search Console UI.

### Measurement and implementation limits

- The 28-day Search Console, GA4 and GBP extracts are directional snapshots; query/page totals may differ because of Search Console anonymisation, aggregation and differing dimensions.
- Google recommends crawlable `<a href>` links, meaningful HTTP status codes for missing pages and consistent canonical signals. See [crawlable link guidance](https://developers.google.com/search/docs/crawling-indexing/links-crawlable), [crawling error guidance](https://developers.google.com/search/docs/crawling-indexing/troubleshoot-crawling-errors) and [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
- No production deployment, redirect, DNS or hosting change was made.

## 2026-11-04 — Enquiry confirmation integrity and Gurugram MICE relevance

- Added a shared contact-response validator matching the existing main contact form's success semantics: only boolean true or a non-empty success string other than 'false' is treated as a confirmed API submission.
- Applied the validator to the dealer-meet, conference-management and corporate-offsite primary/FAQ contact forms. Success messages and form resets now wait for the API's explicit success response rather than treating every HTTP 2xx response as a saved enquiry.
- Moved Meta Pixel Contact/Submit events on dealer-meet, conference-management and the shared popup form to after confirmed contact API success. The dealer-meet newsletter Submit event now fires after the subscription request resolves.
- Removed the shared popup form's console log of the full submission payload so names, email addresses, phone numbers and company names are not printed to the browser console during normal submission.
- Added focused Jest cases for boolean/string success, false responses, missing success flags and null responses.
- Used the latest 28-day Search Console extract (361 query/page/date rows) to refine the MICE hub's local intent. Site-level non-brand query rows include 'mice company in gurugram' (9 impressions, average position 68.2), 'mice companies in gurgaon' (8 impressions, position 76.0), 'mice company in gurgaon' (2 impressions, position 93.5), and 'mice agency for corporate events' (3 impressions, position 65.7); all had zero clicks in this extract. These are small samples and not a forecast.
- The MICE hub itself appeared under both apex and www URLs: 8 impressions at average position 47.5 on the apex URL and 4 impressions at position 32.3 on the www URL, with zero clicks for both. This continues to support the separately documented host-canonicalisation blocker; no redirect or hosting change was made.
- Updated the MICE hub title, H1, visible introduction and enquiry prompt to state its Gurugram base and Delhi NCR/India programme coverage, without claiming additional offices or credentials.
- Fresh GA4 aggregate for the last 28 days reports 99 Organic Search sessions and 68 active users. The ads_conversion_Submit_lead_form_1 event recorded 21 Organic Search events and 63 events across all channels. These remain event counts, not unique people, confirmed submissions or CRM-qualified opportunities; Tag Assistant and CRM reconciliation are still required.
- No GTM/GA4 configuration was changed. The existing Tag Manager setup still requires owner/developer verification with Tag Assistant before conversion attribution can be treated as reliable.

### Validation and release safety

- Re-fetched and verified all changed source files after their updates, including the shared validator, its test, the three commercial service pages, shared popup form, route metadata and MICE service hub.
- Ran six direct behaviour assertions against the validator logic (boolean true, string true, boolean false, string false, missing success and null response); all passed. The Jest test file is added but the repository Jest suite has not been run.
- A local GitHub connectivity check failed because this environment could not resolve github.com; therefore no local React build, JSX compilation or Jest run was possible. The repository has no Actions workflow run available as an alternative.
- No production deployment, DNS/hosting change, redirect, campaign send, merge or EmpFly/Indo Exhibits change was made.


## 2026-11-04 — Destination discovery and enquiry conversion

- Destination detail pages now replace generic slug-based metadata with a destination-specific corporate group travel title and description after the destination record loads. The page updates canonical, robots, Open Graph and Twitter title/description/URL metadata together; missing destinations receive noindex metadata and have stale canonicals removed.
- Changed the destination name to the page's primary H1, made the optional location link conditional, and added a useful not-found state with browse/contact links.
- Added a visible corporate group programme enquiry section to destination pages, with links to incentive travel, destination management and international group travel. The copy asks for dates, group size and programme type without promising availability.
- Added a small pure metadata helper and focused Jest tests for destination-specific titles/descriptions.
- The main contact page now uses the shared contact-response validator, shows an error if the API returns an empty or unsuccessful response instead of silently ending, handles event-date errors whether returned as a string or array, and no longer logs response payloads that may contain submitted personal information. Promoted the contact page heading to H1 and updated its existing heading style.
- Fresh last-28-day measurement snapshot (4 November 2026): Search Console returned 42 query aggregates; express earth had 20 clicks / 47 impressions and expressearth 19 / 34. Non-brand MICE queries remain low-volume: mice company in gurugram 9 impressions, mice companies in gurgaon 8, mice company in gurgaon 2, all with zero clicks. GA4 reported 99 Organic Search sessions and 21 ads_conversion_Submit_lead_form_1 event counts from Organic Search (63 event counts across all channels). Google Business Profile reported 167 impressions, 10 website clicks, 1 call click and 37 direction requests. GA4 events are not unique enquiries or CRM-qualified opportunities.
- Validation: re-fetched and compared every changed file after writing; added three focused destination-metadata Jest tests. The full Jest suite, JSX compilation and React build were not run because no local checkout/dependency installation is available and the repository has no Actions workflow runs to use as an alternative.
- No production deployment, DNS/hosting change, redirect, PR merge, campaign send, or EmpFly/Indo Exhibits code change was made.


## 2026-11-04 — Commercial enquiry payload and attribution integrity

- Added a shared `generate_lead` event helper for confirmed form submissions. It records service type, form location, page path and a referrer path with query strings/fragments removed; it does not send names, email addresses or phone numbers.
- Standardised the main contact page to push the `generate_lead` event only after the Contact API returns an explicit success response.
- Hardened International Group Travel primary and FAQ forms: both now check the API success payload before displaying confirmation or clearing fields; FAQ free text is mapped to `requirements` and the event type uses the supported `Other` value.
- Hardened Incentive Travel primary and FAQ forms in the same way. Replaced the FAQ form's fabricated phone value with a required user-entered phone field, mapped the question to `requirements` and used the supported `Incentive Trip` event type.
- Repaired Recognition & Rewards form payload mapping to the Contact API fields (`full_name`, `company_name`, `email`, `phone`, `event_type`, `requirements`). Replaced its fabricated FAQ phone value with a required user-entered phone field.
- Removed pre-request pixel lead events from the updated Incentive Travel and Recognition & Rewards forms; the new PII-free `generate_lead` event is emitted only after the API confirms success. Removed raw error-response logging from the updated forms.
- Added focused tests for lead-event parameters, referrer sanitisation, PII exclusion and the no-gtag fallback.

### Validation and remaining measurement checks

- Re-fetched each modified source file after its commit and verified the intended API mappings, response checks, real phone inputs, event wiring and removal of placeholder phone values.
- The Contact API model in the separate ExpressEarth backend was inspected read-only to confirm the existing field names, required phone field and allowed event-type values; no backend files were changed.
- The new Jest tests and full React production build still need to be executed in a checkout with dependencies. GTM/GA4 receipt of `generate_lead` must be verified with Tag Assistant and an appropriate GTM event trigger/tag; no production tag or configuration was changed.
- No deployment, merge, DNS/hosting change, outbound campaign, or EmpFly/Indo Exhibits modification was made.

- Follow-up fix: both Recognition & Rewards forms now use the shared `axiosInstance` configured from `REACT_APP_API_URL` (defaulting to `https://api.expressearth.com`). The previous raw Axios relative URL could resolve against the frontend host instead of the configured API host.


## 2026-11-04 — Latest acquisition evidence refresh

- Search Console returned 42 distinct query strings across 102 daily query rows for the last 28 days. ExpressEarth brand variants accounted for 39 clicks from 85 impressions; the remaining non-brand queries accounted for 0 clicks from 76 impressions. These are low-volume query samples, not a demand estimate.
- Priority non-brand MICE queries included `mice company in gurugram` (9 impressions; average position 68.2), `mice companies in gurgaon` (8; 76.0), `mice agency for corporate events` (3; 65.7), and `mice company in gurgaon` (2; 93.5); each had zero clicks in this extract.
- Search Console page URLs remain split across hosts: `www.expressearth.com` recorded 57 clicks / 473 impressions, while `expressearth.com` recorded 19 clicks / 716 impressions. The B2C subdomain recorded 10 impressions and the development host 3, both with zero clicks. This reinforces the hosting-level canonical consolidation dependency; no redirects or hosting changes were made.
- GA4 recorded 597 sessions, including 99 Organic Search sessions. The existing `ads_conversion_Submit_lead_form_1` event recorded 63 counts: 21 from Organic Search, 39 Direct and 3 Unassigned. These are event counts, not unique people, confirmed submissions or qualified CRM opportunities.
- Google Business Profile recorded 167 impressions, 10 website clicks, 1 call click and 37 direction requests over the same period.
- GA4 also recorded 17 `page_view` and 17 `session_start` events for the unmatched path `/ZGVzdGluYX` under Direct. No corresponding public React route exists; treat this as a route/measurement anomaly, not a lead. Developer/analytics tracing is required to identify its source.
- The Search Console sitemap connector returned rows with a null sitemap path and zero submission/error fields; this does not verify whether the sitemap is submitted or processed. Use Search Console's Sitemaps and URL Inspection views for confirmation.
- The new `generate_lead` event exists only in the development branch until the code is released and the corresponding GTM event trigger/GA4 tag is verified with Tag Assistant.


## 2026-11-04 — privacy-safe conversion attribution across remaining MICE forms

- Audited the shared Meta Pixel contact/form helpers and found that they forwarded names, email addresses, phone numbers, company names and free-text form data as event parameters. Reworked both helpers to send only generic event labels, service/form categories and form location; added strict label allowlisting. Existing event names are preserved.
- Added privacy-safe GA4/GTM `generate_lead` events after explicit API success on dealer-meet primary and FAQ forms, conference-management primary and FAQ forms, and corporate-offsite primary and FAQ forms. Events include service type, form location, page path and a referrer path without query strings/fragments; no form PII is sent.
- Added the same confirmed-lead event to the shared popup enquiry form and removed its unused Axios import. The popup is attributed separately as `popup_mice_enquiry`; the page path identifies the page where it was opened.
- Reduced the dealer-meet newsletter pixel payload to non-identifying form context. Newsletter subscriptions are not counted as MICE leads.
- Added focused tests for the Meta Pixel helper allowlist and PII exclusion. These tests are committed but still require execution in the repository's Jest environment.
- Validation for this batch: changed source files were re-fetched after each commit and compared with the intended content; targeted source assertions and standalone runtime checks were run. Full Jest/build/browser submission and GTM/Tag Assistant verification remain pending.
- No backend, EmpFly, Indo Exhibits, production configuration, DNS, hosting or redirect changes were made. No outbound campaigns were sent.


- Privacy hardening follow-up: narrowed Meta Pixel event payloads further to fixed generic categories and an explicit allowlist of form-location labels. Caller-supplied category/type strings are no longer copied into pixel events, preventing an unexpected personal name or company value from being used as an event label.


## 2026-11-04 — latest 28-day acquisition snapshot (data through 3 November)

- Search Console returned 102 query rows: 39 clicks and 161 impressions. The two explicit ExpressEarth brand queries (`express earth` and `expressearth`) accounted for 39 clicks and 81 impressions. Other returned queries accounted for 80 impressions and no clicks; this query-row view does not include all anonymised search terms.
- Non-brand MICE query samples remain small: `mice company in gurugram` (9 impressions; weighted average position 68.2), `mice companies in gurgaon` (8; 76.0), `mice agency for corporate events` (3; 65.7), `mice company in gurgaon` (2; 93.5), `corporate incentive travel companies` (2; 52.5) and `mice services for corporates` (2; 79.5). All returned zero clicks in this snapshot.
- GA4 reports 596 sessions, including 99 Organic Search sessions and 77 Organic Search active users. The existing lead-form conversion event recorded 63 event counts: 21 Organic Search, 39 Direct and 3 Unassigned. These are events, not unique enquiries or qualified opportunities.
- Google Business Profile reports 167 impressions, 10 website clicks, 1 call click and 37 direction requests.
- GA4 records 70 events across 38 rows on the unmatched path `/ZGVzdGluYX`. No matching public React route or internal base64 route construction was found in the inspected source files; treat this as an unexplained measurement/traffic anomaly, not a lead, until developer tracing identifies its source.


## 2026-11-05 — Local MICE discovery and service navigation

- Added a Rewards & Recognition card to the main MICE services hub, linking to the existing /r&rplanning route; expanded the hub's Service description to include recognition programmes.
- Added a concise Gurugram/Delhi NCR service-area explanation to the MICE hub, naming Gurugram, Delhi, Noida, Faridabad and Ghaziabad as corporate-team locations (not additional office claims). Added an answer-first prompt listing the details that make a corporate MICE brief actionable: objective, programme type, attendee count, dates, origin cities, destination, budget and required delivery scope.
- Added responsive styling for the local coverage section.
- Replaced the duplicate Corporate Offsites item in the footer service navigation with a Rewards & Recognition link.
- Added focused MICE hub tests for the Rewards & Recognition route, NCR context and brief-qualification prompt.

### Fresh acquisition evidence (28-day extract through 3 November 2026)

- GA4 session-level report: 101 Organic Search sessions and 86 Organic Search active users. Organic landing pages included / (72 sessions), /contact (9), /about (5) and /corporate-events (1). The MICE services hub and the other dedicated MICE service pages were not among the leading organic landing pages in this extract.
- GA4's existing ads_conversion_Submit_lead_form_1 event recorded 63 counts (62 on /contact, 1 on /contact/). These are event counts, not unique enquiries or qualified opportunities.
- Search Console page rows showed /mice-services on the apex host (8 impressions) and www host (4 impressions), with zero clicks on both. Returned non-brand query rows included 'mice agency for corporate events' (3 impressions across two host variants; average positions in the mid-60s), 'mice services for corporates' (2 impressions; average position 79.5), 'mice agency' (1; position 65) and 'mice company in delhi' (1; position 83). These are small samples, not demand forecasts.
- Google Business Profile: 167 impressions, 10 website clicks, 1 call click and 37 direction requests.
- The Search Console sitemap connector still returns a null sitemap path and no usable submission/download status; sitemap processing remains unverified and must be checked in the Search Console UI.

### Validation and limitations

- Re-fetched and reviewed src/components/MiceService.js, src/components/MiceService.css, src/components/Footer.js, the new src/components/MiceService.test.js and this changelog after their commits.
- Source assertions confirmed the Rewards & Recognition route, local coverage content, brief prompt, responsive styles and removal of the duplicate footer link.
- Focused Jest tests were added but not run. Full JSX compilation and the React production build remain unverified because this runtime has no local checkout/dependency installation; no GitHub Actions checks are configured.
- No production deployment, merge, DNS/hosting change, redirect, outbound campaign, or EmpFly/Indo Exhibits code change was made.


## 2026-11-05 — commercial enquiry form submission safeguards

- Added independent pending states and duplicate-submit guards to the primary and FAQ contact forms on Conference Management, Dealer Meet and Corporate Offsites. Submit buttons are disabled and show a submitting label while the API request is pending; the form exposes `aria-busy` during submission.
- Added browser autofill hints and explicit accessible names to primary name, work email, phone and company fields. Phone inputs now use `type="tel"` and a telephone input mode. Company name becomes required only when the visitor selects the Company/Corporate option, supporting more useful business enquiries without requiring it for individual enquiries.
- Added name/email autofill hints to the FAQ forms. Existing API payloads, endpoints, success validation and post-success lead-event parameters are unchanged.
- Removed raw API error-response logging from these six contact handlers. The visitor still receives a generic retry message, while submitted details and backend response bodies are no longer written to the browser console by these handlers.
- Fresh connected acquisition snapshot (last-28-day cached extracts; forced refresh is unavailable on the current Windsor trial plan): GA4 reported 99 Organic Search sessions and 68 Organic Search active users; 63 existing lead-form conversion event counts across all channels. Search Console returned 42 query strings; the two ExpressEarth brand queries produced 42 clicks (22 + 20) from 574 impressions, while priority non-brand MICE samples remained low-volume with zero clicks: “mice company in gurugram” (9 impressions), “mice companies in gurgaon” (8), “mice agency for corporate events” (3). Google Business Profile reported 169 impressions, 10 website clicks, 1 call click and 37 direction requests. Event counts and profile actions are not unique or qualified enquiries.
- GA4 continues to show Direct traffic landing on `/ZGVzdGluYX` (66 event counts in the current event/landing-page extract); no matching public route has been found. This remains an unexplained analytics/traffic anomaly, not a lead.
- Validation: changed files were re-fetched after commit and checked for submission guards, disabled states, autofill/telephone semantics, conditional company fields and removal of raw error logging. Full Jest/React build and browser/API integration tests remain unavailable in this environment; see run report.
- No API payload contract, backend code, EmpFly, Indo Exhibits, production tracking configuration, DNS, hosting, redirects or deployment were changed. No outbound campaigns were sent.


## 2026-11-05 — privacy-safe lead attribution parameters

- Hardened `src/utils/leadTracking.js`: `service_type` is now restricted to known MICE service categories, with the Contact form's visible event choices mapped to stable values (Conference, Incentive Trip, Corporate Meeting, Exhibition, Product Launch and Other). Alias lookup checks own properties so inherited object keys cannot become event values.
- Restricted `form_location` to the known values `primary`, `faq_question`, `popup` and `contact_page`; unexpected values fall back to a generic safe value.
- Sanitised `page_path` and `page_referrer`: query strings and fragments are not accepted in event page paths; encoded/double-encoded email addresses, phone-like or long numeric path segments (including numbers embedded in slugs), control characters and malformed paths are replaced with a root path. Referrer query strings/fragments remain excluded, and a sensitive referrer path retains only its origin.
- Expanded focused Jest coverage for contact-form event-type mapping, invalid labels, unsafe page paths and personal-looking referrer paths. No form payload, backend contract, GTM configuration or production tracking setup was changed.
- Cached connected acquisition snapshot (last 28 days; Windsor force-refresh is unavailable on the current trial plan): GA4 reported 101 Organic Search sessions and 68 Organic Search active users; 21 Organic Search key-event counts. The existing lead-form event recorded 64 counts (63 on `/contact`, 1 on `/contact/`), not unique or qualified enquiries. Organic landing-page rows included 72 sessions on the homepage and 9 on `/contact`.
- Search Console returned 42 query rows: the two ExpressEarth brand variants generated 39 clicks / 81 impressions; the other 40 returned query rows generated 0 clicks / 80 impressions. Small non-brand MICE samples remain low-volume and have no clicks, including “mice company in gurugram” (9 impressions), “mice companies in gurgaon” (8), “mice agency for corporate events” (3) and “mice services for corporates” (2).
- Search Console page rows still split the MICE hub across hosts: apex `/mice-services` (1 click / 14 impressions) and www `/mice-services` (0 / 8). Contact also appears on apex (0 / 101) and www (0 / 11). This is evidence of a host-consistency issue; no redirects or hosting changes were made.
- GA4 landing-page rows include 16 Direct sessions on `/ZGVzdGluYX`; no matching public React route was found in the inspected app source. This remains an unexplained traffic/measurement anomaly, not a lead.
- Two Google Business Profile posts were returned as LIVE in the cached period. The profile's service list still includes consumer-travel categories alongside corporate MICE; no profile edits were made because the current service mix requires owner confirmation.
- Validation for this batch: re-fetched all three changed files after commits; standalone Node syntax checks passed for the helper and Jest test file, and 23 runtime assertions against the helper passed. The Jest suite itself, full React build and Tag Assistant verification remain separate release checks. No merge, deployment, DNS/hosting modification, outbound send, EmpFly/Indo Exhibits code change or production tracking change was made.


## 2026-11-05 — answer-first MICE service discovery

- Added a visible, keyboard-accessible corporate MICE FAQ section to the MICE services hub. The answers explain the delivery scope, link to existing meetings/conferences, incentive travel, dealer-meet, corporate-offsite and corporate-event routes, and clarify Gurugram/Delhi NCR/India coverage using the existing approved service description.
- Changed the hub's contact CTA label to “Share Your Corporate MICE Brief” so the next step is explicit for corporate buyers. The destination remains the existing contact route.
- Added responsive FAQ styling and visible keyboard focus treatment for native disclosure summaries. No FAQPage structured data was added; the Q&A is visible page content, not a promise of a Google FAQ rich result.
- Evidence informing this update: the latest connected 28-day Search Console extract has 12 impressions and zero clicks across apex/www /mice-services page rows; non-brand queries include “mice company in gurugram” (9 impressions; avg position 68.2), “mice companies in gurgaon” (8; 76.0) and “mice agency for corporate events” (3; 65.7), all with zero clicks. GA4 reports 101 Organic Search sessions, with 75 organic sessions landing on the homepage and 9 on /contact; the MICE hub is not among the top organic landing pages in this extract. These are small-sample observations, not a forecast or evidence that the new content has improved rankings.
- Validation: source-level assertions checked the FAQ heading and answers, five internal route links, contact CTA destination, accessible native details/summary structure and responsive/focus styles. Changed files were re-fetched after commit. Focused Jest tests were added but not run; the full React build remains unavailable in this environment.
- No structured-data claims, client proof, testimonials, event results, credentials, new locations or additional office claims were introduced. No production deployment, merge, DNS/hosting change, redirect, outbound campaign, or EmpFly/Indo Exhibits modification was made.


## 2026-11-05 — homepage-to-MICE service discovery

- Added a visible, crawlable priority-service navigation block immediately below the homepage hero. It links directly to the existing Meetings & Conferences, Incentive Travel, Dealer & Distributor Meets and Corporate Offsites routes, plus the MICE services hub and contact page.
- Added concise local context stating the Gurugram base and Delhi NCR/India programme coverage. The block reuses the existing programme-link data so the labels and destinations remain aligned with the lower homepage MICE carousel.
- Added responsive four-column/two-column/single-column layouts, visible keyboard focus styles and reduced-motion handling for hover transitions.
- Added a focused Home component test covering the four priority service routes and the two next-step links.

### Measurement used (connected 28-day extracts, 7 October–3 November 2026)

- GA4 returned 67 landing-page/channel rows. Organic Search active users were concentrated on the homepage (54), then /contact (7), /about (5), (not set) (4) and /careers (2). The MICE hub did not appear among the returned Organic Search landing-page rows. These are active-user counts by landing-page/channel, not sessions or enquiries.
- Search Console returned 94 query/page rows with 45 clicks and 736 impressions. The explicit brand queries “express earth” and “expressearth” accounted for all 45 clicks (612 impressions); the other returned query rows accounted for 124 impressions and zero clicks. Anonymised queries may not appear in query-level rows.
- Priority non-brand query samples remain low: “mice company in gurugram” (10 impressions; average position 68.8), “mice companies in gurgaon” (8; 76.0), “mice agency for corporate events” (4; 65.5), “mice services for corporates” (4; 77.5), and “incentive travel company india” (4; 68.25), all with zero clicks in this extract.
- Search Console page rows show /mice-services on the www host (10 impressions) and apex host (9 impressions), both with zero clicks. Host consolidation remains a separate hosting task; no redirect or hosting change was made.
- Google Business Profile recorded 10 website clicks and 40 direction requests in the 28-day extract. These are profile interactions, not verified corporate enquiries. The two returned posts remained LIVE (27 October and 2 November).
- Forced Windsor refresh is unavailable on the connected trial plan; these figures are the latest available cached connector extracts, not a forced live refresh.

### Validation and safety

- Re-fetched Home.js, Home.css, Home.test.js and this changelog after committing. Source assertions confirmed the new section is placed between the homepage hero and destinations, the four links use the existing programmeLinks entries, the contact/MICE CTAs point to registered routes, and the responsive/focus/reduced-motion CSS is present.
- CSS brace counts are balanced. The focused Jest test was added but not run; JSX compilation, the full React build and browser verification remain outstanding because no local dependency-backed checkout is available and the repository has no configured GitHub Actions status checks.
- No case-study claims, client proof, testimonials, credentials, results or new office claims were added. No production deployment, merge, DNS/hosting change, redirect, outbound campaign, or EmpFly/Indo Exhibits modification was made.

## 2026-11-05 — Exclude placeholder case studies from public discovery

- Added a shared case-study visibility helper with the known placeholder slugs `abc`, `abc-1`, `abc-2` and `abcd` already identified in the separate sitemap-quality PR #4.
- The public case-study listing now omits those placeholder records. Direct requests for the known placeholder slugs show the existing not-found state without requesting the case-study or destination APIs.
- Case-study detail records without a descriptive public slug (including ID-only records) remain accessible for legacy compatibility, but receive `noindex, follow` and have any stale canonical removed. Descriptive slugs retain index/follow and their self-referencing canonical.
- Added focused unit tests for placeholder matching, descriptive-slug indexability, legacy ID-only compatibility and public-list filtering. This work does not modify the sitemap generator, avoiding overlap with PR #4.

### Measurement used (connected 28-day extracts, 7 October–3 November 2026)

- Search Console returned 361 daily query/page rows: 42 clicks and 690 impressions. Explicit brand queries accounted for 42 clicks / 614 impressions; returned non-brand queries accounted for 76 impressions and zero clicks. The connector's branded flag misclassifies these brand variants because it checks for the domain string, so the query text was classified explicitly.
- Priority non-brand samples included “mice company in gurugram” (9 impressions; average position 68.2), “mice companies in gurgaon” (8; 76.0), “mice agency for corporate events” (3; 65.7), and “corporate incentive travel companies” (2; 52.5), all with zero clicks in this extract.
- GA4 reported 101 Organic Search sessions. Organic landing-page sessions were concentrated on / (72), /contact (9) and /about (5). The existing `ads_conversion_Submit_lead_form_1` event recorded 64 counts (63 on /contact and 1 on /contact/); these are event counts, not unique enquiries or qualified opportunities.
- GA4 recorded one observed session on `/case-studies/abc-1` (one each for first_visit, session_start, page_view and scroll). This is a route-traffic signal, not evidence that the visit came from search.
- Google Business Profile recorded 169 impressions, 10 website clicks, 1 call click and 40 direction requests. These are profile interactions, not confirmed corporate enquiries.
- The Search Console sitemap connector returned a null path and zero submission/download/error fields; sitemap processing remains unverified and must be checked in the Search Console UI. Query and analytics extracts are connector-cached; forced refresh is unavailable on the connected trial plan.

### Validation and safety

- Re-fetched both modified React components and the two new utility files after their commits; source assertions confirmed the list filter, placeholder route guard, noindex/canonical removal for non-descriptive slugs, and preservation of indexable metadata for descriptive slugs.
- Added `caseStudyVisibility.test.js`; the Jest suite, JSX compilation, full React build and browser/API tests have not been run. No GitHub Actions workflow runs or commit status checks are configured.
- Google Search Central's robots meta documentation confirms that `noindex` prevents a page from appearing in Search and that crawlers must be able to access the page to read the directive: https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag
- No client proof, testimonials, event results, credentials or permissions were invented. No sitemap script, hosting, DNS, redirects, production deployment, merge, outbound campaign, EmpFly or Indo Exhibits code was changed.



## 2026-11-05 — Align case-study detail/list visibility with sitemap duplicate rules

- Reviewed the open sitemap-quality PR #4 on `fix/seo-sitemap-quality-controls` before editing. Its generator excludes a numbered case-study slug only when the unsuffixed base slug also exists, and deduplicates exact slugs.
- Found a parity gap in PR #2: the public case-study list filtered known placeholders only, while the detail page could still set `index, follow` for a numbered duplicate that PR #4 would omit from the sitemap.
- Extended `src/utils/caseStudyVisibility.js` to apply the same base-slug check, exclude exact duplicate entries from the public list, and preserve legitimate numbered slugs when no base slug exists.
- Updated `CaseStudyDetail.js` to check the combined legacy/new case-study indexes only for a loaded slug ending in a numeric suffix. Matching duplicate detail pages remain accessible but receive `noindex, follow` and no canonical; ordinary detail pages do not incur the extra index lookups.
- Added focused tests for numbered duplicate detection, exact duplicate filtering, and preserving legitimate year-like suffixes when the unsuffixed base does not exist. PR #4's branch and sitemap generator were not modified.

### Connected acquisition evidence (last 28 days; latest available extracts on 5 November 2026)

- Search Console query-only extract used `include_fresh_data=true` and returned 107 query/date rows from 8 October–4 November: 41 clicks and 173 impressions. The explicit brand queries `express earth` (23 clicks / 54 impressions) and `expressearth` (18 / 33) account for the 41 returned clicks. Other returned queries account for 86 impressions and zero clicks; anonymised queries may not appear in query rows.
- Priority non-brand query samples: `mice company in gurugram` (10 impressions), `mice companies in gurgaon` (8), `mice agency for corporate events` (4), `mice services for corporates` (4), `incentive travel company india` (4), and `corporate incentive travel companies` (2); all had zero clicks in this extract.
- GA4 last-28-day channel report: 101 Organic Search sessions / 68 active users. Organic landing-page sessions included `/` (77), `/about` (20), `/contact` (20), `/blogs` (12), `/international-destinations` (12), `/gallery` (9), `/corporate-events` (4), `/mice-services` (4) and `/case-studies` (3). The MICE hub now appears in the returned landing-page data; this is an observed session count, not evidence of a ranking change.
- Existing `ads_conversion_Submit_lead_form_1` event: 64 counts (21 Organic Search, 40 Direct, 3 Unassigned; 20 organic events on `/contact` and one on `/contact/`). These are event counts, not unique enquiries, confirmed submissions or A1/A2-qualified opportunities.
- Google Business Profile (7 October–3 November): 169 impressions, 10 website clicks, 1 call click and 40 direction requests. These are profile interactions, not verified corporate enquiries.
- Windsor.ai rejected `force_refresh=true` because the connected subscription is on a trial plan. Search Console was queried with its `include_fresh_data` option; GA4 and GBP are the latest connector-returned extracts, not a guaranteed live refresh.

### Validation and safety

- Re-fetched the helper, focused test file, `CaseStudyDetail.js`, existing `CaseStudyList.js` and this changelog after edits. Twelve source-level assertions passed, covering sitemap-rule parity, list filtering/deduplication, detail-page duplicate lookup, noindex/canonical handling and test coverage.
- Ran `node --check` on the standalone helper and Jest test source; both passed. Ran eight standalone Node runtime assertions for placeholder handling, base/numbered duplicate detection, legitimate numeric suffixes, indexability and list filtering; all passed. The Jest runner, JSX compilation and full React production build were not run because a dependency-backed repository checkout is unavailable.
- No client names, case-study claims, testimonials, results, permissions or credentials were added. PR #4's sitemap generator, production configuration, hosting, DNS, redirects, EmpFly and Indo Exhibits were not changed. No merge, deployment or outbound campaign was performed.


## 2026-11-05 — Case-study page resilience, accessibility and loading

- Added an effect-scoped AbortController to the case-study detail page. Route changes and unmounts now abort pending detail, duplicate-index and destination requests; cancelled requests cannot overwrite the current case-study content, canonical or robots metadata.
- Promoted the case-study title from H2 to H1 and updated its responsive typography selectors.
- Added request cancellation to the case-study listing page so unmounted lists do not apply late API results.
- Added an explicit empty/error state with crawlable links to the contact page and MICE service hub when no public case-study entries can be displayed. The copy distinguishes a source/API failure from a successful empty response.
- Added lazy loading and asynchronous decoding to case-study listing images below the introductory content.
- Added focused component tests for the detail-page H1, request abortion on unmount, listing image loading attributes, API failure fallback and contact/service links.
- These changes do not create case-study claims, testimonials, client names or performance results. Existing API routes and public case-study slugs are unchanged.
- Validation for this batch: changed files were re-fetched after commits; source-level checks verified abort signals on every case-study/detail destination request, cleanup paths, H1/CSS alignment, empty-state links and lazy image attributes. Focused Jest tests were added but require the developer's dependency-backed test/build run; no full React build or live API/browser test was available in this execution.
- Measurement note: the connected 28-day Search Console/GA4/GBP extracts were read from cache on 5 November because the Windsor.ai trial plan rejects forced refresh. Metrics remain observational and GA4 form-event counts are not unique or qualified enquiries.

## 2026-11-05 — Case-study page resilience, accessibility and loading

- Added an effect-scoped AbortController to the case-study detail page. Route changes and unmounts now abort pending legacy/new detail, duplicate-index and destination requests; cancelled requests cannot overwrite current case-study content or SEO metadata.
- Promoted the case-study title from H2 to H1 and updated the responsive typography selectors.
- Added request cancellation to the case-study listing page so unmounted lists do not apply late API results.
- Added an accessible empty/error state to the case-study listing with crawlable links to the contact page and MICE service hub. The copy distinguishes API/source failure from a successful response containing no public records.
- Added lazy loading and asynchronous decoding to case-study listing images and below-the-fold gallery images.
- Added focused component tests for the detail-page H1, request abortion on unmount, listing image loading, API failure fallback and contact/service links.
- These changes do not create case-study claims, testimonials, client names or performance results. Existing API routes and public case-study slugs are unchanged.
- Validation for this batch: source files, CSS and test files were re-fetched after commits; source assertions verified request signals/cleanup paths, H1/CSS alignment, fallback links and lazy image attributes. Focused Jest tests were added but require a dependency-backed test run; the full React build and live API/browser tests were unavailable in this execution.
- Measurement note: connected 28-day Search Console/GA4/GBP extracts were read from cache on 5 November because the Windsor.ai trial plan rejects forced refresh. GA4 form-event counts remain event counts, not unique or qualified enquiries.

## 2026-11-05 — Case-study detail enquiry path

- Added a reusable, visible enquiry section at the end of each loaded case-study detail page. It asks visitors to share programme type, expected group size, preferred dates and destination without inventing project outcomes or client proof.
- Added crawlable links from every public case-study detail page to the existing contact route and MICE service hub.
- Styled the section for desktop/mobile, with 44px minimum action targets, visible keyboard focus and responsive stacked links.
- Added a focused component test for the enquiry heading and both internal destinations.
- This is a conversion-path change only: no API payloads, case-study records, client claims, public slugs, sitemap generator or production configuration changed.

### Latest connected evidence (cached last-28-day extracts, 8 October–4 November 2026)

- GA4: 603 sessions across returned daily channel rows; 101 Organic Search sessions. Organic landing-page sessions were concentrated on the homepage (72), contact (9), not set (6), about (5), Switzerland destination (3), careers (2), and corporate-events (1). The MICE hub did not appear in this particular 28-day landing-page extract.
- Existing `ads_conversion_Submit_lead_form_1`: 64 event counts (21 Organic Search, 40 Direct, 3 Unassigned); 63 on `/contact`, one on `/contact/`. These are event counts, not unique submissions or qualified opportunities.
- Search Console returned 99 query/date rows: 38 clicks and 156 impressions. The explicit brand variants `express earth` and `expressearth` accounted for all 38 returned clicks (83 impressions); other returned queries had 73 impressions and zero clicks. Priority samples: `mice company in gurugram` (9 impressions), `mice companies in gurgaon` (8), `mice agency for corporate events` (3), and `corporate incentive travel companies` (2), all with zero clicks in the extract.
- Search Console page rows include preferred www, apex HTTPS and apex HTTP URLs. The top page rows included the www homepage (52 clicks) and apex HTTP homepage (7 clicks); host consolidation remains a hosting-owner task.
- Google Business Profile: 170 impressions, 10 website clicks, 1 call click and 40 direction requests.
- Windsor.ai `force_refresh=true` was rejected on the connected trial plan; these are cached connector extracts, not guaranteed live refreshes.


## 2026-11-05 — Case-study featured image accessibility and discovery

- Replaced the CSS-only featured-image background on case-study detail pages with a semantic image element. The image now has title-derived alternative text, eager loading and asynchronous decoding; responsive CSS reserves the existing desktop, tablet and mobile banner heights.
- Kept below-the-fold case-study gallery images lazy-loaded. No case-study content, API response shape, URL, client claim, result or permission was changed.
- Added a focused component regression test for the featured image source, accessible name, eager loading and decoding attributes.

### Connected acquisition evidence reviewed for 8 October–4 November 2026

- GA4 returned 101 Organic Search sessions. Organic landing pages: homepage 72 sessions, contact 9, about 5 and corporate events 1; the MICE service hub did not appear in the 10 returned organic landing-page rows. The MICE hub had 17 Direct sessions in the unfiltered landing-page report.
- Search Console query rows returned 41 clicks, all from the visible ExpressEarth brand variants ("express earth" 23 clicks / 54 impressions; "expressearth" 18 / 33). Returned non-brand query rows had impressions but no clicks. Small MICE samples: "mice company in gurugram" 10 impressions (average position 68.8), "mice companies in gurgaon" 8 (76.0), and "mice agency for corporate events" 4 (65.5).
- Search Console page rows showed one click / 9 impressions for the existing 5,000-person employee/family-day case-study URL (average position 1.44) and one click / 17 impressions for the MICE services hub (average position 25.76). These are observed page metrics, not proof that the code changes caused traffic.
- Existing GA4 lead-form event: 64 counts (21 Organic Search, 40 Direct, 3 Unassigned). These are event counts, not unique submissions or A1/A2-qualified opportunities.
- Google Business Profile: 170 impressions, 10 website clicks, 1 call click and 40 direction requests. Two local posts were returned as LIVE (27 October corporate MICE and 2 November corporate offsite).
- Forced refresh was rejected by the connected Windsor.ai trial plan. GA4/GBP and the Search Console fresh-data option therefore remain connector-cached extracts; no live-refresh claim is made.


## 2026-11-05 — Homepage MICE discovery and visitor-initiated enquiry

- Expanded the homepage's priority corporate MICE navigation from four to all six existing commercial programme routes: meetings/conferences, incentive travel, dealer/distributor meets, corporate offsites, corporate events, and exhibitions/trade shows. Verified all six paths against the current React route table.
- Changed the priority-link grid to three columns on desktop, two on tablet and one on mobile so all six services remain visible without a partial second row.
- Removed the five-second automatic enquiry-modal timer. The existing floating enquiry launcher is now visible on initial page load; the popup opens only after a visitor activates it and the launcher returns when the popup is closed. This is a UX hypothesis intended to reduce interruption and keep enquiries visitor-initiated; no conversion lift is claimed.
- Extended the existing homepage component tests to cover all six crawlable service links and the opt-in popup open/close flow.

### Connected acquisition evidence (cached 8 October–4 November 2026)

- GA4: 101 Organic Search sessions / 68 active users. Organic landing pages: homepage 72 sessions, contact 9, about 5, corporate events 1; the MICE services hub did not appear among the returned Organic Search landing pages. It recorded 17 Direct landing sessions in the same report.
- Search Console query report: 42 query rows, 38 clicks and 156 impressions. Explicit brand queries `express earth` (20 clicks / 47 impressions) and `expressearth` (18 / 32) accounted for all returned query clicks. Returned non-brand queries had 77 impressions and zero clicks. MICE examples: `mice company in gurugram` (9 impressions; avg. position 68.2), `mice companies in gurgaon` (8; 76.0), and `mice agency for corporate events` (3; 65.7), all zero clicks.
- Search Console page report: 37 page rows, 74 clicks and 1,167 impressions. The preferred www homepage had 52 clicks / 254 impressions; the apex HTTP homepage had 7 / 162. The apex HTTPS MICE hub had 1 click / 14 impressions (average position 30.3). These host variants remain a hosting-level canonicalisation issue, not something changed in this commit.
- Existing GA4 `ads_conversion_Submit_lead_form_1` event: 64 counts (21 Organic Search, 40 Direct, 3 Unassigned). These are event counts, not unique submissions or A1/A2-qualified opportunities.
- Google Business Profile: 170 impressions, 10 website clicks, 1 call click and 40 direction requests. These are profile interactions, not verified corporate enquiries.
- Windsor.ai forced refresh was rejected because the connected account is on the Trial plan; GA4, Search Console and GBP figures are cached connector extracts. Search Console query and page reports use different dimensions and therefore have different totals.

### Validation and safety

- Re-fetched the modified homepage component, homepage CSS and homepage test after their commits; route table inspection confirmed all six linked paths exist.
- Source assertions verified the initial enquiry launcher, removal of the five-second auto-open timer, all six priority links, responsive 3/2/1-column breakpoints, and regression-test coverage.
- The focused Jest test and full React production build were not run because no dependency-backed checkout is available in this execution. The repository reports no configured GitHub status checks/workflow runs.
- No route, API payload, sitemap generator, analytics configuration, hosting/DNS, production configuration, EmpFly or Indo Exhibits code was changed. No merge, deployment or outbound campaign was performed.


## 2026-11-05 — Corporate enquiry brief qualification

- The main Contact page now asks for a company/organisation and a programme type before accepting a corporate MICE enquiry. Both fields show inline, accessible validation messages; the existing event-type options and Contact API payload remain unchanged.
- Kept expected group size and preferred destination optional to avoid forcing visitors to guess details they may not yet have. The field labels now make those details clearer for the sales team.
- Extracted the two-field validation into `src/utils/corporateEnquiryValidation.js` and added focused tests for blank, whitespace, valid and non-string values.
- This is client-side qualification only. It does not change backend validation, CRM stages, event taxonomy or the definition of an A1/A2 opportunity.

### Connected acquisition evidence reviewed (cached 28-day extracts, 8 October–4 November 2026)

- GA4 property `expressearth.com`: 599 sessions, 101 Organic Search sessions and 79 Organic Search active users. Organic landing-page sessions were homepage 72, `/contact` 9, (not set) 6, `/about` 5, Switzerland destination 3, careers 2, corporate events 1, destinations 1, Maldives destination 1 and unsubscribe 1. The MICE hub had 17 Direct landing sessions and did not appear in the returned Organic Search landing-page rows.
- Existing `ads_conversion_Submit_lead_form_1` event: 64 counts (21 Organic Search, 40 Direct, 3 Unassigned). These are event counts, not unique submissions or qualified CRM opportunities.
- Search Console returned 107 query/date rows, 41 clicks and 173 impressions. The explicit brand queries `express earth` (23 clicks / 54 impressions) and `expressearth` (18 / 33) accounted for the returned query clicks; the connector's branded flag labels these as non-branded, so brand terms were classified manually.
- Priority non-brand samples remained low-volume with zero clicks: `mice company in gurugram` (10 impressions; average position 68.8), `mice companies in gurgaon` (8; 76.0), `mice agency for corporate events` (4; 65.5), `mice services for corporates` (4; 77.5), and `incentive travel company india` (4; 68.3).
- Google Business Profile returned 169 impressions, 10 website clicks, 1 call click and 40 direction requests. Its service list still includes several consumer-travel categories alongside corporate MICE services; this needs an owner decision before any profile cleanup.

### Validation and limitations

- Re-fetched the Contact form, validation helper, test file and changelog after committing; verified required fields, accessible error associations, unchanged API field names and unchanged event-type options.
- Added five focused Jest cases. The Jest runner, JSX compilation and full React production build were not run because this execution has no dependency-backed checkout; the GitHub commit status and workflow-run endpoints returned no checks.
- Forced Windsor.ai refresh was rejected because the connected subscription is on the Trial plan. The GA4, Search Console and GBP figures above are cached connector extracts.
- No backend/API, CRM, GTM configuration, GBP profile, production configuration, hosting/DNS, EmpFly or Indo Exhibits code was changed. No merge, deployment or outbound campaign was performed.


## 2026-11-05 — Capture optional corporate project planning stage

- Added an optional “Current Planning Stage” selector to the main corporate contact form: active brief/RFQ, programme planned and comparing partners, upcoming programme exploring options, or early planning/gathering information.
- Stored the selected value as a short “Planning stage: ...” note inside the existing requirements field. The UI-only project_stage property is removed before the Contact API request, so the existing API payload schema and backend remain unchanged.
- Kept the field optional to avoid adding another required step. Existing free-text requirements are retained after the planning-stage note.
- Added a pure buildContactRequirements helper and six focused regression tests covering existing notes, stage-only entries, empty values, non-string inputs and whitespace handling.
- The selected planning stage is not sent to GA4 or Meta Pixel. It is included only in the existing first-party Contact API requirements field after the visitor submits the form.

### Latest connected acquisition evidence (last 28 days; 8 October–4 November 2026)

- GA4 (property account 503963716): 101 Organic Search sessions and 68 Organic Search active users. Organic landing pages: / 72 sessions, /contact 9, (not set) 6, /about 5, /destinations/switzerland 3, /careers 2, /corporate-events 1, /destinations 1, /destinations/Maldives 1 and /unsubscribe 1.
- Existing GA4 ads_conversion_Submit_lead_form_1 event: 64 counts — Organic Search 20 on /contact, Organic Search 1 on /contact/, Direct 40 on /contact, and Unassigned 3 on /contact. These are event counts, not unique submissions, contacts, or A1/A2-qualified opportunities.
- Search Console returned 42 query rows: 38 clicks / 156 impressions. Explicit ExpressEarth brand variants accounted for 38 clicks / 83 impressions; the other returned queries accounted for 0 clicks / 73 impressions. Priority examples: “mice company in gurugram” (9 impressions, avg. position 68.22), “mice companies in gurgaon” (8, 76.0), “mice agency for corporate events” (3, 65.67), and “corporate incentive travel companies” (2, 52.5), all with zero clicks in this extract.
- Search Console page rows continue to include the preferred www host alongside apex HTTP/HTTPS URLs. Homepage rows include https://www.expressearth.com/ (52 clicks / 254 impressions) and http://expressearth.com/ (7 / 162); host consolidation remains a hosting dependency.
- Google Business Profile: 170 impressions, 10 website clicks, 1 call click and 40 direction requests. These are profile interactions, not verified corporate leads.
- A forced refresh was attempted for Search Console, GA4 and GBP. All three were rejected because the connected Windsor.ai account is on the Trial plan; cached last-28-day extracts were used.

### Validation and safety

- Re-fetched the updated ContactForm component and both new utility files after their commits. Verified the selector is optional, is reset after confirmed success, and is converted into the existing requirements field.
- Verified project_stage is destructured out before the API request; no new backend field or endpoint is introduced.
- Added six Jest tests. The full Jest suite, JSX compilation, React production build and live API/browser test were not run in this environment; the repository has no configured GitHub Actions status checks.
- No backend, GTM, GA4, Meta Pixel, hosting, DNS, sitemap generator, EmpFly or Indo Exhibits changes were made. No campaign was sent and nothing was deployed or merged.
