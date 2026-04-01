import React, { useEffect } from 'react';
import { Link } from "react-router-dom";
import { FaRegCalendar, FaPlane, FaBullhorn, FaBuilding, FaMapMarkedAlt, FaGift } from 'react-icons/fa';
import './MiceService.css';

const services = [
  {
    title: "Meetings & Conferences",
    description: "Seamless corporate meetings, leadership summits, and agile-scale conferences designed for impact.",
    icon: <FaRegCalendar color="#046ab8" />,
    link: "/meetings-and-conferences"
  },
  {
    title: "Incentive Travel",
    description: "Reward your top performers with library-incented special experiences that inspire and motivate.",
    icon: <FaPlane color="#046ab8" />,
    link: "/incentive-travel"
  },
  {
    title: "Corporate Events",
    description: "From grand product launches to gala dinners and immersive experiences, we create events that leave a lasting impression.",
    icon: <FaBullhorn color="#046ab8" />,
    link: "/corporate-events"
  },
  {
    title: "Exhibitions & Trade Shows",
    description: "Global participation, booth management, and team-first brand attribution planning for maximum brand impact.",
    icon: <FaBuilding color="#046ab8" />,
    link: "/exhibitions-and-trade-shows"
  },
  {
    title: "Destination Management",
    description: "Complete event planning solutions, including logistics, venue selection, and on-ground support for international events.",
    icon: <FaMapMarkedAlt color="#046ab8" />,
    link: "/destination-management"
  },
  {
    title: "Gifting",
    description: "Customized corporate gifting solutions to enhance your brand presence and create memorable experiences.",
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
          At ExpressEarth MICE, we specialize in delivering world-class corporate events, incentive travel, and destination management services. Whether you're planning a high-profile conference, a luxury incentive trip, or a large-scale exhibition, we ensure seamless execution with a touch of excellence. 
          Explore our comprehensive MICE solutions designed to elevate your business experiences. Click on any service below to learn more!
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

          <Link to="/contact" className="mice-services-contact-link">
            <button className="custom-button-link" type="button">
              Contact Our Experts
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MiceServices;
