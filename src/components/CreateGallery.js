import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Ensure correct path
import axiosInstance from "../api/axios";

function CreateGallery() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext); // ⬅️ Use correct `authTokens` key

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);

    try {
      await axiosInstance.post("/api/gallery/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authTokens?.access}`, // ⬅️ Adjust token usage
        },
      });

      alert("Gallery item added successfully!");
      setTitle("");
      setDescription("");
      setImage(null);
      navigate("/gallery"); // optional redirect
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      setError("Error adding gallery item. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Add Gallery Item</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        <input
          type="text"
          className="form-control my-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="form-control my-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          required
        />
        <input
          type="file"
          className="form-control my-2"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        {error && <p className="text-danger mt-3">{error}</p>}
      </form>
    </div>
  );
}

export default CreateGallery;
