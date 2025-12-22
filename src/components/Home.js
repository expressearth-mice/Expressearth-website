import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import PopupForm from "./popupForm";
import axiosInstance from "../api/axios";
import IntegrationTools from "./ui/IntegrationTools";

const Home = () => {
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

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index);
  };

  const miceDestinations = [
    {
      icon: "fa-building",
      label: "Luxury Conferences",
      destinations: "20+",
      slug: "Luxury Conferences",
    },
    {
      icon: "fa-plane-departure",
      label: "Incentive Travel",
      destinations: "15+",
      slug: "Incentive Travel",
    },
    {
      icon: "fa-umbrella-beach",
      label: "Corporate Retreats",
      destinations: "12+",
      slug: "Corporate Retreats",
    },
    {
      icon: "fa-people-arrows",
      label: "Business Networking",
      destinations: "18+",
      slug: "Business Networking",
    },
    {
      icon: "fa-store",
      label: "Exhibitions & Trade Shows",
      destinations: "10+",
      slug: "Exhibitions & Trade Shows",
    },
    {
      icon: "fa-map-marker-alt",
      label: "Destination Meetings",
      destinations: "25+",
      slug: "Destination Meetings",
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
                src="\Images\HOME\Banner image\A.avif"
                className="d-block w-100 carousel-image"
                alt="Slide 1"
              />
              <div className="carousel-caption hero-overlay d-none d-md-block">
                <h1>Turning MICE Experiences into Unforgettable Journeys</h1>
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
              <div className="carousel-caption hero-overlay d-none d-md-block">
                <h1>Turning MICE Experiences into Unforgettable Journeys</h1>
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
              <div className="carousel-caption hero-overlay d-none d-md-block">
                <h1>Turning MICE Experiences into Unforgettable Journeys</h1>
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
              <div className="carousel-caption hero-overlay d-none d-md-block">
                <h1>Turning MICE Experiences into Unforgettable Journeys</h1>
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
              <div className="carousel-caption hero-overlay d-none d-md-block">
                <h1>Turning MICE Experiences into Unforgettable Journeys</h1>
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
      <section className="destinations">
        <div className="destination-section">
          <div className="intro-row">
            <div className="text-left">
              {/* <p className="highlight">DESTINATIONS WE RECOMMEND</p> */}
              <h3 className="section-title">DESTINATIONS WE RECOMMEND</h3>
              <h5>
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

      <section class="travel-banner">
        <div class="travel-image-box">
          <img
            src="\Images\HOME\PLAN. EXECUTE. INSPIRE\cascade-park-stone-flow-splash-ban_1417-1272.jpg"
            alt="Travel"
          />
          <button class="travel-play-btn">
            <svg viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div class="travel-content-box">
          <p class="travel-callback-text">
            CONNECT WITH US FOR UNFORGETTABLE MICE EXPERIENCES
          </p>

          <h1 class="travel-heading">PLAN. EXECUTE. INSPIRE.</h1>

          <p class="travel-subtext">
            At <strong>ExpressEarth</strong>, we don’t just organize events — we
            craft immersive corporate experiences. With over a decade of
            expertise in the MICE industry, we specialize in curating high-end
            conferences, incentive retreats, and global business summits. Our
            focus is on <em>flawless execution</em> with a touch of luxury,
            ensuring every moment leaves a lasting impression.
          </p>

          <div class="travel-subheading-box">
            <h6 class="travel-tagline">
              From Vision to Reality – We Make It Happen.
            </h6>
            <h5 class="travel-impact"> Our Global Impact</h5>
          </div>

          <div class="travel-stats-grid">
            <div class="travel-stat-item">
              <i class="fas fa-globe fa-2x travel-icon"></i>
              <p class="travel-stat-number">30+</p>
              <p class="travel-stat-label">Countries Network</p>
            </div>
            <div class="travel-stat-item">
              <i class="fas fa-hotel fa-2x travel-icon"></i>
              <p class="travel-stat-number">500+</p>
              <p class="travel-stat-label">Hotel Partners</p>
            </div>
            <div class="travel-stat-item">
              <i class="fas fa-smile-beam fa-2x travel-icon"></i>
              <p class="travel-stat-number">1 Lakh+</p>
              <p class="travel-stat-label">Satisfied Clients</p>
            </div>
            <div class="travel-stat-item">
              <i class="fas fa-briefcase fa-2x travel-icon"></i>
              <p class="travel-stat-number">1000+</p>
              <p class="travel-stat-label">Successful Events</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mice-section container mt-3 mb-5">
        <h2 className="text-center mb-3 fw-bold">MICE BY DESTINATION</h2>
        <h5 className="text-center text-muted mb-5">
          Explore the world's finest destinations, designed for unforgettable
          corporate experiences.
        </h5>

        {/* Horizontal scroll wrapper */}
        <div className="scroll-container d-flex gap-3 overflow-auto px-2 pb-3">
          {miceDestinations.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: "300px" }}
            >
              <Link
                to={`/categories/${item.slug}`}
                className="text-decoration-none"
              >
                <div className="card mice-card text-center shadow-sm p-3 h-100">
                  <i className={`fa ${item.icon} fa-2x text-primary mb-3`}></i>
                  <h6 className="fw-semibold mb-1">{item.label}</h6>
                  <p className="text-muted small mb-0">
                    {item.destinations} Destinations
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="subtext text-center mt-4">
          <h6 className="text-secondary">
            Where business meets luxury—tailor your next event with
            ExpressEarth!
          </h6>
        </div>

        <h2 className="text-center mt-5 mb-4 ">MICE BY GROUP SIZE</h2>
        <h5 className="text-center text-muted mb-5">
          Seamless event planning for every group, from intimate gatherings to
          grand corporate affairs.
        </h5>

        <div className="scroll-container d-flex gap-3 overflow-auto px-2 pb-3 ">
          {[
            {
              icon: "fa-solid fa-users",
              text: "Large Corporate Groups – 500+ Participants | 20+ Destinations",
              slug: "large-corporate-groups",
            },
            {
              icon: "fa-solid fa-user-group",
              text: "Small Business Teams – 50–200 Participants | 15+ Destinations",
              slug: "small-business-teams",
            },
            {
              icon: "fa-solid fa-user-tie",
              text: "Executive Retreats & Couples – 2–50 Participants | 12+ Destinations",
              slug: "executive-retreats-couples",
            },
            {
              icon: "fa-solid fa-champagne-glasses",
              text: "Incentive & Special Interest Groups – Customizable | 18+ Destinations",
              slug: "incentive-special-interest-groups",
            },
            {
              icon: "fa-solid fa-globe",
              text: "Global Conferences – 1000+ Participants | 10+ Destinations",
              slug: "global-conferences",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: "300px" }}
            >
              <Link
                to={`/categories/${item.slug}`}
                className="text-decoration-none"
              >
                <div className="card mice-card text-center shadow-sm p-3 h-100">
                  <i className={`${item.icon} fa-2x text-primary mb-3`}></i>
                  <p className="text-muted small mb-0">{item.text}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div className="subtext text-center mt-4">
          <h6>
            Whatever the size, we craft experiences that leave a lasting impact!
          </h6>
        </div>
      </section>
      {/* Testimonials */}
      <section className="testimonials">
        <div className="testimonial-title">
          <h3>CLIENT EXPERIENCES THAT SPEAK FOR THEMSELVES</h3>
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
        <div className="text-center mt-4">
          <p>What’s your story? Let us craft your perfect travel experience!</p>
          <Link to="/contact" className="custom-button-link">
            Contact Us
          </Link>
        </div>
      </section>

      {/*Recent blog*/}
      <section className="blogs-updates mt-5 mb-5">
        <h2 className="text-center mb-4">Latest News & Blogs</h2>
        <p className="text-center lead">Trends, Insights & MICE Updates!</p>

        <div className="scrolling-wrapper mt-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="blog-card">
              <img src={post.image} alt={post.title} />
              <div className="card-body">
                <h5>
                  <Link
                    to={`/blogs/${post.slug}`}
                    className="text-dark text-decoration-none"
                  >
                    {post.title}
                  </Link>
                </h5>
                <p>{post.description.slice(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-3">
          <Link to="/blogs" className="custom-button-link">
            Explore Blogs
          </Link>
        </div>
      </section>

      <section className="relative bg-white py-20 px-4 md:px-8 text-center overflow-hidden">
        {/* Top curved SVG */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 rotate-180">
          <svg
            className="relative block w-full h-16"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path d="M1200 0L0 0 0 120 1200 0z" fill="#0162b5"></path>
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-block">
            <h2 className="font-bold text-lg md:text-xl">
              Real Success Stories
            </h2>
            <p className="text-lg md:text-xl lg:text-2xl">
              Transforming Corporate Travel & Events
            </p>
            <h3
              className="mt-10 text-2xl text-indigo-600 font-bold italic px-2"
              style={{
                color: "blue",
              }}
            >
              “ExpressEarth MICE delivered a seamless and personalized corporate
              travel experience. Their expertise in handling large-scale events,
              attention to detail, and customized solutions truly set them
              apart.”
            </h3>
          </div>
          <p className="mt-6 text-gray-600">
            That’s what a senior manager from a{" "}
            <span className="italic">[Fortune 500 Company]</span> had to say
            about their experience with ExpressEarth MICE. From end-to-end event
            planning to flawless execution, we ensure every journey is a
            success.
          </p>

          <p className="mt-3 text-gray-600">
            Discover how our innovative solutions and industry expertise create
            unforgettable corporate experiences.
          </p>
          <Link to="/case-studies">
            <button className="custom-button-link">Read Full Case Study</button>
          </Link>
        </div>

        {/* Bottom curved SVG */}
        {/* Top rotated curved SVG (180°) */}
        <div
          className="w-full overflow-hidden leading-0"
          style={{
            transform: "rotate(180deg)", // Rotate the whole div
            marginTop: "2rem",
            marginBottom: "3rem",
          }}
        >
          <svg
            className="relative block w-full h-16"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path d="M1200 0L0 120 0 0 1200 0z" fill="#0162b5" />
          </svg>
        </div>
      </section>

      <section className="bg-gray-50 text-center py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Excellence Recognized, Trust Earned
        </h2>
        <p className="text-gray-700 max-w-3xl mx-auto mb-6 text-base md:text-lg">
          Discover the awards, accreditations, and industry recognition that
          make{" "}
          <span className="text-green-600 font-medium">ExpressEarth MICE</span>{" "}
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

      <section className="faq-section">
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
                style={{
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
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
