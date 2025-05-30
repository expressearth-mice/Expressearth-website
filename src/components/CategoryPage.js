import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPage = () => {
  const { slug } = useParams();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    axios.get(`/api/destinations/category_slug=${slug}`)
      .then(res => setDestinations(res.data))
      .catch(err => console.error(err));
  }, [slug]);

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4 capitalize">{slug.replace('-', ' ')}</h2>
      {destinations.length > 0 ? (
        destinations.map(dest => (
          <div key={dest.id} className="border p-3 mb-3 rounded">
            <h3 className="text-lg font-semibold">{dest.name}</h3>
            <p>{dest.description}</p>
          </div>
        ))
      ) : (
        <p>No destinations found for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;