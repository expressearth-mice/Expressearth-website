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


## 2026-11-07 — Corporate-first homepage refresh

- Replaced the rotating, generic homepage hero and long mixed homepage layout with a focused corporate MICE acquisition page led by the Delhi NCR search intent.
- Added six clear service pathways: MICE management, incentive travel, dealer/distributor meets, conferences, corporate offsites, and exhibitions/trade shows.
- Added concise programme positioning, a four-step planning process, a Gurugram/Delhi NCR service-area section, six visible buyer FAQs, and enquiry/telephone/email calls to action.
- Removed unverified homepage counters (including client, event and partner totals) rather than publishing claims without evidence.
- Removed the automatic five-second enquiry popup; visitors can now choose when to start an enquiry.
- Reused the existing homepage hero asset and existing routes; no backend, CRM, client data, or other business systems were changed.
- Validation: source files were re-fetched from the feature branch after the edits. A dependency-backed JSX compile, Jest run, responsive browser review and production build have not yet been run in this environment. This change is a review PR only and has not been merged or deployed.


## 2026-11-07 — Homepage asset, metadata and AI crawler refinements

- Corrected the homepage hero image URL to the exact existing asset path in the repository.
- Removed an unsupported group-size example from the homepage headline.
- Aligned the homepage route title and description with the corporate MICE / Delhi NCR positioning.
- Added a static homepage canonical link so the initial HTML has an explicit preferred homepage URL before React route metadata runs.
- Expanded Organization structured data with verified public contact details and the stated Delhi NCR service cities, alongside India-wide coverage.
- Explicitly allowed OAI-SearchBot in robots.txt while retaining the existing general crawler policy and admin-path exclusions.
- Validation: source and asset paths checked against the repository tree; build and live crawler verification remain outstanding.

- Follow-up QA validated the JSON-LD syntax and preserved all existing admin-path exclusions in both the general crawler group and the OAI-SearchBot group.
