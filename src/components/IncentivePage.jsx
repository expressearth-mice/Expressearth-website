import React, { useEffect, useRef, useState } from "react";
import "./IncentivePage.css";
import axiosInstance from "../api/axios";
import { trackFormSubmit, trackContact } from "../utils/fbPixel";

import ig1 from "../assests/IP_5.jpg";
import ig2 from "../assests/IP_6.jpg";
import ig3 from "../assests/IP_7.jpg";

import why1 from "../assests/IP_9.jpg";
import why2 from "../assests/IP_10.jpg";

import meeting from "../assests/IP_8.png";
import IP_2 from "../assests/IP_2.png";
import dubaiImg from "../assests/dubai.png";
import singaporeImg from "../assests/singapore.jpg";
import baliImg from "../assests/bali.jpg";
import bakuImg from "../assests/baku.jpg";
import switzerlandImg from "../assests/switzerland.png";
import maldivesImg from "../assests/maldives.jpg";
import almatyImg from "../assests/almaty.jpg";
import italyImg from "../assests/italy.webp";
import turkeyImg from "../assests/turkey.jpg";
import ip4Img from "../assests/IP_4.jpg";
import PopupForm from "./popupForm";

const galleryImages = [ig1, ig2, ig3];

const services = [
  {
    title: "End-to-End Incentive Travel Planning",
    text: "From destination research to itinerary design, logistics, hospitality, and thematic experiences, we manage every detail to perfection.",
    btn: "Share Your Brief",
  },
  {
    title: "Domestic & International Travel Packages",
    text: "Choose from curated holiday packages and premium international tour packages crafted to motivate, reward, and celebrate success.",
    btn: "See Packages",
  },
  {
    title: "Corporate Tours & Executive Travel",
    text: " We design business-focused journeys that combine leisure with meaningful engagement, perfect for leadership teams, partners, and high achievers.",
    btn: "Custom Itinerary",
  },
  {
    title: "Group Travel Packages for Teams",
    text: "Seamless group coordination, luxury stays, curated activities, and unforgettable shared moments, everything your team deserves.",
    btn: "Get Started",
  },
  {
    title: "Conference + Incentive Travel (C-Incentive)",
    text: " Combine your annual business trip or conference with rewarding travel experiences that boost motivation and team bonding.",
    btn: "Plan a C-Incentive",
  },
];

const destinations = [
  { name: "Dubai", image: dubaiImg },
  { name: "Singapore", image: singaporeImg },
  { name: "Bali", image: baliImg },
  { name: "Baku", image: bakuImg },
  { name: "Georgia", image: ip4Img },
  { name: "Turkey", image: turkeyImg },
  { name: "Vietnam", image: singaporeImg },
  { name: "Italy", image: italyImg },
  { name: "Switzerland", image: switzerlandImg },
  { name: "Almaty", image: almatyImg },
  { name: "Maldives", image: maldivesImg },
];

const faqs = [
  {
    question: "What is an incentive travel program?",
    answer:
      "An incentive travel program is a reward-based travel experience designed to recognize and motivate employees, partners, or top performers. As a MICE expert in India, ExpressEarth creates journeys that combine appreciation with meaningful engagement.",
  },
  {
    question: "What does ExpressEarth handle in incentive travel?",
    answer:
      "ExpressEarth manages everything from destination planning and itineraries to travel, stays, activities, and on-ground execution. As an end-to-end service provider, every detail is handled seamlessly.",
  },
  {
    question: "Can incentive travel programs be customized?",
    answer:
      "Absolutely. Every program is custom-designed based on your goals, team preferences, and budget, whether it’s luxury relaxation, adventure, or a mix of both.",
  },
  {
    question: "Do you organize international incentive trips?",
    answer:
      "Yes, ExpressEarth organizes both domestic and international incentive travel programs, backed by its expertise as a MICE expert, ensuring smooth execution across global destinations.",
  },
  {
    question: "How does incentive travel benefit companies?",
    answer:
      "Incentive travel helps boost motivation, improve performance, and strengthen loyalty. Well-designed programs by a MICE expert like ExpressEarth turn rewards into long-term business impact.",
  },
];

const IncentivePage = () => {
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(0);

  const [activeIndex, setActiveIndex] = useState(0);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [visibleServiceCards, setVisibleServiceCards] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 768 ? 1 : 3,
  );
  const [galleryIndex, setGalleryIndex] = useState(1);
  const [faqForm, setFaqForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Company",
    company: "",
  });

  /* DESTINATION SLIDER */

  const nextSlide = () => {
    if (activeIndex < destinations.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const prevSlide = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  useEffect(() => {
    const updateVisibleServiceCards = () => {
      setVisibleServiceCards(window.innerWidth <= 768 ? 1 : 3);
    };

    updateVisibleServiceCards();
    window.addEventListener("resize", updateVisibleServiceCards);

    return () =>
      window.removeEventListener("resize", updateVisibleServiceCards);
  }, []);

  useEffect(() => {
    setServiceIndex((currentIndex) =>
      Math.min(
        currentIndex,
        Math.max(services.length - visibleServiceCards, 0),
      ),
    );
  }, [visibleServiceCards]);

  const nextService = () => {
    if (serviceIndex < services.length - visibleServiceCards) {
      setServiceIndex(serviceIndex + 1);
    }
  };

  const prevService = () => {
    if (serviceIndex > 0) {
      setServiceIndex(serviceIndex - 1);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  /* GALLERY SLIDER */

  const nextGallery = () => {
    setGalleryIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevGallery = () => {
    setGalleryIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1,
    );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      trackContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        type: "IncentiveTravel",
      });

      const payload = {
        full_name: formData.name,
        company_name: formData.type === "Company" ? formData.company : null,
        email: formData.email,
        phone: formData.phone,
        event_date: null,
        event_type: "Other",
        type: formData.type,
      };

      await axiosInstance.post("/api/contact/", payload);

      alert("Form Submitted Successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "Company",
        company: "",
      });
    } catch (error) {
      console.log(
        "IncentivePage submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting form");
    }
  };

  const handleFaqFormChange = (key) => (e) => {
    setFaqForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();

    try {
      trackFormSubmit({
        name: "IncentiveTravel FAQ Inquiry",
        email: faqForm.email,
        message: faqForm.message,
        type: "IncentiveTravel_FAQ",
      });

      const payload = {
        full_name: faqForm.name,
        company_name: null,
        email: faqForm.email,
        phone: "1234567890",
        event_date: null,
        event_type: faqForm.message || "Incentive Travel FAQ Question",
        type: "Individual",
      };

      await axiosInstance.post("/api/contact/", payload);

      alert("Your question has been submitted successfully");

      setFaqForm({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log(
        "IncentivePage FAQ submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting your question");
    }
  };

  const toggleFAQ = (faqIndex) => {
    setActiveFAQ((currentFAQ) => (currentFAQ === faqIndex ? null : faqIndex));
  };

  return (
    <div className="incentive-wrapper">
      {showPopup && <PopupForm onClose={handleClosePopup} />}

      {/* HERO */}

      <div className="incentive-container">
        <div className="left-section">
          <div className="left-content">
            <h1>Incentive Travel Programs</h1>

            <p className="sub-text">
              Incentive Travel | Corporate Reward Trips | Employee Recognition
              Travel | Performance-Based Incentives | Domestic & International
              Programs | End-to-End Travel Management
            </p>

            <div className="divider"></div>

            <p className="tagline">
              Where Achievement Turns Into Unforgettable Experiences.
            </p>

            <button className="cta-button" onClick={handleOpenPopup}>
              PLAN MY INCENTIVE TRAVEL PROGRAM
            </button>
          </div>
        </div>

        <div className="right-section" ref={formRef}>
          <form className="form-card" onSubmit={handleSubmit}>
            <h2>Get in Touch</h2>

            <input
              ref={inputRef}
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="type"
                  value="Individual"
                  checked={formData.type === "Individual"}
                  onChange={handleChange}
                />
                Individual
              </label>

              <label>
                <input
                  type="radio"
                  name="type"
                  value="Company"
                  checked={formData.type === "Company"}
                  onChange={handleChange}
                />
                Company
              </label>
            </div>

            <input
              type="text"
              name="company"
              placeholder="Company Name"
              value={formData.company}
              onChange={handleChange}
            />

            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* INFO */}

      <div className="incentive-info-section">
        <div className="info-image"></div>

        <div className="info-content">
          <p className="info-text">
            At ExpressEarth, we design incentive travel programs that inspire,
            reward, and accelerate performance.
          </p>

          <p className="info-text">
            From curated travel packages to fully customized corporate tour
            packages, we help companies turn appreciation into unforgettable
            journeys.
          </p>

          <button className="outline-btn" onClick={handleOpenPopup}>
            Plan Your Incentive Travel Program
          </button>

          <p className="closing-text">
            When people feel valued, performance naturally multiplies
          </p>
        </div>
      </div>

      {/* PREMIUM */}

      <div className="premium-section">
        <div className="premium-container">
          <div className="premium-images">
            <img src={IP_2} alt="" />
          </div>

          <div className="premium-content">
            <h2>
              Premium Incentive Travel Solutions <br />
              for High-Performing Teams
            </h2>

            <p>
              Whether you’re rewarding top performers or motivating your
              workforce, ExpressEarth delivers seamless corporate travel
              experiences across India and global destinations.
            </p>

            <p>
              From luxury escapes to adventure-driven group travel packages, we
              design memorable journeys backed by trusted MICE services and
              flawless execution.
            </p>

            <button className="premium-btn" onClick={handleOpenPopup}>
              Let’s Discuss Your Incentive Travel Goals
            </button>
          </div>
        </div>
      </div>

      {/* DESTINATION */}

      <div className="destination-section">
        <h2 className="destination-heading">
          Our Best Destinations for Incentive Travel
        </h2>

        <div className="destination-content">
          <div className="destination-left">
            <p className="highlight-text">
              Where your team’s achievements meet world-class experiences.
            </p>

            <p>
              From sun-soaked coastlines to vibrant cityscapes, cultural
              escapes, and peaceful retreats, our curated destination portfolio
              is designed to inspire, motivate, and deliver unforgettable reward
              journeys.
            </p>

            <button className="destination-btn" onClick={handleOpenPopup}>
              Discover Our Signature Incentive Destinations
            </button>
          </div>

          {/* RIGHT SLIDER */}

          <div className="destination-right">
            <div
              className="card-track"
              style={{
                transform: `translateX(-${activeIndex * 250}px)`,
              }}
            >
              {destinations.map((dest, index) => {
                const isActive = index === activeIndex;

                return (
                  <div
                    key={index}
                    className={`destination-image ${isActive ? "active" : ""}`}
                  >
                    <img src={dest.image} alt={dest.name} />

                    <h3 className="card-title">{dest.name}</h3>

                    {isActive && <div className="check-circle">✓</div>}
                  </div>
                );
              })}
            </div>

            <div className="slider-controls">
              <button onClick={prevSlide}>←</button>
              <button onClick={nextSlide}>→</button>
            </div>
          </div>
        </div>
      </div>

      {/* SERVICES */}

      <div className="services-section">
        <h2 className="services-heading">Our Incentive Travel Services</h2>

        <div className="slider-window">
          <div
            className="services-track"
            style={{
              transform: `translateX(-${serviceIndex * (100 / visibleServiceCards)}%)`,
            }}
          >
            {services.map((item, index) => (
              <div className="service-card" key={index}>
                <h3>{item.title}</h3>
                <div className="card-line"></div>
                <p>{item.text}</p>
                <button className="card-btn" onClick={handleOpenPopup}>
                  {item.btn}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          <button onClick={prevService}>◀</button>
          <button onClick={nextService}>▶</button>
        </div>
      </div>

      {/* GALLERY */}

      <section className="gallerySection">
        <div className="galleryHeader">
          <h2>Our Incentive Travel Gallery</h2>
          <p>A showcase of moments we’ve created for our clients.</p>
        </div>

        <div className="galleryRow">
          <div className="galleryText">
            <p>
              From leadership summits to high performer retreats, here’s a
              glimpse of the experiences we’ve delivered in different
              destinations, each designed with precision and luxury.
            </p>

            <button className="galleryBtn" onClick={handleOpenPopup}>
              View the Photo Gallery
            </button>
          </div>

          <div>
            <div className="galleryImages">
              {galleryImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className={index === galleryIndex ? "active" : ""}
                />
              ))}
            </div>

            <div className="galleryNav">
              <button onClick={prevGallery}>←</button>
              <button onClick={nextGallery}>→</button>
            </div>
          </div>
        </div>
      </section>

      {/* WHY */}

      <section className="incentive-why-section">
        <div className="incentive-why-container">
          <h2 className="incentive-why-main-title">
            Why Companies Choose ExpressEarth for Incentive Travel
          </h2>

          <div className="incentive-why-content">
            <div className="incentive-why-left">
              <h3 className="incentive-why-subtitle">
                Your Team. Our Expertise. Zero Stress.
              </h3>

              <div className="incentive-why-item">
                <h4>Custom-Designed Incentive Travel Programs</h4>
                <p>Built around your goals and reward strategy.</p>
              </div>

              <div className="incentive-why-item">
                <h4>Global Network of Premium Partners</h4>
                <p>
                  Access luxury resorts, unique experiences, and international
                  expertise.
                </p>
              </div>

              <div className="incentive-why-item">
                <h4>Flawless Planning & Execution</h4>
                <p>
                  The reliability is trusted by global corporations and business
                  leaders.
                </p>
              </div>

              <div className="incentive-why-item">
                <h4>Value-Driven, Experience-Led Travel Design</h4>
                <p>
                  We ensure every incentive trip delivers measurable impact.
                </p>
              </div>
            </div>

            <div className="incentive-why-right">
              <div className="incentive-why-image-card">
                <img src={why1} alt="" />
              </div>

              <div className="incentive-why-image-card">
                <img src={why2} alt="" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="incentive-faq-section">
        <div className="incentive-faq-inner">
          <div className="incentive-faq-grid">
            <div className="incentive-faq-content">
              <div className="incentive-faq-header">
                <p className="incentive-faq-tag">FAQ</p>
                <p className="incentive-faq-eyebrow">
                  Frequently Asked Questions
                </p>
                {/* <h2 className="incentive-faq-title">
                  Common questions about incentive travel programs
                </h2> */}
              </div>

              <div className="incentive-faq-list">
                {faqs.map((faq, faqIndex) => (
                  <div
                    className={`incentive-faq-item ${
                      activeFAQ === faqIndex ? "active" : ""
                    }`}
                    key={faq.question}
                  >
                    <button
                      className="incentive-faq-question"
                      type="button"
                      onClick={() => toggleFAQ(faqIndex)}
                      aria-expanded={activeFAQ === faqIndex}
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`incentive-faq-icon ${
                          activeFAQ === faqIndex ? "open" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {activeFAQ === faqIndex && (
                      <p className="incentive-faq-answer">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="incentive-faq-form-wrap">
              <h3 className="incentive-faq-form-title">
                Ask a different question
              </h3>

              <form className="incentive-faq-form" onSubmit={handleFaqSubmit}>
                <label className="incentive-faq-field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={faqForm.name}
                    onChange={handleFaqFormChange("name")}
                    required
                  />
                </label>

                <label className="incentive-faq-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    value={faqForm.email}
                    onChange={handleFaqFormChange("email")}
                    required
                  />
                </label>

                <label className="incentive-faq-field incentive-faq-field-message">
                  <span>Message</span>
                  <textarea
                    rows="4"
                    value={faqForm.message}
                    onChange={handleFaqFormChange("message")}
                    required
                  />
                </label>

                <button type="submit" className="incentive-faq-submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* REWARD CTA */}

      <section
        className="reward-section"
        style={{ backgroundImage: `url(${meeting})` }}
      >
        <div className="reward-overlay"></div>

        <div className="reward-content">
          <h2>Ready to Reward Your Top Performers?</h2>

          <p>
            Let’s create an incentive travel experience that inspires loyalty,
            builds motivation, and drives real business results.
          </p>

          <button className="reward-btn" onClick={handleOpenPopup}>
            Speak to Our Incentive Travel Experts Today
          </button>
        </div>
      </section>
    </div>
  );
};

export default IncentivePage;
