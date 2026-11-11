import React from "react";
import {
  FaMapMarkerAlt,
  FaPlaneDeparture,
  FaUniversity,
  FaTruckMoving,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./DestinationManagement.css";
import HorizontalSlider from "./ui/HorizontalSlider";
import ServiceStructuredData from "./ServiceStructuredData";

const serviceDescription =
  "ExpressEarth coordinates destination management for corporate events, incentive trips and group programmes in India and international destinations. Planning can include destination research, venue options, accommodation, transfers, activities, local suppliers and on-ground logistics based on the brief.";

const nationalDestinations = [
  "Udaipur",
  "Jaipur",
  "Jodhpur",
  "Goa",
  "Kerala",
  "Himachal",
  "Delhi NCR",
  "Mumbai",
  "Bengaluru",
];

const internationalDestinations = [
  "Dubai",
  "Abu Dhabi",
  "Oman",
  "Baku",
  "Istanbul",
  "Antalya",
  "Paris",
  "Rome",
  "Vienna",
  "Singapore",
  "Thailand",
  "Bali",
];

const destinationServices = [
  {
    icon: <FaMapMarkerAlt size={40} />,
    title: "Destination Research and Selection",
    description:
      "Compare destination options against the programme objective, season, access, group size, dates and budget.",
  },
  {
    icon: <FaPlaneDeparture size={40} />,
    title: "Accommodation and Group Transfers",
    description:
      "Coordinate hotel requirements, airport transfers, local transport and group movement around the itinerary.",
  },
  {
    icon: <FaUniversity size={40} />,
    title: "Venue and Activity Coordination",
    description:
      "Review meeting venues, event spaces, sightseeing, group activities and local supplier requirements.",
  },
  {
    icon: <FaTruckMoving size={40} />,
    title: "On-ground Event Logistics",
    description:
      "Plan arrival support, hospitality desks, material movement, operating contacts and event-day schedules.",
  },
];

const DestinationManagement = () => {
  return (
    <div className="destination-management">
      <ServiceStructuredData
        name="Corporate Destination Management"
        serviceType="Destination management for corporate events, incentive travel and group programmes"
        description={serviceDescription}
        url="https://www.expressearth.com/destination-management"
      />

      <section className="hero-section">
        <img
          src="/Images/Expressearth website images/Destination-management/travel.avif"
          alt="Destination setting for a corporate group programme"
          className="hero-image"
          fetchPriority="high"
          decoding="async"
        />
        <div className="hero-content">
          <h1>Corporate Destination Management in Delhi NCR &amp; India</h1>
          <p>Destination research | Hotels | Transfers | Activities | Local logistics</p>
        </div>
      </section>

      <section className="content-section">
        <h2>Destination Planning for Corporate Groups</h2>
        <p>{serviceDescription}</p>
        <p>
          The destination plan is shaped around your group profile, travel
          dates, origin, programme format, accessibility needs and budget.
          Availability and final inclusions are confirmed during proposal
          preparation.
        </p>
        <div className="but-on">
          <Link to="/contact">Discuss Your Destination Brief</Link>
        </div>
      </section>

      <section className="offer-section">
        <h2>Destination Management Scope</h2>
        <p>
          Select the planning support required for your corporate event,
          incentive trip, offsite or business delegation.
        </p>

        <HorizontalSlider className="offer-grid" itemCount={destinationServices.length}>
          {destinationServices.map((service) => (
            <div className="offer-card" key={service.title}>
              <div className="icon-wrapper">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to="/contact" className="cta-link">
                Discuss This Requirement
              </Link>
            </div>
          ))}
        </HorizontalSlider>
      </section>

      <section className="featured-section">
        <h2>Destination Examples</h2>
        <p>
          These are examples of locations that can be discussed. Suitability
          depends on travel dates, group size, access, budget and availability.
        </p>
        <div className="destination-box-group">
          <div>
            <h3>India</h3>
            <HorizontalSlider className="destination-boxes" itemCount={nationalDestinations.length}>
              {nationalDestinations.map((place) => (
                <div className="destination-card-in" key={place}>
                  {place}
                </div>
              ))}
            </HorizontalSlider>
          </div>
          <div>
            <h3>International</h3>
            <HorizontalSlider className="destination-boxes" itemCount={internationalDestinations.length}>
              {internationalDestinations.map((place) => (
                <div className="destination-card-in" key={place}>
                  {place}
                </div>
              ))}
            </HorizontalSlider>
          </div>
        </div>
        <div className="but-on">
          <Link to="/destinations" className="featured-btn">
            Explore Group Travel Destinations
          </Link>
        </div>
      </section>

      <section className="why-section">
        <h2>How Destination Planning Works</h2>
        <ul>
          <li>Confirm the programme objective, audience, origin, dates and budget.</li>
          <li>Compare destination access, seasonality, venue and accommodation options.</li>
          <li>Define travel, transfers, activities, local suppliers and operating contacts.</li>
          <li>Confirm inclusions, responsibilities and contingency arrangements in the proposal.</li>
        </ul>
        <div className="but-on">
          <Link to="/contact">Share Your Group Travel Brief</Link>
        </div>
      </section>

      <section className="final-cta">
        <h2>Plan a Corporate Programme at Your Preferred Destination</h2>
        <p>
          Share the destination, group size, dates and required services to
          discuss feasibility and planning scope.
        </p>
        <div className="but-on">
          <Link to="/contact" className="cta-link">
            Contact ExpressEarth
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DestinationManagement;
