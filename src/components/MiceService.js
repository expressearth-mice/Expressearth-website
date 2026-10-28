import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaRegCalendar, FaPlane, FaBullhorn, FaBuilding, FaMapMarkedAlt, FaGift } from 'react-icons/fa';
import './MiceService.css';

const services = [
  {
    title: "Meetings & Conferences",
    description: "Plan leadership meetings, sales conferences and corporate gatherings with venue sourcing, delegate logistics and event production.",
    icon: <FaRegCalendar color="#046ab8" />,
    link: "/meetings-and-conferences"
  },
  {
    title: "Incentive Travel",
    description: "Reward employees and channel partners with tailored incentive trips, destination experiences and coordinated group travel.",
    icon: <FaPlane color="#046ab8" />,
    link: "/incentive-travel"
  },
  {
    title: "Corporate Events",
    description: "Coordinate product launches, annual days, award ceremonies and employee events with venue, production and on-site support.",
    icon: <FaBullhorn color="#046ab8" />,
    link: "/corporate-events"
  },
  {
    title: "Exhibitions & Trade Shows",
    description: "Coordinate exhibition participation, booth logistics, branded environments and on-site support for trade shows and business events.",
    icon: <FaBuilding color="#046ab8" />,
    link: "/exhibitions-and-trade-shows"
  },
  {
    title: "Destination Management",
    description: "Manage corporate group logistics, including hotels, transfers, activities and local coordination at the destination.",
    icon: <FaMapMarkedAlt color="#046ab8" />,
    link: "/destination-management"
  },
  {
    title: "Gifting",
    description: "Source corporate gifts and gift-with-purchase solutions for employee engagement, customer rewards and channel programmes.",
    icon: <FaGift color="#046ab8" />,
    link: "/Gifting"
  }
];

const MiceServices = () => {
  const heroImage = '/Images/Expressearth%20website%20images/Our-Services/services.png';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mice-services-page">
      <section
        className="mice-services-hero"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <h1 className="mice-services-hero-title">
          Our Services<br />Crafting Extraordinary MICE Experiences
        </h1>
      </section>


      <section className="mice-services-section">
        <p className="mice-services-intro">
          ExpressEarth plans corporate MICE programmes across India and international destinations, including meetings and conferences, incentive travel, dealer and distributor meets, corporate offsites, exhibitions and business events. Our team can coordinate venue sourcing, group travel, accommodation, event production and on-ground logistics around your programme requirements.
          Explore the services below, then contact us to discuss your event type, destination, group size and dates.
        </p>
        <h2 className="mice-services-heading">
          OUR KEY SERVICES
        </h2>

        <div className="mice-services-grid">
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              className="mice-service-link"
            >
              <div className="mice-service-card">
                <div className="mice-service-icon">{service.icon}</div>
                <h3 className="mice-service-title">{service.title}</h3>
                <p className="mice-service-description">{service.description}</p>
                <span className="mice-service-cta">
                  LEARN MORE
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mice-services-contact">
          <p className="mice-services-contact-text">
            Looking for a tailor-made event solution? Get in touch with our experts today!
          </p>

          <Link to="/contact" className="mice-services-contact-link custom-button-link">
            Contact Our Experts
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MiceServices;
