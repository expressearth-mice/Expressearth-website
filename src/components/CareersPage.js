import React from "react";
import { Button } from "react-bootstrap";
import { FaEnvelope, FaBriefcase, FaSearch, FaBullseye, FaStar, FaGlobeAmericas } from "react-icons/fa"; // Importing professional icons
import "./CareersPage.css";

const CareersPage = () => {
  return (

    <div className="careers-page">
      {/* Hero Section */}
      <section className="careers-hero-section text-white text-center">
        <h1>JOIN OUR JOURNEY AT EXPRESS EARTH</h1>
        ...
      </section>
      {/* Explore Careers Section */}
      <section className="explore-section">
      <p className="hero-text">
        At ExpressEarth, we don’t just plan events — we craft experiences that leave lasting impressions across the globe. As a leading luxury MICE company, we’re always on the lookout for passionate, creative, and driven individuals ready to shape the future of corporate travel and event management.<br/>
        Whether you're just stepping into the world of events or looking to take your career to new heights, ExpressEarth offers a dynamic, growth-driven environment where your talent thrives.
        </p>
        <h2><FaGlobeAmericas className="me-2 icon-large" /> Explore Careers in the MICE Industry</h2>
        <p>We're hiring across departments! If you're excited about:</p>
        <ul>
          <li><FaBriefcase className="me-2" /> Work in the MICE Industry</li>
          <li><FaBriefcase className="me-2" /> Designing large-scale corporate events</li>
          <li><FaBriefcase className="me-2" /> Managing global incentive programs</li>
          <li><FaBriefcase className="me-2" /> Delivering unforgettable experiences for top brands</li>
        </ul>
        <p>Then you’ll love being part of our journey.</p>
      </section>

      {/* Current Job Openings Section */}
      <section className="job-openings-section">
        <h3><FaSearch className="me-2 icon-large" /> Current Job Openings</h3>
        <p>Explore roles in Event Planning, Operations, Sales, Marketing, Logistics & more.</p>

        <h4><FaBullseye className="me-2" /> Event Planning Jobs</h4>
        <p>From creative ideation to flawless execution, bring your expertise to life.</p>

        {/* Apply Button with mailto link */}
        <a href="mailto:careers@expressearth.com?subject=Job Application - Event Planning" target="_blank" rel="noopener noreferrer">
          <Button variant="primary" className="apply-button">
            <FaEnvelope className="me-2" />
            APPLY NOW
          </Button>
        </a>

        <p className="email-contact">
          <FaEnvelope className="me-2" />
          careers@expressearth.com
        </p>
        {/* <Button variant="primary" className="apply-button">APPLY NOW</Button>
        <p className="email-contact">
          <FaEnvelope className="me-2" />
          careers@expressearth.com
        </p> */}
      </section>

      {/* Why Work With Us Section */}
      <section className="why-work-section">
        <h3><FaStar className="me-2 icon-large" /> Why Work with ExpressEarth?</h3>
        <ul>
          <li><FaBriefcase className="me-2" /> Collaboration and creativity</li>
          <li><FaBriefcase className="me-2" /> A vibrant, inclusive work culture</li>
          <li><FaBriefcase className="me-2" /> Continuous growth and learning</li>
          <li><FaBriefcase className="me-2" /> Working with top global brands</li>
        </ul>
        <p>Join a place where ideas matter, your impact is celebrated, and your career journey is taken seriously.</p>
      </section>

      {/* Footer Highlight Section */}
      <section className="footer-highlight">
        <h3><FaStar className="me-2 icon-large" /> Join a Leading MICE Company</h3>
        <p>Your future in the corporate travel and event planning world begins here.</p>
      </section>
    </div>
  );
};

export default CareersPage;
