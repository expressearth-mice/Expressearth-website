import React, { useEffect, useRef, useState } from "react";
import "./DealerMeet.css";
import dealerImg from "../assests/DE_2.jpeg";
import dealerImg2 from "../assests/DE_1.png";
import dealerImg3 from "../assests/DE_Team.jpg";
import IT_6 from "../assests/IT_Team(1).jpg";
import bg from "../assests/dealerbg.png";
import axiosInstance from "../api/axios";
import PopupForm from "./popupForm";
import { trackFormSubmit, trackContact } from "../utils/fbPixel";

const services = [
  {
    title: "End-to-End Dealer Meet Planning",
    text: "From strategy to execution, our dealer meet planning services cover every detail: venue, staging, content, logistics, branding, and hospitality.",
    btn: "Start Planning",
  },
  {
    title: "Stage, AV & Experience Design",
    text: "We deliver world-class setups using premium AV systems, LED screens, lighting, themed décor, and digital engagement, just like the top event management companies around the world.",
    btn: "See Experience Options",
  },
  {
    title: "Business Event Management",
    text: "As an expert business event organizer, we ensure your meeting supports real business goals: engagement, recognition, product awareness, and relationship-building.",
    btn: "Request a Custom Plan",
  },
  {
    title: "National & International Dealer Meets",
    text: "Whether you’re hosting in India or abroad, our dealer meets event planners and production teams to deliver seamless execution with global standards.",
    btn: "Explore Locations",
  },
  {
    title: "Corporate Event Planning",
    text: "We are a leading corporate event management company, handling conferences, leadership summits, award nights, and annual business gatherings for top brands across sectors.",
    btn: "Talk to a Planner",
  },
];

const faqs = [
  {
    question: "What exactly does ExpressEarth handle in a dealer meet?",
    answer:
      "ExpressEarth takes care of everything from planning and venue selection to production, logistics, and final execution, ensuring a smooth and impactful experience.",
  },
  {
    question: "Why should we choose ExpressEarth instead of managing it in-house?",
    answer:
      "With ExpressEarth as a MICE expert and corporate event management company, brands get better execution, stronger engagement, and a professionally managed event without the stress.",
  },
  {
    question: "Does ExpressEarth manage dealer meets end-to-end?",
    answer:
      "Yes, ExpressEarth is an end-to-end service provider, handling everything from concept creation and design to on-ground execution and coordination.",
  },
  {
    question: "Can ExpressEarth customize the dealer meet as per our business goals?",
    answer:
      "Absolutely. ExpressEarth designs every event based on your objectives—whether it’s dealer engagement, product launches, or recognition and reward programs.",
  },
  {
    question: "Can ExpressEarth organize dealer meets outside India as well?",
    answer:
      "Yes, ExpressEarth plans and executes dealer meets across India and international destinations, delivering global-standard experiences with seamless execution.",
  },
];

function DealerMeet() {
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

  const [subscribeEmail, setSubscribeEmail] = useState("");
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

      trackContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        type: "DealerMeet",
      });

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
        "DealerMeet submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting form");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      trackFormSubmit({
        name: "Newsletter Subscription",
        email: subscribeEmail,
        type: "DealerMeet_Email",
      });

      const payload = {
        full_name: subscribeEmail,
        company_name: null,
        email: subscribeEmail,
        phone: "1234567890",
        event_date: null,
        event_type: "Other",
        type: "Individual",
      };

      await axiosInstance.post("/api/contact/", payload);

      alert("Subscribed Successfully");

      setSubscribeEmail("");
    } catch (error) {
      console.log(
        "DealerMeet CTA submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error subscribing email");
    }
  };

  const handleFaqFormChange = (key) => (e) => {
    setFaqForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();

    try {
      trackFormSubmit({
        name: "DealerMeet FAQ Inquiry",
        email: faqForm.email,
        message: faqForm.message,
        type: "DealerMeet_FAQ",
      });

      const payload = {
        full_name: faqForm.name,
        company_name: null,
        email: faqForm.email,
        phone: "1234567890",
        event_date: null,
        event_type: faqForm.message || "Dealer Meet FAQ Question",
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
        "DealerMeet FAQ submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting your question");
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

  const toggleFAQ = (faqIndex) => {
    setActiveFAQ((currentFAQ) => (currentFAQ === faqIndex ? null : faqIndex));
  };

  return (
    <>
      {/* -------- SECTION 1 -------- */}

      {showPopup && <PopupForm onClose={handleClosePopup} />}
      <section className="dealer-section">
        <div className="dealer-left">
          <div className="dealer-content">
            <h1>Dealer Meet Organizers</h1>

            <p className="dealer-sub">
              Dealer Meets | Channel Partner Events | Product Launches
              <br />
              Dealer Engagement | Recognition Nights | End-to-End Event
              Management
            </p>

            <div className="line"></div>

            <p className="dealer-tag">
              Where Business Relationships Become Partnerships.
            </p>

            <button className="dealer-btn" onClick={handleOpenPopup}>
              PLAN MY DEALER MEET
            </button>
          </div>
        </div>

        <div className="dealer-right" ref={formRef}>
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
      </section>

      {/* -------- SECTION 2 -------- */}

      <section className="dealer-meet-section2">
        <div className="dealer-meet-text">
          <h2>
            Creating Dealer Meets That <br />
            Inspire, Influence & Drive Growth
          </h2>

          <p>
            At ExpressEarth, we specialize in curating high-impact dealer meet
            organizer solutions for brands that want more than just an event;
            they want a powerful platform to connect, motivate, reward, and
            energize their dealer networks.
          </p>

          <p>
            From concept to execution, our team designs experiences that
            showcase your brand, strengthen loyalty, and deliver business
            outcomes.
          </p>

          <h3>Let’s Plan Your Dealer Meet</h3>

          <p className="dealer-meet-last">
            When engagement is meaningful, growth becomes natural.
          </p>
        </div>

        <div className="dealer-meet-image">
          <img src={dealerImg} alt="Dealer Meet Event" />
        </div>
      </section>

      {/* -------- SECTION 3 -------- */}

      <section className="dealer-section3">
        <div className="decor-dots">
          <span className="dot-green"></span>
          <span className="dot-blue"></span>
        </div>

        <div className="section3-image">
          <img src={dealerImg2} alt="Dealer Event" />
        </div>

        <div className="section3-content">
          <h2>
            Your Partners in Powerful <br />
            Dealer Engagement
          </h2>

          <p>
            As one of India’s premium corporate event organizers, we bring the
            expertise, precision, and creativity needed to execute extraordinary
            dealer meets across India and global destinations.
          </p>

          <p>
            Whether it’s a product launch, a leadership address, an annual
            celebration, or a recognition event, we ensure flawless corporate
            event management at every step.
          </p>

          <button className="discuss-btn" onClick={handleOpenPopup}>
            Let’s Discuss Your Event
          </button>
        </div>
      </section>

      {/* -------- SECTION 4 : SERVICES SLIDER -------- */}

      <section className="services-section">
        <h2 className="services-heading">
          Our Dealer Meet Management Services
        </h2>

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

      {/* -------- SECTION 5 -------- */}

      <section className="dealer-why-section">
        <div className="dealer-why-container">
          <div className="dealer-why-left">
            <h2 className="dealer-why-title">
              Why Brands Choose <br /> ExpressEarth
            </h2>

            <p className="dealer-why-sub">
              Your Brand. Our Expertise. Zero Compromise.
            </p>

            <div className="dealer-why-image">
              <img src={IT_6} alt="Team Event" />
            </div>

            <h3 className="dealer-why-left-heading">
              Experienced Dealer Meet Organizers
            </h3>

            <p className="dealer-why-left-text">
              We handle everything, from invitations to final execution.
            </p>
          </div>

          <div className="dealer-why-right">
            <div className="dealer-why-item">
              <h3>Premium Corporate Event Management Services</h3>
              <p>
                The same precision trusted by large enterprises, global brands,
                and business leaders.
              </p>
            </div>

            <div className="dealer-why-item">
              <h3>Creative Concepts & High-Impact Production</h3>
              <p>
                We bring ideas to life with immersive setups and engagement-led
                formats.
              </p>
            </div>

            <div className="dealer-why-item">
              <h3>Seamless Execution Anywhere</h3>
              <p>
                From metro cities to international hubs, we operate with
                absolute reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="dealer-faq-section">
        <div className="dealer-faq-inner">
          <div className="dealer-faq-grid">
            <div className="dealer-faq-content">
              <div className="dealer-faq-header">
                <p className="dealer-faq-tag">FAQ</p>
                <p className="dealer-faq-eyebrow">Frequently Asked Questions</p>
                {/* <h2 className="dealer-faq-title">
                  Common questions about dealer meet planning
                </h2> */}
              </div>

              <div className="dealer-faq-list">
                {faqs.map((faq, faqIndex) => (
                  <div
                    className={`dealer-faq-item ${
                      activeFAQ === faqIndex ? "active" : ""
                    }`}
                    key={faq.question}
                  >
                    <button
                      className="dealer-faq-question"
                      type="button"
                      onClick={() => toggleFAQ(faqIndex)}
                      aria-expanded={activeFAQ === faqIndex}
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`dealer-faq-icon ${
                          activeFAQ === faqIndex ? "open" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {activeFAQ === faqIndex && (
                      <p className="dealer-faq-answer">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="dealer-faq-form-wrap">
              <h3 className="dealer-faq-form-title">Ask a different question</h3>

              <form className="dealer-faq-form" onSubmit={handleFaqSubmit}>
                <label className="dealer-faq-field">
                  <span>Name</span>
                  <input
                    type="text"
                    value={faqForm.name}
                    onChange={handleFaqFormChange("name")}
                    required
                  />
                </label>

                <label className="dealer-faq-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    value={faqForm.email}
                    onChange={handleFaqFormChange("email")}
                    required
                  />
                </label>

                <label className="dealer-faq-field dealer-faq-field-message">
                  <span>Message</span>
                  <textarea
                    rows="4"
                    value={faqForm.message}
                    onChange={handleFaqFormChange("message")}
                    required
                  />
                </label>

                <button type="submit" className="dealer-faq-submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* -------- SECTION 6 : CTA -------- */}
      <section
        className="dealer-cta-section"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="dealer-cta-overlay"></div>

        <div className="dealer-cta-content">
          <h2>Ready To Elevate Your Next Dealer Meet?</h2>

          <p>
            Let’s turn your dealer engagement strategy into an unforgettable
            experience.
          </p>

          <form className="dealer-cta-form" onSubmit={handleEmailSubmit}>
            <div className="dealer-input-wrapper">
              <span className="dealer-search-icon">🔍</span>

              <input
                type="email"
                placeholder="Your Email Address"
                value={subscribeEmail}
                required
                onChange={(e) => setSubscribeEmail(e.target.value)}
              />
            </div>

            <button type="submit" className="dealer-cta-submit">
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default DealerMeet;
