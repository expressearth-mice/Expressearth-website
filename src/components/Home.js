import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link, useLocation } from "react-router-dom";
import PopupForm from "./popupForm";
import axiosInstance from "../api/axios";
import IntegrationTools from "./ui/IntegrationTools";
import HorizontalSlider from "./ui/HorizontalSlider";
//import homeVideo from "/assets/home.mp4";

const travelStats = [
  {
    icon: "fas fa-globe",
    label: "Countries Network",
    target: 30,
    step: 1,
    interval: 45,
    formatValue: (value) => `${value}+`,
  },
  {
    icon: "fas fa-hotel",
    label: "Hotel Partners",
    target: 500,
    step: 10,
    interval: 55,
    formatValue: (value) => `${value}+`,
  },
  {
    icon: "fas fa-smile-beam",
    label: "Satisfied Clients",
    target: 100000,
    step: 2500,
    interval: 80,
    formatValue: (value) => {
      if (value >= 100000) {
        return "1 Lakh+";
      }

      if (value >= 1000) {
        return `${Math.round(value / 1000)}K+`;
      }

      return `${value}+`;
    },
  },
  {
    icon: "fas fa-briefcase",
    label: "Successful Events",
    target: 1000,
    step: 25,
    interval: 70,
    formatValue: (value) => `${value}+`,
  },
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
  });

  const [showPopup, setShowPopup] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [hasStartedTravelStats, setHasStartedTravelStats] = useState(false);
  const [animatedTravelStats, setAnimatedTravelStats] = useState(
    travelStats.map(() => 0)
  );
  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const miceDestinations = [
    {
      icon: "fa-building",
      label: "Luxury Conferences",
      destinations: "20+",
      slug: "/meetings-and-conferences",
    },
    {
      icon: "fa-plane-departure",
      label: "Incentive Travel",
      destinations: "15+",
      slug: "/incentive-travel",
    },
    {
      icon: "fa-umbrella-beach",
      label: "Corporate Retreats",
      destinations: "12+",
      slug: "/incentive-travel",
    },
    {
      icon: "fa-people-arrows",
      label: "Business Networking",
      destinations: "18+",
      slug: "/meetings-and-conferences",
    },
    {
      icon: "fa-store",
      label: "Exhibitions & Trade Shows",
      destinations: "10+",
      slug: "/exhibitions-and-trade-shows"
    },
    {
      icon: "fa-map-marker-alt",
      label: "Destination Meetings",
      destinations: "25+",
      slug: "/destination-management",
    },
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

  useEffect(() => {
    if (!hasStartedTravelStats) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setAnimatedTravelStats((prev) => {
        const next = prev.map((value, index) => {
          const stat = travelStats[index];

          if (value >= stat.target) {
            return stat.target;
          }

          return Math.min(value + stat.step, stat.target);
        });

        const allComplete = next.every(
          (value, index) => value >= travelStats[index].target
        );

        if (allComplete) {
          window.clearInterval(intervalId);
        }

        return next;
      });
    }, 60);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [hasStartedTravelStats]);

  const handleClosePopup = () => {
    setShowPopup(false);
    setShowIcon(true); // Show icon after closing
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
    setShowIcon(false); // Hide icon when popup is open
  };

  const handleTravelStatsHover = () => {
    setHasStartedTravelStats(true);
  };

  const splitMiceCardText = (text) => {
    const parts = text.split(/\s+[–-]\s+/u);

    return {
      title: parts[0] || text,
      details: parts.slice(1).join(" - "),
    };
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
                alt="Slide 1"
              />
              <div className="carousel-caption hero-overlay">
                <h1 className="hero-title-box">
                  Turning MICE Experiences into Unforgettable Journeys
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
                alt="Slide 2"
              />
              <div className="carousel-caption hero-overlay">
                <h1 className="hero-title-box">
                  Turning MICE Experiences into Unforgettable Journeys
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
            {/* Carousel Item 3 */}
            <div className="carousel-item">
              <img
                src="\Images\HOME\Banner image\C.avif"
                className="d-block w-100 carousel-image"
                alt="Slide 3"
              />
              <div className="carousel-caption hero-overlay">
                <h1 className="hero-title-box">
                  Turning MICE Experiences into Unforgettable Journeys
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
            {/* Carousel Item 4 */}
            <div className="carousel-item">
              <img
                src="\Images\HOME\Banner image\D.avif"
                className="d-block w-100 carousel-image"
                alt="Slide 4"
              />
              <div className="carousel-caption hero-overlay">
                <h1 className="hero-title-box">
                  Turning MICE Experiences into Unforgettable Journeys
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
            {/* Carousel Item 5 */}
            <div className="carousel-item">
              <img
                src="\Images\HOME\Banner image\E.avif"
                className="d-block w-100 carousel-image"
                alt="Slide 5"
              />
              <div className="carousel-caption hero-overlay">
                <h1 className="hero-title-box">
                  Turning MICE Experiences into Unforgettable Journeys
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
            <h1 className="main-heading">We Create Experiences</h1>
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

          <h1 className="travel-heading">Plan. Execute. Inspire.</h1>

          <p className="travel-subtext">
            <span className="travel-subtext-initial">At ExpressEarth</span>, we don’t just organize events — we
            craft immersive corporate experiences. With over a decade of
            expertise in the MICE industry, we specialize in curating high-end
            conferences, incentive retreats, and global business summits. Our
            focus is on <em>flawless execution</em> with a touch of luxury,
            ensuring every moment leaves a lasting impression.
          </p>

          <div className="travel-subheading-box">
            <h6 className="travel-tagline">
              From Vision to Reality – We Make It Happen.
            </h6>
            <h5 className="travel-impact"> Our Global Impact</h5>
          </div>

          <div
            className="travel-stats-grid"
            onMouseEnter={handleTravelStatsHover}
          >
            {travelStats.map((stat, index) => (
              <div key={stat.label} className="travel-stat-item">
                <i className={`${stat.icon} fa-2x travel-icon`}></i>
                <p className="travel-stat-number">
                  {stat.formatValue(animatedTravelStats[index])}
                </p>
                <p className="travel-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mice-section home-mice-section">
        <h2 className="c">Mice By Destination</h2>
        <h5 className="section-subheading">
          Explore the world's finest destinations, designed for unforgettable
          corporate experiences.
        </h5>

        {/* Horizontal scroll wrapper */}
        <HorizontalSlider
          className="scroll-container mice-scroll-container"
          shellClassName="mice-scroll-shell"
          arrowClassName="mice-scroll-arrow"
          itemCount={miceDestinations.length}
          leftAriaLabel="Scroll destination cards left"
          rightAriaLabel="Scroll destination cards right"
        >
          {miceDestinations.map((item, index) => (
            <div key={index} className="mice-scroll-item">
              <Link to={item.slug} className="mice-link">
                <div className="mice-card mice-card-panel">
                  <i className={`fa ${item.icon} fa-2x mice-card-icon`}></i>
                  <h6 className="mice-card-title">{item.label}</h6>
                  <p className="mice-card-meta">
                    {item.destinations} Destinations
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </HorizontalSlider>

        <div className="subtext subtext-block">
          <h6 className="subtext-note">
            Where business meets luxury, tailor your next event with
            ExpressEarth!
          </h6>
        </div>

        <h2 className="section-heading section-heading-spacing">Mice By Group Size</h2>
        <h5 className="section-subheading">
          Seamless event planning for every group, from intimate gatherings to
          grand corporate affairs.
        </h5>

        <HorizontalSlider
          className="scroll-container mice-scroll-container"
          shellClassName="mice-scroll-shell"
          arrowClassName="mice-scroll-arrow"
          itemCount={5}
          leftAriaLabel="Scroll group size cards left"
          rightAriaLabel="Scroll group size cards right"
        >
          {[
            {

              text: "Large Corporate Groups – 500+ Participants | 20+ Destinations",

            },
            {

              text: "Small Business Teams – 50–200 Participants | 15+ Destinations",

            },
            {

              text: "Executive Retreats & Couples – 2–50 Participants | 12+ Destinations",

            },
            {

              text: "Incentive & Special Interest Groups – Customizable | 18+ Destinations",

            },
            {

              text: "Global Conferences – 1000+ Participants | 10+ Destinations",

            },
          ].map((item, index) => (
            <div key={index} className="mice-scroll-item">
              <div className="mice-card mice-card-panel">
                <h6 className="mice-card-title">
                  {splitMiceCardText(item.text).title}
                </h6>
                <p className="mice-card-meta">
                  {splitMiceCardText(item.text).details}
                </p>
              </div>
            </div>
          ))}
        </HorizontalSlider>

        <div className="subtext subtext-block">
          <h6 className="subtext-note">
            Whatever the size, we craft experiences that leave a lasting impact!
          </h6>
        </div>
      </section>
      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonial-title" >
          <h3>Client Experiences That Speak For Themselves</h3>
          <h6>
            Hear from our satisfied groups who have experienced seamless
            planning, exceptional service, and unforgettable journeys with us.
          </h6>
        </div>
        <div className="testimonial-grid">
          {[
            {
              quote:
                "Our corporate retreat in Dubai was flawlessly executed! From the luxurious stay to the well-organized activities, ExpressEarth made everything effortless.",
              name: "Atiksh Singh",
              designation: "Business Director",
              img: "https://media.licdn.com/dms/image/v2/D5603AQFCo_9GZYA7MA/profile-displayphoto-shrink_200_200/B56ZbrouZbGsAY-/0/1747710044720?e=2147483647&v=beta&t=vKycTUn1chOaICigDy2lY6I_0jnDCgAVwFrRfHMgD-o",
            },
            {
              quote:
                "ExpressEarth transformed our event into an unforgettable journey. Highly professional and truly luxurious experience!",
              name: "Sana Khan",
              designation: "HR Head",
              img: "/Images/client2.jpg",
            },
          ].map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <img
                src={testimonial.img}
                alt={testimonial.name}
                className="client-image"
              />
              <p>"{testimonial.quote}"</p>
              <span>
                <strong>{testimonial.name}</strong>
              </span>
              <p className="designation">{testimonial.designation}</p>
            </div>
          ))}
        </div>
        <div className="testimonial-cta">
          <p>What’s your story? Let us craft your perfect travel experience!</p>
          <Link to="/contact" className="custom-button-link">
            Contact Us
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



