import React from "react";
import { Link } from "react-router-dom";

function QuickLinksNew() {
  return (
    <div className="d-flex flex-wrap gap-3 mt-4 mb-4">
      <Link to="/create-post-new" className="btn btn-primary">
        Create Blog Post New
      </Link>
      <Link to="/blogs-new" className="btn btn-outline-primary">
        Manage Blog Posts New
      </Link>
      <Link to="/create-case-studies-new" className="btn btn-success">
        Create Case Study New
      </Link>
      <Link to="/case-studies-new" className="btn btn-outline-success">
        Manage Case Studies New
      </Link>
    </div>
  );
}

export default QuickLinksNew;
