import React from 'react';
import { FaMapMarkerAlt, FaPlaneDeparture, FaUniversity, FaTruckMoving } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './DestinationManagement.css';
import HorizontalSlider from './ui/HorizontalSlider';

const heroImage ="/Images/Expressearth website images/Destination-management/travel.avif";

const DestinationManagement = () => {
  const nationalDestinations = ["Udaipur", "Jaipur", "Jodhpur", "Goa", "Kerala", "Himachal", "Delhi NCR", "Mumbai", "Bangalore"];
  const internationalDestinations = ["Dubai", "Abu Dhabi", "Oman", "Baku", "Istanbul", "Antalya", "Paris", "Rome", "Vienna", "Singapore", "Thailand", "Bali"];

  return (
    <div className="destination-management">
      {/* Hero Section */}
      <section className="hero-section">
        <img src={heroImage} alt="Scenic background for destination event" className="hero-image" />
        <div className="hero-content">
          <h1>Destination Management</h1>
          <p>End-to-End Planning for National & International Events</p>
        </div>
      </section>

      {/* Intro Content */}
      <section className="content-section">
        <h2>One Vision. Infinite Destinations.</h2>
        <p>
          At ExpressEarth, we bring your event vision to life — whether it's in the heart of India or across global borders. From majestic palaces in Rajasthan to seaside retreats in Greece, our destination management services are crafted to deliver luxury, seamless execution, and unforgettable experiences.
        </p>
        <em>"Your event deserves the perfect destination — and we make it happen."</em>
        <div className="but-on">
          <Link to="/contact" className="">
            Start Planning Today
          </Link>
        </div>
      </section>

      {/* Offerings */}
      <section className="offer-section">
        <h3>What We Offer: From Concept to Celebration</h3>
        <p>
          As a luxury MICE leader, ExpressEarth provides all-inclusive services for corporate events, incentives, and conferences, whether hosted within India or abroad.
        </p>

        <HorizontalSlider className="offer-grid" itemCount={4}>
          <div className="offer-card">
            <div className="icon-wrapper"><FaMapMarkerAlt size={40} /></div>
            <h4>Event Destination Planning Services</h4>
            <p>We identify and recommend the best fit — be it a regal Indian fort or a European chateau — based on your brand goals, group profile, and occasion type.</p>
            <Link to="/destinations" className="cta-link">Explore Stunning Locations</Link>
          </div>

          <div className="offer-card">
            <div className="icon-wrapper"><FaPlaneDeparture size={40} /></div>
            <h4>Corporate Travel Destination Management</h4>
            <p>From flight bookings and luxury transfers to curated travel experiences, our corporate travel destination management team ensures top-tier service across India and global destinations.</p>
            <Link to="/destinations" className="cta-link">Seamless Travel, Always</Link>
          </div>

          <div className="offer-card">
            <div className="icon-wrapper"><FaUniversity size={40} /></div>
            <h4>Venue Selection & Management</h4>
            <p>Whether it’s a serene beach resort in Goa or a state-of-the-art convention center in Dubai, we handle venue selection and management — including layout design, negotiations, and technical setup.</p>
            <Link to="/destinations" className="cta-link">Find Your Perfect Venue</Link>
          </div>

          <div className="offer-card">
            <div className="icon-wrapper"><FaTruckMoving size={40} /></div>
            <h4>Logistics Management for Events</h4>
            <p>From on-ground transport and material movement to guest hospitality desks and real-time updates, our logistics management for events ensures zero disruptions.</p>
            <Link to="/destinations" className="cta-link">Flawless Execution Awaits</Link>
          </div>
        </HorizontalSlider>
      </section>

      {/* Destinations */}
      <section className="featured-section">
        <h3>Featured Destinations We Cover</h3>
        <div className="destination-box-group">
          <div>
            <h4>National</h4>
            <HorizontalSlider className="destination-boxes" itemCount={nationalDestinations.length}>
              {nationalDestinations.map((place) => (
                <div className="destination-card-in" key={place}>{place}</div>
              ))}
            </HorizontalSlider>
          </div>
          <div>
            <h4>International</h4>
            <HorizontalSlider className="destination-boxes" itemCount={internationalDestinations.length}>
              {internationalDestinations.map((place) => (
                <div className="destination-card-in" key={place}>{place}</div>
              ))}
            </HorizontalSlider>
          </div>
        </div>
        <div className="but-on">
          <Link to="/contact" className="featured-btn">
            Have a Destination in Mind?
          </Link>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-section">
        <h3>Why ExpressEarth?</h3>
        <ul>
          <li>Pan-India & Global Expertise — From iconic Indian cities to international capitals.</li>
          <li>Luxury-Centric Approach — From premium stays to bespoke experiences, your guests get first-class treatment.</li>
          <li>Integrated Execution — Single-window project management with multilingual teams and tech support.</li>
          <li>Stress-Free Coordination — Flights, visas, transport, venues, staff, gifts, we’ve got it covered.</li>
        </ul>
        <div className="but-on">
          <Link to="/contact" className="">
            Let’s Create an Unforgettable Experience
          </Link>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="final-cta">
        <h3>Plan Your Next Destination Event with Us</h3>
        <p>Let’s create an event that speaks your brand’s language, no matter the location.</p>
        <div className="but-on">
          <Link to="/contact" className="cta-link">
            Talk to Our Destination Experts Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DestinationManagement;
