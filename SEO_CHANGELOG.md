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
- Updated the corporate offsite page H1 for Delhi NCR intent and added a visible FAQ explaining the confirmed ₹7,000 starting package: 1 night / 2 days, 40–100 people, twin-share stay, all meals, round-trip transportation, taxes extra. The page lists Mussoorie, Jim Corbett, Jaipur, Pushkar, Nainital, Dharamshala, Shimla, Kasauli, Kufri and Manali.
- Updated the offsite route's meta description to match the confirmed offer and its qualifications.
- Updated the sitemap generator to follow same-origin paginated API responses, while detecting loops and refusing pagination links to a different host; failed retrieval still preserves the existing sitemap.
- Fixed the homepage "Home Page Loaded" analytics effect so it fires once on mount rather than after every render.
- Removed duplicate Font Awesome CDN stylesheet requests because the app already imports the installed local Font Awesome package; removed the duplicate Google Fonts preconnect pair and a duplicate Bootstrap CSS import.
- Re-fetched each changed source file after its commit and checked the intended copy, links, package details and effect dependency.

### Validation and outstanding checks

- Repository API reports no GitHub Actions workflow runs. A local clone/build could not be run because this environment could not resolve github.com; no build or test result is claimed.
- Review found the current public/index.html loads gtag.js using a GTM- container ID and calls gtag('config', 'GTM-...'). Google's current guidance distinguishes a Google tag ID (for example G-... / GT-...) from a Tag Manager container ID (GTM-...). Do not change this blindly: the owner/developer must confirm whether the intended setup is GA4 gtag.js, Google Tag Manager, or both, and provide the GA4 Measurement ID plus GTM container access/configuration as applicable. Verify with Tag Assistant after correction.
- Changes remain in the development repository only. Production rendering, form submissions, analytics events and Search Console indexing must be checked after the developer deploys the changes.
