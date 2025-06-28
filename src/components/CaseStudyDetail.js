import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useParams } from "react-router-dom";
import "./CaseStudyDetails.css";
import { Link } from "react-router-dom"; // For Link to other blog or destination pages
import axiosInstance from "../api/axios";

const CaseStudyDetail = () => {
  const { id } = useParams(); // Get the case study ID from the URL parameter
  const [caseStudy, setCaseStudy] = useState(null);
  const [recentPosts, setRecentPosts] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch case study details
    const fetchCaseStudy = async () => {
      try {
        const response = await axiosInstance.get(`/api/case-studies/${id}/`);
        setCaseStudy(response.data);
      } catch (error) {
        console.error("Error fetching case study:", error);
      }
    };

    // Fetch recent posts
    const fetchRecentPosts = async () => {
      try {
        const response = await axiosInstance.get("/api/posts/");
        setRecentPosts(response.data.slice(0, 5)); // Limit to 5 recent posts
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    // Fetch destinations
    const fetchDestinations = async () => {
      try {
        const response = await axiosInstance.get("/api/destinations/");
        setDestinations(response.data.slice(0, 5)); // Limit to 5 destinations
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };

    // Start fetching data
    fetchCaseStudy();
    fetchRecentPosts();
    fetchDestinations();

    setLoading(false);
  }, [id]);

  if (loading || !caseStudy) {
    return <div>Loading...</div>;
  }

  return (
    <div className="case-study-detail-container">
      <div className="case-study-detail-banner" style={{ backgroundImage: `url(${caseStudy.image})` }}>
        <h1>{caseStudy.name}</h1>
        <p>{caseStudy.description}</p>
      </div>

      <div className="case-study-detail-content">
        <h2>Case Study Details</h2>
        <p>{caseStudy.detailed_description}</p>
        <p><strong>Client Name:</strong> {caseStudy.client_name}</p>
        <p><strong>Outcome:</strong> {caseStudy.outcome}</p>
        <p><strong>Feedback:</strong> {caseStudy.client_feedback}</p>
        <p><strong>Quote:</strong> {caseStudy.client_quote}</p>
      </div>

      {/* Recent Blog Scroller */}
      <div className="recent-blogs">
        <h3>Recent Blogs</h3>
        <div className="scrolling-wrapper">
          {recentPosts.map((post) => (
            <div key={post.id} className="blog-card">
              <img src={post.image} alt={post.title} />
              <div className="card-body">
                <h5>
                  <Link to={`/blogs/${post.slug}`} className="text-dark text-decoration-none">
                    {post.title}
                  </Link>
                </h5>
                <p>{post.description.slice(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Destinations Scroller */}
      <div className="destinations-scroller">
        <h3>Popular Destinations</h3>
        <div className="scrolling-wrapper">
          {destinations.map((destination) => (
            <div key={destination.id} className="destination-card">
              <img src={destination.image} alt={destination.name} />
              <div className="destination-info">
                <h5>{destination.name}</h5>
                <p>{destination.description.slice(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudyDetail;
