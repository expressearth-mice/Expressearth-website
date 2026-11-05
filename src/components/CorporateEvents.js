import React from "react";
import { Briefcase, Rocket, Award, Wine, Users } from "lucide-react";
import { Link } from "react-router-dom";
import "./CorporateEvents.css";
import HorizontalSlider from "./ui/HorizontalSlider";
import ServiceStructuredData from "./ServiceStructuredData";

const serviceDescription =
  "ExpressEarth plans corporate event programmes in Delhi NCR and across India, including product launches, annual day celebrations, employee family days, gala dinners, award ceremonies and networking events. Coordination can include venue planning, production, branding, guest logistics and on-ground event operations based on the brief.";

const eventServices = [
  {
    icon: <Wine size={28} className="service-icon" />,
    title: "Gala Dinners & Milestone Celebrations",
    description:
      "Coordinate venue, lighting, decor, entertainment, cuisine and guest logistics for corporate dinners and milestone events.",
  },
  {
    icon: <Users size={28} className="service-icon" />,
    title: "Networking Events & Business Mixers",
    description:
      "Plan business gatherings with venue layouts, registration, guest communication, hospitality and event-day coordination.",
  },
  {
    icon: <Award size={28} className="service-icon" />,
    title: "Corporate Anniversaries",
    description:
      "Develop event formats for company milestones, including programme flow, stage content, branding and guest arrangements.",
  },
  {
    icon: <Rocket size={28} className="service-icon" />,
    title: "Product Launches & Brand Activations",
    description:
      "Coordinate launch venues, product presentation areas, staging, AV, branding and attendee movement around the launch brief.",
  },
  {
    icon: <Award size={28} className="service-icon" />,
    title: "Award Ceremonies",
    description:
      "Plan award-night formats with stage and AV, award presentation flow, guest management, hospitality and production requirements.",
  },
];

const deliveryScope = [
  "Confirm the event objective, audience, format, destination, dates and budget.",
  "Coordinate venue options, staging, AV, lighting, branding and event production based on the brief.",
  "Plan guest registration, travel, accommodation, hospitality and attendee communication where required.",
  "Agree supplier responsibilities, the event schedule and event-day operating contacts.",
];

const relatedServices = [
  { label: "Dealer & distributor meets", to: "/dealermeet" },
  { label: "Meetings & conferences", to: "/meetings-and-conferences" },
  { label: "Corporate offsites", to: "/corporateoffsites" },
  { label: "Incentive travel", to: "/incentive-travel" },
];

const CorporateEvents = () => {
  return (
    <div className="corporate-events-container">
      <ServiceStructuredData
        name="Corporate Event Management"
        serviceType="Corporate events, product launches, annual days and employee events"
        description={serviceDescription}
        url="https://www.expressearth.com/corporate-events"
      />

      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url('/Images/Expressearth website images/Corporate/corporate.avif')",
        }}
      >
        <h1>Corporate Event Management in Delhi NCR</h1>
        <h4>Product Launches | Annual Days | Employee Family Days | Conferences</h4>
        <Link to="/contact?service=corporate_events" className="cta-button">
          Discuss Your Corporate Event
        </Link>
      </section>

      <section className="intro-section">
        <h2>
          <Briefcase size={32} /> Corporate Events Planned Around Your Brief
        </h2>
        <p className="text-cen">{serviceDescription}</p>
      </section>

      <section className="signature-services">
        <h2>
          <Rocket size={32} /> Corporate Event Formats
        </h2>
        <p>
          Choose a format and share the audience, objective, location, dates
          and production requirements. The agreed scope can then be shaped
          around your programme.
        </p>

        <HorizontalSlider className="services-grid" itemCount={eventServices.length}>
          {eventServices.map((service) => (
            <div className="service-item" key={service.title}>
              {service.icon}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to="/contact?service=corporate_events" className="cta-link">
                Discuss This Event Format
              </Link>
            </div>
          ))}
        </HorizontalSlider>
      </section>

      <section className="why-choose-us">
        <h2>Planning and Delivery Scope</h2>
        <ul>
          {deliveryScope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <Link to="/contact?service=corporate_events" className="cta-button">
          Share Your Event Brief
        </Link>
      </section>

      <section className="related-services container py-5">
        <h2>Related Corporate Programme Services</h2>
        <div className="d-flex flex-wrap gap-3">
          {relatedServices.map((service) => (
            <Link
              key={service.to}
              to={service.to}
              className="btn btn-outline-primary"
            >
              {service.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <h2>Plan Your Next Corporate Event</h2>
        <p>
          Share your event type, expected attendance, destination, dates and
          required services to discuss the next planning steps.
        </p>
        <Link to="/contact?service=corporate_events" className="cta-button">
          Contact ExpressEarth
        </Link>
      </section>
    </div>
  );
};

export default CorporateEvents;
