# ExpressEarth SEO / AEO / GEO Changelog

## 2026-10-28

- Fixed the main contact form's success handling so boolean `true` responses are accepted, while an explicit string `"false"` is not; corrected the contact logo URL and removed an unused import.
- Improved the MICE services page heading and service descriptions with clearer corporate-intent language; replaced a nested button/link with one accessible contact link.
- Repaired incentive-travel enquiry links, including a CTA that previously pointed to a missing page fragment.
- Fixed destination-category fetching to use Axios response data; added links from the category index to category pages and route-specific metadata for those pages.
- Extended the sitemap generator to include category URLs returned by the API.
- Expanded robots.txt exclusions to cover additional admin/editor route variants.
- Removed the duplicate public route for case-study creation so the existing role-gated route is authoritative.

### Validation and deployment

- Re-fetched every changed file after committing and verified the intended edits.
- A production build and automated tests were not run in this environment: the repository could not be cloned due to unavailable network access, and the repository currently reports no GitHub Actions workflow runs.
- These are repository changes only. Production rendering, Search Console indexing, analytics, and lead outcomes still require validation after the developer copies the changes to the live environment.
