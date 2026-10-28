import React, { useContext, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Import useLocation
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { AuthContext } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // Import your Footer
import Home from "./components/Home";
import AboutUs from "./components/AboutUs";
import BlogList from "./components/BlogList";
import CreatePost from "./components/CreatePost";
import BlogDetails from "./components/BlogDetails";
import DestinationSection from "./components/DestinationSection";
import DestinationDetails from "./components/DestinationDetails";
import CreateDestination from "./components/CreateDestination";
import Gallery from "./components/Gallery";
import CreateGallery from "./components/CreateGallery";
import ContactForm from "./components/ContactForm";
import CareersPage from "./components/CareersPage";
import CreateCaseStudy from "./components/CreateCaseStudy";
import CaseStudyList from "./components/CaseStudyList";
import CreatePostNew from "./components/CreatePostNew";
import ManageBlogs from "./components/blogs/ManageBlogs";
import CreateCaseStudyNew from "./components/CreateCaseStudyNew";
import ManageCaseStudiesNew from "./components/ManageCaseStudiesNew";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import CategoryPage from "./components/CategoryPage";
import CreateCategory from "./components/CreateCategory";
import CategoryList from "./components/CategoryList";
import GiftingPage from "./components/GiftingPage";
import MiceServices from "./components/MiceService";
import MeetingsAndConferences from "./components/MeetingsAndConferences";
import IncentiveTravel from "./components/IncentiveTravel";
import CorporateEvents from "./components/CorporateEvents";
import ExhibitionPage from "./components/ExhibitionPage";
import DestinationManagement from "./components/DestinationManagement";
import AchievementPage from "./components/AchievementPage";
import PrivacyPolicy from "./components/PrivacyPolicy";
import CategoryDestinations from "./components/CategoryDestination";
import CaseStudyDetail from "./components/CaseStudyDetail";
import TermsAndConditions from "./components/TermsAndConditions";
import Marquee from "./components/ui/marquee";
import CorporateOffsitesPage from "./components/CorporateOffsitesPage";
import DealerMeet from "./components/DealerMeet";
import InternationalGroupTravel from "./components/InternationalGroupTravel";
import R_R_Planning from "./components/R_R_Planning";
import ConferenceManagement from "./components/ConferenceManagement";
import IncentivePage from "./components/IncentivePage";
import International from "./components/International";
import Domestic from "./components/Domestic";

const AdminComponent = () => <div>Admin-only Section</div>;

// const ScrollToTop = () => {
//   const { pathname } = useLocation();

//   useEffect(() => {
//     if ("scrollRestoration" in window.history) {
//       window.history.scrollRestoration = "manual";
//     }
//   }, []);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, [pathname]);

//   return null;
// };

function App() {
  const { role, loading } = useContext(AuthContext);
  const location = useLocation(); // Get current route path

  useEffect(() => {
    console.log("REACT_APP_API_URL:", process.env.REACT_APP_API_URL);
  }, []);

  // useEffect(() => {
  //   if (window.gtag) {
  //     window.gtag('config', 'GTM-WMJCBMGG', {
  //       page_path: location.pathname + location.search,
  //     });
  //   }
  // }, [location]);

  // Route-aware metadata for public pages. Detail pages refine this using their fetched content.
  useEffect(() => {
    const pathname = (location.pathname || "/").replace(/\/+$/, "") || "/";
    const pageSeo = {
      "/": {
        title: "Event Management & MICE Company in Delhi NCR, India | ExpressEarth",
        description: "Looking for an event management or MICE company in Delhi, Gurugram or India? ExpressEarth plans corporate events, product launches, annual days, family days, conferences, offsites and incentive group tours.",
      },
      "/about": {
        title: "About ExpressEarth | Corporate MICE & Event Experts",
        description: "Learn about ExpressEarth, a Gurugram-based corporate MICE and event management company delivering corporate travel, conferences, incentive programmes and business events.",
      },
      "/contact": {
        title: "Contact ExpressEarth | Corporate MICE Enquiries",
        description: "Contact ExpressEarth to plan corporate MICE programmes, incentive travel, dealer meets, offsites, conferences and business events in India and internationally.",
      },
      "/careers": {
        title: "Careers at ExpressEarth | MICE & Event Management Jobs",
        description: "Explore career opportunities at ExpressEarth across corporate event planning, MICE operations, incentive travel, sales and event management.",
      },
      "/mice-services": {
        title: "MICE Agency & Corporate Event Management in Delhi NCR | ExpressEarth",
        description: "ExpressEarth is a MICE agency for corporate meetings, conferences, incentive tours, dealer meets, offsites and events in Delhi NCR and across India, with international group travel planning.",
      },
      "/dealermeet": {
        title: "Dealer Meet Management Company in Delhi NCR & India | ExpressEarth",
        description: "Plan dealer meets and distributor conferences in Delhi NCR and across India. ExpressEarth coordinates venues, travel, hospitality, stage and AV, branding, delegate logistics and on-ground execution.",
      },
      "/corporateoffsites": {
        title: "Corporate Offsite Management Company in Delhi NCR | ExpressEarth",
        description: "Organise corporate offsites from Delhi NCR with ExpressEarth. We coordinate destinations, hotels, team-building activities, group transport and on-ground support across India and abroad.",
      },
      "/incentive-travel": {
        title: "Incentive Tour Organisers in Delhi NCR & India | ExpressEarth",
        description: "Incentive tour organisers for corporate teams in Delhi NCR and across India. ExpressEarth plans reward trips, destination experiences, hotels, group logistics and on-ground management in India and abroad.",
      },
      "/incentivetravel": {
        title: "Corporate Incentive Travel & Reward Trips | ExpressEarth",
        description: "Design employee reward trips and sales incentive travel with ExpressEarth. We coordinate destinations, group logistics, stays and experiences for corporate teams.",
      },
      "/meetings-and-conferences": {
        title: "Corporate Conference & Meeting Organisers in Delhi NCR | ExpressEarth",
        description: "Corporate conference organisers for Delhi NCR and India. Plan leadership summits, seminars, annual conferences and business meetings with venue sourcing, AV, registration and delegate logistics.",
      },
      "/conferencemanagement": {
        title: "Conference Management Company in Delhi NCR & India | ExpressEarth",
        description: "Plan corporate conferences, annual sales meets and leadership summits in Delhi NCR and across India. ExpressEarth coordinates venues, speakers, delegates, AV, travel and event logistics.",
      },
      "/corporate-events": {
        title: "Corporate Event Management Company in Delhi NCR, India | ExpressEarth",
        description: "Event management for product launches, annual day celebrations, employee family days and corporate gatherings in Delhi NCR and across India, including production, venue and event logistics.",
      },
      "/exhibitions-and-trade-shows": {
        title: "Exhibition and Trade Show Management | ExpressEarth",
        description: "ExpressEarth supports exhibition and trade show planning with event coordination, booth and venue logistics, production support and on-ground execution for business events.",
      },
      "/destination-management": {
        title: "Destination Management Services in India | ExpressEarth",
        description: "Coordinate corporate group travel and destination experiences with ExpressEarth, including local logistics, hotels, transfers, activities and on-ground support for MICE groups.",
      },
      "/internationalgrouptravel": {
        title: "Corporate Group Tour Management in Delhi NCR & India | ExpressEarth",
        description: "Corporate group tour management from Delhi NCR across India and international destinations, including incentive trips, hotel coordination, transfers, experiences and group logistics.",
      },
      "/r&rplanning": {
        title: "Rewards & Recognition Event Planners in Delhi NCR | ExpressEarth",
        description: "Plan rewards and recognition events, employee celebrations, award ceremonies and sales incentive trips in Delhi NCR and across India with ExpressEarth.",
      },
      "/international-destinations": {
        title: "International Destinations for Corporate Groups | ExpressEarth",
        description: "Explore international destinations for corporate incentive trips, offsites and group travel, with ExpressEarth coordinating stays, experiences and group logistics.",
      },
      "/domestic-destinations": {
        title: "India Destinations for Corporate Offsites and Incentives | ExpressEarth",
        description: "Explore destinations across India for corporate offsites, incentive travel and group events, with planning support for accommodation, activities and on-ground logistics.",
      },
      "/Gifting": {
        title: "Corporate Gifting and Gift-with-Purchase Solutions | ExpressEarth",
        description: "Explore corporate gifting and gift-with-purchase solutions from ExpressEarth for employee engagement, customer rewards, channel programmes and brand activations.",
      },
      "/blogs": {
        title: "Corporate MICE, Events & Incentive Travel Insights | ExpressEarth",
        description: "Read ExpressEarth insights on corporate MICE, incentive travel, dealer meets, offsites, conferences, destinations and business event planning.",
      },
      "/case-studies": {
        title: "Corporate MICE & Event Case Studies | ExpressEarth",
        description: "Explore ExpressEarth case studies showcasing corporate events, incentive travel, dealer meets, conferences and group travel programmes.",
      },
      "/destinations": {
        title: "Corporate Group Travel Destinations | ExpressEarth",
        description: "Explore destinations for corporate incentive travel, MICE groups, offsites and business events with planning support from ExpressEarth.",
      },
      "/achievements": {
        title: "ExpressEarth Achievements | Corporate MICE & Events",
        description: "Discover ExpressEarth's milestones and experience in corporate MICE, incentive travel, conferences and event management.",
      },
      "/gallery": {
        title: "Corporate Events & Incentive Travel Gallery | ExpressEarth",
        description: "View highlights from ExpressEarth corporate events, incentive trips, conferences, dealer meets and group travel experiences.",
      },
      "/case-category": {
        title: "Corporate Event Case Study Categories | ExpressEarth",
        description: "Browse ExpressEarth case studies by category to explore corporate events, incentive travel and MICE programme experience.",
      },
      "/categories": {
        title: "Destination Categories for Corporate Group Travel | ExpressEarth",
        description: "Browse destination categories for corporate incentive trips, offsites and MICE group travel with ExpressEarth.",
      },
      "/privacy-policy": {
        title: "Privacy Policy | ExpressEarth",
        description: "Read the ExpressEarth privacy policy to understand how information is handled when you use our website or contact our team.",
      },
      "/terms-and-conditions": {
        title: "Terms and Conditions | ExpressEarth",
        description: "Read the terms and conditions governing use of the ExpressEarth website and its content.",
      },
    };

    const slugToWords = (slug) => decodeURIComponent(slug || "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/\b\w/g, (character) => character.toUpperCase());

    let metadata = pageSeo[pathname];
    if (!metadata && pathname.startsWith("/blogs/")) {
      const blogTitle = slugToWords(pathname.slice("/blogs/".length));
      metadata = {
        title: blogTitle ? blogTitle + " | ExpressEarth Insights" : "Corporate MICE Insights | ExpressEarth",
        description: blogTitle
          ? "Read " + blogTitle + " insights from ExpressEarth on corporate MICE, incentive travel and business event planning."
          : pageSeo["/blogs"].description,
      };
    }
    if (!metadata && pathname.startsWith("/case-studies/")) {
      const caseTitle = slugToWords(pathname.slice("/case-studies/".length));
      metadata = {
        title: caseTitle ? caseTitle + " | ExpressEarth Case Study" : pageSeo["/case-studies"].title,
        description: caseTitle
          ? "Explore this ExpressEarth case study covering corporate MICE, event planning, incentive travel or group programme execution."
          : pageSeo["/case-studies"].description,
      };
    }
    if (!metadata && pathname.startsWith("/destinations/")) {
      const destination = slugToWords(pathname.slice("/destinations/".length));
      metadata = {
        title: destination ? "Corporate Group Travel in " + destination + " | ExpressEarth" : pageSeo["/destinations"].title,
        description: destination
          ? "Explore corporate group travel, incentive trip and MICE planning options for " + destination + " with ExpressEarth."
          : pageSeo["/destinations"].description,
      };
    }
    if (!metadata && pathname.startsWith("/categories/")) {
      const category = slugToWords(pathname.slice("/categories/".length));
      metadata = {
        title: category ? category + " Destinations for Corporate Groups | ExpressEarth" : pageSeo["/categories"].title,
        description: category
          ? "Explore " + category.toLowerCase() + " destinations for corporate incentive travel, offsites and MICE group trips with ExpressEarth."
          : pageSeo["/categories"].description,
      };
    }

    if (!metadata || typeof document === "undefined") return;

    const canonicalUrl = "https://www.expressearth.com" + pathname;
    document.title = metadata.title;

    const setMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', { name: "description" }, metadata.description);
    setMeta('meta[property="og:title"]', { property: "og:title" }, metadata.title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, metadata.description);
    setMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, metadata.title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, metadata.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [location.pathname]);

  const publicRoutes = [
    "/",
    "/about",
    "/contact",
    "/careers",
    "/blogs",
    "/achievements",
    "/gallery",
    "/case-studies",
    "/case-category",
    "/categories",
  ];

  const isPublicRoute =
    publicRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/blogs/") ||
    location.pathname.startsWith("/destinations/");

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {/* <ScrollToTop /> */}
      <Navbar />
      <Marquee speedSec={22} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/mice-services" element={<MiceServices />} />
        <Route
          path="/meetings-and-conferences"
          element={<MeetingsAndConferences />}
        />
        <Route path="/incentive-travel" element={<IncentiveTravel />} />
        <Route path="/corporate-events" element={<CorporateEvents />} />
        <Route
          path="/exhibitions-and-trade-shows"
          element={<ExhibitionPage />}
        />
        <Route
          path="/destination-management"
          element={<DestinationManagement />}
        />
        <Route path="/achievements" element={<AchievementPage />} />
        <Route path="/Gifting" element={<GiftingPage />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:title" element={<BlogDetails />} />
        <Route path="/destinations" element={<DestinationSection />} />
        <Route path="/destinations/:name" element={<DestinationDetails />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/case-studies" element={<CaseStudyList />} />
        <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
        <Route path="/case-category" element={<CategoryPage />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/categories/:slug" element={<CategoryDestinations />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/dealermeet" element={<DealerMeet />} />
        <Route path="/corporateoffsites" element={<CorporateOffsitesPage />} />
        <Route
          path="/internationalgrouptravel"
          element={<InternationalGroupTravel />}
        />
        <Route path="/r&rplanning" element={<R_R_Planning />} />
        <Route
          path="/conferencemanagement"
          element={<ConferenceManagement />}
        />
        <Route path="/incentivetravel" element={<IncentivePage />} />
        <Route path="/international-destinations" element={<International />} />
        <Route path="/domestic-destinations" element={<Domestic />} />

        {/* SEO + Admin Routes */}
        {(role.is_admin || role.is_seo) && (
          <>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/edit-post/:title" element={<CreatePost />} />
            <Route
              path="/create-destinations"
              element={<CreateDestination />}
            />
            <Route path="/create-gallery" element={<CreateGallery />} />
            <Route path="/create-case-studies" element={<CreateCaseStudy />} />
            <Route path="/edit-case-study/:id" element={<CreateCaseStudy />} />
            <Route path="/create-category" element={<CreateCategory />} />

            {/* New admin CRUD pages */}
            <Route path="/create-post-new" element={<CreatePostNew />} />
            <Route path="/blogs-new" element={<ManageBlogs />} />
            <Route path="/blogs-new/:title" element={<ManageBlogs />} />
            <Route
              path="/create-case-studies-new"
              element={<CreateCaseStudyNew />}
            />
            <Route
              path="/case-studies-new"
              element={<ManageCaseStudiesNew />}
            />
            <Route
              path="/case-studies-new/:id"
              element={<ManageCaseStudiesNew />}
            />
          </>
        )}

        {/* Admin Only */}
        {role.is_admin && (
          <Route path="/admin-only-section" element={<AdminComponent />} />
        )}
      </Routes>

      {/* Show Footer only on public routes */}
      {/* {isPublicRoute && <Footer />} */}
      <Footer />

      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
