import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./R_R_Planning.css";
import RR_3 from "../assests/RR_3.png";
import RR_4 from "../assests/RR_4.jpg";
import RR_6 from "../assests/RR_6.jpg";
import RR_7 from "../assests/RR_7.JPG";
import PopupForm from "./popupForm";

const services = [
  {
    title: "End-to-End R&R Program Planning",
    text: "Strategy, themes, engagement design, logistics, awards, and execution for impactful recognition programs.",
    btn: "Start Planning",
  },
  {
    title: "Employee Recognition Events & Awards",
    text: "Memorable awards events and corporate ceremonies that celebrate excellence and reinforce values.",
    btn: "Plan an Event",
  },
  {
    title: "Employee Engagement Programs & Activities",
    text: "Engagement programs that boost morale, collaboration, and long-term motivation.",
    btn: "Build Engagement",
  },
  {
    title: " Employee Incentive & Motivation Events",
    text: "Performance-driven incentive programs aligned with business goals and team dynamics.",
    btn: "Design an Incentive Program",
  },
  {
    title: "Recognition Program Ideas & Appreciation Events",
    text: "Creative recognition and appreciation events that feel personal, authentic, and impactful.",
    btn: "Explore Recognition Ideas",
  },
];

const whyChooseCards = [
  {
    num: "01",
    title: "Experts in Employee Rewards and Recognition",
    text: "We specialise in structured and scalable employee rewards and recognition programs for organisations of all sizes.",
  },
  {
    num: "02",
    title: "Strategic R&R Program Planning",
    text: "Our approach to R&R program planning balances engagement, motivation, and business alignment.",
  },
  {
    num: "03",
    title: "Tailored Employee Engagement Programs",
    text: "Every employee engagement program is customised to match your culture, goals, and workforce expectations.",
  },
  {
    num: "04",
    title: "Trusted Corporate Award Ceremony Organizers",
    text: "From annual employee awards to large-scale recognition nights, we deliver with precision and professionalism.",
  },
];

const R_R_Planning = () => {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/contact/", formData);

      alert("Form Submitted Successfully");

      setFormData({
        name: "",
        email: "",
        phone: "",
        type: "Company",
        company: "",
      });
    } catch (error) {
      console.log(error);
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
  return (
    <>
      {showPopup && <PopupForm onClose={handleClosePopup} />}

      <section className="rr-hero">
        {/* FORM CARD */}

        <div className="rr-form-wrapper" ref={formRef}>
          <form className="rr-form-card" onSubmit={handleSubmit}>
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

            <div className="rr-radio-group">
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

            <button type="submit" className="rr-submit-btn">
              Submit
            </button>
          </form>
        </div>

        {/* RIGHT CONTENT */}

        <div className="rr-hero-content">
          <h1>Rewards & Recognition Planning</h1>

          <p className="rr-sub">
            Employee Recognition | R&R Planning | Recognition Events | Incentive
            Programs | Awards Night Planning | Engagement Programs
          </p>

          <div className="rr-line"></div>

          <p className="rr-tag">Where Recognition Inspires Performance.</p>

          <button className="rr-btn" onClick={handleOpenPopup}>
            PLAN YOUR R&R PROGRAM
          </button>
        </div>
      </section>

      <section className="rr-curated-section">
        <div className="rr-curated-media">
          <img
            className="rr-curated-image"
            src={RR_3}
            alt="Employee recognition collage"
          />
        </div>

        <div className="rr-curated-content">
          <h2>
            Curated Employee
            <br />
            Rewards and Recognition
            <br />
            Experiences
          </h2>

          <p>
            At ExpressEarth, we create employee recognition programs that
            celebrate performance, boost motivation, and strengthen culture with
            strategic planning and seamless execution.
          </p>

          <button className="rr-curated-btn" onClick={handleOpenPopup}>
            Plan Your Employee Rewards and Recognition Program
          </button>
        </div>
      </section>

      <section className="rr-partner-section">
        <div className="rr-partner-inner">
          <div className="rr-partner-left">
            <h2>
              Your Trusted Partner for
              <br />
              Employee Rewards &amp;
              <br />
              Recognition Planning
            </h2>

            <p className="rr-partner-intro">
              As corporate incentive and appreciation planners, ExpressEarth
              delivers end-to-end employee recognition solutions.
            </p>

            <div className="rr-partner-cards">
              <div className="rr-mini-card">
                <span>01</span>
                <div className="rr-mini-line"></div>
                <p>Employee awards events</p>
              </div>
              <div className="rr-mini-card">
                <span>02</span>
                <div className="rr-mini-line"></div>
                <p>Annual employee awards</p>
              </div>
              <div className="rr-mini-card">
                <span>03</span>
                <div className="rr-mini-line"></div>
                <p>Corporate awards night planning</p>
              </div>
              <div className="rr-mini-card">
                <span>04</span>
                <div className="rr-mini-line"></div>
                <p>Employee appreciation events</p>
              </div>
              <div className="rr-mini-card">
                <span>05</span>
                <div className="rr-mini-line"></div>
                <p>Employee motivation events</p>
              </div>
            </div>

            <p className="rr-partner-note">
              Every recognition journey is planned with intent, creativity, and
              seamless execution; so teams feel truly valued.
            </p>

            <button className="rr-partner-btn" onClick={handleOpenPopup}>
              Discuss Your R&amp;R Program Planning Needs
            </button>
          </div>

          <div className="rr-partner-right">
            <img src={RR_4} alt="Rewards trophy" />
          </div>
        </div>
      </section>

      {/* -------- SECTION 4 : SERVICES SLIDER -------- */}

      <section className="services-section">
        <h2 className="services-heading">Our Rewards & Recognition Services</h2>

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

      <section className="rr-why-section">
        <div className="rr-why-left">
          <h2>
            Why Choose ExpressEarth
            <br />
            for R &amp; R Planning
          </h2>

          <div className="rr-why-line"></div>

          <p>
            Recognition That Resonates.
            <br />
            Execution That Delivers.
          </p>

          <img src={RR_6} alt="Team at employee recognition event" />
        </div>

        <div className="rr-why-right">
          {whyChooseCards.map((item) => (
            <div className="rr-why-card" key={item.num}>
              <span>{item.num}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rr-ready-section">
        <h2>Ready to Recognise, Reward, and Inspire?</h2>

        <div className="rr-ready-content">
          <div className="rr-ready-left">
            <p>
              Let ExpressEarth transform your employee recognition program into
              a seamless, engaging, and impactful experience.
            </p>

            <div className="rr-ready-accent-line"></div>

            <button className="rr-ready-btn" onClick={handleOpenPopup}>
              Speak to Our Rewards &amp; Recognition Specialists Today
            </button>
          </div>

          <div className="rr-ready-right">
            <div className="rr-ready-outer">
              <div className="rr-ready-inner">
                <img src={RR_7} alt="Employee group celebration" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default R_R_Planning;
