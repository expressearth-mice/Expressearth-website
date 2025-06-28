import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { authTokens } = useContext(AuthContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      await axiosInstance.post(
        "/api/categories/",
        { name },
        {
          headers: {
            Authorization: `Bearer ${authTokens?.access}`,
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/categories"); // Ensure this route/page exists
    } catch (err) {
      console.error("Error creating category:", err);
      setError("Failed to create category. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-50 to-amber-100 flex items-center justify-center px-4 py-10 pt-32">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-lg">
        <h2 className="text-3xl font-semibold text-center text-yellow-800 mb-8">
          Add New Category
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-yellow-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-yellow-700 transition-transform duration-200 w-full sm:w-auto"
              >
                Create Category
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
