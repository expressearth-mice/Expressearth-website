import React, { useContext, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { AuthContext } from "../context/AuthContext";
import SearchBar from "./SearchBar";

function Navbar() {
  const { role } = useContext(AuthContext);
  const navbarCollapseRef = useRef(null);
  const navLinksRef = useRef(null);
  const location = useLocation();
  const isAdminOrSeo = role.is_admin || role.is_seo;

  const [openDropdown, setOpenDropdown] = useState(null);
  const closeTimerRef = useRef(null);

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
        {
          name: "Exhibitions & Trade Shows",
          path: "/exhibitions-and-trade-shows",
        },
        { name: "Destination Management", path: "/destination-management" },
        { name: "Gifting", path: "/Gifting" },
      ],
    },
    { name: "Destinations",
      path: "/international-destinations",
      dropdown: true,
      items: [
        { name: "International Destinations", path: "/international-destinations" },
        { name: "Domestic Destinations", path: "/domestic-destinations" },
      ], 
     },
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
    {
      name: "Personal Travel",
      path: "https://b2c.expressearth.com/",
      external: true,
    },
    { name: "Contact Us", path: "/contact" },
  ];

  const handleToggle = () => {
    navbarCollapseRef.current?.classList.toggle("show");
  };

  const handleNavLinkClick = () => {
    setOpenDropdown(null);
    if (window.innerWidth < 992) handleToggle();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openMenu = (key) => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setOpenDropdown(key);
  };

  const closeMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setOpenDropdown(null), 260);
  };

  const toggleMenuMobile = (key, e) => {
    if (window.innerWidth >= 992) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setOpenDropdown((prev) => (prev === key ? null : key));
  };

  const handleNavLinksWheel = (e) => {
    if (!isAdminOrSeo || !navLinksRef.current) return;
    if (e.deltaY === 0) return;
    e.preventDefault();
    navLinksRef.current.scrollLeft += e.deltaY;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light glass-navbar">
      <div className="container-fluid navbar-inner">
        <NavLink
          to="/"
          className="navbar-brand navbar-logo-wrapper"
          onClick={handleNavLinkClick}
        >
          <img
            src="/Images/express_earth_logoo-removebg-preview.png"
            alt="ExpressEarth Logo"
            className="navbar-logo"
          />
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleToggle}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" ref={navbarCollapseRef}>
          <ul
            className={`navbar-nav mx-auto navbar-links ${
              isAdminOrSeo ? "ee-scrollable" : ""
            }`}
            ref={navLinksRef}
            onWheel={handleNavLinksWheel}
          >
            {navLinks.map((tab, idx) => {
              if (tab.dropdown) {
                const key = `dd-${idx}`;
                const isOpen = openDropdown === key;

                return (
                  <li
                    key={idx}
                    className={`nav-item dropdown ee-dropdown ${
                      isOpen ? "show" : ""
                    }`}
                    onMouseEnter={() => openMenu(key)}
                    onMouseLeave={closeMenu}
                  >
                    <div className="d-flex align-items-center">
                      <NavLink
                        to={tab.path}
                        className="nav-link nav-text"
                        onClick={handleNavLinkClick}
                      >
                        {tab.name}
                      </NavLink>

                      <a
                        href="#"
                        className="nav-link dropdown-toggle ee-dd-toggle"
                        onClick={(e) => toggleMenuMobile(key, e)}
                        aria-expanded={isOpen ? "true" : "false"}
                        aria-label={`${tab.name} menu`}
                      />
                    </div>

                    <ul
                      className={`dropdown-menu ee-dropdown-menu ${
                        isOpen ? "show" : ""
                      }`}
                      onMouseEnter={() => openMenu(key)}
                      onMouseLeave={closeMenu}
                    >
                      {tab.items.map((item, i) => (
                        <li key={i} className="ee-dd-item">
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
                );
              }

              if (tab.external) {
                return (
                  <li className="nav-item" key={idx}>
                    <a
                      className="nav-link nav-text"
                      href={tab.path}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {tab.name}
                    </a>
                  </li>
                );
              }

              return (
                <li className="nav-item" key={idx}>
                  <NavLink
                    className={`nav-link nav-text ${
                      location.pathname === tab.path ? "active" : ""
                    }`}
                    to={tab.path}
                    onClick={handleNavLinkClick}
                  >
                    {tab.name}
                  </NavLink>
                </li>
              );
            })}

            {isAdminOrSeo && (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link nav-text text-success"
                    to="/dashboard"
                    onClick={handleNavLinkClick}
                  >
                    Dashboard
                  </NavLink>
                </li>
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

          <a href="tel:+919266056660" className="navbar-phone">
            +91-92660 56660
          </a>

          <div className="search-wrapper d-flex align-items-center">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
