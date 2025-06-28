import React, { useState, useContext } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const bgImage = process.env.PUBLIC_URL + "/Images/bg2.jpg";

function CreatePost() {
  const { authTokens } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Meetings", // default as per model
    image: null,
    video_url: "",
  });

  const [content, setContent] = useState(""); // rich text body (optional display or future field)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);
    data.append("long_des", content);
    data.append("video_url", formData.video_url);

    try {
      const res = await axiosInstance.post("/api/posts/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authTokens?.access}`,
        },
      });

      alert("Post created successfully!");
      setFormData({
        title: "",
        description: "",
        category: "Meetings",
        image: null,
      });
      setContent("");
    } catch (err) {
      console.error("Error:", err);
      if (err.response?.data) {
        alert(err.response.data.error || JSON.stringify(err.response.data));
      } else {
        alert("Network error or server is down.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
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
          <h2 className="text-center mb-4">Create Post</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="form-control mb-3"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Short Description"
              className="form-control mb-3"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <select
              name="category"
              className="form-control mb-3"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Meetings">Meetings</option>
              <option value="Incentives">Incentives</option>
              <option value="Conferences">Conferences</option>
              <option value="Exhibitions">Exhibitions</option>
            </select>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="form-control mb-3"
              onChange={handleFileChange}
            />
            <input
              type="url"
              name="video_url"
              placeholder="Video URL (optional)"
              className="form-control mb-3"
              value={formData.video_url}
              onChange={handleChange}
            />
            <ReactQuill
              theme="snow"
              value={content}
              onChange={(val) => setContent(val)}
              className="mb-3"
              placeholder="You can write blog long des here (not submitted yet)..."
            />
            <button type="submit" className="btn btn-primary w-100">
              Submit Post
            </button>
            {content && (
              <div
                className="border p-3 rounded mb-3"
                style={{ backgroundColor: "#f9f9f9" }}
              >
                <h5>Live Preview:</h5>
                <div
                  dangerouslySetInnerHTML={{ __html: content }}
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                />
              </div>
            )}

          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;

