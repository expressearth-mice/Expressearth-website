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

function CorporateOffsitesPage() {
  const [showPopup, setShowPopup] = useState(false);

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

  const formRef = useRef(null);
  const firstInputRef = useRef(null);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
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
                At ExpressEarth, we design corporate offsites, team offsites,
                and corporate retreats that blend purpose, productivity, and
                unforgettable experiences. Whether it’s a corporate offsite
                event, leadership meet, or company-wide team offsite, we create
                environments that help teams think better, bond deeper, and
                perform stronger.
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
