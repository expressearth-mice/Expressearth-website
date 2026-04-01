import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1>Welcome to Admin Dashboard</h1>
      <p>You can create, edit, and delete blog posts and case studies from here.</p>
      <div className="d-flex flex-wrap gap-3 mt-4">
        <Link to="/create-post" className="btn btn-primary">
          Create Blog Post
        </Link>
        <Link to="/blogs" className="btn btn-outline-primary">
          Manage Blog Posts
        </Link>
        <Link to="/create-case-studies" className="btn btn-success">
          Create Case Study
        </Link>
        <Link to="/case-studies" className="btn btn-outline-success">
          Manage Case Studies
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
