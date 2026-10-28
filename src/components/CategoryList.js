import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axios";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance.get("/api/categories/")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setCategories(data);
      })
      .catch((err) => console.error("Failed to load destination categories:", err));
  }, []);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-6">All Categories</h2>
      <ul className="list-disc pl-6 space-y-2">
        {categories.map((cat) => {
          const categoryName = String(cat.name || "").trim();
          const categorySlug = cat.slug || categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          if (!categoryName || !categorySlug) return null;

          return (
            <li key={cat.id || categorySlug} className="text-gray-800 text-lg">
              <Link to={`/categories/${encodeURIComponent(categorySlug)}`} className="text-inherit hover:underline">
                {categoryName}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryList;
