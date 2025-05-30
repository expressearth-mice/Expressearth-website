import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AuthContext } from "../context/AuthContext";

const bgImage = process.env.PUBLIC_URL + "/Images/bg2.jpg";

function CreateCaseStudy() {
  const { authTokens } = useContext(AuthContext);
  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    comment: "",
    image: null,
    destination: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8000/api/destinations/").then((res) => {
      setDestinations(res.data);
      if (res.data.length > 0) {
        setFormData((prev) => ({ ...prev, destination: res.data[0].id }));
      }
    });
  }, []);

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
      await axios.post("http://localhost:8000/api/case-studies/", data, {
        headers: {
          Authorization: `Bearer ${authTokens.access}`,
        },
      });

      alert("Case study created!");
      setFormData({
        name: "",
        comment: "",
        image: null,
        destination: destinations.length > 0 ? destinations[0].id : "",
      });
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
          <h2 className="text-center mb-4">Create Case Study</h2>
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
              Submit Case Study
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
