import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../api/axios";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance.get("/api/categories/")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">All Categories</h2>
      <ul className="list-disc pl-6 space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="text-gray-800 text-lg">{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
