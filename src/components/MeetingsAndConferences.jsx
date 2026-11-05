import React from "react";
import {
  Briefcase,
  Globe,
  Mic,
  PieChart,
  Users,
  Phone,
  Building,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import "./MeetingsAndConferences.css";
import { Link } from "react-router-dom";
import HorizontalSlider from "./ui/HorizontalSlider";
import ServiceStructuredData from "./ServiceStructuredData";

const serviceDescription =
  "ExpressEarth helps organisations plan corporate meetings, conferences and business gatherings in Delhi NCR and across India. Depending on the brief, coordination can include venue sourcing, agenda and speaker coordination, delegate registration, branding, AV, accommodation, transfers and on-site logistics.";

const offerings = [
  {
    icon: <Briefcase />,
    title: "Corporate Meetings",
    description:
      "Plan board meetings, leadership sessions and hybrid meetings with venue, agenda, hospitality and technology coordination.",
  },
  {
    icon: <Globe />,
    title: "Conferences & Summits",
    description:
      "Coordinate venue options, speaker schedules, delegate registration, branding, AV and travel logistics for business conferences and summits.",
  },
  {
    icon: <Mic />,
    title: "Seminars & Forums",
    description:
      "Organise seminars, panel discussions and forums with room layouts, presentation technology, attendee flow and event-day coordination.",
  },
  {
    icon: <Users />,
    title: "Workshops & Training",
    description:
      "Arrange training and workshop venues, breakout spaces, materials, participant logistics and session support.",
  },
  {
    icon: <PieChart />,
    title: "Annual General Meetings",
    description:
      "Coordinate meeting spaces, registration, presentation technology, attendee communication and event logistics. Regulatory and corporate-secretarial advice remains with the client's appointed advisers.",
  },
];

const planningCapabilities = [
  {
    icon: <Building />,
    title: "Venue and room planning",
    description:
      "Shortlist venue options and plan room layouts around the agenda, audience and technical requirements.",
  },
  {
    icon: <Settings />,
    title: "Production and AV",
    description:
      "Coordinate stage, sound, screens, lighting, presentation systems and event branding where required.",
  },
  {
    icon: <Globe />,
    title: "Delegate logistics",
    description:
      "Plan registration, accommodation, transfers, hospitality and attendee communication according to the brief.",
  },
  {
    icon: <ShieldCheck />,
    title: "Event-day coordination",
    description:
      "Agree the run of show, supplier responsibilities, operating contacts and escalation process before the event.",
  },
];

const relatedServices = [
  { label: "Dealer & distributor meets", to: "/dealermeet" },
  { label: "Corporate events", to: "/corporate-events" },
  { label: "Corporate offsites", to: "/corporateoffsites" },
  { label: "Incentive travel", to: "/incentive-travel" },
];

const MeetingsAndConferences = () => {
  return (
    <div className="meetings-container">
      <ServiceStructuredData
        name="Corporate Meetings and Conference Management"
        serviceType="Corporate meetings, conferences, summits and seminars"
        description={serviceDescription}
        url="https://www.expressearth.com/meetings-and-conferences"
      />

      <section className="hero-section">
        <img
          src="https://img.freepik.com/premium-photo/banner-conference-hall-seminar-room-with-attendee-background_157125-12992.jpg"
          alt="Conference hall prepared for a corporate meeting"
          className="hero-image"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-content">
          <h1 className="hero-title">
            Corporate Meetings &amp; Business Gatherings in Delhi NCR
          </h1>
          <p className="hero-subtitle">
            Leadership meetings | Board meetings | Seminars | Workshops | AGMs
          </p>
          <Link to="/contact?service=conference_management" className="hero-button">
            Discuss Your Conference Brief
          </Link>
        </div>
      </section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="intro-section"
      >
        <div className="intro-left">
          <img
            src="https://images.stockcake.com/public/2/c/d/2cdf01bf-4db2-404f-ab01-8230afde4e47_medium/international-business-handshake-stockcake.jpg"
            alt="Business representatives meeting"
            className="intro-image"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="intro-right">
          <p>{serviceDescription}</p>
          <p className="intro-highlight">
            <ShieldCheck size={16} />
            Planning scope is agreed around the audience, programme format,
            location, dates and budget.
          </p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="offer-section timeline-section"
      >
        <h2 className="offer-title">Meetings and Conference Formats</h2>
        <HorizontalSlider className="meetings-cards-row" itemCount={offerings.length}>
          {offerings.map((item) => (
            <div key={item.title} className="meetings-card">
              <div className="meetings-card-icon">{item.icon}</div>
              <div className="meetings-card-content">
                <h3 className="meetings-card-title">{item.title}</h3>
                <p className="meetings-card-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </HorizontalSlider>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="testimonial-section"
      >
        <h2 className="testimonial-title">Planning and Delivery Scope</h2>
        <div className="testimonial-grid">
          {planningCapabilities.map((item) => (
            <div key={item.title} className="testimonial-item">
              <div className="testimonial-icon">{item.icon}</div>
              <h3 className="testimonial-heading">{item.title}</h3>
              <p className="testimonial-quote">{item.description}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <section className="related-services container py-5">
        <h2>Related Corporate Programme Services</h2>
        <p>
          If your programme also includes channel partners, employee
          celebrations, team retreats or reward travel, explore these related
          ExpressEarth services.
        </p>
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

      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="contact-section"
      >
        <h2 className="contact-title">Plan Your Next Meeting or Conference</h2>
        <p className="contact-description">
          Share your event format, expected delegate count, destination, dates
          and production requirements so the team can review the brief.
        </p>
      </motion.section>

      <div className="contact-btn-container">
        <Link to="/contact?service=conference_management" className="contact-btn">
          <Phone size={16} style={{ marginRight: "8px" }} />
          Share Your Event Brief
        </Link>
      </div>
    </div>
  );
};

export default MeetingsAndConferences;
