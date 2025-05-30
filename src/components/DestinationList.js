import React, { useState, useEffect } from "react";
import axios from "axios";

const DestinationList = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/destinations/");
        console.log(response.data);  // Log the response to inspect the structure
        setDestinations(response.data);
      } catch (err) {
        setError("Failed to fetch destinations.");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []); // Empty dependency array means this runs once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      {destinations.map((destination) => (
        <div key={destination.id}>
          <h3>{destination.name}</h3>
          <p>{destination.description}</p>
          {/* Handle image path and fallback */}
          <img 
            src={`http://127.0.0.1:8000${destination.image || '/media/default-image.jpg'}`} 
            alt={destination.name} 
          />
          {/* Handle video URL if available */}
          {destination.video_url && <a href={destination.video_url}>Watch Video</a>}
        </div>
      ))}
    </div>
  );
};

export default DestinationList;
