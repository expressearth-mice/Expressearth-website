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
