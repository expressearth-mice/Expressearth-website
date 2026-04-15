import React from "react";
import { FaMedal, FaChartLine, FaUsers, FaUmbrellaBeach, FaGift, FaCarSide, FaGem, FaGlobeAmericas, FaBullseye } from "react-icons/fa";
import "./IncentiveTravel.css"; // (make sure you import your CSS!)
import { Link } from 'react-router-dom';
import HorizontalSlider from "./ui/HorizontalSlider";

const IncentiveTravel = () => {
  return (
    <div className="incentive-travel-container">

      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url('/Images/Expressearth website images/incentive-travel/Banner-image/singaporeincentive.avif')`,
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="hero-title">Luxury Incentive Programs for Top Performers
            <br />Reward the Best. Inspire the Rest.</h1>
          <a href="/contact" className="primary-button">Let’s Create Your Next Dream Incentive Trip </a>
        </div>
      </section>

      <section className="para-section">
        <div className="para">
          <p className="hero-subtitle">
            At ExpressEarth, we design incentive travel programs that go far beyond a getaway — they’re powerful tools to recognize, motivate, and retain your top talent. Every journey is curated with sophistication, purpose, and unforgettable moments, delivering the kind of reward that speaks volumes.
          </p>

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
            Our team specializes in developing high-end corporate reward travel programs that align with your brand values and performance goals. Whether it's a tropical escape, a snow-covered adventure, or a cultural deep dive — we turn achievements into experiences of a lifetime.
          </p>
          <Link to="/contact">
            <a href="#consultatio" className="primary-button  performance-btn">Let’s Talk Goals </a></Link>
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
            desc: "Boost productivity with travel goals that excite. Our sales incentive travel packages are designed to engage your teams and drive results.",
            link: "/contact",
            linkText: "Inspire Peak Sales Performance",
          },
          {
            icon: <FaUsers className="text-purple-500" />,
            title: "Team Incentive Tours",
            desc: "Reinforce collaboration and unity with personalized team incentive tours that mix business with leisure in premium settings.",
            link: "/destinations",
            linkText: "Explore Tour Options",
          },
          {
            icon: <FaUmbrellaBeach className="text-pink-500" />,
            title: "Corporate Retreat Destinations",
            desc: "Handpicked retreat locations — vineyards in Tuscany, beach resorts in Bali, and more.",
            link: "/destinations",
            linkText: "Discover Your Next Retreat",
          },
          {
            icon: <FaGift className="text-red-400" />,
            title: "Corporate Reward Travel Programs",
            desc: "Tailor-made reward travel programs that combine luxury, logistics, and emotion — all handled by our dedicated incentive specialists.",
            link: "/contact",
            linkText: "Let’s Build Something Special",
          },
          {
            icon: <FaCarSide style={{ color: "#1c65a5" }} />,
            title: "Luxury Ground Transportation",
            desc: "We believe the journey should be just as impressive as the destination. That’s why we provide top-tier ground transportation options.",
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
            <li><span className="benefit-highlight">Curated Luxury Experiences</span> — Each itinerary is handcrafted with premium experiences, five-star stays, and personalized touches.</li>
            <li><span className="benefit-highlight">Seamless Global Execution</span> — From flights to final-night galas, we manage every detail, anywhere in the world.</li>
            <li><span className="benefit-highlight">Custom Branding & Engagement</span> — Your brand identity is infused into every aspect of the journey, making each moment uniquely yours.</li>
            <li><span className="benefit-highlight">ROI-Driven Programs</span> — Our incentive travel programs are designed to boost retention, morale, and measurable performance.</li>
          </ul>
          <a href="#measure-roi" className="primary-button mt-8">Let’s Make It Count</a>
          
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title text-white"><FaBullseye className="inline mr-2" />Ready to Motivate with Meaning?</h2>
          <p className="section-description text-white">Let’s turn your recognition goals into extraordinary journeys.</p>
          <a href="/contact" className="secondary-button">Speak to our Incentive Travel Experts today </a>
        </div>
      </section>

    </div>
  );
};

export default IncentiveTravel;
