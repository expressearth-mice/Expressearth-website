import React from 'react';
import { Link } from "react-router-dom";
import { FaRegCalendar, FaPlane, FaBullhorn, FaBuilding, FaMapMarkedAlt, FaGift } from 'react-icons/fa';

const services = [
  {
    title: "Meetings & Conferences",
    description: "Seamless corporate meetings, leadership summits, and agile-scale conferences designed for impact.",
    icon: <FaRegCalendar color="#046ab8" />,
    link: "/meetings-and-conferences"
  },
  {
    title: "Incentive Travel",
    description: "Reward your top performers with library-incented special experiences that inspire and motivate.",
    icon: <FaPlane color="#046ab8" />,
    link: "/incentive-travel"
  },
  {
    title: "Corporate Events",
    description: "From grand product launches to gala dinners and immersive experiences, we create events that leave a lasting impression.",
    icon: <FaBullhorn color="#046ab8" />,
    link: "/corporate-events"
  },
  {
    title: "Exhibitions & Trade Shows",
    description: "Global participation, booth management, and team-first brand attribution planning for maximum brand impact.",
    icon: <FaBuilding color="#046ab8" />,
    link: "/exhibitions-and-trade-shows"
  },
  {
    title: "Destination Management",
    description: "Complete event planning solutions, including logistics, venue selection, and on-ground support for international events.",
    icon: <FaMapMarkedAlt color="#046ab8" />,
    link: "/destination-management"
  },
  {
    title: "Gifting",
    description: "Customized corporate gifting solutions to enhance your brand presence and create memorable experiences.",
    icon: <FaGift color="#046ab8" />,
    link: "/Gifting"
  }
];

const MiceServices = () => {
  const heroImage = '/Images/Expressearth%20website%20images/Our-Services/services.png'; // Make sure bg3.jpg is inside the public/Images/ folder

  return (
    <div style={{ fontFamily: 'Arial-Nova, sans-serif', backgroundColor: '#f8fafc', color: '#333' }}>
      {/* Header Section with Background Image */}
      <section
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          color: '#fff',
          padding: '110px 20px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Optional: Dark overlay */}
        {/* <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(114, 107, 107, 0.5)', // black overlay with 50% opacity
          zIndex: -1,
        }} /> */}

        <h1
          style={{
            fontSize: '48px',
            marginBottom: '20px',
            backgroundColor: 'rgba(19, 17, 17, 0.38)', // semi-transparent white background
            display: 'inline-block',
            padding: '10px 20px',
            borderRadius: '8px'
          }}
        >
          Our Services<br />Crafting Extraordinary MICE Experiences
        </h1>
      </section>


      {/* Services Section */}
      <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: 'auto' }}>
        <p style={{
          fontSize: '18px',
          maxWidth: '700px',
          margin: 'auto',
          lineHeight: '1.6',
          textAlign: 'center'
        }}>
          At ExpressEarth MICE, we specialize in delivering world-class corporate events, incentive travel, and destination management services. Whether you're planning a high-profile conference, a luxury incentive trip, or a large-scale exhibition, we ensure seamless execution with a touch of excellence.<br />
          Explore our comprehensive MICE solutions designed to elevate your business experiences. Click on any service below to learn more!
        </p>
        <br />
        <h2 style={{ textAlign: 'center', marginBottom: '50px', fontSize: '28px', color: '#0a3d62' }}>
          OUR KEY SERVICES
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {services.map((service, index) => (
            <Link
              key={index}
              to={service.link}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div
                style={{
                  backgroundColor: '#fff',
                  padding: '30px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  textAlign: 'left',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  border: '1px solid #f0f0f0',
                  overflow: 'hidden',
                  height: '100%',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ fontSize: '40px', marginBottom: '20px' }}>{service.icon}</div>
                <h3 style={{ color: '#0a3d62', fontSize: '22px', marginBottom: '15px' }}>{service.title}</h3>
                <p style={{ marginBottom: '20px', lineHeight: '1.6', color: '#555' }}>{service.description}</p>
                <span style={{
                  color: '#0a3d62',
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '15px'
                }}>
                  LEARN MORE
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12 mb-16 px-4">
          <p className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
            Looking for a tailor-made event solution? Get in touch with our experts today!
          </p>

          <Link to="/contact">
            <button className="custom-button-link">
              Contact Our Experts
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MiceServices;
