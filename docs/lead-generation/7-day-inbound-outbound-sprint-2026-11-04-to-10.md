# ExpressEarth 7-Day Inbound + Outbound Lead Generation Sprint
**Sprint:** 4–10 November 2026  
**Market:** Delhi NCR first; expand only after the NCR workflow is producing qualified opportunities.  
**Owner:** ExpressEarth leadership and sales team.  
**Operating principle:** Count verified enquiries and sales-ready opportunities, not scraped names, impressions, clicks, or email opens.

## Outcomes for this sprint
1. Establish one daily pipeline across inbound enquiries, live MICE opportunities, and outbound target accounts.
2. Use Apollo to identify relevant NCR companies and decision-makers; use Smartlead only for campaigns personally approved by the ExpressEarth CEO.
3. Route positive replies and qualified enquiries into EmpFly with an owner and next action.
4. Improve the highest-intent inbound paths on the website and Google Business Profile.
5. Produce a daily scorecard separating inbound, referral/direct, and Apollo/Smartlead outbound.

**Important:** 50 inbound leads/day is a growth ambition, not a credible 7-day forecast. Do not report it as achieved unless 50 unique, contactable inbound enquiries are actually received and deduplicated. Track qualified A1/A2 opportunities separately.

## Qualification definitions
- **A1 — Active brief:** A current RFQ, event brief, dealer meet, conference, incentive tour, offsite, annual day, launch, or group-travel requirement with a known decision-maker/contact and a plausible buying window.
- **A2 — Upcoming project:** A credible upcoming event or incentive requirement supported by public evidence and a relevant business contact, even if the RFQ is not yet open.
- **Nurture:** Relevant company/contact but no evidenced active project or timing. Keep separate from A1/A2.
- **Disqualify:** Vendor/jobseeker, consumer-only enquiry, duplicate, outside service fit, invalid contact, or unsupported assumption.

## Day-by-day execution

### Day 1 — 4 Nov: Access, baseline and funnel readiness
- Confirm staging owner and backend location for the Django integration. Do not put provider credentials in GitHub, chat, source files, or logs.
- Developer configures Apollo and Smartlead secrets in the backend Secret Manager; EmpFly integration-user details are configured separately.
- Keep Smartlead writes, sending, and EmpFly CRM writes disabled until staging checks pass.
- Confirm ExpressEarth sending domains/mailboxes and check SPF, DKIM, DMARC and SMTP health.
- Review website enquiry routes, forms, phone/email visibility, Google Business Profile links and analytics event definitions.
- Create a baseline: last 7/28 days of unique enquiries, source, contactability, A1/A2 status, and response time.

### Day 2 — 5 Nov: High-fit NCR account universe
- Build company searches by sector: pharma/healthcare, automotive/auto ancillary, FMCG, manufacturing/industrial, IT/technology, BFSI/NBFC and funded businesses with dealer/distributor ecosystems.
- Prioritise companies with NCR headquarters or a verifiable NCR office and a plausible event/incentive need.
- Find relevant titles: CHRO/HR Head, Head HR, Admin/Facilities Head, Sales Head, Channel/Dealer Development, Marketing Head, Events/Corporate Communications, Procurement only where appropriate.
- Deduplicate by company domain and contact email. Do not treat Apollo's location guess as proof of decision-maker location.
- Keep an evidence/source note and confidence level for every account.

### Day 3 — 6 Nov: Qualification and first campaign drafts
- Score accounts for NCR presence, sector fit, employee/dealer footprint, public event signal, role relevance, and contact quality.
- Prepare distinct campaigns by use case: dealer/distributor meets; incentive tours; conferences/annual sales meets; corporate offsites and leadership retreats.
- Draft concise, personalised sequences. No generic mass blast and no unsupported client claims.
- Import existing client, vendor, employee and opted-out domains/addresses into local suppression before enrolment.
- Campaigns remain **PENDING CEO APPROVAL**. No sends.

### Day 4 — 7 Nov: Inbound conversion improvements
- Prioritise commercial landing pages for MICE company in Gurgaon/Delhi NCR, dealer meets, incentive travel, conference management, corporate offsites and annual sales conferences.
- Ensure each page has one clear enquiry action, working phone/email, short form, service proof and relevant FAQs.
- Publish one evidence-backed Google Business Profile update and one LinkedIn proof-led post. Use client names/logos only where permission exists.
- Add source attribution to every form/lead: organic search, Google Business Profile, LinkedIn, referral/direct, paid, or other.
- Test form submission through to the actual receiving inbox/CRM; an analytics event alone is not proof of a lead.

### Day 5 — 8 Nov: Staging integration checks
- Run read-only Apollo and Smartlead health checks; verify credit limits and account scope.
- Test Apollo company and people search, deduplication, NCR classification, enrichment status and suppression.
- Verify Smartlead sender mailbox ownership and authentication. Confirm only ExpressEarth sender domains are in scope; do not touch shared-account campaigns for EmpFly or Indo Exhibits.
- Enforce CEO-only campaign approval server-side. A campaign approval must be invalidated by any change to audience, copy, sequence, sender, schedule or material configuration.
- Keep sending and CRM write flags off until the staging checks and CEO approval controls pass.

### Day 6 — 9 Nov: Controlled pilot preparation
- Prepare a small internal-only test campaign using approved ExpressEarth mailboxes and internal test addresses.
- Verify audit records: who approved, when, campaign version/configuration, sender verification and send state.
- Test replies, bounce and unsubscribe webhook handling, suppression, duplicate event handling and EmpFly outbox sync in staging.
- Verify a positive reply creates/updates the correct EmpFly company/lead, assigns an owner and creates a follow-up task.
- Do not send external outreach if any gate or webhook test fails.

### Day 7 — 10 Nov: Review and next sprint
- Review actual inbound enquiries, A1/A2 opportunities, verified outbound contacts, positive replies, meetings booked, and EmpFly task completion.
- Separate volume from quality: report invalid emails, bounces, unsubscribes, duplicates and unqualified responses.
- Keep only the sectors, messages, landing pages and channels that show evidence of qualified demand.
- Agree the next 14-day activity plan based on measured conversion, not assumed lead counts.

## Daily sales operating rhythm
- 9:30 AM: 15-minute pipeline stand-up; review new enquiries, A1/A2 signals and overdue follow-ups.
- 11:00 AM: Data verification and account/contact assignment.
- 12:30 PM: Personalised outreach preparation and CEO approval queue.
- 3:00 PM: Sales calls, discovery and proposals; record every next step in EmpFly.
- 5:30 PM: Reconcile replies, form submissions, CRM records and next-day actions.

## Daily scorecard
Report these separately:
- Inbound: unique enquiries; contactable enquiries; A1; A2; source; response time.
- Outbound: new target accounts; verified decision-makers; campaigns awaiting CEO approval; sends (only after approval); positive replies; meetings.
- Quality: duplicate rate; invalid email rate; bounce rate; unsubscribe count; suppressed contacts blocked.
- Revenue pipeline: qualified briefs; proposal value; expected decision date; owner; next action.
- Website: organic non-brand clicks, landing-page enquiries, completed forms confirmed in inbox/CRM, and GBP actions.

## Non-negotiable safety gates
- Never share API keys in chat, GitHub, frontend code, spreadsheets or logs.
- No autonomous campaign approval or sending. CEO approval is required for every campaign.
- No sending until the staging demonstration passes and the CEO explicitly approves the campaign.
- Reapproval is required after material campaign changes.
- Respect opt-outs, bounces, existing-client/vendor exclusions and applicable email/privacy rules.
- Do not claim 50 inbound leads/day until measured unique inbound enquiries support that figure.
- No production deployment or live sending without explicit developer/CEO release approval.

## Dependencies and ownership
- **Developer:** install the Django app in the actual backend, configure Secret Manager, migrations, URL routes, staging deployment, background jobs and sanitised test evidence.
- **ExpressEarth CEO:** confirm the final sender domains/mailboxes and personally approve each campaign.
- **Sales team:** verify account fit, research event signals, personalise outreach, respond quickly and maintain EmpFly next actions.
- **Marketing/website owner:** publish and QA landing pages, GBP updates, proof assets and analytics attribution.
