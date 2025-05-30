// CorporateEvents.jsx
import React from "react";
import { Briefcase, Rocket, Award, Link, Wine, Users } from "lucide-react"; // Using lucide-react icons
import "./CorporateEvents.css";

const CorporateEvents = () => {
  return (
    <div className="corporate-events-container">

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: "url('/Images/Expressearth website images/Corporate/corporate.avif')"
        }}
      >
        <h1>Corporate Events</h1>
        <h4>Product Launches | Gala Dinners | Networking Events</h4>
        <a href="/contact" className="cta-button">
          Let’s Curate Something Iconic 
        </a>
      </section>

      <section>
      <h2><Briefcase size={32} /> Where Business Meets Celebration </h2>
      <div class="text-cen">
        
          At ExpressEarth, we don’t just organize corporate events — we create unforgettable experiences that reflect your brand’s prestige and values.
          Whether it’s a high-profile product launch, an elegant gala dinner, or a memorable networking event, we blend luxury, creativity, and precision to deliver moments that truly matter.
      
        
          Because first impressions last — and we make sure yours is extraordinary.
        
        </div>
      </section>

      {/* Signature Services Section */}
      <section className="signature-services">
        <h2><Rocket size={32} /> Our Signature Corporate Event Services</h2>
        <p>
          As one of the most trusted names in luxury MICE, ExpressEarth brings innovation, elegance, and flawless execution to every kind of corporate gathering.
        </p>

        <div className="services-grid">
          <div className="service-item">
            <Wine size={28} className="service-icon" />
            <h3>Gala Dinners & Milestone Celebrations</h3>
            <p>Looking to host an exquisite evening? Our team of seasoned corporate gala dinner organizers ensures every detail — from lighting and decor to entertainment and cuisine — is nothing short of spectacular.</p>
            <a href="/gallery" className="cta-link"> Plan a Night to Remember </a>
          </div>

          <div className="service-item">
            <Users size={28} className="service-icon" />
            <h3>Networking Events & Business Mixers</h3>
            <p>With our professional networking event planning services, we create atmospheres where meaningful connections happen. From stylish venues to curated guest experiences, we focus on setting the perfect tone for corporate engagement.            </p>
            <a href="/gallery" className="cta-link"> Make Every Conversation Count </a>
          </div>

          <div className="service-item">
            <Award size={28} className="service-icon" />
            <h3>Corporate Anniversaries</h3>
            <p>Celebrate your journey with finesse. As experienced corporate anniversary event planners, we bring your company’s story to life through themed setups, legacy displays, and unforgettable presentations.            .</p>
            <a href="#gallery" className="cta-link">Celebrate in Style </a>
          </div>

          <div className="service-item">
            <Rocket size={28} className="service-icon" />
            <h3>Product Launches & Brand Activations</h3>
            <p>Launch your innovations with impact, media buzz, and experiential showcases.</p>
            <a href="/gallery" className="cta-link">Launch with Impact </a>
          </div>

          <div className="service-item">
            <Award size={28} className="service-icon" />
            <h3>Award Ceremonies</h3>
            <p>Honor your top achievers with class. As luxury corporate award ceremony organizers, we deliver prestigious experiences that inspire excellence and loyalty — complete with staging, AV, gifting, and red-carpet flair.            </p>
            <a href="/achievements" className="cta-link">Celebrate Success Right </a>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-us">
        <h2>Why Choose ExpressEarth?</h2>
        <ul>
          <li><strong>Luxury Brand Experience</strong> – We align every detail with your brand’s tone, prestige, and purpose.          </li>
          <li><strong>Creative Concepts & Storytelling</strong> –  Your event is more than logistics — it’s a narrative. And we tell it beautifully.          </li>
          <li><strong>Global Venue Curation</strong> – From rooftop lounges to heritage castles, we source the perfect setting anywhere in the world.          </li>
          <li><strong>End-to-End Services</strong> –One expert partner. Complete event execution — from ideation to applause.
          </li>
        </ul>
        <a href="/contact" className="cta-button">
          Let’s Bring Your Vision to Life 
        </a>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <h2>Let’s Design Your Next Signature Event</h2>
        <p>
          Whether you're planning a landmark celebration or launching your next innovation, our team is here to make it magnificent.
        </p>
        <a href="/contact" className="cta-button">
           Speak to Our Corporate Event Specialists Today
        </a>
      </section>
    </div>
  );
};

export default CorporateEvents;
