import React from "react";
import { FaMedal, FaChartLine, FaUsers, FaUmbrellaBeach, FaGift, FaCarSide, FaGem, FaGlobeAmericas, FaBullseye } from "react-icons/fa";
import "./IncentiveTravel.css"; // (make sure you import your CSS!)
import { Link } from 'react-router-dom';
import HorizontalSlider from "./ui/HorizontalSlider";
import ServiceStructuredData from "./ServiceStructuredData";

const serviceDescription =
  "ExpressEarth plans corporate incentive travel programmes for employees and channel partners. Planning can include destination selection, flights, accommodation, transfers, activities, group coordination and on-ground support. Programme design is shaped around recognition objectives, group size, travel dates and budget.";

const IncentiveTravel = () => {
  return (
    <div className="incentive-travel-container">
      <ServiceStructuredData
        name="Corporate Incentive Travel and Reward Programmes"
        serviceType="Corporate incentive travel and employee reward trips"
        description={serviceDescription}
        url="https://www.expressearth.com/incentive-travel"
      />

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url('/Images/Expressearth website images/incentive-travel/Banner-image/singaporeincentive.avif')`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="hero-title">Corporate Incentive Travel &amp; Reward Programmes in Delhi NCR</h1>
          <Link to="/contact" className="primary-button">Discuss Your Incentive Travel Brief</Link>
        </div>
      </section>

      <section className="para-section">
        <div className="para">
          <p className="hero-subtitle">{serviceDescription}</p>

          <p className="hero-quote">
             -When performance meets passion, the destination becomes the motivation.
          </p>
        </div>
      </section>


      {/* Your Performance Section */}
      <section className="performance-section">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title"><FaGlobeAmericas className="inline mr-2" />Your Performance. Our Inspiration.</h2>
          <p className="section-description">
            We help companies plan reward trips around recognition objectives, group profile, destination, dates and budget. Options can include beach, city, mountain and cultural itineraries, subject to availability and travel requirements.
          </p>
          <Link to="/contact" className="primary-button performance-btn">Let’s Talk Goals</Link>
        </div>
      </section>

      {/* Core Offerings */}
      <HorizontalSlider className="offerings-grid" itemCount={6}>
        {[
          {
            icon: <FaMedal className="text-yellow-400" />,
            title: "Performance Reward Trips",
            desc: "Celebrate milestones and individual achievements with bespoke experiences — from private yacht charters to curated cultural immersions.",
            link: "/contact",
            linkText: "Ready to Reward Your Team?",
          },
          {
            icon: <FaChartLine style={{ color: "#56CE27" }} />,
            title: "Sales Incentive Travel Packages",
            desc: "Coordinate sales incentive trips with destination research, accommodation, group travel, activities and on-ground logistics.",
            link: "/contact",
            linkText: "Inspire Peak Sales Performance",
          },
          {
            icon: <FaUsers className="text-purple-500" />,
            title: "Team Incentive Tours",
            desc: "Bring colleagues together through shared itineraries, group activities and destination experiences planned around the programme brief.",
            link: "/destinations",
            linkText: "Explore Tour Options",
          },
          {
            icon: <FaUmbrellaBeach className="text-pink-500" />,
            title: "Corporate Retreat Destinations",
            desc: "Compare domestic and international locations based on season, access, group size, accommodation and programme objectives.",
            link: "/destinations",
            linkText: "Discover Your Next Retreat",
          },
          {
            icon: <FaGift className="text-red-400" />,
            title: "Corporate Reward Travel Programs",
            desc: "Coordinate reward travel components, including itinerary planning, participant communication and destination logistics.",
            link: "/contact",
            linkText: "Let’s Build Something Special",
          },
          {
            icon: <FaCarSide style={{ color: "#1c65a5" }} />,
            title: "Luxury Ground Transportation",
            desc: "Plan airport transfers and local group transport according to the itinerary, vehicle requirements and destination.",
            link: "/contact",
            linkText: "Travel in Style",
          },
        ].map((item, index) => (
          <div key={index} className="offering-card">
            <div className="offering-header">
              {item.icon}
              <h3>{item.title}</h3>
            </div>
            <p>{item.desc}</p>
            <a href={item.link} className="link-button">
              {item.linkText}
            </a>
          </div>
        ))}
      </HorizontalSlider>


      {/* Why Choose Us */}
      <section className="why-choose-us">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title"><FaGem style={{ color: "#1c65a5" }} className="mr-2" />Why Choose ExpressEarth?</h2>
          <ul className="benefits-list">
            <li><span className="benefit-highlight">Programme design</span> — Align destination, itinerary and activities with recognition objectives and budget.</li>
            <li><span className="benefit-highlight">Group logistics</span> — Coordinate flights, accommodation, transfers, activities and participant movement.</li>
            <li><span className="benefit-highlight">Branding &amp; engagement</span> — Include approved company branding and group activities where required.</li>
            <li><span className="benefit-highlight">Travel coordination</span> — Plan participant communication, travel documents and on-ground support, subject to destination requirements.</li>
          </ul>
          <Link to="/contact" className="primary-button mt-8">Let’s Make It Count</Link>
          
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title text-white"><FaBullseye className="inline mr-2" />Ready to Motivate with Meaning?</h2>
          <p className="section-description text-white">Let’s turn your recognition goals into extraordinary journeys.</p>
          <Link to="/contact" className="secondary-button">Share Your Incentive Travel Brief</Link>
        </div>
      </section>

    </div>
  );
};

export default IncentiveTravel;
