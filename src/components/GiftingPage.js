import React from "react";
import { motion } from "framer-motion";
import {
  Gift,
  ShoppingBag,
  Brush,
  Briefcase,
  Leaf,
  Globe,
  ShieldCheck,
  PackageCheck,
  UserCheck,
  Send,
} from "lucide-react";
import "./GiftingPage.css";
import HorizontalSlider from "./ui/HorizontalSlider";

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const GiftingPage = () => {
  const items = [
    "Corporate retreats & incentives",
    "Board meetings & AGMs",
    "Product launches",
    "Award ceremonies",
    "Destination events",
  ];

  const whyChooseItems = [
    {
      icon: <PackageCheck size={28} />,
      title: "Luxury-Centric Selections",
      text: "Only the finest products curated from top global and Indian brands.",
    },
    {
      icon: <Brush size={28} />,
      title: "Branded & Thematic Presentation",
      text: "Every gift is beautifully packaged and aligned with your event’s branding.",
    },
    {
      icon: <UserCheck size={28} />,
      title: "Personalized Touches",
      text: "Engraved names, tailored messages, or localized elements, every detail matters.",
    },
    {
      icon: <Briefcase size={28} />,
      title: "Seamless Gifting Management",
      text: "From procurement to distribution, everything is handled by our dedicated team.",
    },
  ];

  return (
    <div className="gifting-page">
      <div className="gifting-hero-section">
        <div className="hero-overlay">
          <motion.h1 initial="hidden" animate="show" variants={fadeIn}>
            <Gift size={48} /> Gifting
          </motion.h1>
          <motion.h2 initial="hidden" animate="show" variants={fadeIn}>
            Elevating Events Through Thoughtful & Bespoke Gifting
          </motion.h2>
          <motion.p initial="hidden" animate="show" variants={fadeIn}>
            Make Every Gesture Memorable
          </motion.p>
        </div>
      </div>

      <motion.section className="intro" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <p>
          At ExpressEarth, we understand that gifting is more than just an exchange — it’s an experience,
          an extension of your brand, and a lasting impression. Whether it’s a pre-arrival welcome kit,
          a luxurious memento, or an end-of-event token, we curate premium corporate gifting solutions
          that reflect class, creativity, and personalization.
        </p>
        <i>Because the smallest touches often leave the deepest impressions.</i>
        <div className="cta-button">
          <Send size={18} /> Looking for the perfect gift mix? <a href="/contact">Request a Gifting Consultation</a>
        </div>
      </motion.section>

      <motion.section className="offer-section" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <h2><ShoppingBag size={32} /> What We Offer</h2>
        <p>Our gifting solutions align with the tone and theme of your event — from luxury MICE events to international incentives and leadership summits.</p>

        <HorizontalSlider className="offer-cards" itemCount={6}>
          {[
            { icon: <Brush size={32} />, title: "Customized Gifting Curation", text: "From concept to packaging, we tailor gifts to your brand ethos and audience." },
            { icon: <Briefcase size={32} />, title: "Welcome Kits & Delegate Hampers", text: "Make your guests feel special from the moment they arrive with elegantly packaged kits containing essentials, personalized items, and local souvenirs." },
            { icon: <PackageCheck size={32} />, title: "Luxury Merchandise & Branded Keepsakes", text: "From monogrammed leather accessories to fine stationery, we source high-end merchandise that reflects premium aesthetics." },
            { icon: <Leaf size={32} />, title: "Eco-Friendly & Sustainable Gifting", text: "Make a statement of purpose with ethically sourced, earth-conscious gifting options that leave a positive impact." },
            { icon: <Globe size={32} />, title: "Global Sourcing & Delivery", text: "Whether your event is in India or overseas, we manage end-to-end logistics including international sourcing, custom clearance, and on-ground delivery." },
            { icon: <Globe size={32} />, title: "Themed Gifting for Special Occasions", text: "Celebrate festivals, milestones, and corporate achievements with thoughtfully themed gift sets tailored to the occasion — be it Diwali, New Year, product launches, or anniversaries." },
          ].map((item, index) => (
            <div className="offer-card" key={index}>
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </HorizontalSlider>
      </motion.section>

      <motion.section className="why-choose" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <h2><ShieldCheck size={32} /> Why Choose ExpressEarth for Gifting?</h2>
        <HorizontalSlider className="why-choose-cards" itemCount={whyChooseItems.length}>
          {whyChooseItems.map((item, index) => (
            <div className="why-choose-card" key={index}>
              <div className="why-choose-card-icon">{item.icon}</div>
              <div className="why-choose-card-content">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </HorizontalSlider>
        <div className="cta-button">
          <Send size={18} /> Let’s Make Your Gifting Stand Out → <a href="/contact">Get in Touch with Our Gifting Experts</a>
        </div>
      </motion.section>

      <section className="ideal-for bg-gradient-to-r from-blue-50 to-blue-100 py-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <Briefcase size={24} className="text-blue-700" />
            <h2 className="text-xl font-bold text-gray-800">Ideal For:</h2>
          </div>

          <div className="flex flex-wrap gap-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="cloud-badge bg-white px-6 py-3 rounded-full shadow-md text-sm font-semibold text-blue-700 border border-blue-200 transition-all duration-300 hover:shadow-lg"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <motion.section className="final-call" initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeIn}>
        <h2>Let’s Create Something Special</h2>
        <p>We’re here to help you create moments that last beyond the event. Let’s design a gifting experience your guests will remember — and talk about.</p>
        <div className="cta-button">
          <a href="/contact">Speak to Our Gifting Specialists Today</a>
        </div>
      </motion.section>
    </div>
  );
};

export default GiftingPage;
