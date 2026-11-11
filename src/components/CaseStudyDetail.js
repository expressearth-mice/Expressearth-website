import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CaseStudyDetails.css";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { case_study_detail_url, case_study_url, delete_case_study_url } from "../api/urls";
import { normalizeCollectionResponse } from "../api/collectionData";
import Skeleton from "./Skeleton";
import { isIndexableCaseStudySlug, isPlaceholderCaseStudySlug } from "../utils/caseStudyVisibility";

const getImageList = (item) => {
  if (!item) return [];
  if (Array.isArray(item.images)) return item.images;
  if (typeof item.images === "string" && item.images.trim()) {
    return [{ id: null, image: item.images }];
  }
  if (typeof item.image === "string" && item.image.trim()) {
    return [{ id: null, image: item.image }];
  }
  return [];
};

const CaseStudyDetailSkeleton = () => (
  <div className="case-study-detail-container">
    <Skeleton className="case-study-detail-banner" />

    <div className="case-study-detail-content">
      <Skeleton
        className="skeleton-title"
        style={{ width: "45%", height: 42, margin: "0 auto 20px" }}
      />
      <Skeleton
        className="skeleton-text"
        style={{ width: "25%", margin: "0 auto 24px" }}
      />
      <Skeleton className="skeleton-text" style={{ width: "100%" }} />
      <Skeleton className="skeleton-text" style={{ width: "96%" }} />
      <Skeleton className="skeleton-text" style={{ width: "92%" }} />
      <Skeleton className="skeleton-text" style={{ width: "88%" }} />
      <Skeleton className="skeleton-text" style={{ width: "70%" }} />
    </div>
  </div>
);

const CaseStudyDetail = () => {
  const { id: idOrSlug } = useParams();
  const navigate = useNavigate();
  const { role, getValidAccessToken } = useContext(AuthContext);

  const [caseStudy, setCaseStudy] = useState(null);
  const [caseStudyId, setCaseStudyId] = useState(null); // ✅ store real ID
  const [isNewSystem, setIsNewSystem] = useState(false); // which API this item lives in
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableCaseStudySlugs, setAvailableCaseStudySlugs] = useState([]);

  const canManageCaseStudies = role.is_admin || role.is_seo;

  useEffect(() => {
  const controller = new AbortController();
  let cancelled = false;

  const fetchCaseStudy = async () => {
    try {
      setLoading(true);
      setCaseStudy(null);
      setAvailableCaseStudySlugs([]);

      let item;
      let fromNewSystem = false;
      let oldCaseStudyRecords = null;
      const isNumeric = !isNaN(idOrSlug);

      if (isNumeric) {
        // ✅ Fetch by ID
        try {
          const res = await axiosInstance.get(`/api/case-studies/${idOrSlug}/`, { signal: controller.signal });
          item = res.data;
        } catch (err) {
          item = null;
        }
      } else {
        // ❌ Backend filter broken → fetch all
        try {
          const res = await axiosInstance.get(`/api/case-studies/`, { signal: controller.signal });
          oldCaseStudyRecords = normalizeCollectionResponse(res.data);
          item = oldCaseStudyRecords.find((cs) => String(cs.slug || "") === String(idOrSlug));
        } catch (err) {
          item = null;
        }
      }

      if (!item) {
        // Fall back to the new case-study API
        try {
          const res = await axiosInstance.get(case_study_detail_url(idOrSlug), { signal: controller.signal });
          const data = res.data;
          item = {
            ...data,
            name: data.title,
            comment: data.content || data.short_description,
            image: data.images?.[0]?.image || data.image,
          };
          fromNewSystem = true;
        } catch (err) {
          item = null;
        }
      }

      let availableSlugs = [];
      if (item && /-\d+$/.test(String(item.slug || "").trim())) {
        // Only numbered-suffix records need the extra index lookup. This mirrors
        // the sitemap rule without adding requests to ordinary case-study views.
        const oldIndexRequest = oldCaseStudyRecords !== null
          ? Promise.resolve(oldCaseStudyRecords)
          : axiosInstance.get("/api/case-studies/", { signal: controller.signal }).then((res) => normalizeCollectionResponse(res.data));
        const newIndexRequest = axiosInstance.get(case_study_url, { signal: controller.signal })
          .then((res) => normalizeCollectionResponse(res.data));
        const [oldIndexResult, newIndexResult] = await Promise.allSettled([
          oldIndexRequest,
          newIndexRequest,
        ]);
        if (cancelled) return;
        const oldIndex = oldIndexResult.status === "fulfilled" ? oldIndexResult.value : [];
        const newIndex = newIndexResult.status === "fulfilled" ? newIndexResult.value : [];
        availableSlugs = [...oldIndex, ...newIndex]
          .map((record) => String(record?.slug || "").trim().toLowerCase())
          .filter(Boolean);
      }
      if (cancelled) return;
      setAvailableCaseStudySlugs(availableSlugs);

      if (!item) {
        return;
      }

      setCaseStudy(item);
      setCaseStudyId(item.id);
      setIsNewSystem(fromNewSystem);

    } catch (error) {
      if (!cancelled) {
        console.error("Error fetching case study:", error);
        alert("Unable to load case study.");
      }
    } finally {
      if (!cancelled) setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await axiosInstance.get("/api/destinations/", { signal: controller.signal });
      if (!cancelled) setDestinations(normalizeCollectionResponse(res.data).slice(0, 5));
    } catch (err) {
      if (!cancelled) console.error("Error fetching destinations:", err);
    }
  };

  if (isPlaceholderCaseStudySlug(idOrSlug)) {
    // Known placeholder records are not public content; avoid unnecessary API requests.
    setCaseStudy(null);
    setAvailableCaseStudySlugs([]);
    setCaseStudyId(null);
    setIsNewSystem(false);
    setDestinations([]);
    setLoading(false);
  } else {
    fetchCaseStudy();
    fetchDestinations();
  }

  return () => {
    cancelled = true;
    controller.abort();
  };
}, [idOrSlug]);

  useEffect(() => {
    if (loading || typeof document === "undefined") return;

    const robotsMeta = document.head.querySelector('meta[name="robots"]');
    if (!caseStudy) {
      document.title = "Case study not found | ExpressEarth";
      if (robotsMeta) robotsMeta.setAttribute("content", "noindex, follow");
      const staleCanonical = document.head.querySelector('link[rel="canonical"]');
      if (staleCanonical) staleCanonical.remove();
      return;
    }

    const titleText = String(caseStudy.name || caseStudy.title || "Corporate MICE Case Study").trim();

    if (!isIndexableCaseStudySlug(caseStudy.slug, availableCaseStudySlugs)) {
      // Keep legacy ID pages and numbered duplicate aliases accessible, but do not index them.
      document.title = titleText + " | ExpressEarth Case Study";
      if (robotsMeta) robotsMeta.setAttribute("content", "noindex, follow");
      const staleCanonical = document.head.querySelector('link[rel="canonical"]');
      if (staleCanonical) staleCanonical.remove();
      return;
    }

    if (robotsMeta) {
      robotsMeta.setAttribute("content", "index, follow, max-image-preview:large");
    }
    const rawDescription = caseStudy.short_description || caseStudy.description || caseStudy.comment || caseStudy.content || "";
    const descriptionText = String(rawDescription)
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 160);
    const canonicalUrl = "https://www.expressearth.com/case-studies/" + encodeURIComponent(caseStudy.slug || idOrSlug || "");

    document.title = titleText + " | ExpressEarth Case Study";
    const setMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };
    const description = descriptionText || "Explore this ExpressEarth case study covering corporate MICE, event planning and group programme execution.";
    setMeta('meta[name="description"]', { name: "description" }, description);
    setMeta('meta[property="og:title"]', { property: "og:title" }, titleText + " | ExpressEarth Case Study");
    setMeta('meta[property="og:description"]', { property: "og:description" }, description);
    setMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [caseStudy, idOrSlug, loading, availableCaseStudySlugs]);

  /* ✅ FIXED DELETE */
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete the case study "${caseStudy?.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    if (!caseStudyId) {
      alert("Invalid case study ID");
      return;
    }

    try {
      const accessToken = await getValidAccessToken();

      const deleteUrl = isNewSystem
        ? delete_case_study_url(caseStudyId)
        : `/api/case-studies/${caseStudyId}/`;

      await axiosInstance.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert("Case study deleted successfully.");
      navigate("/case-studies");
    } catch (error) {
      console.error("Error deleting case study:", error.response?.data || error.message);
      alert("Unable to delete this case study.");
    }
  };

  if (loading) {
    return <CaseStudyDetailSkeleton />;
  }

  if (!caseStudy) {
    return (
      <div className="case-study-detail-container">
        <div className="case-study-detail-content">
          <h1>Case study not found</h1>
          <p>The requested case study could not be found.</p>
          <Link to="/case-studies">Browse case studies</Link>
          {" · "}
          <Link to="/contact">Discuss a corporate programme</Link>
        </div>
      </div>
    );
  }

  const destinationName =
    typeof caseStudy.destination === "object"
      ? caseStudy.destination?.name
      : destinations.find(
        (item) => String(item.id) === String(caseStudy.destination)
      )?.name;

  const caseStudyImages = getImageList(caseStudy);

  return (
    <div className="case-study-detail-container">
      <div className="case-study-detail-banner">
        {typeof caseStudy.image === "string" && caseStudy.image.trim() ? (
          <img
            src={caseStudy.image}
            alt={(caseStudy.name || "Corporate MICE") + " case study featured image"}
            className="case-study-detail-banner-image"
            loading="eager"
            decoding="async"
          />
        ) : null}
      </div>

      {canManageCaseStudies && (
        <div className="d-flex gap-2 justify-content-end px-4 pt-4">
          <Link
            to={
              isNewSystem
                ? `/case-studies-new/${caseStudy.slug || caseStudyId}`
                : `/edit-case-study/${caseStudy.slug || caseStudyId}`
            }
            className="btn btn-outline-primary"
          >
            Edit Case Study
          </Link>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleDelete}
          >
            Delete Case Study
          </button>
        </div>
      )}

      <div className="case-study-detail-content">
        <h1>{caseStudy.name}</h1>

        {destinationName && (
          <p>
            <strong>Destination:</strong> {destinationName}
          </p>
        )}

        {caseStudy.comment ? (
          <div
            className="case-study-rich-content"
            dangerouslySetInnerHTML={{ __html: caseStudy.comment }}
          />
        ) : (
          <p>No case study details available.</p>
        )}

        {caseStudyImages.length > 1 && (
          <div className="case-study-gallery">
            {caseStudyImages.map((img, index) => (
              <img
                key={img.id || index}
                alt={`${caseStudy.name} ${index + 1}`}
                src={img.image}
                className="case-study-gallery-image"
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        )}
        <section className="case-study-detail-cta" aria-labelledby="case-study-detail-cta-title">
          <h2 id="case-study-detail-cta-title">Planning a corporate MICE programme?</h2>
          <p>
            Share your programme type, expected group size, preferred dates and destination
            with ExpressEarth. Explore the service options or send your brief to the team.
          </p>
          <div className="case-study-detail-cta-actions">
            <Link to="/contact">Discuss your programme</Link>
            <Link to="/mice-services">Explore MICE services</Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CaseStudyDetail;