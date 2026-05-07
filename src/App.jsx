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

function App() {
  const { role, loading } = useContext(AuthContext);
  const location = useLocation(); // Get current route path

  // useEffect(() => {
  //   if (window.gtag) {
  //     window.gtag('config', 'GTM-WMJCBMGG', {
  //       page_path: location.pathname + location.search,
  //     });
  //   }
  // }, [location]);

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
            <Route
              path="/edit-case-study/:id"
              element={<CreateCaseStudy />}
            />
            <Route path="/create-category" element={<CreateCategory />} />
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
