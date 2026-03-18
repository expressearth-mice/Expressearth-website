// AboutUs.js
import {
  CheckCircle,
  Leaf,
  Users,
  ShieldCheck,
  Handshake,
  Recycle,
  Globe,
  BookOpenCheck,
} from "lucide-react";
import { Sparkles, Lightbulb, Clock, Settings } from "lucide-react";
import React from "react";
import "./AboutUs.css";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import IntegrationTools from "./ui/IntegrationTools";

const SectionWrapper = ({ children, className = "" }) => (
  <section className={`section-wrapper ${className}`}>{children}</section>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="section-title">
    <h2
      className="my-title"
      style={{ fontFamily: `'Arial Nova', 'Montserrat'` }}
    >
      {title}
    </h2>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

const Head = ({ title, subtitle }) => (
  <div className="section-titl">
    <h2
      className="my-titl"
      style={{ fontFamily: `"Arial Nova", "Montserrat"` }}
    >
      {title}
    </h2>
    {subtitle && <p>{subtitle}</p>}
  </div>
);

const OurStory = () => (
  <SectionWrapper className="our-story-section">
    <Head title="Our Story" />
    <div className="story-content">
      <motion.div
        className="story-text"
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p>
          <strong> Our Journey: Built on Vision, Experience & Trust</strong>
        </p>
        <p>
          {" "}
          Professional Event Organizers | MICE Industry Leaders | Trusted
          Globally
        </p>
        <p className="about-us">
          ExpressEarth began with a bold mission — to elevate business travel
          and events through unmatched service, global access, and curated
          luxury.
        </p>
        <p>
          Over the years, we’ve become corporate event specialists in India and
          globally, known for delivering unforgettable experiences.
        </p>
        <p>
          From exclusive board meetings in Istanbul to mega conferences in
          Dubai, our story is shaped by innovation, integrity, and passion.
        </p>
      </motion.div>
      <motion.img
        src="\Images\ABOUT US\Our Story\travel-concept-with-worldwide-landmarks_23-2149153263 (2).avif"
        alt="Team"
        className="story-img"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      />
    </div>
  </SectionWrapper>
);

const features = [
  {
    icon: Users,
    title: "Tailored Experiences",
    desc: "Fully customized to match your brand identity.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    desc: "20+ countries, elite venues, world-class logistics",
  },
  {
    icon: Settings,
    title: "Precision Planning",
    desc: "Every detail covered by event planning consultants.",
  },
  {
    icon: Lightbulb,
    title: "Innovation & Tech",
    desc: " From VR booths to real-time app-based agendas.",
  },
  {
    icon: Leaf,
    title: "Sustainable & Ethical",
    desc: "Green practices and ethical sourcing.",
  },
  {
    icon: Clock,
    title: "10:30am to 6:30pm ",
    desc: "Full support from ideation to execution",
  },
];

const WhyChooseUs = () => (
  <SectionWrapper className="why-choose-section">
    <Head
      title="Why Choose Us"
      subtitle="World-class service, unmatched value"
    />
    <div className="features-grid">
      {features.map((f, idx) => (
        <motion.div
          key={idx}
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <div className="icon-wrapper">
            <f.icon />
          </div>
          <h4>{f.title}</h4>
          <p>{f.desc}</p>
        </motion.div>
      ))}
    </div>
    {/* SEO Addition */}
    <p className="seo-text text-center mt-5 mb-3">
      We are business event experts trusted by global brands, offering expert
      guidance from start to finish.
    </p>

    {/* CTA Button */}
    <div className="text-center">
      <Link to="/mice-services" className="cta-button">
        Discover Our Services
      </Link>
    </div>
  </SectionWrapper>
);

const team = [
  {
    name: "Himanshu Narula",
    title: "Captain of the Ship",
    img: "/Images/Team-Images-for-website/6.png",
  },
  {
    name: "Basudha Srivastav",
    title: "The Ship Anchor",
    img: "/Images/Team-Images-for-website/4.png",
  },
  {
    name: "Megha Aggarwal",
    title: "Crew & Coin Keeper",
    img: "/Images/Team-Images-for-website/5.png",
  },
  {
    name: "Vaidehi Khanna",
    title: "Digital Buzz Commander",
    img: "/Images/Team-Images-for-website/7.png",
  },
  {
    name: "Tamanna Sharma",
    title: "Digital Sailor",
    img: "/Images/Team-Images-for-website/9.png",
  },
  {
    name: "Simran Sharma",
    title: "Client Catcher",
    img: "/Images/Team-Images-for-website/8.png",
  },
  {
    name: "Shivangi Gupta",
    title: "Pitch Pirate",
    img: "/Images/Team-Images-for-website/12.png",
  },
  // {
  //   name: "Harsh Sharma",
  //   title: "On-Ground Navigator",
  //   img: "/Images/Team-Images-for-website/10.png",
  // },
  {
    name: "Anjali Kumari",
    title: "Client Whisperer",
    img: "/Images/Team-Images-for-website/11.png",
  },
];

const MeetTheTeam = () => (
  <SectionWrapper className="team-section">
    <Head
      title="Meet the Team"
      subtitle="Our Team: The People Behind the Magic"
    />
    <div className="text-center my-6">
      <p className="text-lg text-gray-700">
        From MICE industry leaders to destination specialists and logistics
        pros, our team is the heartbeat of every seamless event.
      </p>
    </div>
    <div className="team-horizontal-scroll">
      {team.map((member, idx) => (
        <motion.div
          key={idx}
          className="team-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1 }}
        >
          <img src={member.img} alt={member.name} className="team-img" />
          <h4>{member.name}</h4>
          <p>{member.title}</p>
        </motion.div>
      ))}
    </div>
  </SectionWrapper>
);

const values = [
  { icon: Sparkles, title: "Excellence in Execution" },
  { icon: Globe, title: "Global Perspective" },
  { icon: Handshake, title: "Client-Centric Service" },
  { icon: Lightbulb, title: "Innovation with Impact" },
  { icon: Leaf, title: "Responsibility & Sustainability" },
];

const MissionValues = () => (
  <SectionWrapper className="mission-values-section">
    <Head
      title="Our Mission & Values"
      subtitle="Driven by purpose. Defined by Values."
    />
    <SectionTitle title="&ldquo;To deliver exceptional, inspiring, and unforgettable corporate travel and event experiences, while building long-term relationships based on trust and value&rdquo;" />
    <div className="values-grid">
      {values.map((val, i) => (
        <motion.div
          key={i}
          className="value-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="icon-wrapper">
            <val.icon />
          </div>
          <h4>{val.title}</h4>
        </motion.div>
      ))}
    </div>
  </SectionWrapper>
);

const TrustedByBrands = () => (
  <SectionWrapper className="trusted-brands-section py-10 bg-gray-50">
    <Head title="Our Legacy of Trust" />
    <div className="grid md:grid-cols-2 items-center gap-8 mb-10">
      <div className="space-y-4">
        {/* Testimonials */}
        <blockquote className="bg-white p-4 shadow rounded-lg border-l-4 border-blue-500">
          <span>
            “ExpressEarth made our global summit seamless and spectacular!” –{" "}
            <strong>Zydus Team Leader</strong>
          </span>
        </blockquote>
        <blockquote className="bg-white p-4 shadow rounded-lg border-l-4 border-green-500">
          <span>
            “Impeccable attention to detail. It felt like white-glove service
            from start to finish.” – <strong>Cello World Delegate</strong>
          </span>
        </blockquote>
      </div>

      {/* Recognition Text */}
      <p className="text-center text-gray-700 mt-6 text-lg">
        We’re recognized globally as professional event organizers and MICE
        experts.
      </p>

      {/* Logo Section */}
      {/* <div className="flex justify-center items-center flex-wrap mt-6 gap-4">
  <img src="/Images/Expressearth website images/logo/ZydusLogo.jpg" alt="Zydus Logo" className="h-10 w-10 rounded-full object-cover border border-gray-300 shadow-sm" />
  <img src="/Images/Expressearth website images/logo/cello-logo.png" alt="Cello Logo" className="h-10 w-10 rounded-full object-cover border border-gray-300 shadow-sm" /> */}
      {/* Add more logos as needed */}
      {/* </div> */}
    </div>
  </SectionWrapper>
);

const ESGCommitment = () => (
  <SectionWrapper className="esg-commitment-section  py-10 bg-white">
    <div>
      <img
        src="/Images/ESGSection.png"
        alt="Team"
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "auto",
          display: "block",

          margin: "0 auto",
          // borderRadius: "12px",
          // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      />
    </div>
  </SectionWrapper>
);

const AboutUs = () => {
  return (
    <div className="about-page">
      <OurStory />
      <WhyChooseUs />
      <IntegrationTools />
      <TrustedByBrands />
      <MeetTheTeam />
      <MissionValues />
      <ESGCommitment />
    </div>
  );
};

export default AboutUs;
