import React, { useState, useEffect, useContext } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const bgImage = process.env.PUBLIC_URL + "/Images/bg2.jpg";

function CreateCaseStudy() {
  const { getValidAccessToken } = useContext(AuthContext);
  const [destinations, setDestinations] = useState([]);
  const navigate = useNavigate();
  const { id: idOrSlug } = useParams();
  const isEditMode = Boolean(idOrSlug);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    image: null,
    destination: "",
  });
  const [caseStudyId, setCaseStudyId] = useState(null);
  const [loading, setLoading] = useState(isEditMode);

  useEffect(() => {
    axiosInstance.get("/api/destinations/").then(async (res) => {
      setDestinations(res.data);
      if (!isEditMode && res.data.length > 0) {
        setFormData((prev) => ({ ...prev, destination: res.data[0].id }));
      }

      if (!isEditMode) {
        setLoading(false);
      }
    });
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode) return;

    const fetchCaseStudy = async () => {
      try {
        const res = await axiosInstance.get(`/api/case-studies/${idOrSlug}/`);
        const item = res.data;
        setCaseStudyId(item.id || null);
        setFormData((prev) => ({
          ...prev,
          name: item.name || "",
          comment: item.comment || "",
          image: null,
          destination:
            item.destination?.id || item.destination || prev.destination || "",
        }));
      } catch (err) {
        console.error("Error fetching case study for editing:", err);
        alert("Unable to load case study for editing.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudy();
  }, [idOrSlug, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, image: file }));
  };

  const handleCommentChange = (value) => {
    setFormData((prev) => ({ ...prev, comment: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("comment", formData.comment);
    data.append("destination", formData.destination);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        alert("Your session has expired. Please log in again.");
        return;
      }

      const updateIdentifier = caseStudyId || idOrSlug;
      const request = isEditMode
        ? axiosInstance.put(`/api/case-studies/${updateIdentifier}/`, data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          })
        : axiosInstance.post("/api/case-studies/", data, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          });

      const res = await request;

      alert(isEditMode ? "Case study updated!" : "Case study created!");
      if (isEditMode) {
        navigate(`/case-studies/${res.data?.slug || res.data?.id || updateIdentifier}`);
        return;
      }

      setFormData({
        name: "",
        comment: "",
        image: null,
        destination: destinations.length > 0 ? destinations[0].id : "",
      });
      setTimeout(() => navigate("/case-studies"), 1500);
    } catch (err) {
      console.error("Error response:", err.response?.data || err.message);
      if (err.response?.data) {
        const errors = err.response.data;
        const messages = Object.entries(errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join("\n");
        alert(`Error creating case study:\n${messages}`);
      } else {
        alert("Error creating case study.");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading editor...</div>;
  }

  return (
    <div className="container mt-4">
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          minHeight: "100vh",
          padding: "2rem",
        }}
      >
        <div
          className="container"
          style={{
            backgroundColor: "white",
            maxWidth: "700px",
            margin: "0 auto",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          <h2 className="text-center mb-4">
            {isEditMode ? "Edit Case Study" : "Create Case Study"}
          </h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="name"
              placeholder="Case Study Title"
              className="form-control mb-3"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <select
              name="destination"
              className="form-control mb-3"
              value={formData.destination}
              onChange={handleChange}
              required
            >
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              name="image"
              accept="image/*"
              className="form-control mb-3"
              onChange={handleFileChange}
            />

            <ReactQuill
              theme="snow"
              value={formData.comment}
              onChange={handleCommentChange}
              className="mb-3"
              placeholder="Write detailed comment here..."
            />

            <button type="submit" className="btn btn-success w-100">
              {isEditMode ? "Update Case Study" : "Submit Case Study"}
            </button>
          </form>

          {formData.comment && (
            <div className="mt-5">
              <h5>Preview:</h5>
              <div
                className="p-3 border"
                dangerouslySetInnerHTML={{ __html: formData.comment }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCaseStudy;
