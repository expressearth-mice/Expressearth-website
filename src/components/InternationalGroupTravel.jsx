import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axios";
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

const internationalServices = [
  {
    img: IT_3,
    title: "End-to-End International Group Travel Planning",
    text: " We manage complete international tour packages, including flights, visas, premium hotels, transfers, curated experiences, and travel assistance, delivered seamlessly for groups of all sizes.",
    btn: "START PLANNING",
  },
  {
    img: IT_4,
    title: "Luxury International Holiday Packages",
    text: "Our international holiday packages are designed for comfort, exclusivity, and smooth experiences, ensuring your group travels stress-free while enjoying the finest global destinations.",
    btn: "VIEW DESTINATIONS",
  },
  {
    img: IT_5,
    title: "Group Tour Packages International",
    text: "From leadership groups to corporate delegations, our group tour packages focus on refined travel, balanced itineraries, and memorable shared experiences.",
    btn: "REQUEST A PLAN",
  },
  {
    img: IT_3,
    title: " Foreign Tour Packages & World Tour Packages",
    text: "We curate premium foreign tour packages and exclusive world tour packages, combining multiple destinations into a cohesive, well-paced international journey.",
    btn: "Explore World Tours",
  },
  {
    img: IT_4,
    title: "International Holiday & Travel Packages",
    text: "Our international holiday packages and travel packages are tailored for groups seeking refined leisure with professional planning standards.",
    btn: "Talk to an Expert",
  },
];

const faqs = [
  {
    question: "What is included in an international group tour package?",
    answer:
      "An international group tour package includes flights, visas, accommodation, transfers, curated experiences, and complete travel management. As a MICE expert in India, ExpressEarth ensures a seamless and well-coordinated journey.",
  },
  {
    question: "Does ExpressEarth handle everything for international travel?",
    answer:
      "Yes, ExpressEarth is an end-to-end service provider, managing everything from itinerary planning and bookings to on-ground coordination, so your group can travel stress-free.",
  },
  {
    question: "Can international travel packages be customized for our group?",
    answer:
      "Absolutely. Every international trip is tailored based on your group size, preferences, pace, and travel goals, ensuring a personalized and well-balanced experience.",
  },
  {
    question: "Do you offer multi-country or world tour packages?",
    answer:
      "Yes, ExpressEarth curates foreign tour packages and world tour packages, combining multiple destinations into a seamless, well-planned global journey.",
  },
  {
    question: "Which destinations do you cover for international group travel?",
    answer:
      "We organize travel across Asia, Europe, the Middle East, and beyond, backed by our expertise as a MICE expert, delivering consistent quality across global destinations.",
  },
];

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
        "InternationalGroupTravel submit error:",
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
        phone: "1234567890",
        event_date: null,
        event_type: faqForm.message || "International Group Travel FAQ Question",
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
        "InternationalGroupTravel FAQ submit error:",
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
      {/* HERO SECTION */}

      <section className="travel-section">
        <div className="travel-left">
          <div className="travel-content">
            <h1>International Group Traveler</h1>

            <p className="travel-sub">
              International Group Tour Packages | International Tour Packages
              International Holiday Packages | Corporate Group Travel Foreign
              Tour Packages | World Tour Packages
            </p>

            <div className="travel-line"></div>

            <p className="travel-tag">
              Where Global Journeys Bring Teams Together.
            </p>

            <button className="travel-btn" onClick={handleOpenPopup}>
              PLAN MY INTERNATIONAL GROUP TRAVEL
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
              <p>
                At ExpressEarth, we design premium international group tour
                packages that combine comfort, seamless planning, and meaningful
                experiences. Our international holiday packages and
                international trip packages are crafted for corporates and
                professional groups seeking refined global travel.
              </p>

              <p>
                From single-destination journeys to complete world tour
                packages, every itinerary reflects precision, exclusivity, and
                global standards.
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
            <h2>Your Trusted Partner for International Group Tour Packages </h2>

            <p>
              As a premium corporate travel and MICE company, ExpressEarth
              delivers managed international group tour packages across top
              global destinations. Our experience spans Asia, Europe, the Middle
              East, and beyond; executed with precision, discretion, and
              attention to detail.
            </p>

            <p>
              From foreign travel packages to high-end world tour packages, we
              handle everything from itinerary design and accommodation to
              logistics, experiences, and on-ground coordination.
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
              Why Choose ExpressEarth for
              <br />
              International Group Travel
            </h2>

            <h4>Your Global Vision. Our Expertise. Seamless Execution.</h4>

            <div className="why-item">
              <h5>Experts in International Group Tour Packages</h5>
              <p>
                We specialize in managing complex international group tour
                packages with ease and precision.
              </p>
            </div>

            <div className="why-item">
              <h5>Premium International Travel Experiences</h5>
              <p>
                From best international holiday packages to curated global
                journeys, quality is never compromised.
              </p>
            </div>

            <div className="why-item">
              <h5>Tailored International Trip Packages</h5>
              <p>
                Every international trip package is customized to match your
                group’s objectives, pace, and expectations.
              </p>
            </div>

            <div className="why-item">
              <h5>Global Reach. Trusted Execution</h5>
              <p>
                Whether it’s a single destination or a complete world tour
                travel package, we deliver with consistency worldwide.
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
            <h2>Ready to Travel the World as a Group?</h2>

            <p>
              Let ExpressEarth transform your next international journey into a
              seamless, memorable, and expertly managed experience.
            </p>

            <button className="cta-btn" onClick={handleOpenPopup}>
              Speak to Our International Group Travel Specialists Today
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default InternationalGroupTravel;
