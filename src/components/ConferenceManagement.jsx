import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import "./ConferenceManagement.css";
import { trackConfirmedLead } from "../utils/leadTracking";
import { isSuccessfulContactResponse } from "../utils/contactResponse";
import CM_1 from "../assests/CM_1.png";
import CM_2 from "../assests/CM_2.png";
import CM_3 from "../assests/CM_3.png";
import CM_4 from "../assests/CM_4.jpg";
import CM_5 from "../assests/CM_5.jpg";
import CM_6 from "../assests/CM_6.png";
import PopupForm from "./popupForm";
import ServiceStructuredData from "./ServiceStructuredData";

const services = [
  {
    title: "End-to-End Conference Management",
    text: "Coordinate planning, suppliers, schedules, delegate logistics and on-site delivery according to the agreed conference scope.",
    btn: "Start Conference Planning",
  },
  {
    title: "Corporate Conferences & Leadership Events",
    text: "Plan leadership meetings, annual sales conferences and corporate summits around the agenda, speakers, audience and event format.",
    btn: "Plan a Corporate Conference",
  },
  {
    title: "Meetings, Seminars & Business Conferences",
    text: "Coordinate business meetings, seminars and multi-session programmes with schedules, venue arrangements and attendee support shaped around the brief.",
    btn: "Plan a Business Meeting",
  },
  {
    title: "Venue, Delegate & Logistics Management",
    text: "Arrange venue options, registration support, delegate communication, accommodation and group transfers when included in the event brief.",
    btn: "Plan Your Conference Venue",
  },
  {
    title: "Large Conferences, Conventions & Trade Events",
    text: "Support multi-day conferences, conventions and trade events with production, supplier coordination and delegate logistics based on programme requirements.",
    btn: " Manage a Large-Scale Conference",
  },
];

const whyChooseCards = [
  {
    num: "01",
    title: "Planning around your conference objectives",
    text: "We align the proposed format, agenda, venue and operating plan with the objectives and audience you share.",
  },
  {
    num: "02",
    title: "Venue and programme coordination",
    text: "We coordinate venue requirements, session flow, speaker needs and delegate movement within the agreed scope.",
  },
  {
    num: "03",
    title: "Delegate and supplier coordination",
    text: "Support can include supplier communication, registrations, travel, accommodation and on-site coordination.",
  },
  {
    num: "04",
    title: "India and international programme support",
    text: "We can discuss conference locations in India and overseas, subject to group requirements, dates and destination feasibility.",
  },
];

const faqs = [
  {
    question: "What does ExpressEarth handle in conference management?",
    answer:
      "The agreed scope can include venue sourcing, production, registration, delegate travel, accommodation, schedules and on-site coordination. Exact services depend on your event brief.",
  },
  {
    question: "Do you provide end-to-end conference management services?",
    answer:
      "ExpressEarth can coordinate planning through on-site delivery when that full scope is requested. Responsibilities are confirmed against the brief and proposal.",
  },
  {
    question: "Can conferences be customized based on our business needs?",
    answer:
      "Yes. The format, venue, agenda, production and delegate arrangements can be planned around your objectives, audience, dates and budget.",
  },
  {
    question: "Do you manage large-scale conferences and conventions?",
    answer:
      "We can discuss multi-day conferences and conventions. Feasibility and the required supplier and operations plan depend on location, attendance and programme complexity.",
  },
  {
    question: "Do you handle delegate management and logistics as well?",
    answer:
      "Delegate support can include registration, travel, accommodation, transfers and event-day coordination, depending on the agreed scope.",
  },
];

const serviceDescription =
  "ExpressEarth plans corporate conferences, leadership meets, annual sales conferences and seminars in Delhi NCR and across India. Depending on the brief, support can include venue sourcing, stage and AV coordination, registration, speaker and agenda logistics, accommodation, group transfers and on-site event management.";

const ConferenceManagement = () => {
  const formRef = useRef(null);
  const inputRef = useRef(null);

  const [showPopup, setShowPopup] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFaqSubmitting, setIsFaqSubmitting] = useState(false);

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
    phone: "",
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
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const payload = {
        full_name: formData.name,
        company_name: formData.type === "Company" ? formData.company : null,
        email: formData.email,
        phone: formData.phone,
        event_date: null,
        event_type: "Other",
        type: formData.type,
      };

      const response = await axiosInstance.post("/api/contact/", payload);
      if (!isSuccessfulContactResponse(response)) {
        alert(response?.data?.error || "We couldn't confirm your enquiry. Please try again.");
        return;
      }

      trackConfirmedLead({
        serviceType: "conference_management",
        formLocation: "primary",
      });

      alert("Form Submitted Successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "Company",
        company: "",
      });
    } catch {
      alert("Error submitting form");
    } finally {
      setIsSubmitting(false);
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
    if (isFaqSubmitting) return;
    setIsFaqSubmitting(true);

    try {
      const payload = {
        full_name: faqForm.name,
        company_name: null,
        email: faqForm.email,
        phone: faqForm.phone,
        event_date: null,
        event_type: faqForm.message || "Conference Management FAQ Question",
        type: "Individual",
      };

      const response = await axiosInstance.post("/api/contact/", payload);
      if (!isSuccessfulContactResponse(response)) {
        alert(response?.data?.error || "We couldn't confirm your question. Please try again.");
        return;
      }

      trackConfirmedLead({
        serviceType: "conference_management",
        formLocation: "faq_question",
      });

      alert("Your question has been submitted successfully");
      setFaqForm({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch {
      alert("Error submitting your question");
    } finally {
      setIsFaqSubmitting(false);
    }
  };

  const toggleFAQ = (faqIndex) => {
    setActiveFAQ((currentFAQ) => (currentFAQ === faqIndex ? null : faqIndex));
  };

  return (
    <>
      <ServiceStructuredData
        name="Corporate Conference Management"
        serviceType="Corporate conferences, leadership summits and annual sales meets"
        description={serviceDescription}
        url="https://www.expressearth.com/conferencemanagement"
      />
      {showPopup && <PopupForm onClose={handleClosePopup} />}

      <section className="cm-hero">
        <div className="cm-form-wrapper" ref={formRef}>
          <form className="cm-form-card" onSubmit={handleSubmit} aria-busy={isSubmitting}>
            <h2>Get in Touch</h2>

            <input
              ref={inputRef}
              type="text"
              name="name"
              autoComplete="name"
              aria-label="Full name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              autoComplete="email"
              aria-label="Work email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              inputMode="tel"
              autoComplete="tel"
              aria-label="Phone number"
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
              autoComplete="organization"
              aria-label="Company name"
              placeholder="Company Name"
              required={formData.type === "Company"}
              value={formData.company}
              onChange={handleChange}
            />

            <button type="submit" className="cm-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        <div className="cm-hero-content">
          <div className="cm-hero-copy">
            <h1>Corporate Conference Management in Delhi NCR &amp; India</h1>

            <p className="cm-sub">
              Corporate conferences | Leadership meets | Annual sales
              conferences | Seminars | Delegate management
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
            Corporate Conference
            <br />
            Planning and Management
            <br />
            Services
          </h2>

          <p>{serviceDescription} The proposed scope is shaped around your audience, programme, location and dates.</p>

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
            Conference Management Support
            <br />
            for Corporate Teams
          </h2>

          <p className="cm-trusted-intro">
            ExpressEarth coordinates conference planning for organisations
            that need support with venues, production, delegate logistics and
            on-site operations.
          </p>

          <img
            className="cm-trusted-image"
            src={CM_3}
            alt="Conference venue setup"
          />

          <p className="cm-trusted-note">
            Planning begins with your objectives, audience, event format, dates
            and budget. We then define the practical requirements and
            responsibilities for the agreed programme.
          </p>

          <button className="cm-trusted-btn" onClick={handleOpenPopup}>
            Discuss Your Conference Planning Requirements
          </button>
        </div>

        <div className="cm-trusted-right">
          <div className="cm-trusted-pill">Conference programme components</div>

          <div className="cm-expertise-list">
            <div className="cm-expertise-item">
              <span className="cm-expertise-num">01</span>
              <p>Leadership meetings and annual sales conferences</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">02</span>
              <p>Seminars and multi-session programmes</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">03</span>
              <p>Stage, audio-visual and production coordination</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">04</span>
              <p>Venue sourcing and event schedules</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">05</span>
              <p>Registration and delegate support</p>
            </div>

            <div className="cm-expertise-item">
              <span className="cm-expertise-num">06</span>
              <p>Accommodation, transfers and on-site logistics</p>
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
            Conference plans built around your audience, agenda and
            operating requirements.
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

              <form className="cm-faq-form" onSubmit={handleFaqSubmit} aria-busy={isFaqSubmitting}>
                <label className="cm-faq-field">
                  <span>Name</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={faqForm.name}
                    onChange={handleFaqFormChange("name")}
                    required
                  />
                </label>

                <label className="cm-faq-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={faqForm.email}
                    onChange={handleFaqFormChange("email")}
                    required
                  />
                </label>

                <label className="cm-faq-field">
                  <span>Phone Number</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    value={faqForm.phone}
                    onChange={handleFaqFormChange("phone")}
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

                <button type="submit" className="cm-faq-submit" disabled={isFaqSubmitting}>
                  {isFaqSubmitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <nav className="cm-related-services" aria-label="Related corporate event services">
        <p>Planning a wider corporate programme? Explore our <Link to="/corporate-events">corporate event management</Link>, <Link to="/dealermeet">dealer meet management</Link> and <Link to="/corporateoffsites">corporate offsite planning</Link> services.</p>
      </nav>

      <section className="cm-final-cta-section">
        <h2 className="cm-final-cta-heading">
          Planning a Corporate Conference in Delhi NCR or Elsewhere?
        </h2>

        <div className="cm-final-cta-image-wrap">
          <img
            className="cm-final-cta-image"
            src={CM_6}
            alt="Conference auditorium stage setup"
          />
        </div>

        <p className="cm-final-cta-text">
          Share your event dates, expected attendance, location and programme
          brief. ExpressEarth can help scope the venue, production, delegate
          and on-site requirements.
        </p>

        <button className="cm-final-cta-btn" onClick={handleOpenPopup}>
          Discuss Your Conference Requirements
        </button>
      </section>
    </>
  );
};

export default ConferenceManagement;
