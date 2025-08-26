import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";


const BlogDetails = () => {
  const { title } = useParams();
  const [blog, setBlog] = useState(null);
  const [posts, setPosts] = useState([]);
  const [videoEmbed, setVideoEmbed] = useState(null);


  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/api/posts/${title}/`);
        setBlog(res.data);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const res = await axiosInstance.get("/api/posts/");
        setPosts(res.data.results || res.data); // use `.results` if using pagination
      } catch (error) {
        console.error("Error fetching recent posts:", error);
      }
    };

    fetchPost();
    fetchRecentPosts();
  }, [title]);

  const getEmbeddedVideoUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url; // return as is if it's already an embed URL or another platform
  };

  if (!blog) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Blog not found!</p>;



  return (
    <div style={{ padding: "2rem 5%", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      {/* Banner */}
      <div style={{ position: "relative", textAlign: "center", marginBottom: "2rem" }}>
        <img
          src="/Images/Expressearth website images/BLOG/banner image/aerial-picture-river-surrounded-by-islands-covered-greenery-sunlight_181624-6504 (1) (1).avif"
          alt="Blog Banner"
          style={{ width: "100%", height: "300px", objectFit: "cover", borderRadius: "8px" }}
        />
        <h1 style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#fff",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          padding: "0.5rem 1rem",
          borderRadius: "5px"
        }}>
          {blog.title}
        </h1>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "2rem",
          alignItems: "flex-start",
          padding: "2rem 5%",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.6",
        }}
      >
        {/* Main Blog Content */}
        <div style={{ flex: "3", maxWidth: "800px" }}>

          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              style={{ maxWidth: "100%", borderRadius: "6px", marginBottom: "1.5rem" }}
            />
          )}

          <div
            style={{ fontSize: "1.1rem", color: "#555" }}
            dangerouslySetInnerHTML={{ __html: blog.long_des }}
          ></div>
          {blog.video_url && !videoEmbed && (
            <div style={{ marginTop: "1.5rem" }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setVideoEmbed(getEmbeddedVideoUrl(blog.video_url)); // Set embedded video URL
                }}
                style={{
                  fontSize: "1rem",
                  color: "#0066cc",
                  textDecoration: "underline",
                }}
              >
                Click to watch the video
              </a>
            </div>
          )}

          {videoEmbed && (
            <div style={{ marginTop: "2rem" }}>
              <h4 style={{ color: "#444", marginBottom: "0.5rem" }}>Watch the Video</h4>
              <iframe
                width="100%"
                height="400"
                src={videoEmbed}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video"
                style={{ borderRadius: "8px" }}
              ></iframe>
            </div>
          )}
        </div>

        {/* Sidebar on the Right */}
        <aside
          style={{
            flex: "1",
            maxWidth: "280px",
            maxHeight: "600px",
            overflowY: "auto",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <h3
            style={{
              borderBottom: "1px solid #ccc",
              paddingBottom: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1.2rem",
            }}
          >
            Recent Posts
          </h3>
          {posts.length === 0 ? (
            <p>No recent posts available.</p>
          ) : (
            posts.slice(0, 7).map((post) => (
              <Link to={`/blogs/${post.slug}`} key={post.id}

                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "1rem",
                    padding: "0.5rem",
                    backgroundColor: "#fff",
                    borderRadius: "6px",
                    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.2s ease",
                    cursor: "pointer",
                  }}
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      style={{
                        width: "100%",
                        height: "140px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        marginBottom: "0.5rem",
                      }}
                    />
                  )}
                  <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "#333", margin: 0 }}>
                    {post.title}
                  </p>
                </div>
              </Link>
            ))
          )}
        </aside>
      </div>


    </div>
  );
};

export default BlogDetails;
