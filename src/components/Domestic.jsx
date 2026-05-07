import { useRef, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../api/axios";
import HorizontalSlider from "./ui/HorizontalSlider";
import PopupForm from "./popupForm";
import "./Domestic.css";

const categories = [
  { key: "Beach", icon: "🏝️", label: "Beach Destinations" },
  { key: "Mountains", icon: "🏔️", label: "Mountains & Wellness Retreats" },
  { key: "Heritage", icon: "🏰", label: "Heritage & Luxury Locations" },
  { key: "Metro", icon: "🌆", label: "Metro & Business Cities" },
  { key: "Offbeat", icon: "🌿", label: "Offbeat & Emerging Destinations" },
];
const categoryTaglines = {
  Beach: "Perfect for corporate offsite in India with relaxation and engagement.",
  Mountains: "Ideal for team building retreats in India and leadership offsites.",
  Heritage: "Suited for corporate events in India with a premium experience.",
  Metro: "Built for corporate event management in India, conferences, and exhibitions.",
  Offbeat: "Hidden gems across India for unique corporate retreat planning experiences.",
};

const destData = {
  Beach: {
    goa: {
      icon: "🏝️",
      name: "Goa",
      cardName: "Goa",
      tagline: "Perfect for corporate offsites blending work with coastal leisure.",
      desc: "Goa offers the ultimate corporate offsite experience, world-class beach resorts, unique team-building activities on pristine shores, and vibrant after-event entertainment. Ideal for large incentive groups and leadership retreats that need an energising setting.",
      places: ["North Goa", "South Goa", "Panjim", "Vasco", "Calangute"],
      img: "/assets/goa.jpg",
    },
    andaman: {
      icon: "🌊",
      name: "Andaman & Nicobar",
      cardName: "Andaman",
      tagline: "Pristine island paradise for exclusive corporate retreats.",
      desc: "The Andaman Islands deliver an exclusive, off-the-beaten-path corporate retreat experience. Crystal-clear waters, untouched beaches, and a secluded environment make it perfect for leadership offsites and premium incentive programs.",
      places: ["Port Blair", "Havelock", "Neil Island", "Baratang"],
      img: "/assets/andaman.jpg",
    },
    kerala: {
      icon: "🌴",
      name: "Kerala Coast",
      cardName: "Kerala",
      tagline: "God's Own Country for wellness retreats.",
      desc: "Kerala's backwaters, beach resorts, and Ayurvedic wellness centres create an unmatched environment for corporate retreats focused on rejuvenation and reflection. Ideal for executive wellness retreats and intimate leadership programs.",
      places: ["Kovalam", "Varkala", "Alleppey", "Kumarakom", "Bekal"],
      img: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?w=600&q=80",
    },
  },

  Mountains: {
    himachal: {
      icon: "🏔️",
      name: "Himachal Pradesh",
      cardName: "Himachal",
      tagline: "Adventure and serenity for team retreats.",
      desc: "Himachal Pradesh combines dramatic mountain landscapes with comfortable retreat infrastructure. From Shimla's colonial charm to Manali's adventure potential, it's a top choice for team building retreats and leadership offsites away from city distractions.",
      places: ["Shimla", "Manali", "Dharamshala", "Kasol"],
      img: "/assets/Himachal pradesh.webp",
    },
    uttarakhand: {
      icon: "⛰️",
      name: "Uttarakhand",
      cardName: "Uttarakhand",
      tagline: "Himalayan backdrop for corporate experiences.",
      desc: "Uttarakhand's Himalayan backdrop, yoga ashrams, and adventure sports make it ideal for leadership retreats, wellness offsites, and team expeditions. Rishikesh and Mussoorie offer world-class resort infrastructure with mountain magic.",
      places: ["Rishikesh", "Mussoorie", "Nainital", "Auli"],
      img: "/assets/Uttarakhand.jpg",
    },
    Coorg: {
      icon: "⛰️",
      name: "Coorg",
      cardName: "Coorg",
      tagline: " Misty coffee estates for intimate leadership retreats.",
      desc: "Coorg's rolling coffee plantations and boutique estate resorts offer a private, tranquil setting for small to mid-size corporate retreats. Perfect for leadership alignment offsites and focused strategy sessions in nature. Rishikesh and Mussoorie offer world-class resort infrastructure with mountain magic.",
      places: [" Madikeri", "Virajpet", "Kushalnagar", "Bylakuppe"],
      img: "/assets/Coorg.webp",
    },
    North_East_India: {
      icon: "⛰️",
      name: "North East India",
      cardName: "North_East_India",
      tagline: "Unexplored beauty for truly unique corporate journeys.",
      desc: "The North-East offers an extraordinary backdrop for corporate retreats, from Meghalaya's living root bridges to Sikkim's monastery valleys. Ideal for offbeat incentive trips and culture-immersive experiences that teams will never forget.",
      places: ["Meghalaya", "Sikkim", "Assam", "Arunachal Pradesh", "Nagaland", "Ziro"],
      img: "/assets/north east.webp",
    },
  },

  Heritage: {
    rajasthan: {
      icon: "🏰",
      name: "Rajasthan",
      cardName: "Rajasthan",
      tagline: "Royal grandeur for premium corporate events.",
      desc: "Rajasthan is India's jewel for luxury corporate events. Palace hotels, desert camps, and heritage forts create an incomparable backdrop for gala dinners, incentive programs, and high-profile conferences. Nowhere else delivers this level of grandeur.",
      places: ["Jaipur", "Udaipur", "Jodhpur", "Jaisalmer"],
      img: "/assets/rajasthan.webp",
    },
  },

  Metro: {
    mumbai: {
      icon: "🌆",
      name: "Mumbai",
      cardName: "Mumbai",
      tagline: "India’s business capital, world-class venues, unlimited energy.",
      desc: "Mumbai offers India's best conference and exhibition infrastructure alongside premier luxury hotels. Ideal for large-scale corporate events, product launches, exhibitions, and gala evenings with city-wide impact.",
      places: [" BKC", "Nariman Point", "Powai", "Juhu", "Worli", "Lower Parel"],
      img: "/assets/mumbai.jpg",
    },
    delhi: {
      icon: "🏙️",
      name: "Delhi NCR",
      cardName: "Delhi",
      tagline: " The capital, unmatched scale and premium event infrastructure.",
      desc: "Delhi NCR's luxury hotel corridor, MICE venues, and excellent connectivity make it the go-to for large conferences, government-adjacent events, and high-profile incentive programs. Gurgaon and Noida extend the options further.",
      places: [" Gurgaon, Noida", "Aerocity", "Connaught Place", "Dwarka", "Greater Noida"],
      img: "/assets/delhi ncr.webp",
    },
    bangalore: {
      icon: "💻",
      name: "Bangalore",
      cardName: "Bangalore",
      tagline: "India's tech hub — ideal for innovation-driven corporate events.",
      desc: "Preferred for tech company offsites and leadership summits.",
      places: ["Whitefield", "Electronic City", "Outer Ring Road", "Indiranagar", "Marathahalli"],
      img: "/assets/banglore.webp",
    },
  },

  Offbeat: {
    spiti: {
      icon: "🏔️",
      name: "Spiti Valley",
      cardName: "Spiti",
      tagline: "Cold desert drama for unforgettable leadership expeditions.",
      desc: "Perfect for high-altitude adventure and digital detox retreats.",
      places: [" Kaza", "Key Monastery", "Chandratal", "Pin Valley", "Kibber"],
      img: "/assets/spiti valley.jpg",
    },
    ziro: {
      icon: "🌿",
      name: "Ziro Valley",
      cardName: "Ziro",
      tagline: "UNESCO-listed cultural landscape for immersive retreats.",
      desc: "Perfect for offbeat cultural immersion experiences.",
      places: ["Ziro Town", "TalyangDutta", "Old Ziro", "Hong"],
      img: "/assets/ziro valley.jpg",
    },
    chopta: {
      icon: "🌄",
      name: "Chopta",
      cardName: "Chopta",
      tagline: "The perfect Himalayan base for corporate retreats.",
      desc: "A pristine meadow ideal for trekking and nature retreats.",
      places: [" Chopta Meadows", "Tungnath Temple", "Chandrashila Peak", "Dugalbitta"],
      img: "/assets/chopta.jpg",
    },
  },
};
const executeItems = [
  ["🏕️", "Corporate Offsite Planning", "Designed for engagement and outcomes, tailored for your team's goals and culture."],
  ["🏆", "Incentive Travel Programs", "Reward-driven travel experiences that motivate, recognise, and retain top performers."],
  ["🎯", "Leadership Retreats", "Focused, high-impact environments designed to inspire strategic clarity and alignment."],
  ["🎪", "Conference & Exhibition Management", "Seamless large-scale execution from setup to wrap-up, anywhere in India."],
  ["🤝", "Team Building Activities", "Structured and result-driven programs that build cohesion and improve collaboration."],
  ["✨", "Gala Nights & Corporate Events", "Concept, production, and delivery of unforgettable corporate celebrations."],
];

const strengthItems = [
  ["🗺️ Nationwide Network", "Deep partnerships and on-ground teams for corporate travel management across every Indian state and territory."],
  ["🔗 End-to-End Control", "From logistics and accommodation to production and activities, one point of contact keeps the program aligned."],
  ["🎨 Custom-Built Experiences", "Every client gets a bespoke experience designed around their brand, culture, and objectives."],
  ["✅ On-Ground Delivery", "Our teams are present throughout to ensure flawless on-the-day execution and real-time problem solving."],
];

const Domestic = () => {
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const expandedRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("Beach");
  const [expanded, setExpanded] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "Company",
    company: "",
  });

  const selectedDestination = expanded ? destData[activeTab][expanded] : null;

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
      console.log("Domestic Destination submit error:", error.response?.data || error.message || error);
      alert("Error submitting form");
    }
  };

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const switchCategory = (category) => {
    setActiveTab(category);
    setExpanded(null);
  };

  const toggleDestination = (place) => {
    setExpanded((current) => (current === place ? null : place));
    window.requestAnimationFrame(() => {
      expandedRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  };

  return (
    <main className="domestic-page">
      {showPopup && <PopupForm onClose={() => setShowPopup(false)} />}

      <section className="domestic-hero">
        <div className="domestic-hero-content">
          <span className="domestic-hero-tag">Pan-India Corporate Travel</span>
          <h1>
            Explore India for
            <br />
            <span>Corporate Retreats</span>
            <br />
            &amp; MICE
          </h1>
          <p>
            End-to-end corporate offsite planning in India across every destination, from beaches and mountains to business cities and hidden retreats.
          </p>
          <div className="domestic-hero-cta">
            <a href="#destinations" className="domestic-btn-primary" onClick={handleOpenPopup}>
              Explore Destinations
            </a>
            <a href="#cta" className="domestic-btn-outline" onClick={handleOpenPopup}>
              Plan Your Offsite
            </a>
          </div>
        </div>

        <div className="domestic-right" ref={formRef}>
          <form className="form-card" onSubmit={handleSubmit}>
            <h2>Get in Touch</h2>
            <input ref={inputRef} type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />

            <div className="radio-group">
              <label>
                <input type="radio" name="type" value="Individual" checked={formData.type === "Individual"} onChange={handleChange} />
                Individual
              </label>
              <label>
                <input type="radio" name="type" value="Company" checked={formData.type === "Company"} onChange={handleChange} />
                Company
              </label>
            </div>

            <input type="text" name="company" placeholder="Company Name" value={formData.company} onChange={handleChange} />
            <button type="submit" className="submit-btn">
              Submit
            </button>
          </form>
        </div>
      </section>

      <section className="domestic-intro-section">
        <span className="domestic-section-label">Why ExpressEarth</span>
        <div className="domestic-intro-divider" />
        <h2>India isn't one destination,<br /> it's hundreds of possibilities.</h2>
        <p>
          At ExpressEarth, we deliver corporate retreats in India, incentive programs, conferences, and large-scale events across every region of the country.
        </p>
      </section>

      <section className="domestic-destinations-section" id="destinations">
        <h2>Destinations Across India</h2>
        <p>
          We don't limit you to a shortlist. Our expertise spans pan-India corporate travel management, covering every type of experience.
        </p>

        <div className="domestic-cat-tabs">
          {categories.map((category) => (
            <button className={`domestic-cat-tab ${activeTab === category.key ? "active" : ""}`} key={category.key} type="button" onClick={() => switchCategory(category.key)}>
              <span className="domestic-tab-icon">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>
        <div className="domestic-category-tagline">
          {categoryTaglines[activeTab]}
        </div>

        <div ref={expandedRef} className={`domestic-dest-expanded ${selectedDestination ? "open" : ""}`}>
          {selectedDestination && (
            <>
              <button className="domestic-expand-close" type="button" onClick={() => setExpanded(null)} aria-label="Close destination details">
                ×
              </button>
              <h3>
                <span className="domestic-icon">{selectedDestination.icon}</span>
                {selectedDestination.name}
              </h3>
              <div className="domestic-tagline">{selectedDestination.tagline}</div>
              <p className="domestic-desc-text">{selectedDestination.desc}</p>
              <div className="domestic-dest-places">
                {selectedDestination.places.map((place) => (
                  <span className="domestic-dest-place-pill" key={place}>
                    {place}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="domestic-dest-grid">
          {Object.entries(destData[activeTab] || {}).map(([key, item]) => (
            <button className="domestic-dest-card" type="button" key={key} onClick={() => toggleDestination(key)}>
              <img src={item.img} alt={item.cardName} />
              <span className="domestic-dest-card-overlay">
                <span className="domestic-dest-card-name">{item.cardName}</span>
              </span>
              <span className="domestic-dest-card-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M13 5l7 7-7 7M5 12h15" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="domestic-execute-section">
        <span className="domestic-section-label">What We Execute Across India</span>
        <h2>Complete MICE Solutions, Any Destination</h2>
        <p>No matter the destination, we deliver end-to-end execution with precision and creativity.</p>

        <HorizontalSlider
          className="domestic-execute-slider"
          shellClassName="domestic-slider-shell"
          arrowClassName="domestic-slider-arrow"
          itemCount={executeItems.length}
        >
          {executeItems.map(([icon, title, text], idx) => (
            <motion.div className="domestic-execute-card" key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <div className="domestic-execute-icon">{icon}</div>
              <h4>{title}</h4>
              <p>{text}</p>
            </motion.div>
          ))}
        </HorizontalSlider>
      </section>

      <section className="domestic-howwe-section">
        <span className="domestic-section-label">Our Strength</span>
        <h2>How We Make It Seamless</h2>
        <p>Our strength lies in execution, not just planning.</p>
        <div className="domestic-howwe-grid">
          {strengthItems.map(([title, text]) => (
            <div className="domestic-howwe-item" key={title}>
              <h4>{title}</h4>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="domestic-cta-section" id="cta">
        <h2>Plan Your India Offsite</h2>
        <p>From any location to every experience, we design corporate retreats and offsites in India that truly deliver.</p>
        <a href="https://www.expressearth.com/" className="domestic-btn-cta" onClick={handleOpenPopup}>
          Get In Touch With Us →
        </a>
      </section>
    </main>
  );
};

export default Domestic;
