import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { normalizeCollectionResponse } from "../api/collectionData";

const CategoryDestinations = () => {
  const { slug = "" } = useParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const categoryName = (() => {
    try {
      return decodeURIComponent(slug)
        .replace(/[-_]+/g, " ")
        .trim()
        .replace(/\b\w/g, (character) => character.toUpperCase());
    } catch {
      return String(slug).replace(/[-_]+/g, " ").trim();
    }
  })();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(false);
    setDestinations([]);

    const formattedSlug = String(slug)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const fetchDestinations = async () => {
      try {
        const response = await axiosInstance.get(
          `/api/destinations/?category=${encodeURIComponent(formattedSlug)}`
        );
        if (!cancelled) {
          setDestinations(normalizeCollectionResponse(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch destinations for category:", error);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchDestinations();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (loading || typeof document === "undefined") return;

    const robotsMeta = document.head.querySelector('meta[name="robots"]');
    const setMeta = (selector, attributes, content) => {
      let element = document.head.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    if (loadError || destinations.length === 0) {
      document.title = "Destinations not found | ExpressEarth";
      if (robotsMeta) robotsMeta.setAttribute("content", "noindex, follow");
      const staleCanonical = document.head.querySelector('link[rel="canonical"]');
      if (staleCanonical) staleCanonical.remove();
      return;
    }

    const description = `Explore ${categoryName.toLowerCase()} destinations for corporate incentive travel, offsites and MICE group programmes with ExpressEarth.`;
    const canonicalUrl = `https://www.expressearth.com/categories/${encodeURIComponent(slug)}`;

    document.title = `${categoryName} Destinations for Corporate Groups | ExpressEarth`;
    if (robotsMeta) robotsMeta.setAttribute("content", "index, follow, max-image-preview:large");
    setMeta('meta[name="description"]', { name: "description" }, description);
    setMeta('meta[property="og:title"]', { property: "og:title" }, document.title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, description);
    setMeta('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, document.title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);
  }, [categoryName, destinations, loadError, loading, slug]);

  return (
    <main className="category-destinations">
      <h1>{categoryName || "Corporate group"} destinations</h1>
      <p className="category-destinations-intro">
        Explore destination options for corporate incentive trips, offsites and
        group programmes. Share your preferred dates and group size with
        ExpressEarth to discuss a suitable itinerary.
      </p>

      {loading ? (
        <p role="status" aria-live="polite">Loading destinations...</p>
      ) : loadError ? (
        <div className="category-destinations-empty" role="status">
          <p>We could not load destinations in this category just now.</p>
          <Link to="/contact">Discuss a corporate group programme</Link>
        </div>
      ) : destinations.length === 0 ? (
        <div className="category-destinations-empty">
          <p>No destinations are currently listed in this category.</p>
          <Link to="/destinations">Browse all destinations</Link>
          {" · "}
          <Link to="/contact">Discuss a corporate group programme</Link>
        </div>
      ) : (
        <div className="destinations-grid">
          {destinations.map((destination) => (
            <Link
              to={`/destinations/${encodeURIComponent(destination.slug || destination.name)}`}
              key={destination.id || destination.slug || destination.name}
              className="destination-card"
            >
              {destination.image && (
                <img
                  src={destination.image}
                  alt={destination.name || "Corporate group destination"}
                  className="destination-image"
                  loading="lazy"
                  decoding="async"
                />
              )}
              <div className="destination-content">
                <h2>{destination.name}</h2>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .category-destinations {
          padding: 30px 20px;
          background-color: #f9f9f9;
        }

        .category-destinations h1 {
          text-align: center;
          margin-bottom: 16px;
          font-size: 1.8rem;
          text-transform: capitalize;
        }

        .category-destinations-intro {
          max-width: 760px;
          margin: 0 auto 25px;
          line-height: 1.6;
          text-align: center;
        }

        .category-destinations .destinations-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .category-destinations .destination-card {
          display: block;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          width: 300px;
          color: inherit;
          text-align: center;
          text-decoration: none;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        .category-destinations .destination-card:hover,
        .category-destinations .destination-card:focus-visible {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .category-destinations .destination-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .category-destinations .destination-content {
          padding: 16px;
        }

        .category-destinations .destination-content h2 {
          font-size: 1.1rem;
          font-weight: bold;
          margin: 0;
        }

        .category-destinations-empty {
          text-align: center;
          padding: 24px 12px;
        }

        @media (max-width: 480px) {
          .category-destinations .destination-card {
            width: 90%;
          }

          .category-destinations h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </main>
  );
};

export default CategoryDestinations;
