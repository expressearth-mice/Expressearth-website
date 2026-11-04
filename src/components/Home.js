import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, useLocation } from "react-router-dom";
import PopupForm from "./popupForm";
import axiosInstance from "../api/axios";
import IntegrationTools from "./ui/IntegrationTools";
import HorizontalSlider from "./ui/HorizontalSlider";
//import homeVideo from "/assets/home.mp4";

const programmeCapabilities = [
  { icon: "fas fa-calendar-check", title: "Programme planning", description: "Define the objective, audience, format, destination, dates and budget before supplier planning." },
  { icon: "fas fa-hotel", title: "Travel and accommodation", description: "Coordinate group travel, stays, transfers and destination arrangements around the itinerary." },
  { icon: "fas fa-volume-up", title: "Event production", description: "Plan stage, AV, branding, technical requirements and the event run of show where required." },
  { icon: "fas fa-clipboard-check", title: "On-ground logistics", description: "Coordinate registration, hospitality, delegate movement and event-day operations according to the agreed scope." },
];
const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "click", {
        event_category: "Homepage",
        event_label: "Home Page Loaded",
      });
    }
  }, []);

  const [showPopup, setShowPopup] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const toggleFAQ = (index) => {
    setActiveFAQ((currentFAQ) => (currentFAQ === index ? null : index));
  };

  const programmeLinks = [
    { icon: "fa-building", label: "Meetings & Conferences", description: "Leadership meetings, conferences, seminars and delegate logistics.", slug: "/meetings-and-conferences" },
    { icon: "fa-plane-departure", label: "Incentive Travel", description: "Reward trips for employees and channel partners, planned around the programme brief.", slug: "/incentive-travel" },
    { icon: "fa-handshake", label: "Dealer & Distributor Meets", description: "Channel partner conferences, business updates, product launches and recognition events.", slug: "/dealermeet" },
    { icon: "fa-mountain", label: "Corporate Offsites", description: "Team retreats, leadership sessions and corporate offsite packages.", slug: "/corporateoffsites" },
    { icon: "fa-bullhorn", label: "Corporate Events", description: "Product launches, annual days, family days and award ceremonies.", slug: "/corporate-events" },
    { icon: "fa-store", label: "Exhibitions & Trade Shows", description: "Exhibition participation, booth logistics and business event support.", slug: "/exhibitions-and-trade-shows" },
  ];

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axiosInstance.get("/api/posts/");
        const sorted = response.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setRecentPosts(sorted.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch recent posts:", error);
      }
    };

    fetchRecentPosts();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.hash === "#home-faqs") {
      const faqSection = document.getElementById("home-faqs");

      if (faqSection) {
        window.requestAnimationFrame(() => {
          faqSection.scrollIntoView({ behavior: "smooth", block: "start" });
          window.setTimeout(() => {
            window.history.replaceState(
              null,
              "",
              `${location.pathname}${location.search}`
            );
          }, 700);
        });
      }
    }
  }, [location]);


  const handleClosePopup = () => {
    setShowPopup(false);
    setShowIcon(true); // Show icon after closing
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
    setShowIcon(false); // Hide icon when popup is open
  };


  return (
    <div className="home-container">
      {showPopup && <PopupForm onClose={handleClosePopup} />}

      {/* 👇 Floating Icon */}
      {showIcon && (
        <div
          className="floating-icon"
          onClick={handleOpenPopup}
          title="Get in Touch"
        >
          📋
        </div>
      )}

      <section className="image-hero-wrapper">
        <div
          id="heroCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="3000"
          data-bs-wrap="true"
        >
          <div className="carousel-inner">
            {/* Carousel Item 1 */}
            <div className="carousel-item active">
              <img
                src="/Images/HOME/Banner image/A.avif"
                className="d-block w-100 carousel-image"
                alt="Corporate event and MICE services by ExpressEarth"
              />
              <div className="carousel-caption hero-overlay">
                <h1 className="hero-title-box">
                  Corporate Event Management &amp; MICE Company in Delhi NCR
                </h1>
                <p>
                  From world-class conferences to luxury incentive travel,
                  ExpressEarth delivers seamless, high-end event solutions
                  tailored to your business needs.
                </p>
                <Link to="/contact" className="custom-button-link">
                  Get a Free Consultation
                </Link>
              </div>
            </div>
            {/* Carousel Item 2 */}
            <div className="carousel-item">
              <img
                src="\Images\HOME\Banner image\B.avif"
                className="d-block w-100 carousel-image"
                alt="Corporate conferences and incentive travel experiences"
              />
              <div className="carousel-caption hero-overlay">
                <h2 className="hero-title-box">
                  Corporate Events, Conferences &amp; Incentive Travel
                </h2>
                <p>
                  From world-class conferences to luxury incentive travel,
                  ExpressEarth delivers seamless, high-end event solutions
                  tailored to your business needs.
                </p>
                <Link to="/contact" className="custom-button-link">
                  Get a Free Consultation
                </Link>
              </div>
            </div>
            {/* Carousel Item 3 */}
            <div className="carousel-item">
              <img
                src="\Images\HOME\Banner image\C.avif"
                className="d-block w-100 carousel-image"
                alt="Corporate group travel and offsite experiences"
              />
              <div className="carousel-caption hero-overlay">
                <h2 className="hero-title-box">
                  Corporate Events, Conferences &amp; Incentive Travel
                </h2>
                <p>
                  From world-class conferences to luxury incentive travel,
                  ExpressEarth delivers seamless, high-end event solutions
                  tailored to your business needs.
                </p>
                <Link to="/contact" className="custom-button-link">
                  Get a Free Consultation
                </Link>
              </div>
            </div>
            {/* Carousel Item 4 */}
            <div className="carousel-item">
              <img
                src="\Images\HOME\Banner image\D.avif"
                className="d-block w-100 carousel-image"
                alt="Business events and employee engagement programmes"
              />
              <div className="carousel-caption hero-overlay">
                <h2 className="hero-title-box">
                  Corporate Events, Conferences &amp; Incentive Travel
                </h2>
                <p>
                  From world-class conferences to luxury incentive travel,
                  ExpressEarth delivers seamless, high-end event solutions
                  tailored to your business needs.
                </p>
                <Link to="/contact" className="custom-button-link">
                  Get a Free Consultation
                </Link>
              </div>
            </div>
            {/* Carousel Item 5 */}
            <div className="carousel-item">
              <img
                src="\Images\HOME\Banner image\E.avif"
                className="d-block w-100 carousel-image"
                alt="Corporate event production and group experiences"
              />
              <div className="carousel-caption hero-overlay">
                <h2 className="hero-title-box">
                  Corporate Events, Conferences &amp; Incentive Travel
                </h2>
                <p>
                  From world-class conferences to luxury incentive travel,
                  ExpressEarth delivers seamless, high-end event solutions
                  tailored to your business needs.
                </p>
                <Link to="/contact" className="custom-button-link">
                  Get a Free Consultation
                </Link>
              </div>
            </div>
          </div>

          {/* Controls */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
          {/* Banner Section */}
          <section className="hero-banner">
            <h2 className="main-heading">We Create Experiences</h2>
            <p className="tag-subtext">Where Business Meets Luxury Travel</p>
          </section>
        </div>
      </section>
      {/* Destinations */}
      <section
        className="destinations"
      // style={{
      //   backgroundImage:
      //     "linear-gradient(rgba(8, 59, 112, 0.55), rgba(8, 59, 112, 0.55)), url('/Images/switzerland.png')",
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
      >
        <div className="destination-section">
          <div className="intro-row">
            <div className="text-left">
              {/* <p className="highlight">DESTINATIONS WE RECOMMEND</p> */}
              <h3 className="section-title">Destinations We Recommend</h3>
              <h5 className="section-subtitle">
                Handpicked Global Locations for Exceptional MICE Experiences
              </h5>
            </div>
            <div className="text-right">
              <p className="description">
                Create extraordinary business moments with tailor-made MICE
                solutions at world-class destinations. Whether it's a
                high-profile corporate conference, an exclusive incentive trip,
                or a global exhibition, we curate immersive experiences that
                inspire and impress.
              </p>
            </div>
          </div>

          <div className="destination-grid">
            {[
              {
                name: "Singapore",
                img: "/Images/singapore.jpg",
                link: "/destinations/singapore",
              },
              {
                name: "Switzerland",
                img: "/Images/switzerland.png",
                link: "/destinations/switzerland",
              },
              {
                name: "Bali",
                img: "/Images/bali.jpg",
                link: "/destinations/bali",
              },
              {
                name: "Baku",
                img: "/Images/baku.jpg",
                link: "/destinations/baku",
              },
              {
                name: "Maldives",
                img: "/Images/maldives.jpg",
                link: "/destinations/maldives",
              },
              {
                name: "Dubai",
                img: "/Images/dubai.png",
                link: "/destinations/dubai",
              },
            ].map((dest, index) => (
              <Link
                to={dest.link}
                key={index}
                className="destination-card-link"
              >
                <div className="destination-card">
                  <img src={dest.img} alt={dest.name} />
                  <h3>{dest.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="view-all">
          <Link to="/destinations" className="custom-button-link">
            View All Destinations
          </Link>
        </div>
      </section>
      <IntegrationTools />

      <section className="travel-banner">
        <div className="travel-image-box">
          <video
            className="travel-video"
            autoPlay
            muted
            loop
            preload="auto"
            playsInline
          >
            <source src="/Images/home-web.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="travel-content-box">
          <p className="travel-callback-text">
            CONNECT WITH US FOR UNFORGETTABLE MICE EXPERIENCES
          </p>

          <h2 className="travel-heading">Plan. Execute. Inspire.</h2>

          <p className="travel-subtext">
            <span className="travel-subtext-initial">At ExpressEarth</span>, we plan corporate meetings and conferences,
            incentive travel, dealer and distributor programmes, offsites and
            business events. Depending on the brief, coordination can include
            destination selection, accommodation, transfers, event production
            and on-ground logistics.
          </p>

          <div className="travel-subheading-box">
            <h6 className="travel-tagline">
              A clear brief helps shape the right programme.
            </h6>
            <h5 className="travel-impact">Programme Planning Scope</h5>
          </div>

          <div className="travel-stats-grid">
            {programmeCapabilities.map((capability) => (
              <div key={capability.title} className="travel-stat-item">
                <i className={`${capability.icon} fa-2x travel-icon`} aria-hidden="true"></i>
                <p className="travel-stat-number">{capability.title}</p>
                <p className="travel-capability-description">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mice-section home-mice-section">
        <h2 className="c">Corporate MICE Services</h2>
        <h5 className="section-subheading">
          Explore the programme types ExpressEarth can plan for corporate teams,
          channel partners and business audiences.
        </h5>

        <HorizontalSlider
          className="scroll-container mice-scroll-container"
          shellClassName="mice-scroll-shell"
          arrowClassName="mice-scroll-arrow"
          itemCount={programmeLinks.length}
          leftAriaLabel="Scroll corporate MICE services left"
          rightAriaLabel="Scroll corporate MICE services right"
        >
          {programmeLinks.map((item) => (
            <div key={item.slug} className="mice-scroll-item">
              <Link to={item.slug} className="mice-link">
                <div className="mice-card mice-card-panel">
                  <i className={`fa ${item.icon} fa-2x mice-card-icon`} aria-hidden="true"></i>
                  <h3 className="mice-card-title">{item.label}</h3>
                  <p className="mice-card-meta">{item.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </HorizontalSlider>

        <div className="view-all">
          <Link to="/mice-services" className="custom-button-link">
            Explore All MICE Services
          </Link>
        </div>
      </section>
      {/*Recent blog*/}
      <section className="blogs-updates blogs-updates-section">
        <h2 className="blogs-title">Latest News & Blogs</h2>
        <p className="blogs-lead">Trends, Insights & MICE Updates!</p>

        <div className="blogs-scrolling-wrapper">
          <div className="blogs-scrolling-track">
            {[...recentPosts, ...recentPosts].map((post, index) => (
              <div
                key={`${post.id}-${index}`}
                className="blog-card"
                aria-hidden={index >= recentPosts.length}
              >
                <img src={post.image} alt={post.title} />
                <div className="card-body">
                  <h5>
                    <Link
                      to={`/blogs/${post.slug}`}
                      className="blog-link"
                      tabIndex={index >= recentPosts.length ? -1 : 0}
                    >
                      {post.title}
                    </Link>
                  </h5>
                  <p>{post.description.slice(0, 80)}...</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="blogs-cta">
          <Link to="/blogs" className="custom-button-link">
            Explore Blogs
          </Link>
        </div>
      </section>

      <section className="case-study-section">
        {/* Top curved SVG */}
        <div className="case-study-wave case-study-wave-top">
          <svg
            className="case-study-wave-svg"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path d="M1200 0L0 0 0 120 1200 0z" fill="#0162b5"></path>
          </svg>
        </div>

        <div className="case-study-content">
          <div className="case-study-content-inner">
            <h2 className="case-study-kicker">
              Real Success Stories
            </h2>
            <p className="case-study-title">
              Transforming Corporate Travel & Events
            </p>
            <h3 className="case-study-quote">
              “ExpressEarth MICE delivered a seamless and personalized corporate
              travel experience. Their expertise in handling large-scale events,
              attention to detail, and customized solutions truly set them
              apart.”
            </h3>
          </div>
          <p className="case-study-description">
            That’s what a senior manager from a{" "}
            <span className="case-study-company">[Fortune 500 Company]</span> had to say
            about their experience with ExpressEarth MICE. From end-to-end event
            planning to flawless execution, we ensure every journey is a
            success.
          </p>

          <p className="case-study-description case-study-description-secondary">
            Discover how our innovative solutions and industry expertise create
            unforgettable corporate experiences.
          </p>
          <Link to="/case-studies">
            <button className="custom-button-link">Read Full Case Study</button>
          </Link>
        </div>

        {/* Bottom curved SVG */}
        {/* Top rotated curved SVG (180°) */}
        <div className="case-study-wave case-study-wave-bottom">
          <svg
            className="case-study-wave-svg"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path d="M1200 0L0 120 0 0 1200 0z" fill="#0162b5" />
          </svg>
        </div>
      </section>

      <section className="achievements-section">
        <h2 className="achievements-title">
          Excellence Recognized, Trust Earned
        </h2>
        <p className="achievements-text">
          Discover the awards, accreditations, and industry recognition that
          make{" "}
          <span className="achievements-brand">ExpressEarth MICE</span>{" "}
          a trusted name in corporate travel and event management. With 9 years
          of excellence, we continue to set new benchmarks in delivering
          unforgettable experiences.
        </p>
        <Link to="/achievements">
          <button className="custom-button-link">
            Explore Our Achievements
          </button>
        </Link>
      </section>

      {/* FAQs Section */}

      <section id="home-faqs" className="faq-section">
        <h3>FAQs</h3>
        <section className="faq-section">
          {[
            {
              question:
                "What MICE services does ExpressEarth offer for corporate events?",
              answer:
                " ExpressEarth specializes in end-to-end MICE services, including corporate meetings, incentive travel, international conferences, trade exhibitions, and luxury corporate retreats. We create tailor-made solutions to deliver high-impact business experiences globally.",
            },
            {
              question:
                "Can ExpressEarth manage international corporate travel and large group logistics?",
              answer:
                "With a strong global network, we handle international corporate travel, visa assistance, luxury hotel bookings, on-ground logistics, and event execution for groups of all sizes—from executive teams to large delegations of 1000+ participants.",
            },
            {
              question:
                " How early should I start planning a corporate event with ExpressEarth?",
              answer:
                " For a smooth experience, we recommend initiating planning 3–6 months in advance, especially for large-scale or international MICE events. However, our experienced team can also manage last-minute MICE travel and event planning with efficiency.",
            },
            {
              question:
                "Are your MICE event packages customizable for our business goals and budget?",
              answer:
                " Absolutely. Our custom MICE packages are tailored to your corporate objectives, budget, and brand identity. Whether you're planning a luxury incentive trip or a strategic offsite, we ensure a personalized and memorable experience.",
            },
            {
              question:
                "How do I start planning a MICE event with ExpressEarth?",
              answer:
                "Getting started is easy—simply fill out the Plan Your Perfect MICE Event form on our website or contact us directly. Our experts will schedule a free MICE consultation and guide you through destination selection, logistics, and event design.",
            },
          ].map((faq, index) => (
            <div key={index} className="faq-item">
              <h4
                onClick={() => toggleFAQ(index)}
                className="faq-question-row"
              >
                {faq.question}
                <span>{activeFAQ === index ? "⌃" : "⌄"}</span>
              </h4>
              {activeFAQ === index && <p>{faq.answer}</p>}
            </div>
          ))}
        </section>
      </section>
      <a
        href="https://wa.me/9266056660"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </div>
  );
};

export default Home;



