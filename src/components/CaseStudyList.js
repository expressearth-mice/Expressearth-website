import React, { useEffect, useState } from "react";
import "./CaseStudyList.css";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";

const CaseStudyList = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get("/api/case-studies/")
      .then((res) => {
        setCaseStudies(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching case studies:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="loading-text">Loading case studies...</div>;
  }

  return (
    <>
      <div
        className="case-study-banner"
        style={{
          backgroundImage:
            "url('https://plus.unsplash.com/premium_photo-1661375427386-64ac35086427?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2FzZSUyMHN0dWR5fGVufDB8fDB8fHww')",
        }}
      >
        <h1 className="banner-title">CASE STUDIES</h1>
        <p className="banner-description">
          Discover how ExpressEarth has successfully delivered memorable MICE
          events through our detailed case studies and client success stories.
        </p>
      </div>

      <div className="case-study-list-container">
        <div className="left-panel">
          <h2 className="case-title">OUR SUCCESS STORIES</h2>
          <p className="case-subtitle">
            See how we bring visions to life through our highlight of successful
            events, featuring summaries of the execution, client feedback, and
            the impact of our tailored event strategies.
          </p>
        </div>

        <div
          className="right-panel"
          style={{ display: "flex", flexDirection: "column", gap: "32px" }}
        >
          {caseStudies.map((item) => {
            const cleanText =
              item.comment?.replace(/<[^>]+>/g, "").slice(0, 100) || "";
            const imageUrl = item.image || "/Images/placeholder.jpg";
            const caseStudyPath = item.slug || item.id;

            return (
              <Link
                to={`/case-studies/${caseStudyPath}`}
                key={item.id}
                className="case-card-link"
              >
                <div className="case-card">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="case-card-img"
                    onError={(e) => {
                      e.target.src = "/Images/placeholder.jpg";
                    }}
                  />
                  <div className="case-card-body">
                    <h3 className="card-title">{item.name}</h3>
                    <p className="card-comment">{cleanText}...</p>
                    <p className="card-author">{item.author_name}</p>
                    <p className="card-quote">"{item.author_quote}"</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CaseStudyList;
