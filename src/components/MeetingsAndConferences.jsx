import React from 'react';
import { Briefcase, Globe, Mic, PieChart, Users, Phone, Building, Settings, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import './MeetingsAndConferences.css';
import { Link } from 'react-router-dom';

const MeetingsAndConferences = () => {
  return (
    <div className="meetings-container">
      {/* Hero Section */}
      <div className="hero-section">
        <img
          src="https://img.freepik.com/premium-photo/banner-conference-hall-seminar-room-with-attendee-background_157125-12992.jpg"
          alt="Conference"
          className="hero-image"
        />
        <div className="hero-content">
          <h1 className="hero-title">Meetings & Conferences</h1>
          <p className="hero-subtitle">Corporate Meetings | Conferences and Summits | Seminars & Forums</p>
          <Link to="/contact" className="hero-button">
            Plan Your Event
          </Link>
        </div>
      </div>

      {/* Intro Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="intro-section"
      >
        <div className="intro-left">
          <img
            src="https://images.stockcake.com/public/2/c/d/2cdf01bf-4db2-404f-ab01-8230afde4e47_medium/international-business-handshake-stockcake.jpg"
            alt="Business Handshake"
            className="intro-image"
          />
        </div>
        <div className="intro-right">
          <p>
            Elevate Every Gathering with ExpressEarth. We transform corporate gatherings into high-impact experiences. Whether it's a strategic board meeting, dynamic seminar, or an international business conference, we deliver seamless planning and world-class execution tailored to your goals.
          </p>
          <p className="intro-highlight"><ShieldCheck size={16} /> Trusted by leading corporations worldwide for luxury MICE solutions.</p>
        </div>
      </motion.section>

      {/* Services Section - Updated Design */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="offer-section timeline-section"
      >
        <h2 className="offer-title">What We Offer</h2>
        <div className="timeline">
          {[
            {
              icon: <Briefcase />,
              title: 'Corporate Meetings',
              desc: 'From executive boardrooms to hybrid setups, our meeting planners ensure flawless execution — agenda flow, hospitality, technology, and more.',
            },
            {
              icon: <Globe />,
              title: 'Conferences & Summits',
              desc: 'We handle venue selection, speaker coordination, delegate management, branding, and AV setups across global destinations.',
            },
            {
              icon: <Mic />,
              title: 'Seminars & Forums',
              desc: 'Tailored seminar planning with modern tech, breakout sessions, and engaging thematic elements.',
            },
            {
              icon: <Users />,
              title: 'Workshops & Training',
              desc: 'We create immersive, goal-driven environments for corporate learning and team development.',
            },
            {
              icon: <PieChart />,
              title: 'Annual General Meetings (AGMs)',
              desc: 'Full-service AGM planning including compliance, logistics, technology, and shareholder engagement.',
            },
          ].map((item, idx) => (
            <div key={idx} className="timeline-item">
              <div className="timeline-icon">{item.icon}</div>
              <div className="timeline-content">
                <h3 className="timeline-title">{item.title}</h3>
                <p className="timeline-desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Why Choose Us Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="testimonial-section"
      >
        <h2 className="testimonial-title">Why Choose ExpressEarth</h2>
        <div className="testimonial-grid">
          {[
            {
              icon: <Building />,
              text: ' Luxury Approach to MICE – Premium venues, personalized experiences, and attention to detail that reflect your brand prestige',
            },
            {
              icon: <Settings />,
              text: 'End-to-End Execution –Venue sourcing, travel management, production, staffing — all managed by our in-house team.',
            },
            {
              icon: <Globe />,
              text: ' Global Expertise – Seamless event execution in top MICE destinations across the globe.',
            },
            {
              icon: <ShieldCheck />,
              text: 'Tailored for Impact –  We listen, strategize, and deliver exactly what your event needs — nothing generic, always extraordinary.',
            },
          ].map((item, idx) => (
            <div key={idx} className="testimonial-item">
              <div className="testimonial-icon">{item.icon}</div>
              <p className="testimonial-quote">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.section>


      {/* Contact Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="contact-section"
      >
        <h2 className="contact-title">Let’s Talk</h2>
        <p className="contact-description">
        Connect with our Meetings & Conferences team today
        Let’s design a gathering that’s productive, polished, and unforgettable.
        </p>
      </motion.section>

      <div className="contact-btn-container">
        <Link to="/contact" className="contact-btn">
          <Phone size={16} style={{ marginRight: '8px' }} />
          Get in Touch
        </Link>
      </div>
    </div>
  );
};

export default MeetingsAndConferences;
