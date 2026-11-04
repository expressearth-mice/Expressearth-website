import React, { useState } from 'react';
import { useSnackbar } from "notistack";
import { Link } from 'react-router-dom';
import './Home.css';
import axiosInstance from '../api/axios';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const handleSubscribe = async (e) => {
  e.preventDefault();

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    enqueueSnackbar("Please enter a valid email address.", {
      variant: "error",
    });
    return;
  }

  try {
    const response = await axiosInstance.post("/api/subscribe/", {
      email,
    });

    setSubscribed(true);
    setEmail("");

    enqueueSnackbar(
      response.data.message || "Thanks for subscribing!",
      {
        variant: "success",
      }
    );
  } catch (err) {
    console.error(err);

    let errorMessage = "Something went wrong. Please try again later.";

    if (err.response?.data) {
      const data = err.response.data;

      if (typeof data === "string") {
        errorMessage = data;
      } else if (data.message) {
        errorMessage = data.message;
      } else if (data.email) {
        errorMessage = Array.isArray(data.email)
          ? data.email[0]
          : data.email;
      }
    }

    enqueueSnackbar(errorMessage, {
      variant: "error",
    });
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
              src="/Images/expressearth_white_logo.png"
              alt="ExpressEarth Logo"
              className="footer-logo"
            />

            <p>
              ExpressEarth MICE plans corporate events, conferences, incentive travel, dealer meets and group programmes in India and international destinations.
            </p>
            <p>
              <i className="fas fa-phone-alt" aria-hidden="true"></i>{" "}
              <a href="tel:+919266056660">+91-92660 56660</a><br />
              <i className="fas fa-envelope" aria-hidden="true"></i>{" "}
              <a href="mailto:enquiry@expressearth.com">enquiry@expressearth.com</a>
            </p>
            <p><i className="fas fa-map-marker-alt"></i> 22, Ground Floor, Vipul Trade Center, Sector 48, Gurugram</p>
            <div className="social-icons">
              <a
                href="https://www.linkedin.com/company/expressearthdigitalservicespvtltd/posts/?feedView=all"
                aria-label="ExpressEarth on LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-linkedin"></i>
              </a>
              <a
                href="https://www.instagram.com/expressearthgroup?igsh=NmJjYzloZzRzdmpo"
                aria-label="ExpressEarth on Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.facebook.com/share/1L2WbsX9on/?mibextid=LQQJ4d"
                aria-label="ExpressEarth on Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-facebook"></i>
              </a>
              <a
                href="https://x.com/ExpressEarth"
                aria-label="ExpressEarth on X"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.youtube.com/@Expressearthworld"
                aria-label="ExpressEarth on YouTube"
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
              <li><Link to="/corporate-events" style={linkStyle} onClick={handleClick}><i className="fas fa-hotel"></i> Corporate Events</Link></li>
              <li><Link to="/achievements" style={linkStyle} onClick={handleClick}><i className="fas fa-trophy"></i> Achievements</Link></li>
              <li><Link to="/careers" style={linkStyle} onClick={handleClick}><i className="fas fa-user-tie"></i> Careers</Link></li>
              <li><Link to="/contact" style={linkStyle} onClick={handleClick}><i className="fas fa-envelope-open-text"></i> Contact Us</Link></li>
              <li><Link to="/#home-faqs" style={linkStyle}><i className="fas fa-lightbulb"></i> FAQs</Link></li>
            </ul>
          </div>

          {/* SERVICES */}
          <div className="footer-services">
            <h4>Our MICE Services</h4>
            <ul>
              <li><Link to="/meetings-and-conferences" style={linkStyle} onClick={handleClick}><i className="fas fa-ticket-alt"></i> Meetings & Conferences</Link></li>
              <li><Link to="/incentive-travel" style={linkStyle} onClick={handleClick}><i className="fas fa-medal"></i> Incentive Travel</Link></li>
              <li><Link to="/exhibitions-and-trade-shows" style={linkStyle} onClick={handleClick}><i className="fas fa-globe-americas"></i> Exhibitions & Trade Shows</Link></li>
              <li><Link to="/corporateoffsites" style={linkStyle} onClick={handleClick}><i className="fas fa-umbrella-beach"></i> Corporate Offsites</Link></li>
              <li><Link to="/destination-management" style={linkStyle} onClick={handleClick}><i className="fas fa-location"></i> Destination Management</Link></li>
              <li><Link to="/dealermeet" style={linkStyle} onClick={handleClick}><i className="fas fa-handshake"></i> Dealer &amp; Distributor Meets</Link></li>
              <li><Link to="/corporateoffsites" style={linkStyle} onClick={handleClick}><i className="fas fa-mountain"></i> Corporate Offsites</Link></li>
              <li><Link to="/conferencemanagement" style={linkStyle} onClick={handleClick}><i className="fas fa-calendar-check"></i> Conference Management</Link></li>
              <li><Link to="/internationalgrouptravel" style={linkStyle} onClick={handleClick}><i className="fas fa-plane"></i> International Group Travel</Link></li>
              <li><Link to="/Gifting" style={linkStyle} onClick={handleClick}><i className="fas fa-gift"></i> Corporate Gifting</Link></li>
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
            <p>© {new Date().getFullYear()} ExpressEarth MICE. All Rights Reserved.</p>
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
          <img src="/Images/Expressearth%20website%20images/logo/ADTOILogo.jpg" alt="ADTOI logo" loading="lazy" decoding="async" />
          <img src="/Images/Expressearth%20website%20images/logo/ALLIEDlogo.jpg" alt="Allied logo" loading="lazy" decoding="async" />
          <img src="/Images/Expressearth%20website%20images/logo/dpiitlogo.png" alt="DPIIT logo" loading="lazy" decoding="async" />
          <img src="/Images/Expressearth%20website%20images/logo/duns-logo.png" alt="D-U-N-S logo" loading="lazy" decoding="async" />
          <img src="/Images/Expressearth%20website%20images/logo/NASSCOM-logo.jpg" alt="NASSCOM logo" loading="lazy" decoding="async" />
          <img src="/Images/Expressearth%20website%20images/logo/nidhi.jpg" alt="NIDHI logo" loading="lazy" decoding="async" />
        </div>
      </div>
    </>
  );
};

export default Footer;
