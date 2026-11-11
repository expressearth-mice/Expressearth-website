import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkedAlt, FaPaintBrush, FaGlobe, FaRocket } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";
import HorizontalSlider from "./ui/HorizontalSlider";
import ServiceStructuredData from "./ServiceStructuredData";
import "./ExhibitionPage.css";

const serviceDescription =
  "ExpressEarth supports corporate exhibition and trade show participation in India and international destinations. Depending on the brief, coordination can include booth planning and fabrication requirements, venue and organiser liaison, registration and documentation, travel, material logistics and on-site support.";

const exhibitionServices = [
  {
    icon: <FaMapMarkedAlt className="card-icon" />,
    title: "Exhibition Participation Planning",
    description:
      "Coordinate event research, participation requirements, organiser communication, registration timelines and exhibitor documentation.",
  },
  {
    icon: <FaPaintBrush className="card-icon" />,
    title: "Booth Design and Fabrication Coordination",
    description:
      "Plan booth layouts, design briefs, branding, fabrication requirements, technical services and supplier coordination.",
  },
  {
    icon: <MdEventNote className="card-icon" />,
    title: "Product Showcases",
    description:
      "Coordinate product presentation areas, launch schedules, visitor flow, AV requirements and supporting event logistics.",
  },
  {
    icon: <FaGlobe className="card-icon" />,
    title: "Trade Fair and Exhibitor Logistics",
    description:
      "Plan travel, accommodation, material movement, venue access and local arrangements for exhibition teams.",
  },
  {
    icon: <FaRocket className="card-icon" />,
    title: "On-site Exhibition Support",
    description:
      "Agree supplier responsibilities, installation schedules, event-day contacts and support requirements before the exhibition.",
  },
];

const ExhibitionPage = () => {
  return (
    <div className="exhibition-page">
      <ServiceStructuredData
        name="Exhibition and Trade Show Management"
        serviceType="Corporate exhibition participation, booth planning and trade show logistics"
        description={serviceDescription}
        url="https://www.expressearth.com/exhibitions-and-trade-shows"
      />

      <section className="exhibition-hero-section">
        <div className="hero-overlay">
          <h1>Exhibition &amp; Trade Show Management in Delhi NCR &amp; India</h1>
          <p>Exhibition participation | Booth planning | Trade fair logistics</p>
        </div>
      </section>

      <section className="intro-section container">
        <h2>Plan Your Next Exhibition or Trade Show</h2>
        <p>{serviceDescription}</p>
        <p className="italic-text">
          Share the exhibition name, location, dates, booth requirements and
          expected team size to discuss the planning scope.
        </p>
        <Link to="/contact" className="cta-button">
          Discuss Your Exhibition Brief
        </Link>
      </section>

      <section className="expertise-section container">
        <h2>Exhibition and Trade Show Services</h2>
        <p>
          The delivery plan is built around the organiser's requirements, the
          exhibitor manual, booth specifications, travel needs and the
          responsibilities agreed with your team.
        </p>

        <HorizontalSlider className="expertise-cards" itemCount={exhibitionServices.length}>
          {exhibitionServices.map((service) => (
            <div className="exhibition-card" key={service.title}>
              {service.icon}
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to="/contact" className="cta-link">
                Discuss This Requirement
              </Link>
            </div>
          ))}
        </HorizontalSlider>
      </section>

      <section className="why-choose-section container">
        <h2>Planning Checklist</h2>
        <ul>
          <li>Confirm exhibition dates, venue, organiser deadlines and participation format.</li>
          <li>Review booth size, design brief, branding, utilities and technical requirements.</li>
          <li>Agree fabrication, shipping, installation, dismantling and supplier responsibilities.</li>
          <li>Plan exhibitor travel, accommodation, staffing and on-site contact arrangements.</li>
        </ul>
        <Link to="/contact" className="cta-button">
          Share Your Trade Show Brief
        </Link>
      </section>

      <section className="final-cta-section container">
        <h2>Related Corporate Event Services</h2>
        <p>
          Exhibition participation can also sit alongside product launches,
          conferences and corporate events.
        </p>
        <div className="d-flex flex-wrap gap-3">
          <Link to="/corporate-events" className="cta-link">
            Corporate event management
          </Link>
          <Link to="/meetings-and-conferences" className="cta-link">
            Meetings and conferences
          </Link>
          <Link to="/mice-services" className="cta-link">
            All MICE services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ExhibitionPage;
