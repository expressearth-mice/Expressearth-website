import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Gallery.css";
import axiosInstance from "../api/axios";

// const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

function Gallery() {
  const hardcodedData = [
    {
      title: "Corporate Event Photography",
      desc: "Explore high-resolution images capturing the grandeur, energy, and detail of our meticulously managed events.",
      img: "https://5.imimg.com/data5/SELLER/Default/2021/1/CI/JC/JY/32308928/corporate-event-photography.jpg",
    },
    {
      title: "MICE Event Video Highlights",
      desc: "Relive the magic of our most iconic events through dynamic highlight reels showcasing destination excellence, flawless execution, and unforgettable moments.",
      img: "https://indiaoutbound.info/wp-content/uploads/2022/10/mice-1-1.jpg",
    },
    {
      title: "Event Planning Portfolio Examples",
      desc: "Get inspired by a showcase of diverse MICE events—from exclusive gala dinners to international trade shows—designed and delivered by ExpressEarth.",
      img: "https://i.ytimg.com/vi/XJ_-x3Dl3K0/maxresdefault.jpg",
    },
    {
      title: "Successful Event Case Studies",
      desc: "Each frame tells the story of a challenge turned into triumph, an idea transformed into an experience. Discover how we deliver success, one event at a time.",
      img: "https://weandgoliath.com/wp-content/uploads/2024/07/wg_marketing_event_marketing_95699414-18b2-43ba-8e24-a5159c3c5e0a-768x768.png",
    },
    {
      title: "Event Management Showcase",
      desc: "Browse through stunning shots from featured events—each one a testament to our commitment to excellence.",
      img: "https://expressearth.com/wp-content/uploads/2023/08/WhatsApp-Image-2023-08-04-at-2.03.20-PM-1.jpeg",
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
        const sorted = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
          Step into our world of exceptional event planning through a carefully curated collection of visuals from around the globe.
        </p>
      </div>

      <div className="container">
        <div className="row g-4">
          {loading && <p className="text-center">Loading gallery...</p>}

          {paginatedItems.map((item, index) => (
            <div className="col-md-6 col-lg-4" key={`gallery-${index}`}>
              <div className="gallery-card h-100 shadow-sm">
                <div className="gallery-image-wrapper" onClick={() => setSelectedImage(item.img || item.image)}>
                  <img
                    src={item.img || item.image}
                    className="gallery-img"
                    alt={item.title}
                  />
                  <div className="image-overlay-text">
                    <h5>{item.title}</h5>
                    <p>{item.desc || item.description}</p>
                  </div>
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
              className={`btn mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-outline-light"}`}
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
          <img src={selectedImage} alt="Full Preview" className="fullscreen-img" />
        </div>
      )}
    </div>
  );
}

export default Gallery;