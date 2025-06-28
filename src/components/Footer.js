import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import axiosInstance from '../api/axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axiosInstance.post('/api/subscribe/', {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribed(true);
        setEmail('');
        alert(data.message || 'Thanks for subscribing!');
      } else {
        alert(data.email?.[0] || 'You are already subscribed.');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong. Please try again later.');
    }
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer'
  };

  const handleClick = (e) => {
    // e.currentTarget.style.color = 'green';
    window.scrollTo(0, 0);
  };

  return (
    <>
      <footer className="site-footer">
        <div className="footer-grid">
          {/* ABOUT */}
          <div className="footer-about">
            {/* <h3><i className="fas fa-globe"></i> ExpressEarth MICE</h3> */}

            <img
              src="/Images/express_earth_logoo-removebg-preview.png"
              alt="ExpressEarth Logo"
              className="footer-logo"
            />

            <p>
              With 9+ years of experience, ExpressEarth MICE is your trusted partner
              for corporate events, conferences, incentives, and seamless global travel.
            </p>
            <p><i className="fas fa-phone-alt"></i> +91-92660 56660 <br />
              <i className="fas fa-envelope"></i> enquiry@expressearth.com</p>
            <p><i className="fas fa-map-marker-alt"></i> 22, Ground Floor, Vipul Trade Center, Sector 48, Gurugram</p>
            <div className="social-icons">
              <a
                href="https://www.linkedin.com/company/expressearthdigitalservicespvtltd/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="https://www.instagram.com/expressearthgroup?igsh=NmJjYzloZzRzdmpo"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.facebook.com/share/1L2WbsX9on/?mibextid=LQQJ4d"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://x.com/ExpressEarth"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.youtube.com/@Expressearthworld"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>

          </div>

          {/* QUICK LINKS */}
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/" style={linkStyle} onClick={handleClick}><i className="fas fa-home"></i> Home</Link></li>
              <li><Link to="/about" style={linkStyle} onClick={handleClick}><i className="fas fa-bullseye"></i> About Us</Link></li>
              <li><Link to="/about" style={linkStyle} onClick={handleClick}><i className="fas fa-award"></i> Why Choose Us?</Link></li>
              <li><Link to="/destinations" style={linkStyle} onClick={handleClick}><i className="fas fa-plane-departure"></i> Our Destinations</Link></li>
              <li><Link to="/mice-services" style={linkStyle} onClick={handleClick}><i className="fas fa-calendar-alt"></i> MICE Services</Link></li>
              <li><Link to="/meetings-and-conferences" style={linkStyle} onClick={handleClick}><i className="fas fa-handshake"></i> Meetings & Conferences</Link></li>
              <li><Link to="/corporate-events" style={linkStyle} onClick={handleClick}><i className="fas fa-hotel"></i> Corporate Travel</Link></li>
              <li><Link to="/achievements" style={linkStyle} onClick={handleClick}><i className="fas fa-trophy"></i> Achievements</Link></li>
              <li><Link to="/careers" style={linkStyle} onClick={handleClick}><i className="fas fa-user-tie"></i> Careers</Link></li>
              <li><Link to="/contact" style={linkStyle} onClick={handleClick}><i className="fas fa-envelope-open-text"></i> Contact Us</Link></li>
              <li><Link to="/" style={linkStyle} onClick={handleClick}><i className="fas fa-lightbulb"></i> FAQs</Link></li>
            </ul>
          </div>

          {/* SERVICES */}
          <div className="footer-services">
            <h4>Our MICE Services</h4>
            <ul>
              <li><Link to="/meetings-and-conferences" style={linkStyle} onClick={handleClick}><i className="fas fa-ticket-alt"></i> Meetings & Conferences</Link></li>
              <li><Link to="/incentive-travel" style={linkStyle} onClick={handleClick}><i className="fas fa-medal"></i> Incentive Travel</Link></li>
              <li><Link to="/exhibitions-and-trade-shows" style={linkStyle} onClick={handleClick}><i className="fas fa-globe-americas"></i> Exhibitions & Trade Shows</Link></li>
              <li><Link to="/corporate-events" style={linkStyle} onClick={handleClick}><i className="fas fa-umbrella-beach"></i> Corporate Retreats</Link></li>
              <li><Link to="/destination-management" style={linkStyle} onClick={handleClick}><i className="fas fa-location"></i> Destination Management</Link></li>
              <li><Link to="/Gifting" style={linkStyle} onClick={handleClick}><i className="fas fa-gift"></i> Gifting</Link></li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          <div className="footer-newsletter">
            <h4><i className="fas fa-paper-plane"></i> Stay in the Loop</h4>
            <p>Get exclusive travel tips, MICE trends & deals.</p>
            <form onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>

          {/* BOTTOM */}
          <div className="footer-bottom">
            <p>© 2025 ExpressEarth MICE. All Rights Reserved.</p>
            <p>
              <Link to="/privacy-policy" style={linkStyle} onClick={handleClick}>Privacy Policy</Link> |{' '}
              <Link to="/terms-and-conditions" style={linkStyle} onClick={handleClick}>Terms & Conditions</Link>
            </p>
          </div>

        </div>
      </footer>
      {/* SCROLLING LOGO STRIP */}
      <div className="scrolling-logos">
        <div className="logo-track">
          <img src="/Images/Expressearth%20website%20images/logo/ADTOILogo.jpg" alt="Logo 1" />
          <img src="/Images/Expressearth%20website%20images/logo/ALLIEDlogo.jpg" alt="Logo 2" />
          <img src="/Images/Expressearth%20website%20images/logo/dpiitlogo.png" alt="Logo 3" />
          <img src="/Images/Expressearth%20website%20images/logo/duns-logo.png" alt="Logo 4" />
          <img src="/Images/Expressearth%20website%20images/logo/NASSCOM-logo.jpg" alt="Logo 5" />
          <img src="/Images/Expressearth%20website%20images/logo/nidhi.jpg" alt="Logo 6" />
        </div>
      </div>
    </>
  );
};

export default Footer;
