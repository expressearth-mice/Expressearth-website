import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./CaseStudyDetails.css";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";

const CaseStudyDetail = () => {
  const { id: idOrSlug } = useParams(); // Supports both slug and id
  const navigate = useNavigate();
  const { role, getValidAccessToken } = useContext(AuthContext);
  const [caseStudy, setCaseStudy] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const canManageCaseStudies = role.is_admin || role.is_seo;

  useEffect(() => {
    setLoading(true);

    // Fetch case study details
    const fetchCaseStudy = async () => {
      try {
        const response = await axiosInstance.get(`/api/case-studies/${idOrSlug}/`);
        setCaseStudy(response.data);
      } catch (error) {
        console.error("Error fetching case study:", error);
      } finally {
        setLoading(false);
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
    fetchDestinations();
  }, [idOrSlug]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete the case study "${caseStudy?.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        alert("Your session has expired. Please log in again.");
        return;
      }

      await axiosInstance.delete(`/api/case-studies/${caseStudy?.id || idOrSlug}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Case study deleted successfully.");
      navigate("/case-studies");
    } catch (error) {
      console.error("Error deleting case study:", error);
      alert("Unable to delete this case study.");
    }
  };

  if (loading || !caseStudy) {
    return <div>Loading...</div>;
  }

  const destinationName =
    typeof caseStudy.destination === "object"
      ? caseStudy.destination?.name
      : destinations.find((item) => String(item.id) === String(caseStudy.destination))?.name;

  const bannerText =
    caseStudy.description ||
    destinationName ||
    "Explore this case study from ExpressEarth.";

  return (
    <div className="case-study-detail-container">
      <div className="case-study-detail-banner" style={{ backgroundImage: `url(${caseStudy.image})` }}>
        <h1>{caseStudy.name}</h1>
        <p>{bannerText}</p>
      </div>

      {canManageCaseStudies && (
        <div className="d-flex gap-2 justify-content-end px-4 pt-4">
          <Link to={`/edit-case-study/${caseStudy.slug || caseStudy.id || idOrSlug}`} className="btn btn-outline-primary">
            Edit Case Study
          </Link>
          <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
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
