import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axios";
import { isSuccessfulContactResponse } from "../utils/contactResponse";
import { trackConfirmedLead } from "../utils/leadTracking";
import "./InternationalGroupTravel.css";
import IT_1 from "../assests/IT_Travel.jpg";
import IT_2 from "../assests/IT_Hand.webp";
import IT_3 from "../assests/IT_Slide1.png";
import IT_4 from "../assests/IT_Slide2.png";
import IT_5 from "../assests/IT_slide3.png";
import IT_6 from "../assests/IT_Team(1).jpg";
import IT_7 from "../assests/IT_Team(2).jpg";
import IT_8 from "../assests/IT_Team(3).jpg";
import PopupForm from "./popupForm";
import ServiceStructuredData from "./ServiceStructuredData";

const internationalServices = [
  {
    img: IT_3,
    title: "End-to-End International Group Travel Planning",
    text: "Coordinate corporate group itineraries with destination research, flight and visa planning where required, accommodation, transfers, activities and on-ground support.",
    btn: "START PLANNING",
  },
  {
    img: IT_4,
    title: "Corporate Incentive & Reward Travel",
    text: "Plan employee and channel partner reward trips around group size, travel dates, budget, destination access and recognition objectives.",
    btn: "VIEW DESTINATIONS",
  },
  {
    img: IT_5,
    title: "Business Delegations & Meetings Abroad",
    text: "Coordinate accommodation, transfers and local logistics for corporate delegations attending meetings, conferences or trade events.",
    btn: "REQUEST A PLAN",
  },
  {
    img: IT_3,
    title: "Multi-City Corporate Group Itineraries",
    text: "Build multi-city itineraries with balanced travel time, accommodation, transfers and group activities based on the confirmed brief.",
    btn: "Discuss Multi-City Travel",
  },
  {
    img: IT_4,
    title: "Group Travel Coordination",
    text: "Plan participant communication, document collection, group movement and destination support in line with the agreed programme.",
    btn: "Talk to an Expert",
  },
];

const faqs = [
  {
    question: "What is included in an international group tour package?",
    answer:
      "Depending on the brief, the agreed scope can include flights, visa assistance where required, accommodation, transfers, activities and on-ground coordination. Specific inclusions are confirmed in the proposal.",
  },
  {
    question: "Does ExpressEarth handle everything for international travel?",
    answer:
      "The agreed scope can cover destination research, itinerary planning, accommodation, transfers, activities and on-ground coordination. Responsibilities and inclusions are confirmed in the proposal.",
  },
  {
    question: "Can international travel packages be customized for our group?",
    answer:
      "Yes. The itinerary can be shaped around group size, origin, travel dates, destination, budget, travel pace and programme objectives.",
  },
  {
    question: "Can you plan multi-country corporate group itineraries?",
    answer:
      "Multi-country itineraries can be considered when travel time, transit arrangements, entry requirements, dates and budget make the route practical.",
  },
  {
    question: "Which destinations do you cover for international group travel?",
    answer:
      "Destination options can be discussed across Asia, Europe and the Middle East. Feasibility depends on dates, group size, entry requirements, availability and budget.",
  },
];

const serviceDescription =
  "ExpressEarth plans international group travel for corporate teams and business delegations. Planning can include destination research, flights, accommodation, transfers, activities, visa assistance where required and on-ground coordination. The programme is shaped around group size, origin, travel dates, destination access and budget.";

const InternationalGroupTravel = () => {
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

    try {
      const payload = {
        full_name: formData.name,
        company_name: formData.type === "Company" ? formData.company : null,
        email: formData.email,
        phone: formData.phone,
        event_date: null,
        event_type: "Other",
      };

      const response = await axiosInstance.post("/api/contact/", payload);
      if (!isSuccessfulContactResponse(response)) {
        alert(response?.data?.error || "We couldn't confirm your enquiry. Please try again.");
        return;
      }

      trackConfirmedLead({
        serviceType: "international_group_travel",
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
      alert("Error submitting form. Please try again.");
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
      Math.min(
        currentIndex,
        Math.max(internationalServices.length - visibleCards, 0),
      ),
    );
  }, [visibleCards]);

  const nextSlide = () => {
    if (index < internationalServices.length - visibleCards) {
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
      const payload = {
        full_name: faqForm.name,
        company_name: null,
        email: faqForm.email,
        phone: faqForm.phone,
        event_date: null,
        event_type: "Other",
        requirements: faqForm.message,
      };

      const response = await axiosInstance.post("/api/contact/", payload);
      if (!isSuccessfulContactResponse(response)) {
        alert(response?.data?.error || "We couldn't confirm your question. Please try again.");
        return;
      }

      trackConfirmedLead({
        serviceType: "international_group_travel",
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
      alert("Error submitting your question. Please try again.");
    }
  };

  const toggleFAQ = (faqIndex) => {
    setActiveFAQ((currentFAQ) => (currentFAQ === faqIndex ? null : faqIndex));
  };

  return (
    <>
      <ServiceStructuredData
        name="Corporate International Group Travel Management"
        serviceType="International corporate group travel, incentive trips and business delegations"
        description={serviceDescription}
        url="https://www.expressearth.com/internationalgrouptravel"
      />
      {showPopup && <PopupForm onClose={handleClosePopup} />}
      {/* HERO SECTION */}

      <section className="travel-section">
        <div className="travel-left">
          <div className="travel-content">
            <h1>Corporate International Group Travel Management in Delhi NCR</h1>

            <p className="travel-sub">
              Corporate incentive trips | Business delegations | Group travel programmes
            </p>

            <div className="travel-line"></div>

            <p className="travel-tag">
              Where Global Journeys Bring Teams Together.
            </p>

            <button className="travel-btn" onClick={handleOpenPopup}>
              Discuss Your Group Travel Brief
            </button>
          </div>
        </div>

        {/* FORM */}

        <div className="travel-right" ref={formRef}>
          <form className="travel-form-card" onSubmit={handleSubmit}>
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

            <div className="travel-radio-group">
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

            <button type="submit" className="travel-submit-btn">
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* SECTION 2 */}

      <section className="group-travel-section">
        <div className="group-travel-container">
          <h2 className="group-travel-heading">
            Curated International Group Travel Experiences
          </h2>

          <div className="group-travel-grid">
            {/* LEFT TEXT */}

            <div className="group-travel-text">
              <p>{serviceDescription}</p>

              <p>
                Itinerary options are reviewed against group size, origin,
                travel dates, destination access, budget and programme
                objectives. Flight, visa and other inclusions are confirmed
                in the proposal.
              </p>

              <h3 className="travel-highlight">
                Plan Your International Group Travel
              </h3>

              <p className="travel-tagline">
                Where Global Travel Meets Purposeful Connections.
              </p>
            </div>

            {/* RIGHT IMAGE */}

            <div className="group-travel-image">
              <img src={IT_1} alt="International Group Travel" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}

      <section className="partner-section">
        <div className="partner-container">
          {/* LEFT IMAGE */}

          <div className="partner-image">
            <img src={IT_2} alt="International Travel" />
          </div>

          {/* RIGHT CONTENT */}

          <div className="partner-content">
            <h2>International Group Travel Planning for Corporate Teams</h2>

            <p>
              We coordinate international travel arrangements for corporate
              groups, incentive trips and business delegations. Destination
              options are assessed against group size, dates, travel
              requirements and budget.
            </p>

            <p>
              The agreed scope can include itinerary design, hotel
              coordination, transfers, activities, participant communication
              and destination support. Visa and entry requirements remain
              subject to the relevant authorities and traveller eligibility.
            </p>

            <button className="partner-btn" onClick={handleOpenPopup}>
              Discuss Your International Group Travel Plans
            </button>
          </div>
        </div>
      </section>

      {/* -------- SECTION : INTERNATIONAL GROUP TRAVEL SERVICES -------- */}

      <section className="services-section">
        <h2 className="services-heading">
          Our International Group Travel Services
        </h2>

        <div className="slider-window">
          <div
            className="services-track"
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {internationalServices.map((item, i) => (
              <div className="intl-card" key={i}>
                <img src={item.img} alt="" />

                <div className="intl-card-content">
                  <h3>{item.title}</h3>

                  <div className="card-line"></div>

                  <p>{item.text}</p>

                  <button className="card-btn" onClick={handleOpenPopup}>
                    {item.btn}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="slider-controls">
          <button onClick={prevSlide}>◀</button>
          <button onClick={nextSlide}>▶</button>
        </div>
      </section>

      {/* -------- SECTION : WHY CHOOSE EXPRESSEARTH -------- */}

      <section className="why-international-section">
        <div className="why-international-container">
          {/* LEFT CONTENT */}

          <div className="why-international-left">
            <h2>
              International Group Travel Planning Scope
              <br />
            </h2>

            <h4>Destination, itinerary and group logistics shaped around your brief.</h4>

            <div className="why-item">
              <h5>Corporate Group Programme Planning</h5>
              <p>
                Shape the itinerary around group size, origin, travel dates, budget and programme objectives.
              </p>
            </div>

            <div className="why-item">
              <h5>Travel and Accommodation Coordination</h5>
              <p>
                Coordinate flight options, accommodation requirements, transfers and group movement based on the confirmed brief.
              </p>
            </div>

            <div className="why-item">
              <h5>Itinerary Planning</h5>
              <p>
                Balance sightseeing, group activities, business sessions and free time according to the programme format.
              </p>
            </div>

            <div className="why-item">
              <h5>Destination and Entry Checks</h5>
              <p>
                Review travel documentation and destination entry requirements as part of planning; approvals remain with the relevant authorities.
              </p>
            </div>
          </div>

          {/* RIGHT IMAGES */}

          <div className="why-international-right">
            <img src={IT_6} alt="Team Event" />

            <img src={IT_7} alt="Corporate Group" />
          </div>
        </div>
      </section>

      <section className="travel-faq-section">
        <div className="travel-faq-inner">
          <div className="travel-faq-grid">
            <div className="travel-faq-content">
              <div className="travel-faq-header">
                <p className="travel-faq-tag">FAQ</p>
                <p className="travel-faq-eyebrow">Frequently Asked Questions</p>
                {/* <h2 className="travel-faq-title">
                  Common questions about international group travel
                </h2> */}
              </div>

              <div className="travel-faq-list">
                {faqs.map((faq, faqIndex) => (
                  <div
                    className={`travel-faq-item ${
                      activeFAQ === faqIndex ? "active" : ""
                    }`}
                    key={faq.question}
                  >
                    <button
                      className="travel-faq-question"
                      type="button"
                      onClick={() => toggleFAQ(faqIndex)}
                      aria-expanded={activeFAQ === faqIndex}
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`travel-faq-icon ${
                          activeFAQ === faqIndex ? "open" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {activeFAQ === faqIndex && (
                      <p className="travel-faq-answer">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="travel-faq-form-wrap">
              <h3 className="travel-faq-form-title">Ask a different question</h3>

              <form className="travel-faq-form" onSubmit={handleFaqSubmit}>
                <label className="travel-faq-field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={faqForm.name}
                    onChange={handleFaqFormChange("name")}
                    required
                  />
                </label>

                <label className="travel-faq-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    value={faqForm.email}
                    onChange={handleFaqFormChange("email")}
                    required
                  />
                </label>

                <label className="travel-faq-field">
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

                <label className="travel-faq-field travel-faq-field-message">
                  <span>Message</span>
                  <textarea
                    rows="4"
                    value={faqForm.message}
                    onChange={handleFaqFormChange("message")}
                    required
                  />
                </label>

                <button type="submit" className="travel-faq-submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA GROUP TRAVEL SECTION */}

      <section className="group-travel-cta">
        <div className="cta-overlay">
          <div className="cta-content">
            <h2>Planning an International Corporate Group Trip?</h2>

            <p>
              Share the origin, destination, group size, dates and budget range to discuss feasibility and the proposed scope.
            </p>

            <button className="cta-btn" onClick={handleOpenPopup}>
              Share Your International Group Travel Brief
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default InternationalGroupTravel;
