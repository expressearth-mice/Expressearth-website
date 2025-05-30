import React, { useContext, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";

function Navbar() {
  const { role } = useContext(AuthContext);
  const navbarCollapseRef = useRef(null);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Main Navigation Links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    {
      name: "Services",
      path: "/mice-services",
      dropdown: true,
      items: [
        { name: "Meetings & Conferences", path: "/meetings-and-conferences" },
        { name: "Incentive Travel", path: "/incentive-travel" },
        { name: "Corporate Events", path: "/corporate-events" },
        { name: "Exhibitions & Trade Shows", path: "/exhibitions-and-trade-shows" },
        { name: "Destination Management", path: "/destination-management" },
        { name: "Gifting", path: "/Gifting" },
      ],
    },
     { name: "Destinations", path: "/destinations" },
    {
      name: "Resources",
      path: "/blogs",
      dropdown: true,
      items: [
        { name: "Case Studies", path: "/case-studies" },
        { name: "Blogs & Insights", path: "/blogs" },
        { name: "Achievements", path: "/achievements" },
      ],
    },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact Us", path: "/contact" },
  ];

  // Bootstrap Collapse Toggle for Mobile
  const handleToggle = () => {
    if (navbarCollapseRef.current) {
      navbarCollapseRef.current.classList.toggle("show");
    }
  };

  // Collapse Navbar when clicking on a link + Smooth Scroll to Top
  const handleNavLinkClick = () => {
    if (window.innerWidth < 992) {
      handleToggle();
    }
    window.scrollTo({ top: 0, behavior: "smooth" }); // Smooth scroll to the top
  };

  return (
    <nav
      className={`navbar navbar-expand-lg glass-navbar ${isHomePage ? "homepage-navbar" : ""}`}
    >
      <div className="container">
        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggle}
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav" ref={navbarCollapseRef}>
          <NavLink className="navbar-brand" to="/">
            <img
              src="/Images/express_earth_logoo-removebg-preview.png"
              alt="ExpressEarth Logo"
              className="navbar-logo"
            />
          </NavLink>

          <ul className="navbar-nav me-auto">
            {navLinks.map((tab, idx) =>
              tab.dropdown ? (
                <li className="nav-item dropdown" key={idx}>
                  <div className="d-flex align-items-center">
                    <NavLink
                      to={tab.path}
                      className="nav-link nav-text"
                      style={{ textDecoration: "none" }}
                      onClick={handleNavLinkClick}
                    >
                      {tab.name}
                    </NavLink>
                    <a
                      href="#"
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ paddingLeft: "5px" }}
                      onClick={(e) => e.preventDefault()}
                    />
                  </div>
                  <ul className="dropdown-menu">
                    {tab.items.map((item, subIdx) => (
                      <li key={subIdx}>
                        <NavLink
                          className="dropdown-item"
                          to={item.path}
                          onClick={handleNavLinkClick}
                        >
                          {item.name}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li className="nav-item" key={idx}>
                  <NavLink
                    className={`nav-link nav-text ${location.pathname === tab.path ? "active" : ""}`}
                    to={tab.path}
                    onClick={handleNavLinkClick}
                  >
                    {tab.name}
                  </NavLink>
                </li>
              )
            )}
            
            {(role.is_admin || role.is_seo) && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link nav-text text-success"
                    to="/create-post"
                    onClick={handleNavLinkClick}
                  >
                    Create Post
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link nav-text text-success"
                    to="/create-case-studies"
                    onClick={handleNavLinkClick}
                  >
                    Add Case Study
                  </NavLink>
                </li>
              </>
            )}

            {role.is_admin && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link nav-text text-success"
                    to="/create-category"
                    onClick={handleNavLinkClick}
                  >
                    Add Category
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link nav-text text-success"
                    to="/create-destinations"
                    onClick={handleNavLinkClick}
                  >
                    Add Destination
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link nav-text text-success"
                    to="/create-gallery"
                    onClick={handleNavLinkClick}
                  >
                    Add Gallery
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="search-wrapper d-flex align-items-top">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;