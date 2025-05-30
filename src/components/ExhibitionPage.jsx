import React from "react";
import "./ExhibitionPage.css";
import { FaMapMarkedAlt, FaPaintBrush, FaCogs, FaGlobe, FaRocket } from "react-icons/fa";
import { MdEventNote } from "react-icons/md";

const ExhibitionPage = () => {
  return (
    <div className="exhibition-page">
      
      {/* Hero Section */}
      <section className="exhibition-hero-section">
        <div className="hero-overlay">
          <h1>Exhibitions & Trade Shows</h1>
          <p>Global Participation & Bespoke Booth Management</p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="intro-section container">
        <h2>Make Your Brand the Center of Attention</h2>
        <p>
        At ExpressEarth, we take your brand to the global stage — seamlessly. Our exhibition and trade show solutions are designed to position your business at the forefront of your industry. From conceptual booth design to end-to-end logistics, we deliver striking, results-driven presentations that stand out and make connections happen.
        </p>
        <p className="italic-text">
          Where your brand takes the spotlight — with zero stress.
        </p>
        <a href="/contact" className="cta-button">Request a Free Exhibition Consultation</a>
      </section>

      {/* Expertise Section */}
      <section className="expertise-section container">
        <h2>Our Exhibition & Trade Show Expertise</h2>
        <p>
        As one of India’s leading trade fair organizers and a global MICE force, we help companies navigate complex exhibition landscapes with elegance and ease.
        </p>

        <div className="expertise-cards">

          <div className="exhibition-card">
            <FaMapMarkedAlt className="card-icon" />
            <h3>Expo Planning Services</h3>
            <p>
            Leave the complexities to us. Our all-inclusive expo planning services handle everything from registration and documentation to coordination with international organizers.            </p>
            <a href="/contact" className="cta-link">Simplify the Process → Book Your Planning Session</a>
          </div>

          <div className="card">
            <FaPaintBrush className="card-icon" />
            <h3>Booth Fabrication Services</h3>
            <p>
            Your booth is your brand’s physical presence. We provide high-end, customized booth fabrication services — blending aesthetics, functionality, and brand messaging seamlessly.
            </p>
            <a href="/contact" className="cta-link">Design That Delivers → Get a 3D Concept Today</a>
          </div>

          <div className="exhibition-card">
            <MdEventNote className="card-icon" />
            <h3>Product Showcase Event Planners            </h3>
            <p>
            Planning to unveil your latest innovation? As expert product showcase event planners, we create experiences that attract attention, tell your product story, and drive engagement.
            </p>
            <a href="/contact" className="cta-link"> Launch Your Product Right →Schedule a Showcase Strategy</a>
          </div>

          <div className="card">
            <FaGlobe className="card-icon" />
            <h3>Trade Fair Organizers in India & Beyond            </h3>
            <p>
            From Auto Expo in Delhi to Beautyworld in Dubai, our seasoned team of trade fair organizers in India helps you exhibit confidently at major global expos.
            </p>
            <a href="/contact" className="cta-link"> Go Global with Confidence → Explore Upcoming International Expos</a>
          </div>

          <div className="exhibition-card">
            <FaRocket className="card-icon" />
            <h3> Industry Exhibition Planning Services</h3>
            <p>
            We take a 360° approach — strategy, creative, logistics, staffing, branding, lead tracking — making your participation smooth and successful with our full-scale industry exhibition planning services.
            </p>
            <a href="/contact" className="cta-link"> Maximize ROI → Let’s Build Your Trade Show Strategy</a>
          </div>

          <div className="card">
            <FaRocket className="card-icon" />
            <h3> End-to-End Coordination & Support            </h3>
            <p>
            From the initial planning stages to on-ground execution, our team provides seamless coordination every step of the way — so you can focus on showcasing your brand while we handle the rest.
            </p>
            <a href="/contact" className="cta-link"> Stress-Free Execution → Talk to Our Event Support Team</a>
          </div>

        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section container">
        <h2>Why Brands Choose ExpressEarth</h2>
        <ul>
          <li><strong>Global Reach, Local Expertise:</strong>  We manage exhibitions across continents — with cultural fluency and logistical expertise.</li>
          <li><strong>Custom-Built Booths & Brand Storytelling:</strong>Stand out in the crowd with booths designed to engage and convert.</li>
          <li><strong>End-to-End Participation Management:</strong>From flight bookings to on-ground staffing, everything is handled in-house.</li>
          <li><strong>Lead-Driven Strategy:</strong>Beyond visuals, we focus on footfall, interest, and high-value connections.</li>
        </ul>
        <a href="/contact" className="cta-button"> Let’s Take Your Brand Global → Connect with Exhibition Experts</a>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta-section container">
        <h2> Let’s Elevate Your Next Showcase</h2>
        <p>
        Whether you're a first-time exhibitor or a seasoned player going global — trust ExpressEarth to make your trade show presence impactful, effortless, and unforgettable.
        </p>
        <a href="/contact" className="cta-button">Speak to Our Exhibition Specialists Today</a>
      </section>

    </div>
  );
};

export default ExhibitionPage;
