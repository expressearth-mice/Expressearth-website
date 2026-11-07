import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const services = [
  {
    number: "01",
    title: "Corporate MICE Management",
    description:
      "A single coordination partner for meetings, incentives, conferences and exhibitions—from the first brief through on-ground delivery.",
    href: "/mice-services",
    tag: "End-to-end programmes",
  },
  {
    number: "02",
    title: "Incentive Travel",
    description:
      "Reward and recognition journeys for sales teams, channel partners and employees, in India and international destinations.",
    href: "/incentive-travel",
    tag: "India + international",
  },
  {
    number: "03",
    title: "Dealer & Distributor Meets",
    description:
      "Business meets and channel-partner programmes with venue, delegate, hospitality, production and travel coordination.",
    href: "/dealermeet",
    tag: "Channel engagement",
  },
  {
    number: "04",
    title: "Conferences & Leadership Meets",
    description:
      "Annual conferences, leadership gatherings, sales meets and business forums planned around your agenda and audience.",
    href: "/meetings-and-conferences",
    tag: "Business-led events",
  },
  {
    number: "05",
    title: "Corporate Offsites",
    description:
      "Team retreats and leadership offsites with destination, stay, transport, meals, activities and group logistics coordinated.",
    href: "/corporateoffsites",
    tag: "Team experiences",
  },
  {
    number: "06",
    title: "Exhibitions & Trade Shows",
    description:
      "Planning and coordination support for exhibition participation, trade-show requirements and business event delivery.",
    href: "/exhibitions-and-trade-shows",
    tag: "Brand presence",
  },
];

const planningSteps = [
  ["01", "Understand the brief", "We align on business objective, audience, group size, dates, destination and budget parameters."],
  ["02", "Build the programme", "We shape the itinerary or event plan, recommend suitable options and map the delivery requirements."],
  ["03", "Coordinate every detail", "Travel, venues, hotels, production, delegate communication and suppliers are brought into one plan."],
  ["04", "Deliver on ground", "The team coordinates execution, handles live changes and keeps the programme moving to plan."],
];

const faqs = [
  {
    question: "What does a corporate MICE company do?",
    answer:
      "A corporate MICE partner plans and coordinates meetings, incentive travel, conferences and exhibitions. Depending on the brief, this can include venue sourcing, hotels, flights, transfers, delegate communication, event production and on-ground coordination.",
  },
  {
    question: "Does ExpressEarth manage corporate events in Delhi NCR?",
    answer:
      "ExpressEarth is based in Gurugram and supports corporate MICE and event programmes across Delhi NCR, other parts of India and selected international destinations.",
  },
  {
    question: "Can you organise dealer and distributor meets?",
    answer:
      "Yes. Dealer and distributor programmes can include venue and hotel coordination, travel, delegate logistics, stage and AV requirements, branding, hospitality and event-day coordination.",
  },
  {
    question: "Can you manage international incentive trips for Indian companies?",
    answer:
      "ExpressEarth plans international group programmes with destination selection, hotel and travel coordination, transfers, experiences, documentation guidance and on-ground arrangements. The final plan depends on group profile, dates, budget and destination requirements.",
  },
  {
    question: "What information should we share to get a proposal?",
    answer:
      "Share the programme objective, approximate group size, preferred dates, destination or event city, duration, budget range and key inclusions. If some details are not final, an initial brief is still enough to begin a discussion.",
  },
  {
    question: "Does ExpressEarth work outside Delhi NCR?",
    answer:
      "Yes. Delhi NCR is the starting point for our corporate outreach, while programme planning and delivery can extend across India and international destinations, subject to scope and destination feasibility.",
  },
];

function Home() {
  return (
    <main className="ee-home">
      <section className="ee-hero" aria-labelledby="ee-home-title">
        <img
          className="ee-hero-image"
          src="/Images/Expressearth%20website%20images/HOME/Banner%20image/A.avif"
          alt="Corporate event setting prepared for a business gathering"
          fetchPriority="high"
        />
        <div className="ee-hero-shade" />
        <div className="ee-hero-content">
          <p className="ee-eyebrow ee-eyebrow-light">CORPORATE MICE · EVENTS · INCENTIVE TRAVEL</p>
          <h1 id="ee-home-title">Corporate MICE &amp; Event Management Company in Delhi NCR</h1>
          <p className="ee-hero-lede">
            One accountable partner for corporate events, conferences, dealer meets,
            offsites and incentive travel—across Delhi NCR, India and international destinations.
          </p>
          <div className="ee-hero-actions">
            <Link className="ee-button ee-button-primary" to="/contact">Plan your programme <span aria-hidden="true">↗</span></Link>
            <a className="ee-button ee-button-ghost" href="tel:+919266056660">Speak to our team</a>
          </div>
          <p className="ee-hero-footnote">Gurugram-based team · Corporate programmes across India</p>
        </div>
        <div className="ee-hero-side-note" aria-hidden="true">IDEAS INTO EXPERIENCES</div>
      </section>

      <section className="ee-intro ee-section">
        <div className="ee-intro-label">
          <span className="ee-section-kicker">THE EXPRESS EARTH APPROACH</span>
          <span className="ee-intro-line" />
        </div>
        <div className="ee-intro-copy">
          <h2>Complex corporate programmes. <em>One coordinated plan.</em></h2>
          <p>
            A corporate programme is more than a venue or a flight booking. It is a connected
            experience involving people, schedules, suppliers, movement and live decisions.
            ExpressEarth brings the planning and coordination together so your team can stay
            focused on the business purpose of the programme.
          </p>
          <Link className="ee-text-link" to="/about">Get to know ExpressEarth <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="ee-services ee-section" aria-labelledby="ee-services-title">
        <div className="ee-section-heading">
          <div>
            <span className="ee-section-kicker">WHAT WE PLAN &amp; MANAGE</span>
            <h2 id="ee-services-title">Corporate experiences, <em>built around your objective.</em></h2>
          </div>
          <p>Choose the programme you are planning. We will help shape the scope, logistics and delivery plan.</p>
        </div>
        <div className="ee-service-grid">
          {services.map((service) => (
            <article className="ee-service-card" key={service.number}>
              <div className="ee-service-top"><span>{service.number}</span><span className="ee-service-tag">{service.tag}</span></div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to={service.href} aria-label={`Explore ${service.title}`} className="ee-card-link">Explore service <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="ee-band">
        <div className="ee-band-inner">
          <div>
            <span className="ee-section-kicker ee-eyebrow-light">BUILT FOR CORPORATE TEAMS</span>
            <h2>From a focused leadership offsite to a multi-city corporate programme.</h2>
          </div>
          <p>
            We work with briefs that involve leadership teams, sales organisations, dealer and
            distributor networks, employee groups and business delegates. The programme is
            planned around your audience—not a one-size-fits-all package.
          </p>
        </div>
      </section>

      <section className="ee-process ee-section" aria-labelledby="ee-process-title">
        <div className="ee-section-heading ee-process-heading">
          <div>
            <span className="ee-section-kicker">HOW WE WORK</span>
            <h2 id="ee-process-title">A clear route from <em>brief to delivery.</em></h2>
          </div>
          <Link className="ee-text-link" to="/contact">Start with your brief <span aria-hidden="true">→</span></Link>
        </div>
        <div className="ee-process-grid">
          {planningSteps.map(([number, title, description]) => (
            <article className="ee-process-step" key={number}>
              <span className="ee-process-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ee-local ee-section">
        <div className="ee-local-copy">
          <span className="ee-section-kicker">DELHI NCR FIRST. INDIA NEXT.</span>
          <h2>Your corporate MICE partner in <em>Gurugram.</em></h2>
          <p>
            Based in Gurugram, ExpressEarth works with corporate teams across Delhi, Gurugram,
            Noida, Faridabad and the wider NCR. For programmes beyond the region, our planning
            extends to destinations across India and international group travel.
          </p>
          <div className="ee-location-pills">
            <span>Gurugram</span><span>Delhi</span><span>Noida</span><span>Faridabad</span><span>Pan-NCR</span>
          </div>
          <Link className="ee-button ee-button-dark" to="/contact">Discuss your requirement <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="ee-local-panel">
          <span className="ee-panel-index">EE / NCR</span>
          <p className="ee-panel-statement">Local understanding.<br /><em>Wider reach.</em></p>
          <p className="ee-panel-caption">Corporate programme planning and coordination from Gurugram, India.</p>
        </div>
      </section>

      <section className="ee-faq ee-section" id="home-faqs" aria-labelledby="ee-faq-title">
        <div className="ee-faq-heading">
          <span className="ee-section-kicker">GOOD QUESTIONS, CLEAR ANSWERS</span>
          <h2 id="ee-faq-title">Before you plan your <em>next programme.</em></h2>
          <p>Useful starting points for corporate teams evaluating an event, offsite or incentive travel partner.</p>
        </div>
        <div className="ee-faq-list">
          {faqs.map((faq, index) => (
            <details className="ee-faq-item" key={faq.question} open={index === 0}>
              <summary>{faq.question}<span aria-hidden="true">+</span></summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="ee-final-cta">
        <div>
          <span className="ee-section-kicker ee-eyebrow-light">LET'S PLAN SOMETHING MEANINGFUL</span>
          <h2>Tell us what your organisation is planning.</h2>
          <p>Share the objective, group size and tentative dates. We will take it from there.</p>
        </div>
        <div className="ee-final-actions">
          <Link className="ee-button ee-button-light" to="/contact">Start an enquiry <span aria-hidden="true">↗</span></Link>
          <a href="mailto:enquiry@expressearth.com">enquiry@expressearth.com</a>
        </div>
      </section>
    </main>
  );
}

export default Home;
