import React from "react";
import { Link } from "react-router-dom";
import ServiceStructuredData from "./ServiceStructuredData";

const faqs = [
  { question: "What does an employee family day event usually include?", answer: "A family day can include a welcome and registration area, stage programme, employee recognition, family-friendly activities, food and refreshments, and coordinated guest movement. The final format depends on the audience, venue, schedule and budget." },
  { question: "Can ExpressEarth plan a family day for employees and their children?", answer: "ExpressEarth can coordinate a programme for employees and accompanying family members, including age-appropriate activity zones, entertainment, hospitality and event logistics based on the brief and selected suppliers." },
  { question: "Where can a corporate family day be organised in Delhi NCR?", answer: "Venue options may include indoor event spaces, outdoor lawns, resorts or other suitable venues across Gurugram, Delhi, Noida and the wider NCR. Venue suitability depends on the expected attendance, season, activities and access requirements." },
  { question: "What does the event management scope cover?", answer: "Depending on the agreed scope, coordination can include concept and programme planning, venue sourcing, stage and AV, activities, branding, registration, catering coordination, transport, supplier management and event-day operations." },
  { question: "What information should we share to receive a family day proposal?", answer: "Share your company name, preferred date or month, expected number of employees and family members, preferred city or venue type, programme duration, age groups attending, budget range and any accessibility or operational requirements." },
];

const serviceDescription =
  "ExpressEarth plans employee and corporate family day events in Delhi NCR and across India. Event coordination can include programme design, venue sourcing, stage and AV, family-friendly activities, branding, hospitality, guest registration, transport and on-ground operations based on the brief.";

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

export default function FamilyDayEvents() {
  return (
    <main className="container py-5">
      <ServiceStructuredData
        name="Employee and Corporate Family Day Event Management"
        serviceType="Employee family days, corporate family events and employee engagement events"
        description={serviceDescription}
        url="https://www.expressearth.com/family-day-events"
      />
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      <header className="row align-items-center g-4 py-4">
        <div className="col-lg-8">
          <p className="text-uppercase fw-semibold text-primary mb-2">Corporate events · Employee engagement · Delhi NCR</p>
          <h1 className="display-5 fw-bold">Employee Family Day Event Management in Delhi NCR</h1>
          <p className="lead mt-3">
            Bring employees and their families together with a well-planned company family day.
            ExpressEarth coordinates the event format, venue, activities, production, hospitality
            and on-ground logistics around your organisation’s brief.
          </p>
          <Link to="/contact?service=family_day_events" className="btn btn-primary btn-lg mt-2">Plan Your Company Family Day</Link>
        </div>
        <div className="col-lg-4">
          <div className="border rounded-3 p-4 h-100">
            <h2 className="h4">Share your event brief</h2>
            <p className="mb-0">Tell us the expected attendance, age groups, preferred date, location and programme objectives to discuss a suitable format.</p>
          </div>
        </div>
      </header>
      <section className="py-4" aria-labelledby="family-day-formats">
        <h2 id="family-day-formats" className="h2 mb-3">Corporate family day formats</h2>
        <p>
          Each organisation has a different audience and culture. The event can be designed as a
          family carnival, an annual employee celebration, a themed engagement day or a company
          milestone event. Activities and production are selected to suit the venue, season,
          attendance and age groups.
        </p>
        <div className="row g-3 mt-1">
          {[
            ["Family carnival and activity zones", "Plan activity areas and entertainment for employees and accompanying family members, with age groups and venue layout considered."],
            ["Stage programme and recognition", "Coordinate hosting, performances, employee recognition, leadership addresses, sound and visual production."],
            ["Food, hospitality and guest services", "Plan catering coordination, registration, welcome desks, guest communication and attendee movement."],
            ["Venue, transport and event operations", "Coordinate venue options, access, transport requirements, supplier schedules and event-day operating plans."],
          ].map(([title, description]) => (
            <div className="col-md-6" key={title}>
              <article className="h-100 border rounded-3 p-4">
                <h3 className="h5">{title}</h3>
                <p className="mb-0">{description}</p>
              </article>
            </div>
          ))}
        </div>
      </section>
      <section className="py-4" aria-labelledby="family-day-planning">
        <h2 id="family-day-planning" className="h2 mb-3">Planning a company family day in Gurugram, Delhi or Noida</h2>
        <p>
          ExpressEarth is based in Gurugram and supports corporate programmes across Delhi NCR and
          India. Venue and programme recommendations are shaped around expected attendance,
          employee and family mix, preferred date, travel needs, activity plan and budget.
        </p>
        <ol>
          <li>Confirm the objective, audience, date window and attendance estimate.</li>
          <li>Shortlist suitable indoor or outdoor venue options and review access needs.</li>
          <li>Agree the event flow, activity zones, stage programme and hospitality scope.</li>
          <li>Coordinate suppliers, guest communication, logistics and event-day responsibilities.</li>
        </ol>
      </section>
      <section className="py-4" aria-labelledby="family-day-faqs">
        <h2 id="family-day-faqs" className="h2 mb-3">Employee family day event FAQs</h2>
        <div className="d-grid gap-3">
          {faqs.map(({ question, answer }) => (
            <details className="border rounded-3 p-3" key={question}>
              <summary className="fw-semibold">{question}</summary>
              <p className="mt-2 mb-0">{answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="border rounded-3 p-4 my-4">
        <h2 className="h3">Planning a wider corporate event?</h2>
        <p>Explore ExpressEarth’s corporate event management, conference management and corporate offsite services.</p>
        <div className="d-flex flex-wrap gap-3">
          <Link to="/corporate-events">Corporate event management</Link>
          <Link to="/conferencemanagement">Conference management</Link>
          <Link to="/corporateoffsites">Corporate offsites</Link>
        </div>
        <Link to="/contact?service=family_day_events" className="btn btn-primary mt-3">Contact ExpressEarth</Link>
      </section>
    </main>
  );
}
