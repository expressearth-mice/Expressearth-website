import React, { useEffect, useState } from "react";
import "./CaseStudyList.css";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { case_study_url } from "../api/urls";
import { normalizeCollectionResponse } from "../api/collectionData";
import Skeleton from "./Skeleton";
import { filterPublicCaseStudies } from "../utils/caseStudyVisibility";

const CASE_STUDY_SKELETON_COUNT = 4;

const CaseStudyListSkeleton = () => (
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
        {Array.from({ length: CASE_STUDY_SKELETON_COUNT }).map((_, index) => (
          <div className="case-card" key={index}>
            <Skeleton className="case-card-img" style={{ minHeight: 200 }} />
            <div className="case-card-body">
              <Skeleton className="skeleton-title" style={{ width: "55%" }} />
              <Skeleton className="skeleton-text" style={{ width: "95%" }} />
              <Skeleton className="skeleton-text" style={{ width: "85%" }} />
              <Skeleton className="skeleton-text" style={{ width: "40%" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

const CaseStudyList = () => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;

    const fetchCaseStudies = async () => {
      try {
        const [oldRes, newRes] = await Promise.allSettled([
          axiosInstance.get("/api/case-studies/", { signal: controller.signal }),
          axiosInstance.get(case_study_url, { signal: controller.signal }),
        ]);

        if (cancelled) return;
        setLoadError(oldRes.status === "rejected" || newRes.status === "rejected");

        const oldStudies =
          oldRes.status === "fulfilled"
            ? normalizeCollectionResponse(oldRes.value.data)
            : [];
        const newRaw =
          newRes.status === "fulfilled"
            ? normalizeCollectionResponse(newRes.value.data)
            : [];

        const newStudies = newRaw.map((item) => ({
          id: item.id,
          slug: item.slug,
          name: item.title,
          image: item.images?.[0]?.image || item.image || "",
          comment: item.short_description || item.content || "",
          author_name: item.author_name || "",
          author_quote: item.author_quote || "",
        }));

        setCaseStudies(filterPublicCaseStudies([...newStudies, ...[...oldStudies].reverse()]));
      } catch (err) {
        if (!cancelled) {
          setLoadError(true);
          console.error("Error fetching case studies:", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCaseStudies();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  if (loading) {
    return <CaseStudyListSkeleton />;
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
          {caseStudies.length === 0 ? (
            <div className="case-study-empty-state" role="status" aria-live="polite">
              <h2>
                {loadError
                  ? "Case studies are temporarily unavailable"
                  : "No public case studies are available right now"}
              </h2>
              <p>
                {loadError
                  ? "The project library could not be reached. You can still discuss your upcoming corporate programme with our team."
                  : "Published project details are not currently available here. Contact our team to discuss your corporate MICE requirements."}
              </p>
              <div className="case-study-empty-actions">
                <Link to="/contact">Discuss a corporate programme</Link>
                <Link to="/mice-services">Explore MICE services</Link>
              </div>
            </div>
          ) : caseStudies.map((item) => {
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
                    alt={item.name || "ExpressEarth corporate MICE case study"}
                    className="case-card-img"
                    loading="lazy"
                    decoding="async"
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
