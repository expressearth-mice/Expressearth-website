import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./DealerMeet.css";
import dealerImg from "../assests/DE_2.jpeg";
import dealerImg2 from "../assests/DE_1.png";
import dealerImg3 from "../assests/DE_Team.jpg";
import IT_6 from "../assests/IT_Team(1).jpg";
import bg from "../assests/dealerbg.png";
import axiosInstance from "../api/axios";
import PopupForm from "./popupForm";
import { trackFormSubmit } from "../utils/fbPixel";
import { trackConfirmedLead } from "../utils/leadTracking";
import { isSuccessfulContactResponse } from "../utils/contactResponse";
import ServiceStructuredData from "./ServiceStructuredData";

const services = [
  {
    title: "End-to-End Dealer Meet Planning",
    text: "From strategy to execution, our dealer meet planning services cover every detail: venue, staging, content, logistics, branding, and hospitality.",
    btn: "Start Planning",
  },
  {
    title: "Stage, AV & Experience Design",
    text: "Coordinate stage design, AV, LED screens, lighting, décor and digital engagement based on your brief, venue and event objectives.",
    btn: "See Experience Options",
  },
  {
    title: "Business Event Management",
    text: "Plan dealer meets around your business objectives, such as dealer engagement, product awareness, recognition and relationship-building.",
    btn: "Request a Custom Plan",
  },
  {
    title: "National & International Dealer Meets",
    text: "Plan dealer meets in India or overseas, with venue, travel, production, hospitality and on-ground logistics coordinated around your programme.",
    btn: "Explore Locations",
  },
  {
    title: "Corporate Event Planning",
    text: "We can also coordinate related business events such as conferences, leadership summits, award nights and annual business gatherings.",
    btn: "Talk to a Planner",
  },
];

const faqs = [
  {
    question: "What exactly does ExpressEarth handle in a dealer meet?",
    answer:
      "Depending on the brief, the agreed scope can include venue sourcing, agenda coordination, stage and AV, delegate travel, accommodation, hospitality and on-site event management.",
  },
  {
    question: "Why should we choose ExpressEarth instead of managing it in-house?",
    answer:
      "An event partner can coordinate venue, production, travel, hospitality and on-site logistics against an agreed plan, giving your internal team a clear point of contact.",
  },
  {
    question: "Does ExpressEarth manage dealer meets end-to-end?",
    answer:
      "The agreed scope can cover concept development, supplier coordination, production, delegate logistics and on-ground execution.",
  },
  {
    question: "Can ExpressEarth customize the dealer meet as per our business goals?",
    answer:
      "The format can be planned around your objectives, dealer audience, product or business updates, recognition requirements, dates and budget.",
  },
  {
    question: "Can ExpressEarth organize dealer meets outside India as well?",
    answer:
      "We can plan dealer meets in India and overseas. Destination feasibility depends on your group size, dates, travel requirements and budget.",
  },
];

function DealerMeet() {
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

  const [subscribeEmail, setSubscribeEmail] = useState("");
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
        serviceType: "dealer_meet",
        formLocation: "primary",
        serviceSourcePage: "/dealermeet",
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

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("/api/subscribe/", {
        email: subscribeEmail,
      });

      trackFormSubmit({ type: "DealerMeet_Email", form_location: "newsletter" });

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
    if (isFaqSubmitting) return;
    setIsFaqSubmitting(true);

    try {
      const payload = {
        full_name: faqForm.name,
        company_name: null,
        email: faqForm.email,
        phone: faqForm.phone,
        event_date: null,
        event_type: faqForm.message || "Dealer Meet FAQ Question",
        type: "Individual",
      };

      const response = await axiosInstance.post("/api/contact/", payload);
      if (!isSuccessfulContactResponse(response)) {
        alert(response?.data?.error || "We couldn't confirm your question. Please try again.");
        return;
      }

      trackConfirmedLead({
        serviceType: "dealer_meet",
        formLocation: "faq_question",
        serviceSourcePage: "/dealermeet",
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
      <ServiceStructuredData
        name="Dealer and Distributor Meet Management"
        serviceType="Corporate dealer meets, distributor conferences and channel partner events"
        description="ExpressEarth plans dealer meets and distributor conferences for businesses in Delhi NCR and across India. Programmes can include business updates, product launches, training, recognition and relationship-building, with venue, stage and AV, branding, agenda, delegate travel, accommodation, hospitality and on-site operations coordinated according to the agreed scope."
        url="https://www.expressearth.com/dealermeet"
      />
      {/* -------- SECTION 1 -------- */}

      {showPopup && <PopupForm onClose={handleClosePopup} />}
      <section className="dealer-section">
        <div className="dealer-left">
          <div className="dealer-content">
            <h1>Dealer Meet Management in Delhi NCR &amp; India</h1>

            <p className="dealer-sub">
              Dealer and distributor conferences | Channel partner events
              <br />
              Product launches | Dealer engagement | Recognition programmes
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
          <form className="form-card" onSubmit={handleSubmit} aria-busy={isSubmitting}>
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
              autoComplete="organization"
              aria-label="Company name"
              placeholder="Company Name"
              required={formData.type === "Company"}
              value={formData.company}
              onChange={handleChange}
            />

            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
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
            ExpressEarth plans dealer meets and distributor conferences for
            businesses in Delhi NCR and across India. Programmes can bring
            channel partners together for business updates, product launches,
            training, recognition and relationship-building. The format and
            production plan depend on your audience, objectives, location and
            event dates.
          </p>

          <p>
            Depending on the agreed scope, coordination can include venue
            sourcing, stage and AV, branding, agenda flow, delegate travel,
            accommodation, hospitality and on-site event operations.
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
            We coordinate dealer meets in India and can discuss international
            destinations where they fit the brief, group size, travel
            requirements and budget.
          </p>

          <p>
            A programme may include a product launch, leadership address,
            annual business update, dealer awards or recognition event. The
            run-of-show and delivery responsibilities are agreed during
            planning.
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
              Planning, production and delegate coordination for your dealer network.
            </p>

            <div className="dealer-why-image">
              <img src={IT_6} alt="Team Event" />
            </div>

            <h3 className="dealer-why-left-heading">
              Dealer meet planning and coordination
            </h3>

            <p className="dealer-why-left-text">
              The agreed scope can include invitations, registrations, venue, production, travel and on-site coordination.
            </p>
          </div>

          <div className="dealer-why-right">
            <div className="dealer-why-item">
              <h3>Coordination across event workstreams</h3>
              <p>
                Bring venue, agenda, branding, production, hospitality and
                delegate logistics into one agreed event plan.
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
              <h3>India and international destination planning</h3>
              <p>
                Destination feasibility is assessed against dates, group size,
                travel needs and the programme budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      <nav className="dealer-related-services" aria-label="Related corporate event services">
        <p>Planning a broader channel programme? Explore our <Link to="/meetings-and-conferences">conference management</Link>, <Link to="/corporate-events">corporate event management</Link> and <Link to="/incentive-travel">incentive travel</Link> services.</p>
      </nav>

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

              <form className="dealer-faq-form" onSubmit={handleFaqSubmit} aria-busy={isFaqSubmitting}>
                <label className="dealer-faq-field">
                  <span>Name</span>
                  <input
                    type="text"
                    autoComplete="name"
                    value={faqForm.name}
                    onChange={handleFaqFormChange("name")}
                    required
                  />
                </label>

                <label className="dealer-faq-field">
                  <span>Email Address</span>
                  <input
                    type="email"
                    autoComplete="email"
                    value={faqForm.email}
                    onChange={handleFaqFormChange("email")}
                    required
                  />
                </label>

                <label className="dealer-faq-field">
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

                <label className="dealer-faq-field dealer-faq-field-message">
                  <span>Message</span>
                  <textarea
                    rows="4"
                    value={faqForm.message}
                    onChange={handleFaqFormChange("message")}
                    required
                  />
                </label>

                <button type="submit" className="dealer-faq-submit" disabled={isFaqSubmitting}>
                  {isFaqSubmitting ? "Submitting..." : "Submit"}
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
          <h2>Planning Your Next Dealer Meet or Distributor Conference?</h2>

          <p>
            Share your objectives, expected attendance, preferred location and
            dates to discuss a suitable dealer meet format and scope.
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
