import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CaseStudyDetails.css";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const CaseStudyDetail = () => {
  const { id: idOrSlug } = useParams();
  const navigate = useNavigate();
  const { role, getValidAccessToken } = useContext(AuthContext);

  const [caseStudy, setCaseStudy] = useState(null);
  const [caseStudyId, setCaseStudyId] = useState(null); // ✅ store real ID
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  const canManageCaseStudies = role.is_admin || role.is_seo;

  useEffect(() => {
  const fetchCaseStudy = async () => {
    try {
      setLoading(true);

      let item;
      const isNumeric = !isNaN(idOrSlug);

      if (isNumeric) {
        // ✅ Fetch by ID
        const res = await axiosInstance.get(`/api/case-studies/${idOrSlug}/`);
        item = res.data;
      } else {
        // ❌ Backend filter broken → fetch all
        const res = await axiosInstance.get(`/api/case-studies/`);

        if (!res.data || res.data.length === 0) {
          alert("No case studies found!");
          return;
        }

        // ✅ STRICT match only
        item = res.data.find(cs => cs.slug === idOrSlug);

        console.log("All slugs:", res.data.map(cs => cs.slug));
        console.log("URL slug:", idOrSlug);
      }

      if (!item) {
        alert("Exact case study not found!");
        return;
      }

      console.log("Final selected item:", item);

      setCaseStudy(item);
      setCaseStudyId(item.id);

    } catch (error) {
      console.error("Error fetching case study:", error);
      alert("Unable to load case study.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDestinations = async () => {
    try {
      const res = await axiosInstance.get("/api/destinations/");
      setDestinations(res.data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching destinations:", err);
    }
  };

  fetchCaseStudy();
  fetchDestinations();

}, [idOrSlug]);

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

      console.log("Deleting ID:", caseStudyId); // DEBUG

      await axiosInstance.delete(`/api/case-studies/${caseStudyId}/`, {
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

  if (loading || !caseStudy) {
    return <div>Loading...</div>;
  }

  const destinationName =
    typeof caseStudy.destination === "object"
      ? caseStudy.destination?.name
      : destinations.find(
        (item) => String(item.id) === String(caseStudy.destination)
      )?.name;

  const bannerText =
    caseStudy.description ||
    destinationName ||
    "Explore this case study from ExpressEarth.";

  return (
    <div className="case-study-detail-container">
      <div
        className="case-study-detail-banner"
        style={{ backgroundImage: `url(${caseStudy.image})` }}
      >
        <h1>{caseStudy.name}</h1>
        <p>{bannerText}</p>
      </div>

      {canManageCaseStudies && (
        <div className="d-flex gap-2 justify-content-end px-4 pt-4">
          <Link
            to={`/edit-case-study/${caseStudy.slug || caseStudyId}`}
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
        <h2>Case Study Details</h2>

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
      </div>
    </div>
  );
};

export default CaseStudyDetail;