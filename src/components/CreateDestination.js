import React, { useState, useEffect,useContext } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaMapMarkedAlt,
  FaYoutube,
  FaImage,
  FaHeading,
  FaAlignLeft,
} from "react-icons/fa";
import axiosInstance from "../api/axios";

const CreateDestination = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    image: null,
    video_url: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext); 

  useEffect(() => {
    axiosInstance
      .get("/api/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => {
        console.error(err);
        setErrorMessage("Failed to fetch categories.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));
      if (name === "image") {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      setErrorMessage("Please upload an image.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    try {
      await axiosInstance.post("/api/destinations/", data, {
        headers: {
          Authorization: `Bearer ${authTokens?.access}`, 
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Destination created successfully!");
      setErrorMessage("");
      setFormData({
        name: "",
        description: "",
        location: "",
        image: null,
        video_url: "",
        category: "",
      });
      setImagePreview(null);

      setTimeout(() => navigate("/destinations"), 1500);
    } catch (err) {
      console.error("Error creating destination:", err.response?.data || err.message);
      setErrorMessage(
        err.response?.data?.detail ||
          JSON.stringify(err.response?.data) ||
          "Failed to create destination. Please check your input."
      );
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to right, #E0F7FA, #E8EAF6)", padding: "40px 20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ backgroundColor: "white", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", borderRadius: "24px", padding: "40px", width: "100%", maxWidth: "800px", boxSizing: "border-box" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "800", textAlign: "center", color: "#00796B", marginBottom: "20px" }}>
          Create a New Destination
        </h2>

        {errorMessage && (
          <p style={{ color: "#D32F2F", textAlign: "center", fontWeight: "600", marginBottom: "20px" }}>{errorMessage}</p>
        )}
        {successMessage && (
          <p style={{ color: "#388E3C", textAlign: "center", fontWeight: "600", marginBottom: "20px" }}>{successMessage}</p>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Name */}
          <div>
            <label className="form-label"><FaHeading /> Destination Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Maldives"
              required
              className="form-control"
            />
          </div>

          {/* Description */}
          <div>
            <label className="form-label"><FaAlignLeft /> Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Describe the destination..."
              required
              className="form-control"
            />
          </div>

          {/* Location */}
          <div>
            <label className="form-label"><FaMapMarkedAlt /> Google Maps Link</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="https://maps.app.goo.gl/..."
              required
              className="form-control"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="form-label"><FaImage /> Upload Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="form-control"
            />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="img-fluid mt-2 rounded" style={{ maxHeight: "200px", objectFit: "cover" }} />
            )}
          </div>

          {/* Video URL */}
          <div>
            <label className="form-label"><FaYoutube /> Video URL</label>
            <input
              type="text"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              placeholder="https://youtube.com/..."
              className="form-control"
            />
          </div>

          {/* Category */}
          <div>
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="form-select"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="btn btn-success px-4 py-2 fw-bold"
            >
              Create Destination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDestination;
