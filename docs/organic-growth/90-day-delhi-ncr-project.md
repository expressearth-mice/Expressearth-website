# ExpressEarth Organic Growth Project — Delhi NCR

**Project duration:** 90 days  
**Phase 1:** Days 1–30 — testing, instrumentation and baseline validation  
**Phase 2:** Days 31–60 — build and optimise validated acquisition paths  
**Phase 3:** Days 61–90 — scale the pages and channels that produce qualified opportunities

## Outcome

Build a measurable organic acquisition system for corporate MICE buyers with a Delhi NCR connection. The long-term ambition is 50 sales-ready MICE opportunities per day. This is a target, not a forecast or a 90-day guarantee.

Apollo and Smartlead are excluded from organic attribution; they belong to the separate outbound engine.

## What counts as a sales-ready opportunity

Count only a unique, human, corporate opportunity that:
- has a verifiable company or organisation;
- has a Delhi NCR buying-team, office or operating connection;
- has a specific MICE requirement (offsite, incentive travel, dealer/distributor meet, conference, annual day, product launch, exhibition or corporate event);
- shows active intent through an event brief/RFQ or a confirmed upcoming project; and
- has enough valid contact information for a salesperson to take a concrete next step.

**A1:** active brief/RFQ received.  
**A2:** upcoming project confirmed and relevant business contact identified.  
Only A1 + A2 count toward the 50/day outcome. Downloads, generic contact forms, vendors, job seekers, duplicates and unverified form events do not count.

## Phase 1 — Days 1–30: test and establish the baseline

No volume claims and no broad content production before tracking and conversion paths are validated.

### Workstreams
1. **Measurement integrity**
   - Verify Google Search Console property, domain/canonical host, sitemap submission and indexing coverage.
   - Verify GA4 organic landing-page sessions and event definitions.
   - Test every public enquiry form on desktop and mobile; verify successful submission, confirmation, notifications and CRM receipt.
   - Reconcile GA4 form events against unique, valid enquiries in EmpFly.
   - Preserve first-touch source, landing page, campaign/referrer and final conversion source.
   - Exclude internal traffic, spam, duplicate submissions and test leads from reporting.

2. **Technical SEO**
   - Crawl public URLs and check status codes, redirect chains, canonicals, robots directives, titles, descriptions, headings, internal links, image alt text and mobile rendering.
   - Validate sitemap URLs against actual published, canonical, indexable pages.
   - Identify duplicate, thin, draft/test or orphaned URLs before changing/removing them.
   - Validate structured data for consistency with visible page content.
   - Assess JavaScript rendering and whether key content and metadata are available to search crawlers.

3. **NCR search-demand test**
   - Build a keyword-to-page map for Gurgaon/Gurugram, Delhi, Noida, Greater Noida, Faridabad and Manesar.
   - Cluster terms by service and buying intent: MICE agency, corporate event management, offsites, dealer meets, conferences, incentive travel, annual days, product launches and exhibitions.
   - Record current rankings/impressions/clicks and landing-page performance before making major content changes.
   - Prioritise only terms with plausible corporate buying intent and a real ExpressEarth service match.

4. **Conversion test**
   - Establish separate journeys for corporate events, offsites, incentive travel, conferences/dealer meets and exhibitions.
   - Test form friction, field validation, mobile completion, thank-you states and lead routing.
   - Test call and WhatsApp links and record them as distinct conversion actions.
   - Score leads using the A1/A2 rules above.

### Phase 1 exit criteria
- All priority forms pass end-to-end tests.
- Form submissions can be reconciled to unique EmpFly records.
- Organic source and landing page are retained for each lead.
- Search Console, GA4 and CRM reporting definitions are documented.
- A verified technical SEO issue list exists, ranked by impact and implementation risk.
- A baseline is published for organic sessions, valid enquiries, A1/A2 opportunities and qualified conversion rate.

## Phase 2 — Days 31–60: build validated acquisition paths

- Fix verified technical issues from Phase 1.
- Improve existing high-intent service pages before creating new URLs.
- Publish NCR-specific pages only where there is unique local relevance and useful original information.
- Build industry-specific pages for pharma, automotive/auto ancillary, FMCG, manufacturing, IT/technology and BFSI only where ExpressEarth has relevant delivery capability and evidence.
- Turn completed projects into substantive, client-approved case studies with scope, group size, challenge, execution and outcomes.
- Add buyer-focused FAQs and useful planning resources; implement relevant structured data only where it matches visible content.
- Improve internal links from case studies, destination guides and articles to matching service/enquiry pages.

## Phase 3 — Days 61–90: scale what converts

- Expand only keyword clusters and landing-page patterns that have shown qualified demand.
- Repurpose approved project evidence into LinkedIn and YouTube content; attribute assisted conversions separately.
- Develop relevant referral relationships with NCR hotels, venues, DMCs and corporate service partners; label referrals separately from search.
- Run controlled conversion tests on priority landing pages and forms.
- Review lead quality and pipeline outcomes by original source, service, location and landing page.
- Stop or revise content that attracts irrelevant traffic or no meaningful buyer engagement.

## Reporting definitions

Report weekly and monthly:
- Organic search clicks and impressions (Search Console).
- Organic landing-page sessions (GA4).
- Valid unique organic enquiries.
- A1 and A2 opportunities.
- A1/A2 per 100 organic sessions.
- Lead-to-meeting, meeting-to-RFQ, RFQ-to-proposal and proposal-to-win rates where data exists.
- Pipeline value, won revenue and gross profit attributed to organic acquisition.
- Performance by service, NCR geography, landing page and first-touch source.

Do not combine organic, paid, Apollo/Smartlead outbound, direct, referral or unknown sources into one organic number. Do not equate impressions, sessions, clicks, AI mentions, button clicks or raw form events with sales-ready opportunities.

## Initial repository observations — to validate during Phase 1

- The frontend is a Create React App application.
- Route metadata is currently set client-side in src/App.jsx; verify how public pages render for Google and other crawlers before deciding whether pre-rendering or server rendering is required.
- public/index.html contains site-wide Organization/WebSite JSON-LD and a generic page title/description; route-specific metadata is added at runtime.
- scripts/generate-sitemap.js combines static routes with content from multiple API endpoints. The generated sitemap contains repeated-looking case-study slugs and placeholder-looking case-study URLs (for example, abc, abc-1, abc-2, abcd). Confirm publication status and canonical URLs before removal.
- The sitemap generator includes API-returned blog/case-study/category records based on slug/ID; verify that only published, indexable records are emitted.
- The robots file points to https://www.expressearth.com/sitemap.xml; verify the live canonical host and redirects.
- The existing sitemap, robots file and metadata are not proof that Google has indexed or correctly rendered those URLs.

These are repository observations, not claims about the live production site. All changes must be reviewed and tested on a non-production branch before deployment.
## Initial measurement snapshot — 6 October to 2 November 2026

Connected Search Console domain property (sc-domain:expressearth.com):
- 35 clicks and 148 impressions in the query-level extract returned for this period.
- The 35 clicks were on the brand queries `express earth` (17) and `expressearth` (18). The highest non-brand NCR MICE terms in the extract included `mice companies in gurgaon` (8 impressions), `mice company in gurugram` (7), and `mice company in gurgaon` (2), all with zero clicks.
- This indicates that non-brand search visibility is still very small in this extract. Treat this as a connector-returned query snapshot, not a complete Search Console export.
- Search Console rows included several URL variants: http, apex HTTPS, www HTTPS, plus dev and B2C subdomains. Validate canonical host, redirects, property scope and environment leakage before changing URLs.

Connected GA4 property 503963716:
- 590 sessions in the returned report; 89 were classified as Organic Search.
- The form key-event metric returned 49 event counts across all channels; 18 were attached to Organic Search rows. These are event counts, not unique people, unique form submissions, CRM leads or sales-ready opportunities.
- GA4 city rows labelled Delhi, New Delhi, Gurugram, Gurgaon/Noida/Faridabad and nearby NCR cities summed to 90 sessions and 15 form key-event counts. This is directional only: GA4 city is an IP-derived location signal, not proof of a company's buying-team location, and the event counts are not qualified leads.
- The GA4 report includes sessions from numerous non-NCR and international cities, so channel and geography filtering must be applied before using the data to judge the NCR organic programme.

Live fetch/render check:
- The public homepage fetch returned the Create React App JavaScript fallback text (`You need to enable JavaScript to run this app`) to the inspection crawler. This does not prove Google cannot render the site, but it makes rendered-HTML testing a Phase 1 priority, particularly for non-Google AI crawlers.
- Live robots.txt and sitemap.xml could not be retrieved by the inspection interface in this check. Validate them with a direct technical crawl and Search Console.

**Interpretation:** current available data does not establish any volume of A1/A2 opportunities. The first 30 days must reconcile analytics events with EmpFly records and validate organic traffic, NCR relevance and page rendering before growth targets are forecast.
