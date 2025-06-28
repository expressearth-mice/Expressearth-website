import React, { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../api/axios";

const GalleryList = () => {
  const [galleryItems, setGalleryItems] = useState([]);

  useEffect(() => {
    axiosInstance.get("/api/gallery/")
      .then(res => setGalleryItems(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container my-5">
      <h2 className="mb-4">Gallery</h2>
      <div className="row">
        {galleryItems.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={item.image} className="card-img-top" alt={item.title} />
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryList;
