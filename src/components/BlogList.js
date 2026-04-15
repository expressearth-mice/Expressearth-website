import React, { useState, useEffect, useContext } from "react";
import axiosInstance from "../api/axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./BlogList.css";

function BlogList() {
  const { authTokens } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get("/api/posts/");
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
        );
        setPosts(sortedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      {/* ✅ Banner Image and Title */}
      <div className="blog-banner">
        <img src="/Images/Expressearth website images/BLOG/banner image/aerial-picture-river-surrounded-by-islands-covered-greenery-sunlight_181624-6504 (1) (1).avif" alt="Blog Banner" className="blog-banner" />
        <h1 className="banner-title">Blog & Insights</h1>
      </div>

      <div className="blog-container">
        {/* Left Sidebar */}
        <aside className="sidebar">
          <h2>Recent Posts</h2>
          <div className="recent-posts">
            {posts.length === 0 ? (
              <p>No recent posts available.</p>
            ) : (
              posts.slice(0, 7).map((post) => (
                <Link to={`/blogs/${post.slug ? post.slug : encodeURIComponent(post.title)}`} key={post.id} className="recent-post-link">
                  <div className="recent-post">
                    {post.image && (
                      <div className="recent-post-image-wrap">
                        <img className="recent-post-image" src={post.image} alt={post.title} />
                      </div>
                    )}
                    <p>{post.title}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </aside>

        {/* Right Blog Cards */}
        <main className="blog-cards">
          <div className="cards-header">
            <h2>Latest Blog Posts</h2>
            <hr className="divider" />
          </div>

          <div className="card-group">
            {currentPosts.map((post) => (
              <div key={post.id} className="card blog-card">
                {post.image && (
                  <div className="blog-card-image-wrap">
                    <img className="blog-card-image" src={post.image} alt={post.title} />
                  </div>
                )}
                <div className="card-body">
                  <h5 className="blog-card-title">
                    <Link to={`/blogs/${post.slug ? post.slug : encodeURIComponent(post.title)}`} className="blog-link">
                      {post.title}
                    </Link>
                  </h5>
                  <p className="blog-card-text">
                    {post.description.length > 100
                      ? `${post.description.substring(0, 100)}... `
                      : post.description + " "}
                    <Link to={`/blogs/${post.slug ? post.slug : encodeURIComponent(post.title)}`} className="read-more-link">
                      Read more
                    </Link>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-controls">
            <button onClick={handlePrevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </main>
      </div>

    </>
  );
}

export default BlogList;
