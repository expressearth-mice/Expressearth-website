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

  // Route-specific metadata helps each service page target its own search intent.
  useEffect(() => {
    const pageSeo = {
      "/": {
        title: "ExpressEarth | Corporate MICE, Incentive Travel & Events",
        description: "ExpressEarth is a corporate MICE and event management company in Gurugram, India, delivering incentive travel, corporate offsites, dealer meets, conferences and events across India and international destinations.",
      },
      "/mice-services": {
        title: "Corporate MICE Company in India | ExpressEarth",
        description: "Explore ExpressEarth's corporate MICE services, including meetings and conferences, incentive travel, corporate events, exhibitions and destination management across India and international destinations.",
      },
      "/dealermeet": {
        title: "Dealer Meet Organisers in India | ExpressEarth",
        description: "Plan dealer and distributor meets with ExpressEarth. We manage venue sourcing, travel, hospitality, stage and AV production, branding, delegate logistics and end-to-end event execution across India and abroad.",
      },
      "/corporateoffsites": {
        title: "Corporate Offsite Management Company | ExpressEarth",
        description: "ExpressEarth plans corporate offsites, leadership retreats and team-building experiences, with end-to-end travel, accommodation, activities and on-ground coordination across India and international destinations.",
      },
      "/incentive-travel": {
        title: "Corporate Incentive Travel Company in India | ExpressEarth",
        description: "Motivate and reward teams with corporate incentive travel programmes by ExpressEarth, from destination planning and group travel to hotels, experiences and on-ground management in India and abroad.",
      },
      "/incentivetravel": {
        title: "Corporate Incentive Travel & Reward Trips | ExpressEarth",
        description: "Design memorable employee reward trips and sales incentive travel with ExpressEarth. We coordinate destinations, group logistics, stays and experiences for corporate teams.",
      },
      "/meetings-and-conferences": {
        title: "Corporate Meetings & Conference Management | ExpressEarth",
        description: "ExpressEarth manages corporate meetings, conferences, leadership summits, seminars and forums, including venue sourcing, AV production, delegate travel, registration and on-site execution.",
      },
      "/conferencemanagement": {
        title: "Conference Management Company in India | ExpressEarth",
        description: "Plan corporate conferences and conventions with ExpressEarth. Our team coordinates venues, speakers, delegate management, travel, accommodation, AV production and event logistics.",
      },
      "/corporate-events": {
        title: "Corporate Event Management Company in India | ExpressEarth",
        description: "Plan corporate events with ExpressEarth, including annual days, product launches, employee engagement events and business gatherings with end-to-end production and logistics.",
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
        title: "International Group Travel for Corporates | ExpressEarth",
        description: "ExpressEarth coordinates international group travel for corporate teams, including destination planning, hotels, transfers, experiences and trip logistics for incentive and business groups.",
      },
      "/r&rplanning": {
        title: "Rewards and Recognition Event Planning | ExpressEarth",
        description: "Plan rewards and recognition programmes with ExpressEarth, from incentive travel and award ceremonies to employee celebrations and sales team recognition events.",
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
    };

    const metadata = pageSeo[location.pathname];
    if (!metadata || typeof document === "undefined") return;

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
    setMeta('meta[property="og:url"]', { property: "og:url" }, "https://www.expressearth.com" + location.pathname);
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, metadata.title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, metadata.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.origin + location.pathname);
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
        <Route path="/create-case-studies" element={<CreateCaseStudy />} />
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
