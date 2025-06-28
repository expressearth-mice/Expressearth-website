import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";

const hardcodedDestinations = [
  {
    name: "Switzerland",
    image: "/Images/switzerland.png",
    description:
      "Snow-capped Alps, scenic train rides, and luxury resorts. Switzerland is a landlocked country in Central Europe, known for its stunning Alpine landscapes, high quality of life, and strong banking system. Its cities, like Zurich and Geneva, are hubs for diplomacy and global finance. Enjoy chocolates, watches, neutrality—and breathtaking views.",
  },
  { name: "Bali", image: "/Images/bali.jpg", description: "Island paradise with spiritual temples and serene beaches." },
  { name: "Baku", image: "/Images/baku.jpg", description: "Modern skyline meets ancient city walls in Azerbaijan’s capital." },
  { name: "Singapore", image: "/Images/singapore.jpg", description: "Tech-forward city with world-class infrastructure and events." },
  { name: "Japan", image: "/Images/Japan.jpg", description: "Blend of tradition and tech in the Land of the Rising Sun." },
  { name: "Maldives", image: "/Images/maldives.jpg", description: "Tropical paradise with luxury resorts over turquoise waters." },
];

const DestinationDetails = () => {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);

  const { name: slug } = useParams(); // now 'slug' is the URL param

  useEffect(() => {
    axiosInstance
      .get(`/api/destinations/${slug}/`)
      .then((response) => {
        setDestination(response.data);
        setLoading(false);
      })
      .catch(() => {
        const fallback = hardcodedDestinations.find((d) => d.name.toLowerCase() === decodeURIComponent(slug).toLowerCase());
        setDestination(fallback || null);
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axiosInstance.get("/api/posts/");
        const sorted = response.data.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setRecentPosts(sorted.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch recent posts:", error);
      }
    };

    fetchRecentPosts();
  }, []);


  useEffect(() => {
    // Fetch destinations from the backend
    const fetchDestination = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/destinations/");
        const found = response.data.find((d) => d.name.toLowerCase() === decodedName.toLowerCase());
        if (found) {
          setDestination(found);
        } else {
          const fallback = hardcodedDestinations.find((d) => d.name.toLowerCase() === decodedName.toLowerCase());
          setDestination(fallback || null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching destination:", error);
        setDestination(hardcodedDestinations.find((d) => d.name.toLowerCase() === decodedName.toLowerCase()) || null);
        setLoading(false);
      }
    };

    fetchDestination();
  }, [decodedName]); // Refetch whenever the destination name changes

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  if (!destination) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Destination Not Found</h2>;



  const containerStyle = {
    maxWidth: "1100px",
    margin: "50px auto",
    padding: "30px",
    backgroundColor: "#f7f9fc",
    borderRadius: "12px",
    boxShadow: "0 0 20px rgba(0,0,0,0.05)",
  };

  const rowStyle = {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "2rem",
  };

  const imageStyle = {
    width: "100%",
    maxWidth: "500px",
    height: "auto",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  };

  const textContainerStyle = {
    flex: 1,
    minWidth: "280px",
  };

  const headingStyle = {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "20px",
  };

  const descriptionStyle = {
    fontSize: "1.1rem",
    lineHeight: "1.7",
    color: "#333",
  };

  return (
    <>
      <div style={containerStyle}>
        <div style={{ overflow: "hidden" }}>
          <img
            src={destination.image}
            alt={destination.name}
            style={{
              float: "right",
              width: "40%",
              margin: "0 0 20px 30px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
              maxWidth: "400px"
            }}
          />
          <div>
            <h2 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>{destination.name}</h2>
            <p style={{ marginTop: "10px" }}>
              <Link to={destination.location} style={{ color: "#007bff", textDecoration: "none" }}>
                {destination.location}
              </Link>
            </p>
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333", textAlign: "justify" }}>
              {destination.description}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Blogs Section */}
      <section className="blogs-updates mt-5 mb-5">
        <h2 className="text-center mb-4">Discover More...</h2>
        <p className="text-center lead">Latest Blogs & Insights, Trends, Insights & MICE Updates!</p>

        <div className="scrolling-wrapper mt-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="blog-card">
              <img src={post.image} alt={post.title} />
              <div className="card-body">
                <h5>
                  <Link to={`/blogs/${post.slug}`} className="text-dark text-decoration-none">
                    {post.title}
                  </Link>
                </h5>
                <p>{post.description.slice(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-3">
          <Link to="/blogs" className="custom-button-link">
            Explore Blogs
          </Link>
        </div>
      </section>
    </>
  );
};

export default DestinationDetails;
