import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axios";
import "./ConferenceManagement.css";
import { trackFormSubmit, trackContact } from "../utils/fbPixel";
import CM_1 from "../assests/CM_1.png";
import CM_2 from "../assests/CM_2.png";
import CM_3 from "../assests/CM_3.png";
import CM_4 from "../assests/CM_4.jpg";
import CM_5 from "../assests/CM_5.jpg";
import CM_6 from "../assests/CM_6.png";
import PopupForm from "./popupForm";

const services = [
  {
    title: "End-to-End Conference Management",
    text: "Complete ownership of planning, coordination, vendor management, logistics, and on-ground execution for seamless conferences.",
    btn: "Start Conference Planning",
  },
  {
    title: "Corporate Conferences & Leadership Events",
    text: "Expert planning for corporate conference services, leadership conference planning, and corporate summit planners, ensuring content flow, delegate experience, and executive presence are handled with precision.",
    btn: "Plan a Corporate Conference",
  },
  {
    title: "Meetings, Seminars & Business Conferences",
    text: "Structured meeting and conference planning by experienced business meeting planners and seminar event organizers, tailored to organisational goals and audience profiles.",
    btn: "Plan a Business Meeting",
  },
  {
    title: "Venue, Delegate & Logistics Management",
    text: "Professional conference venue planning, delegate coordination, registrations, travel, and accommodation management for smooth operations at scale.",
    btn: "Plan Your Conference Venue",
  },
  {
    title: "Large Conferences, Conventions & Trade Events",
    text: "Specialised solutions for large conference organizers, annual conference management, convention planning services, and trade conference management, built for scale, compliance, and control.",
    btn: " Manage a Large-Scale Conference",
  },
];

const whyChooseCards = [
  {
    num: "01",
    title: "Experienced Conference Event Planners",
    text: "We bring deep expertise as conference organizers, managing multi-day, multi-stakeholder conferences.",
  },
  {
    num: "02",
    title: "Strategic Corporate Conference Planning",
    text: "Our planning approach aligns objectives, audience engagement, content flow, and logistics.",
  },
  {
    num: "03",
    title: "End-to-End Conference Event Management",
    text: "From planning to post-event closure, we manage every layer of conference execution.",
  },
  {
    num: "04",
    title: "Trusted MICE Conference Organizers",
    text: "We deliver structured, scalable conference solutions for national and international MICE programs.",
  },
];

const faqs = [
  {
    question: "What does ExpressEarth handle in conference management?",
    answer:
      "ExpressEarth manages everything from planning, venue selection, and logistics to delegate management and on-ground execution. As a MICE expert in India, every conference is delivered with structure and precision.",
  },
  {
    question: "Do you provide end-to-end conference management services?",
    answer:
      "Yes, ExpressEarth is an end-to-end service provider, handling everything from concept planning and vendor coordination to execution and post-event closure.",
  },
  {
    question: "Can conferences be customized based on our business needs?",
    answer:
      "Absolutely. Every conference is strategically planned based on your objectives, audience, and industry requirements, ensuring meaningful engagement and effective outcomes.",
  },
  {
    question: "Do you manage large-scale conferences and conventions?",
    answer:
      "Yes, ExpressEarth specializes in large conferences, conventions, and multi-day events, delivering seamless execution as experienced MICE conference organizers.",
  },
  {
    question: "Do you handle delegate management and logistics as well?",
    answer:
      "Yes, ExpressEarth takes care of registrations, travel, accommodation, and complete delegate coordination, ensuring a smooth and well-managed conference experience.",
  },
];

const ConferenceManagement = () => {
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(0);

  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 768 ? 1 : 3,
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Company",
    company: "",
  });

  const [faqForm, setFaqForm] = useState({
    name: "",
    email: "",
    message: "",
  });

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
        type: "ConferenceManagement",
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
        "ConferenceManagement submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting form");
    }
  };

  useEffect(() => {
    const updateVisibleCards = () => {
      setVisibleCards(window.innerWidth <= 768 ? 1 : 3);
    };

    updateVisibleCards();
    window.addEventListener("resize", updateVisibleCards);

    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  useEffect(() => {
    setIndex((currentIndex) =>
      Math.min(currentIndex, Math.max(services.length - visibleCards, 0)),
    );
  }, [visibleCards]);

  const nextSlide = () => {
    if (index < services.length - visibleCards) {
      setIndex(index + 1);
    }
  };

  const prevSlide = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleFaqFormChange = (key) => (e) => {
    setFaqForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();

    try {
      trackFormSubmit({
        name: "ConferenceManagement FAQ Inquiry",
        email: faqForm.email,
        message: faqForm.message,
        type: "ConferenceManagement_FAQ",
      });

      const payload = {
        full_name: faqForm.name,
        company_name: null,
        email: faqForm.email,
        phone: "1234567890",
        event_date: null,
        event_type: faqForm.message || "Conference Management FAQ Question",
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
        "ConferenceManagement FAQ submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting your question");
    }
  };

  const toggleFAQ = (faqIndex) => {
    setActiveFAQ((currentFAQ) => (currentFAQ === faqIndex ? null : faqIndex));
  };

  return (
    <>
      {showPopup && <PopupForm onClose={handleClosePopup} />}

      <section className="cm-hero">
        <div className="cm-form-wrapper" ref={formRef}>
          <form className="cm-form-card" onSubmit={handleSubmit}>
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

            <div className="cm-radio-group">
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

            <button type="submit" className="cm-submit-btn">
              Submit
            </button>
          </form>
        </div>

        <div className="cm-hero-content">
          <div className="cm-hero-copy">
            <h1>Conference Management</h1>

            <p className="cm-sub">
              Conference Management | Corporate Conference Planning | Conference
              Event Management | MICE Conference Organizers | Convention
              Planning Services
            </p>

            <div className="cm-line"></div>

            <p className="cm-tag">
              Where Conferences Are Planned With Precision.
              <br />
              Executed With Control.
            </p>

            <button className="cm-btn" onClick={handleOpenPopup}>
              PLAN YOUR CONFERENCE
            </button>
          </div>
        </div>
      </section>

      <section className="cm-curated-section">
        <div className="cm-curated-left">
          <div className="cm-arrow-row cm-arrow-top">
            <span>&lsaquo;&lsaquo;&lsaquo;&lsaquo;</span>
          </div>

          <h2>
            Curated Conference
            <br />
            Management &amp; Planning
            <br />
            Services
          </h2>

          <p>
            At ExpressEarth, we deliver end-to-end conference management
            solutions designed for organisations that value clarity, structure,
            and flawless execution. As experienced conference event planners and
            conference organizers, we manage complex conferences, summits, and
            conventions with strategic planning and seamless delivery.
          </p>

          <button className="cm-curated-btn" onClick={handleOpenPopup}>
            Plan Your Corporate Conference
          </button>

          <div className="cm-arrow-row cm-arrow-bottom">
            <span>&rsaquo;&rsaquo;&rsaquo;&rsaquo;</span>
          </div>
        </div>

        <div className="cm-curated-right">
          <div className="cm-curated-bg-shape"></div>
          <img
            className="cm-img-small"
            src={CM_1}
            alt="Conference planning board"
          />
          <img
            className="cm-img-large"
            src={CM_2}
            alt="Conference strategy workspace"
          />
        </div>
      </section>

      <section className="cm-trusted-section">
        <div className="cm-trusted-left">
          <h2>
            Your Trusted Conference
            <br />
            Management Company
          </h2>

          <p className="cm-trusted-intro">
            As a full-service conference management company, ExpressEarth
            supports organisations with structured conference planning services
            across industries and scales.
          </p>

          <img
            className="cm-trusted-image"
            src={CM_3}
            alt="Conference venue setup"
          />

          <p className="cm-trusted-note">
            Every conference is planned with intent, coordination, and control;
            ensuring leadership confidence, delegate engagement, and operational
            excellence.
          </p>

          <button className="cm-trusted-btn" onClick={handleOpenPopup}>
            Discuss Your Conference Planning Requirements
          </button>
        </div>

        <div className="cm-trusted-right">
          <div className="cm-trusted-pill">Our expertise spans</div>

          <div className="cm-expertise-list">
            <div className="cm-expertise-item">
              <span className="cm-expertise-num">01</span>
              <p>Corporate conference planning</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">02</span>
              <p>Business conference organizers</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">03</span>
              <p>Conference event management</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">04</span>
              <p>Meeting and conference planning</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">05</span>
              <p>Seminar event organizers</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">06</span>
              <p>MICE conference organizers</p>
            </div>
          </div>
        </div>
      </section>

      {/* -------- SECTION 4 : SERVICES SLIDER -------- */}

      <section className="services-section">
        <h2 className="services-heading">Our Conference Management Services</h2>

        <div className="slider-window">
          <div
            className="services-track"
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {services.map((item, i) => (
              <div className="service-card" key={i}>
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
          <button onClick={prevSlide}>◀</button>

          <button onClick={nextSlide}>▶</button>
        </div>
      </section>

      <section className="cm-why-section">
        <div className="cm-why-media">
          <img
            className="cm-why-img"
            src={CM_4}
            alt="Conference team portrait"
          />
          <img
            className="cm-why-img"
            src={CM_5}
            alt="Conference event group photo"
          />
        </div>

        <div className="cm-why-content">
          <h2>
            Why Choose ExpressEarth
            <br />
            for Conference Management
          </h2>

          <p className="cm-why-sub">
            Conferences That Communicate Authority. Execution That Never
            Falters.
          </p>

          <div className="cm-why-grid">
            {whyChooseCards.map((item) => (
              <article className="cm-why-card" key={item.num}>
                <h3>
                  {item.num}. {item.title}
                </h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="cm-faq-section">
        <div className="cm-faq-inner">
          <div className="cm-faq-grid">
            <div className="cm-faq-content">
              <div className="cm-faq-header">
                <p className="cm-faq-tag">FAQ</p>
                <p className="cm-faq-eyebrow">Frequently Asked Questions</p>
                {/* <h2 className="cm-faq-title">
                  Common questions about conference management
                </h2> */}
              </div>

              <div className="cm-faq-list">
                {faqs.map((faq, faqIndex) => (
                  <div
                    className={`cm-faq-item ${
                      activeFAQ === faqIndex ? "active" : ""
                    }`}
                    key={faq.question}
                  >
                    <button
                      className="cm-faq-question"
                      type="button"
                      onClick={() => toggleFAQ(faqIndex)}
                      aria-expanded={activeFAQ === faqIndex}
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`cm-faq-icon ${
                          activeFAQ === faqIndex ? "open" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {activeFAQ === faqIndex && (
                      <p className="cm-faq-answer">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="cm-faq-form-wrap">
              <h3 className="cm-faq-form-title">Ask a different question</h3>

              <form className="cm-faq-form" onSubmit={handleFaqSubmit}>
                <label className="cm-faq-field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={faqForm.name}
                    onChange={handleFaqFormChange("name")}
                    required
                  />
                </label>

                <label className="cm-faq-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    value={faqForm.email}
                    onChange={handleFaqFormChange("email")}
                    required
                  />
                </label>

                <label className="cm-faq-field cm-faq-field-message">
                  <span>Message</span>
                  <textarea
                    rows="4"
                    value={faqForm.message}
                    onChange={handleFaqFormChange("message")}
                    required
                  />
                </label>

                <button type="submit" className="cm-faq-submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="cm-final-cta-section">
        <h2 className="cm-final-cta-heading">
          Ready to Plan a Conference That Delivers Impact?
        </h2>

        <div className="cm-final-cta-image-wrap">
          <img
            className="cm-final-cta-image"
            src={CM_6}
            alt="Conference auditorium stage setup"
          />
        </div>

        <p className="cm-final-cta-text">
          Let ExpressEarth manage your next conference with precision,
          structure, and professional excellence.
        </p>

        <button className="cm-final-cta-btn" onClick={handleOpenPopup}>
          Speak to Our Conference Management Specialists Today
        </button>
      </section>
    </>
  );
};

export default ConferenceManagement;
