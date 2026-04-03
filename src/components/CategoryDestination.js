import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axios';
const CategoryDestinations = () => {
  const { slug } = useParams();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        // Ensure slug is formatted correctly for backend (replace spaces with hyphens)
        const formattedSlug = slug.trim().toLowerCase().replace(/\s+/g, '-');

        const res = await axiosInstance.get(`/api/destinations/?category=${encodeURIComponent(formattedSlug)}`);
        const data = await res.json();
        setDestinations(data);
      } catch (err) {
        console.error("Failed to fetch destinations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, [slug]);

  return (
    <div className="category-destinations">
      <h2>{slug.replace(/-/g, ' ')}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : destinations.length === 0 ? (
        <p>No destinations found.</p>
      ) : (
        <div className="destinations-grid">
          {destinations.map((dest) => (
            <Link to={`/destinations/${encodeURIComponent(dest.slug || dest.name)}`} key={dest.id} className="destination-card">
              <img src={dest.image} alt={dest.name} className="destination-image" />
              <div className="destination-content">
                <h3>{dest.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Internal CSS with mobile responsiveness */}
      <style jsx>{`
        .category-destinations {
          padding: 30px 20px;
          background-color: #f9f9f9;
        }

        h2 {
          text-align: center;
          margin-bottom: 25px;
          font-size: 1.8rem;
          text-transform: capitalize;
        }

        .destinations-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }

        .destination-card {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          width: 300px;
          text-align: center;
          overflow: hidden;
          transition: box-shadow 0.3s ease;
        }

        .destination-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .destination-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }

        .destination-content {
          padding: 16px;
        }

        .destination-content h3 {
          font-size: 1.1rem;
          font-weight: bold;
          margin: 0;
        }

        /* Responsive for small screens */
        @media (max-width: 480px) {
          .destination-card {
            width: 90%;
          }

          h2 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryDestinations;
