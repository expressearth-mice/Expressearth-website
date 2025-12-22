import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Gallery.css";
import axiosInstance from "../api/axios";
import {
  Image1,
  Image2,
  Image3,
  Image4,
  Image5,
  Image6,
  Image7,
  Image8,
} from "../assests";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Gallery() {
  const hardcodedData = [
    {
      title: "MICE Event Video Highlights",
      desc: "Relive the magic of our most iconic events through dynamic highlight reels showcasing destination excellence, flawless execution, and unforgettable moments.",
      img: Image1,
    },
    {
      title: "",
      desc: "",
      img: Image2,
    },
    {
      title: "",
      desc: "",
      img: Image3,
    },
    {
      title: "",
      desc: "",
      img: Image4,
    },
    {
      title: "",
      desc: "",
      img: Image5,
    },

    {
      title: "",
      desc: "",
      img: Image7,
    },
    {
      title: "",
      desc: "",
      img: Image8,
    },
    {
      title: "Successful Event Case Studies",
      desc: "Each frame tells the story of a challenge turned into triumph, an idea transformed into an experience. Discover how we deliver success, one event at a time.",
      img: Image6,
    },
    {
      title: "Corporate Event Photography",
      desc: "Explore high-resolution images capturing the grandeur, energy, and detail of our meticulously managed events.",
      img: "https://lh3.googleusercontent.com/p/AF1QipNKPtaK6II_kGAxMcKsw6Sdr10SE1Gu7YjHs3NY=s1360-w1360-h1020-rw",
    },
    {
      title: "",
      desc: "",
      img: "https://lh3.googleusercontent.com/p/AF1QipP1LO-pOWx0Rh7xeDk7zOosCeQvK4xuM51kMUZY=s1360-w1360-h1020-rw",
    },
    {
      title: "",
      desc: "",
      img: "https://lh3.googleusercontent.com/p/AF1QipOlKmOT0VGn62HZhdbhVVssEGu7s-kYMoqfgM2C=s1360-w1360-h1020-rw",
    },
    {
      title: "",
      desc: "",
      img: "https://lh3.googleusercontent.com/p/AF1QipOMSBC8_oE2QWkK7QwtzRoLAj9trk-ig1Osr4SJ=s1360-w1360-h1020-rw",
    },
  ];

  const [apiData, setApiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const itemsPerPage = 6;

  useEffect(() => {
    axiosInstance
      .get(`/api/gallery/`)
      .then((response) => {
        const sorted = response.data.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setApiData(sorted);
      })
      .catch((error) => {
        console.error("Error fetching gallery data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalItems = hardcodedData.length + apiData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const combinedGallery = [...hardcodedData, ...apiData];

  const paginatedItems = combinedGallery.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  const handleMouseEnter = (imgSrc) => {
    const timeoutId = setTimeout(() => {
      setSelectedImage(imgSrc);
    }, 1000);
    setHoverTimeout(timeoutId);
  };
  const handleMouseLeave = () => {
    clearTimeout(hoverTimeout);
  };

  return (
    <div className="gallery-container py-5 text-black">
      <div className="text-center mb-5">
        <h1 className="fw-bold display-5">ExpressEarth Moments</h1>
        <h2 className="fs-3 mb-3">A Gallery of Excellence</h2>
        <p className="lead">
          Step into our world of exceptional event planning through a carefully
          curated collection of visuals from around the globe.
        </p>
      </div>

      <div className="container">
        <div className="row g-4">
          {loading && <p className="text-center">Loading gallery...</p>}

          {paginatedItems.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={`gallery-${index}`}>
              <div className="gallery-card h-100 shadow-sm">
                <div
                  className="gallery-image-wrapper"
                  onClick={() => setSelectedImage(item.img || item.image)}
                >
                  <img
                    src={item.img || item.image}
                    className="gallery-img"
                    alt={item.title}
                  />
                  {/* <div className="image-overlay-text">
                    <h5>{item.title}</h5>
                    <p>{item.desc || item.description}</p>
                  </div> */}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="pagination-controls text-center mt-5">
          <button
            className="btn btn-outline-light mx-1"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            &laquo; Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn mx-1 ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline-light"
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-outline-light mx-1"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next &raquo;
          </button>
        </div>
      </div>
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="Full Preview"
            className="fullscreen-img"
          />
        </div>
      )}
    </div>
  );
}

export default Gallery;