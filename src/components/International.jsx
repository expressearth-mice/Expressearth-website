import { useEffect, useState, useRef } from "react";
import "./International.css";
import axiosInstance from "../api/axios";
import HorizontalSlider from "./ui/HorizontalSlider";
import { motion } from "framer-motion";
import PopupForm from "./popupForm";

const CountUp = ({ end, suffix = "", trigger }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const increment = end / (duration / 16);

    const counter = () => {
      start += increment;
      if (start < end) {
        setCount(Math.ceil(start));
        requestAnimationFrame(counter);
      } else {
        setCount(end);
      }
    };

    counter();
  }, [trigger]); // 👈 ONLY runs when trigger changes

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const categories = [
  { key: "Islands", icon: "🏝️", label: "Islands & Leisure Destinations" },
  { key: "Global", icon: "🏙️", label: "Global Business & Luxury Citiess" },
  { key: "Culture", icon: "🏛️", label: "Culture & Experiential Regions" },
  { key: "Emerging", icon: "🌏", label: "Emerging & Offbeat Destinations" },
];
const categoryTaglines = {
  Islands: "Perfect for corporate incentive travel and high-engagement retreats.",
  Global: "Isuited for corporate incentive trips with immersive experiences.",
  Culture: "Suited for corporate events in India with a premium experience.",
  Emerging: "unique options for international corporate retreats.",
};


const destData = {
  Islands: {
    bali: {
      icon: "🏝️",
      name: "Bali, Indonesia",
      cardName: "Bali",
      tagline: "The world's favourite island for corporate incentive travel.",
      desc: "Bali is the gold standard for corporate incentive trips from India, luxury villas, private temple ceremonies, rice paddy trekking, and world-class beach clubs. From Seminyak's vibrant energy to Ubud's cultural serenity, Bali delivers unforgettable experiences at competitive value.",
      places: ["Seminyak", "Ubud", "Nusa Dua", "Kuta", "Canggu", "Uluwatu", "Sanur"],
      img: "/assets/bali.webp",
    },
    phuket: {
      icon: "🌊",
      name: "Phuket, Thailand",
      cardName: "Phuket",
      tagline: "Thailand's crown jewel for beach-based corporate events.",
      desc: "Phuket offers superb conference facilities, stunning beach venues, island-hopping excursions, and a vast range of team-building activities. Its excellent connectivity from India, combined with world-class resort infrastructure, makes it a perennial favourite for large incentive groups.",
      places: ["Patong", "Laguna", "Kata Beach", "Phi Phi Islands", "Phang Nga Bay", "Krabi"],
      img: "/assets/phuket.webp",
    },
    maldives: {
      icon: "🏖️",
      name: "Maldives",
      cardName: "Maldives",
      tagline: "Exclusive over-water luxury for premium corporate retreats.",
      desc: "The Maldives is the pinnacle of exclusive corporate retreats, private island buyouts, over-water bungalow blocks, underwater dining, and pristine turquoise lagoons. Ideal for top performer incentives and C-suite leadership offsites that demand the extraordinary.",
      places: ["Male Atoll", "North Malé Atoll", "Baa Atoll", "Ari Atoll", "Lhaviyani Atoll"],
      img: "/assets/maldives.webp",
    },
    seychelles: {
      icon: "🌴",
      name: "Seychelles",
      cardName: "Seychelles",
      tagline: "Pristine islands for the most exclusive incentive experiences.",
      desc: "Seychelles offers unmatched exclusivity, granite islands, powder-white beaches, and some of the world's most luxurious island resorts. Perfect for ultra-premium incentive groups and leadership retreats hat want privacy, beauty, and absolute world-class service.",
      places: ["Mahé", "Praslin", "La Digue", "Silhouette Island", "North Island"],
      img: "/assets/Seychelles.jpg",
    },
  },

  Global: {
    dubai: {
      icon: "🏙️",
      name: "Dubai, UAE",
      cardName: "Dubai",
      tagline: "The global MICE capital — limitless scale, unparalleled luxury.",
      desc: "Dubai is the #1 international destination for Indian corporate events, world-class venues, luxury hotels, desert safaris, and Burj Khalifa experiences. No visa required for Indians and unbeatable infrastructure.",
      places: ["Downtown Dubai", "DIFC", "Dubai Marina", "Palm Jumeirah", "Business Bay", "JBR"],
      img: "/assets/dubai.webp",
    },
    singapore: {
      icon: "🌆",
      name: "Singapore",
      cardName: "Singapore",
      tagline: "Asia's premier business hub, world-class MICE infrastructure.",
      desc: "Singapore's Marina Bay Sands, Resorts World Sentosa, and Suntec City provide Asia's finest conference and exhibition venues. Coupled with its iconic city backdrop, exceptional food scene, and excellent connectivity from India, Singapore remains a top choice for corporate conferences and incentive programs.",
      places: ["Marina Bay", "Sentosa", "Clarke Quay", "Orchard Road", "Changi", "Gardens by the Bay"],
      img: "/assets/singapore.webp",
    },
    london: {
      icon: "🏛️",
      name: "London, UK",
      cardName: "London",
      tagline: "Global prestige for high-profile corporate conferences.",
      desc: " London brings global prestige to your corporate events, The Shard, Grosvenor House, ExCeL London, and hundreds of heritage venue options. Ideal for financial services, luxury sector, and professional services corporate events that demand a world-class brand association.",
      places: ["Canary Wharf", "The City", "Mayfair", "South Bank", "Kensington", "ExCeL"],
      img: "/assets/london.webp",
    },
    paris: {
      icon: "✨",
      name: "Paris, France",
      cardName: "Paris",
      tagline: "The city of elegance for luxury incentive programs and events..",
      desc: " Paris adds an unmatched level of elegance to corporate incentive programs, private Eiffel Tower dinners, Versailles buyouts, Moulin Rouge shows, and world-class MICE venues at Palais des Congrès. Ideal for luxury sector brands, fashion industry events, and premium incentive programs.",
      places: ["Champs-Élysées", "Le Marais", "Versailles", "Palais des Congrès", "Disneyland Paris"],
      img: "/assets/paris.jfif",
    },
  },

  Culture: {
    italy: {
      icon: "🏛️",
      name: "Italy",
      cardName: "Italy",
      tagline: "Art, history, and cuisine for immersive incentive trips.",
      desc: "Italy offers an extraordinary cultural backdrop for corporate incentive travel — Rome's Colosseum, Venice's canals, Tuscany's vineyards, and the Amalfi Coast's drama. Cooking classes, private museum tours, wine experiences, and Vatican exclusives create incentive programs teams will talk about forever.",
      places: ["Rome", "Venice", "Florence", "Milan", "Tuscany", "Amalfi Coast"],
      img: "/assets/italy.webp",
    },
    turkey: {
      icon: "🕌",
      name: "Turkey",
      cardName: "Turkey",
      tagline: "East meets West, incredible value for corporate events.",
      desc: "Turkey combines exceptional value, stunning landscapes, and remarkable history for corporate incentive trips. Hot air ballooning over Cappadocia, Bosphorus yacht dinners in Istanbul, Ephesus private tours, and Aegean beach resorts,Turkey delivers world-class experiences at compelling price points.",
      places: ["Istanbul", "Cappadocia", "Antalya", "Bodrum", "Izmir", "Pamukkale"],
      img: "/assets/turkey.jpg",
    },
    europe: {
      icon: "🌍",
      name: "Europe Circuit",
      cardName: "Europe",
      tagline: "Multi-country journeys for the ultimate incentive experience.",
      desc: " Europe circuits are the crown jewel of incentive travel — multi-city journeys covering 3–5 countries in 7–10 days. We design seamless cross-border itineraries combining business, culture, and luxury stays across major European cities, tailored to your group's interests and budget.",
      places: ["Paris", "Amsterdam", "Italy", "Scandinavia", "Swiss Alps"],
      img: "/assets/europe.webp",
    },
  },

  Emerging: {
    vietnam: {
      icon: "🌿",
      name: "Vietnam",
      cardName: "Vietnam",
      tagline: "Southeast Asia's fastest-rising destination for incentive travel.",
      desc: "Vietnam has emerged as one of the most exciting international corporate travel destinations from India, Halong Bay cruises, Hoi An lantern festivals, modern Hanoi hotels, and Da Nang's emerging beach resort corridor. Excellent value, unique experiences, and a rapidly improving hospitality scene.",
      places: ["Hanoi", "Ho Chi Minh", "Halong Bay", "Da Nang", "Hoi An"],
      img: "/assets/veitnam.webp",
    },
    azerbaijan: {
      icon: "🔥",
      name: "Azerbaijan",
      cardName: "Azerbaijan",
      tagline: "The Land of Fire, Europe's most surprising destination.",
      desc: "Azerbaijan is rapidly becoming a standout choice for Indian corporate travel, no visa required, direct flights from Mumbai and Delhi, stunning Baku architecture, Caspian Sea backdrop, and a rapidly expanding luxury hotel sector. A unique and memorable destination for incentive programs and conferences.",
      places: ["Baku", "Gabala", "Sheki", "Quba"],
      img: "/assets/Baku.webp",
    },
    centralAsia: {
      icon: "🏔️",
      name: "Central Asia",
      cardName: "Central Asia",
      tagline: "Silk Road grandeur for extraordinary journeys.",
      desc: "Central Asia, Uzbekistan, Kazakhstan, and Kyrgyzstan, offers an entirely unique backdrop for corporate incentive travel. UNESCO-listed Silk Road cities like Samarkand and Bukhara, dramatic mountain landscapes, and nomadic culture create unforgettable experiences for adventurous groups.",
      places: ["Tashkent", "Samarkand", "Bukhara", "Almaty"],
      img: "/assets/Central asia.jpg",
    },
    easternEurope: {
      icon: "🏰",
      name: "Eastern Europe",
      cardName: "Eastern Europe",
      tagline: "Gothic charm and exceptional value across emerging destinations. ",
      desc: "Eastern Europe delivers exceptional value for corporate incentive groups, Prague's fairy-tale architecture, Budapest's thermal baths and river cruises, Krakow's historic old town, and Dubrovnik's Adriatic magnificence. Outstanding hotel quality at a fraction of Western Europe costs.",
      places: ["Prague", "Budapest", "Krakow", "Dubrovnik"],
      img: "/assets/europe.webp",
    },
  },
};

const executeItems = [
  ["🏆", "Corporate Incentive Travel Programs", "Reward-driven global journeys that motivate, inspire, and retain your highest performers."],
  ["🎪", "International Conferences & Exhibitions", "End-to-end execution for large-scale global events across any destination worldwide."],
  ["🎯", "Leadership Retreats & Offsites", "High-impact global experiences designed to create strategic clarity and leadership alignment."],
  ["🚀", "Product Launches & Corporate Events", "Seamless global delivery for product launches, announcements, and milestone celebrations."],
  ["🤝", "Team Building Activities (Global)", "Designed for engagement and outcomes, culturally attuned to international settings."],
];

const logisticsItems = [
  ["✈️ Flights & Group Logistics", "Group airfare, transfers, and airport coordination, fully managed for your entire team, wherever you're flying from."],
  ["🛂 Visa Assistance", "Complete visa processing support for all international destinations, we handle documentation, appointments, and submission."],
  ["💱 Forex & Travel Insurance", "Currency management and comprehensive travel insurance ensuring complete peace of mind for every traveller."],
  ["🌍 On-Ground Coordination", "End-to-end on-ground coordination worldwide, our teams are present at every destination to ensure flawless delivery."],
];

const whyItems = [
  ["🏅", "Trusted MICE Partner", "Proven expertise as a trusted partner for international MICE planning across diverse industries."],
  ["🌐", "Diverse Global Experience", "Deep experience across a wide range of global destinations, from iconic cities to hidden gems."],
  ["🤝", "Strong International Network", "An extensive international vendor and partner network built over years of global execution."],
  ["✅", "Seamless Risk-Managed Delivery", "We anticipate challenges and manage risk proactively, so your event goes exactly as planned."],
];

const International = () => {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const [counterTrigger, setCounterTrigger] = useState(0);
  const statsRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("Islands");
  const [expanded, setExpanded] = useState(null);
  const expandedRef = useRef(null);



  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setCounterTrigger((prev) => prev + 1);
          hasAnimated.current = true; // ✅ runs only once
        }
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, []);

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
        "International Destination submit error:",
        error.response?.data || error.message || error,
      );
      alert("Error submitting form");
    }
  };


  const selectedDestination = expanded ? destData[activeTab][expanded] : null;

  const switchCategory = (category) => {
    setActiveTab(category);
    setExpanded(null);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const toggleDestination = (place) => {
    setExpanded((current) => (current === place ? null : place));
    window.requestAnimationFrame(() => {
      expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };


  return (

    <main className="international-page">
      {showPopup && <PopupForm onClose={handleClosePopup} />}
      <section className="intl-hero">
        <div className="intl-hero-globe"></div>
        <div className="intl-hero-content">
          <span className="intl-hero-tag">🌐 Global Corporate Travel</span>
          <h1>
            Global Destinations for
            <br />
            <span>World-Class</span>
            <br />
            Corporate Experiences
          </h1>
          <p>
            End-to-end international corporate travel planning across destinations worldwide, wherever your team wants to go.
          </p>
          <div className="intl-hero-cta">
            <a href="#destinations" className="intl-btn-primary" onClick={handleOpenPopup}>
              Explore Destinations
            </a>
            <a href="#cta" className="intl-btn-outline" onClick={handleOpenPopup}>
              Plan Your Offsite
            </a>
          </div>
        </div>
        <div className="international-right" ref={formRef}>
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

      <div className="intl-stats-bar" ref={statsRef}>
        {[
          [50, "+", "Countries Covered"],
          [500, "+", "Events Delivered"],
          [100, "%", "Managed End-to-End"],
          [24, "/7", "On-Ground Support"],
        ].map(([num, suffix, label]) => (
          <div className="intl-stat-item" key={label}>
            <div className="intl-stat-num">
              <CountUp end={num} suffix={suffix} trigger={counterTrigger} />
            </div>
            <div className="intl-stat-label">{label}</div>
          </div>
        ))}
      </div>

      <section className="intl-intro-section">
        <span className="intl-section-label">Our Global Reach</span>
        <div className="intl-intro-divider" />
        <h2 >The world isn't limited to a few destinations, and neither are we.</h2>
        <p>
          At ExpressEarth, we design and execute corporate incentive trips, retreats, conferences, and large-scale events across every global destination accessible to Indian travellers. From iconic cities to offbeat international locations,if it's possible, we make it seamless.
        </p>
      </section>

      <section className="intl-destinations-section" id="destinations">
        <h2>Destinations Across the World</h2>

        <p>
          We don't restrict your choices. Our expertise spans global corporate travel management, including every type of destination and experience.
        </p>

        {/* CATEGORY TABS */}
        <div className="intl-cat-tabs">
          {categories.map((category) => (
            <button
              className={`intl-cat-tab ${activeTab === category.key ? "active" : ""}`}
              key={category.key}
              type="button"
              onClick={() => switchCategory(category.key)}
            >
              <span className="intl-tab-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* 🔥 TAGLINE BELOW CATEGORY (CENTER CARD STYLE) */}
        <div className="intl-category-tagline">
          {categoryTaglines[activeTab]}
        </div>

        {/* EXPANDED DESTINATION */}
        <div
          ref={expandedRef}
          className={`intl-dest-expanded ${selectedDestination ? "open" : ""}`}
        >
          {selectedDestination && (
            <>
              <button
                className="intl-expand-close"
                type="button"
                onClick={() => setExpanded(null)}
                aria-label="Close destination details"
              >
                ×
              </button>

              <h3>
                <span className="intl-icon">{selectedDestination.icon}</span>
                {selectedDestination.name}
              </h3>

              <div className="intl-tagline">
                {selectedDestination.tagline}
              </div>

              <p className="intl-desc-text">
                {selectedDestination.desc}
              </p>

              <div className="intl-dest-places">
                {selectedDestination.places.map((place) => (
                  <span className="intl-dest-place-pill" key={place}>
                    {place}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* DESTINATION CARDS */}
        <div className="intl-dest-grid">
          {Object.entries(destData[activeTab] || {}).map(([key, item]) => (
            <button
              className="intl-dest-card"
              type="button"
              key={key}
              onClick={() => toggleDestination(key)}
            >
              <img src={item.img} alt={item.cardName} />

              <span className="intl-dest-card-overlay">
                <span className="intl-dest-card-name">
                  {item.cardName}
                </span>
              </span>

              <span className="intl-dest-card-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M13 5l7 7-7 7M5 12h15" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </section>


      <section className="intl-execute-section">
        <span className="intl-section-label">Global MICE Solutions</span>

        <h2>What We Execute Globally</h2>

        <p>
          Across any destination, we deliver complete MICE solutions with precision and creativity.
        </p>

        {/* 🔥 SLIDER START */}
        <HorizontalSlider
          className="intl-execute-slider"
          itemCount={executeItems.length}
        >
          {executeItems.map(([icon, title, text], idx) => (
            <motion.div
              className="intl-execute-card"
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="intl-execute-icon">{icon}</div>

              <h4>{title}</h4>

              <p>{text}</p>
            </motion.div>
          ))}
        </HorizontalSlider>
        {/* 🔥 SLIDER END */}
      </section>

      <section className="intl-logistics-section">
        <span className="intl-section-label">Fully Managed</span>
        <h2>Travel & Logistics, Fully Managed</h2>
        <p>Global execution requires precision. We handle everything from start to finish.</p>
        <div className="intl-logistics-grid">
          {logisticsItems.map(([title, text]) => (
            <div className="intl-logistics-item" key={title}>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="intl-why-section">
        <span className="intl-section-label">Why ExpressEarth</span>
        <h2>Why Choose ExpressEarth</h2>
        <div className="intl-why-grid">
          {whyItems.map(([icon, title, text]) => (
            <div className="intl-why-item" key={title}>
              <div className="intl-why-badge">{icon}</div>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="intl-cta-section" id="cta">
        <h2>Plan Your International Offsite</h2>
        <p>From any destination to every detail, we deliver corporate incentive trips and global retreats without limits.</p>
        <a href="https://www.expressearth.com/" className="intl-btn-cta" onClick={handleOpenPopup}>
          Get In Touch With Us →
        </a>
      </section>
    </main>
  );
};

export default International;
