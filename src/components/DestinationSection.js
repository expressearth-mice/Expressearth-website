import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../api/axios";
import "./DestinationSection.css";

const hardcodedDestinations = [
  {
    name: "Switzerland",
    image: "/Images/switzerland.png",
    description: "Snow-capped Alps, scenic train rides, and luxury resorts.",
  },
  {
    name: "Bali",
    image: "/Images/bali.jpg",
    description: "Island paradise with spiritual temples and serene beaches.",
  },
  {
    name: "Baku",
    image: "/Images/baku.jpg",
    description:
      "Modern skyline meets ancient city walls in Azerbaijan’s capital.",
  },
  {
    name: "Singapore",
    image: "/Images/singapore.jpg",
    description:
      "Tech-forward city with world-class infrastructure and events.",
  },
  {
    name: "Japan",
    image: "/Images/Japan.jpg",
    description: "Blend of tradition and tech in the Land of the Rising Sun.",
  },
  {
    name: "Maldives",
    image: "/Images/maldives.jpg",
    description: "Tropical paradise with luxury resorts over turquoise waters.",
  },
];

const sliderImages = [
  "/Images/Expressearth website images/Destination/aerial-landscape-forest-river-curve-heights-blue-sky-clouds-summer_77569-225.avif",
  "/Images/Expressearth website images/Destination/aerial-picture-river-surrounded-by-islands-covered-greenery-sunlight_181624-6504 (1).avif",
  "/Images/Expressearth website images/Destination/african-nature-scenery-with-vegetation-trees_23-2148851645.avif",
  "/Images/Expressearth website images/Destination/beautiful-green-park-with-lake-ang-kaew-chiang-mai-universi_1232-3396.avif",
  "/Images/Expressearth website images/Destination/nature-mountains_1204-279.avif",
  "/Images/Expressearth website images/Destination/beautiful-lake-mountains_395237-44.avif",
  "/Images/Expressearth website images/Destination/mountain-medvednica-zagreb-cloudy-sky_181624-6101.avif"
];

const DestinationSection = () => {
  const [destinations, setDestinations] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    axiosInstance
      .get("/api/destinations/")
      .then((res) => {
        setDestinations([...hardcodedDestinations, ...res.data]);
      })
      .catch((error) => {
        console.error("Error fetching destinations:", error);
        setDestinations(hardcodedDestinations); // fallback only
      });
  }, []);

  // This function will be used to add newly created destination to the state
  const addNewDestination = (newDestination) => {
    setDestinations((prevDestinations) => [
      newDestination, // Add the new destination at the start or end of the list
      ...prevDestinations,
    ]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const totalPages = Math.ceil(destinations.length / itemsPerPage);
  const paginatedDestinations = destinations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="destination-section">
      <div className="section-heading-banner">
        <img
          src={sliderImages[currentSlide]}
          alt={`Slide ${currentSlide + 1}`}
          className="banner-background-image"
        />
        <div className="banner-text">
          <i className="fas fa-map-marked-alt" />
          <h1>Destinations</h1>
        </div>
      </div>

      <div className="destination-grid container">
        {paginatedDestinations.map((dest, index) => (
          
          <Link
            key={index}
            to={`/destinations/${encodeURIComponent(dest.slug || dest.name)}`}
            className="destination-card-wrapper"
          >
            <div className="destination-card text-decoration-none">
              <div className="overlay">
                <h4>{dest.name}</h4>
              </div>
              <img src={dest.image} alt={dest.name} />
            </div>
          </Link>
        ))}
      </div>

      <div className="pagination-controls">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? "active" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default DestinationSection;
