import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { normalizeCollectionResponse } from "../api/collectionData";
import { buildDestinationSeoMetadata } from "../utils/destinationSeo";

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
  const { name: slug } = useParams();
  const decodedName = (() => {
    try {
      return decodeURIComponent(slug || "");
    } catch {
      return slug || "";
    }
  })();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchDestination = async () => {
      setLoading(true);
      setDestination(null);

      let found = null;
      try {
        const detailResponse = await axiosInstance.get(`/api/destinations/${slug}/`);
        found = detailResponse.data || null;
      } catch {
        // Fall back to the list endpoint when the detail endpoint cannot resolve this slug.
      }

      if (!found) {
        try {
          const response = await axiosInstance.get("/api/destinations/");
          const items = Array.isArray(response.data)
            ? response.data
            : response.data?.results ?? [];
          found = items.find((item) =>
            [item.slug, item.name].some(
              (value) => String(value || "").toLowerCase() === decodedName.toLowerCase()
            )
          ) || null;
        } catch (error) {
          console.error("Error fetching destination:", error);
        }
      }

      if (!found) {
        found = hardcodedDestinations.find(
          (item) => item.name.toLowerCase() === decodedName.toLowerCase()
        ) || null;
      }

      if (!cancelled) {
        setDestination(found);
        setLoading(false);
      }
    };

    fetchDestination();
    return () => {
      cancelled = true;
    };
  }, [slug, decodedName]);
  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const response = await axiosInstance.get("/api/posts/");
        const sorted = [...normalizeCollectionResponse(response.data)].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setRecentPosts(sorted.slice(0, 4));
      } catch (error) {
        console.error("Failed to fetch recent posts:", error);
      }
    };

    fetchRecentPosts();
  }, []);


  useEffect(() => {
    if (loading || typeof document === "undefined") return;

    const setMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    if (!destination) {
      const notFoundTitle = "Destination not found | ExpressEarth";
      const notFoundDescription = "The requested destination page is unavailable. Browse corporate group destinations or contact ExpressEarth about an upcoming programme.";
      document.title = notFoundTitle;
      setMeta('meta[name="robots"]', { name: "robots" }, "noindex, follow");
      setMeta('meta[property="og:title"]', { property: "og:title" }, notFoundTitle);
      setMeta('meta[property="og:description"]', { property: "og:description" }, notFoundDescription);
      setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, notFoundTitle);
      setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, notFoundDescription);
      const staleCanonical = document.head.querySelector('link[rel="canonical"]');
      if (staleCanonical) staleCanonical.remove();
      return;
    }

    const metadata = buildDestinationSeoMetadata(destination.name || decodedName);
    if (!metadata) return;

    const canonicalPath =
      typeof window !== "undefined"
        ? window.location.pathname.replace(/\/+$/, "") || "/"
        : "/destinations/" + encodeURIComponent(decodedName);
    const canonicalUrl = "https://www.expressearth.com" + canonicalPath;

    document.title = metadata.title;
    setMeta('meta[name="robots"]', { name: "robots" }, "index, follow, max-image-preview:large");
    setMeta('meta[name="description"]', { name: "description" }, metadata.description);
    setMeta('meta[property="og:title"]', { property: "og:title" }, metadata.title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, metadata.description);
    setMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, metadata.title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, metadata.description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [destination, decodedName, loading]);

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;
  if (!destination) {
    return (
      <main className="container py-5 text-center">
        <h1>Destination not found</h1>
        <p>The requested destination could not be found. You can browse other corporate group destinations or discuss a programme with ExpressEarth.</p>
        <Link to="/destinations">Browse destinations</Link>
        {" · "}
        <Link to="/contact">Discuss a corporate group programme</Link>
      </main>
    );
  }



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
            <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>{destination.name}</h1>
            {destination.location && (
              <p style={{ marginTop: "10px" }}>
                <Link to={destination.location} style={{ color: "#007bff", textDecoration: "none" }}>
                  {destination.location}
                </Link>
              </p>
            )}
            <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333", textAlign: "justify" }}>
              {destination.description}
            </p>
          </div>
        </div>
      </div>

      <section className="container py-4 mb-4" aria-labelledby="destination-enquiry-heading">
        <div style={{ backgroundColor: "#eef4f8", borderRadius: "12px", padding: "28px" }}>
          <h2 id="destination-enquiry-heading" style={{ marginBottom: "12px" }}>
            Planning a corporate group programme in {destination.name}?
          </h2>
          <p>
            Share your preferred dates, approximate group size and programme type.
            ExpressEarth can discuss accommodation, transfers, activities and local
            coordination around your brief.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px" }}>
            <Link to="/contact" className="custom-button-link">
              Discuss this destination
            </Link>
            <Link to="/incentive-travel">Corporate incentive travel</Link>
            <Link to="/destination-management">Destination management</Link>
            <Link to="/internationalgrouptravel">International group travel</Link>
          </div>
        </div>
      </section>

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
