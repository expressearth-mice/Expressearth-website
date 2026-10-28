import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axios";

import second from "../assests/Co_second.png";

import "./CorporateOffsitesPage.css";
import BgImage from "../assests/Co_Team_Bg.jpg";

import PopupForm from "./popupForm";

const services = [
  {
    title: "Team Offsites",
    text: "Give your teams a much-needed reset with engaging team offsites crafted for bonding, collaboration, and fun.",
    btn: "Share Your Offsite Brief",
  },
  {
    title: "Team Building Activities",
    text: "We offer curated indoor & outdoor team building activities, team bonding activities, and teamwork games, all tailored to strengthen team dynamics.",
    btn: "Talk to an Activity Specialist",
  },
  {
    title: "Leadership Retreats",
    text: "Exclusive corporate retreat programs designed for strategy, innovation, and high-impact decision-making in premium settings.",
    btn: "Plan a Leadership Retreat",
  },
  {
    title: "Corporate Retreat Destinations",
    text: "Handpicked global & domestic retreats; hills, beaches, wellness stays, heritage resorts, vineyards, and more.",
    btn: "Browse Retreat Options",
  },
  {
    title: "Engagement & Productivity Sessions",
    text: "Structured sessions for communication, collaboration, leadership, and team success; run by expert facilitators.",
    btn: "Request a Session Plan",
  },
];

const faqs = [
  {
    question: "What’s included in a corporate offsite?",
    answer:
      "A typical scope can include planning, accommodation, travel, activities and on-ground coordination. Final inclusions depend on your destination, group size, dates and budget.",
  },
  {
    question: "Why should we hire a MICE expert?",
    answer:
      "An event partner can coordinate venue options, transport, accommodation, activity providers, schedules and contingency planning, giving your internal team a clear point of contact.",
  },
  {
    question: "Do you handle everything end-to-end?",
    answer:
      "Depending on the brief, support can include initial planning, concept development, supplier coordination, travel and accommodation, activities and on-ground management.",
  },
  {
    question: "Can you customize the offsite for our team?",
    answer:
      "Absolutely. Every offsite is custom-designed based on your team’s goals, whether it’s team bonding, leadership alignment, or improving collaboration and performance.",
  },
  {
    question: "Where do you organize offsites?",
    answer:
      "We can plan offsites in India and international destinations. Destination options depend on your dates, group size, travel requirements and budget.",
  },
];

function CorporateOffsitesPage() {
  const [showPopup, setShowPopup] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState(0);

  const [index, setIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(() =>
    typeof window !== "undefined" && window.innerWidth <= 768 ? 1 : 3,
  );

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    companyType: "corporate",
    companyName: "",
  });

  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [faqForm, setFaqForm] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  const onChange = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  /* MAIN FORM SUBMIT */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        full_name: form.fullName,
        company_name:
          form.companyType === "corporate" ? form.companyName : null,
        email: form.email,
        phone: form.phone,
        event_date: null,
        event_type: "Other",
        type: form.companyType === "corporate" ? "Company" : "Individual",
      };

      await axiosInstance.post("/api/contact/", payload);

      alert("Form Submitted Successfully");

      setForm({
        fullName: "",
        email: "",
        phone: "",
        companyType: "corporate",
        companyName: "",
      });
    } catch (error) {
      console.log(
        "CorporateOffsitesPage submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting form");
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        full_name: newsletterEmail,
        company_name: null,
        email: newsletterEmail,
        phone: "1234567890",
        event_date: null,
        event_type: "Other",
        type: "Individual",
      };

      await axiosInstance.post("/api/contact/", payload);

      alert("Subscribed Successfully");
      setNewsletterEmail("");
    } catch (error) {
      console.log(
        "CorporateOffsitesPage CTA submit error:",
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
      const payload = {
        full_name: faqForm.name,
        company_name: null,
        email: faqForm.email,
        phone: "1234567890",
        event_date: null,
        event_type: faqForm.message || "Corporate Offsite FAQ Question",
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
        "CorporateOffsitesPage FAQ submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting your question");
    }
  };

  const formRef = useRef(null);
  const firstInputRef = useRef(null);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const toggleFAQ = (faqIndex) => {
    setActiveFAQ((currentFAQ) =>
      currentFAQ === faqIndex ? null : faqIndex,
    );
  };

  return (
    <div className="offsitePage">
      {showPopup && <PopupForm onClose={handleClosePopup} />}

      {/* HERO */}
      <section className="hero">
        <div className="heroInner">
          <div className="heroLeft">
            <h1 className="heroTopLabel">Corporate Offsites</h1>

            <div className="heroSubLine">
              Team Offsites | Leadership Retreats | Strategy Meets | Team
              Bonding | Offsite Planning | Seamless Execution
            </div>

            <p className="offsiteStartingPrice">
              1 Night / 2 Days Corporate Offsites from ₹7,000 per person*
            </p>
            <p className="offsitePriceNote">
              *Starting price for groups of 40–100 people. Twin-share stay,
              all meals and round-trip transportation included; taxes extra.
              Destinations include Mussoorie, Jim Corbett, Jaipur, Pushkar,
              Nainital, Dharamshala, Shimla, Kasauli, Kufri and Manali. Final
              price depends on dates, availability and confirmed inclusions.
            </p>

            <div className="heroDivider" />

            <div className="heroHeadline2">
              Where Teams Connect, Collaborate & Grow
            </div>

            <button className="ctaPill" type="button" onClick={handleOpenPopup}>
              <span className="ctaDot" />
              START YOUR OFFSITE JOURNEY
            </button>
          </div>

          <div className="heroRight">
            <div className="formCard" ref={formRef}>
              <div className="formTitle">Get in Touch</div>

              <form onSubmit={handleSubmit} className="formGrid">
                <div className="field">
                  <input
                    ref={firstInputRef}
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    placeholder="Full Name"
                    type="text"
                    required
                  />
                </div>

                <div className="field">
                  <input
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="Email"
                    type="email"
                    required
                  />
                </div>

                <div className="field">
                  <input
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="Phone number"
                    type="tel"
                    required
                  />
                </div>

                <div className="field">
                  <div className="radioRow">
                    <label className="radioItem">
                      <input
                        type="radio"
                        name="companyType"
                        value="startup"
                        checked={form.companyType === "startup"}
                        onChange={onChange("companyType")}
                      />
                      <span>Individual</span>
                    </label>

                    <label className="radioItem">
                      <input
                        type="radio"
                        name="companyType"
                        value="corporate"
                        checked={form.companyType === "corporate"}
                        onChange={onChange("companyType")}
                      />
                      <span>Company</span>
                    </label>
                  </div>
                </div>

                <div className="field">
                  <input
                    value={form.companyName}
                    onChange={onChange("companyName")}
                    placeholder="Company Name"
                    type="text"
                  />
                </div>

                <button className="btnPrimary" type="submit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1 */}
      <section className="section sectionWhite">
        <div className="container">
          <div className="twoCol twoColOffsiteHero">
            <div className="imageCard imageCardOffsiteHero">
              <img src={second} alt="" />
            </div>

            <div className="contentBlock contentBlockOffsiteHero">
              <h5 className="h2">
                Build Stronger Teams. Create Bigger Impact.
              </h5>

              <p className="p">
                ExpressEarth plans corporate offsites and team retreats for
                startups, small businesses and larger teams in Delhi NCR and
                across India. For teams of 40–100 people, selected 1-night,
                2-day packages start at ₹7,000 per person, excluding taxes.
                The starting package includes twin-share accommodation, all
                meals and round-trip transportation. Destination options can
                include Mussoorie, Jim Corbett, Jaipur, Pushkar, Nainital,
                Dharamshala, Shimla, Kasauli, Kufri and Manali, subject to dates
                and availability. This is an
                indicative starting price; the final quote depends on your
                group's requirements. Contact us to discuss your team's brief.
              </p>

              <h3 className="h3">Let’s Plan Your Next Offsite</h3>

              <p className="p muted">
                When people step out of the office, teamwork steps up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BLUE STRIP CTA */}
      <section className="strip">
        <div className="container stripInner">
          <h2 className="stripTitle">
            Offsites That Inspire High-Performing Teams
          </h2>

          <p className="stripLead">
            Our off-sites focus on what truly matters: clarity, connection, and
            culture.
          </p>

          <p className="stripSub">
            From peaceful corporate retreat experiences to action-packed team
            building activities, we curate itineraries that align with your
            goals and elevate team spirit.
          </p>

          <p className="discuss">Let’s Discuss Your Objectives</p>

          <button className="btnOutline" onClick={handleOpenPopup}>
            Book a Free Offsite Consultation
          </button>
        </div>
      </section>

      {/* OFFERINGS SLIDER */}
      <section className="offsite-services">
        <h2 className="offsite-heading">
          Our Core Corporate Offsite Offerings
        </h2>

        <div className="slider-window">
          <div
            className="services-track"
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {services.map((item, i) => (
              <div className="offsite-card" key={i}>
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

      {/* WHY CHOOSE */}
      <section className="section sectionWhite">
        <div className="container">
          <div className="whyGrid">
            <div className="whyLeft">
              <h2 className="h2">Why Choose ExpressEarth for Your Offsite?</h2>

              <div className="whyImage">
                <img src={BgImage} alt="Team Offsite" />
              </div>

              <div className="whyItem">
                <div className="whyItemTitle">End-to-End Planning</div>
                <div className="whyItemText">
                  From travel to stay, activities to sessions, everything is
                  managed with precision.
                </div>
              </div>
            </div>

            <div className="whyRight">
              <div className="whyBullet">
                <div className="whyBulletTitle">Premium Experience Design</div>
                <div className="whyBulletText">
                  We craft thoughtful, well-balanced corporate off-sites with
                  the right mix of fun, learning, and relaxation.
                </div>
              </div>

              <div className="whyBullet">
                <div className="whyBulletTitle">Tailor-Made for Your Goals</div>
                <div className="whyBulletText">
                  Each corporate offsite is customized to boost synergy,
                  motivation, and team alignment.
                </div>
              </div>

              <div className="whyBullet">
                <div className="whyBulletTitle">
                  Expert Team Building & Team Bonding Activities
                </div>
                <div className="whyBulletText">
                  Professional guidance ensures meaningful engagement, not just
                  another outing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="offsite-faq-section">
        <div className="container offsiteFaqInner">
          <div className="offsiteFaqGrid">
            <div className="offsiteFaqContent">
              <div className="offsiteFaqHeader">
                <p className="offsiteFaqTag">FAQ</p>
                <p className="offsiteFaqEyebrow">Frequently Asked Questions</p>
                {/* <h2 className="offsiteFaqTitle">
                  Common questions about planning a corporate offsite
                </h2> */}
              </div>

              <div className="offsiteFaqList">
                {faqs.map((faq, faqIndex) => (
                  <div
                    className={`offsiteFaqItem ${
                      activeFAQ === faqIndex ? "active" : ""
                    }`}
                    key={faq.question}
                  >
                    <button
                      className="offsiteFaqQuestion"
                      type="button"
                      onClick={() => toggleFAQ(faqIndex)}
                      aria-expanded={activeFAQ === faqIndex}
                    >
                      <span>{faq.question}</span>
                      <span
                        className={`offsiteFaqIcon ${
                          activeFAQ === faqIndex ? "open" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {activeFAQ === faqIndex && (
                      <p className="offsiteFaqAnswer">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="offsiteFaqFormWrap">
              <h3 className="offsiteFaqFormTitle">Ask a different question</h3>

              <form className="offsiteFaqForm" onSubmit={handleFaqSubmit}>
                <label className="offsiteFaqField">
                  <span>Name</span>
                  <input
                    type="text"
                    value={faqForm.name}
                    onChange={handleFaqFormChange("name")}
                    required
                  />
                </label>

                <label className="offsiteFaqField">
                  <span>Email Address</span>
                  <input
                    type="email"
                    value={faqForm.email}
                    onChange={handleFaqFormChange("email")}
                    required
                  />
                </label>

                <label className="offsiteFaqField offsiteFaqFieldMessage">
                  <span>Message</span>
                  <textarea
                    value={faqForm.message}
                    onChange={handleFaqFormChange("message")}
                    rows="4"
                    required
                  />
                </label>

                <button type="submit" className="offsiteFaqSubmit">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-wrapper">
          <div className="cta-box">
            <h2 className="cta-title">Ready To Elevate Your Next Offsite?</h2>

            <form className="cta-form" onSubmit={handleEmailSubmit}>
              <div className="cta-input">
                <span className="cta-icon">🔍</span>

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  value={newsletterEmail}
                  required
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                />
              </div>

              <button type="submit" className="cta-submit">
                Submit
              </button>
            </form>
          </div>

          {/* FOOTER TEXT OUTSIDE THE BOX */}
          <div className="footerLine">
            Let’s create a meaningful, memorable experience your team will truly
            value.
          </div>
        </div>
      </section>
    </div>
  );
}

export default CorporateOffsitesPage;