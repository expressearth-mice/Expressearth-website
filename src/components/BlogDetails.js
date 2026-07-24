import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { blog_url, blog_detail_url } from "../api/urls";
import "./BlogDetails.css";
import Skeleton from "./Skeleton";

const BlogDetailsSkeleton = () => (
  <div className="blog-detail-page">
    <div className="blog-detail-banner">
      <Skeleton className="blog-detail-banner-image" style={{ height: 300 }} />
    </div>

    <div className="blog-detail-layout">
      <div className="blog-detail-main">
        <Skeleton
          className="blog-detail-featured-image"
          style={{ height: 320 }}
        />
        <Skeleton className="skeleton-text" style={{ width: "100%" }} />
        <Skeleton className="skeleton-text" style={{ width: "96%" }} />
        <Skeleton className="skeleton-text" style={{ width: "92%" }} />
        <Skeleton className="skeleton-text" style={{ width: "88%" }} />
        <Skeleton className="skeleton-text" style={{ width: "70%" }} />
      </div>

      <aside className="blog-detail-sidebar">
        <h3>Recent Posts</h3>
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="blog-detail-recent-card" key={index}>
            <Skeleton className="blog-detail-recent-image" />
            <Skeleton className="skeleton-text" style={{ width: "80%" }} />
          </div>
        ))}
      </aside>
    </div>
  </div>
);

const BlogDetails = () => {
  const { title } = useParams();
  const navigate = useNavigate();
  const { role, getValidAccessToken } = useContext(AuthContext);
  const [blog, setBlog] = useState(null);
  const [posts, setPosts] = useState([]);
  const [videoEmbed, setVideoEmbed] = useState(null);
  const [loading, setLoading] = useState(true);
  const canManagePosts = role.is_admin || role.is_seo;


  useEffect(() => {
    setLoading(true);
    const fetchPost = async () => {
      try {
        const res = await axiosInstance.get(`/api/posts/${title}/`);
        setBlog(res.data);
      } catch (error) {
        try {
          const res = await axiosInstance.get(blog_detail_url(title));
          const data = res.data;
          setBlog({
            ...data,
            description: data.short_description,
            image: data.images?.[0]?.image || data.image,
            long_des: data.content,
          });
        } catch (err2) {
          console.error("Error fetching post:", err2);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentPosts = async () => {
      try {
        const [oldRes, newRes] = await Promise.allSettled([
          axiosInstance.get("/api/posts/"),
          axiosInstance.get(blog_url),
        ]);

        const oldPosts =
          oldRes.status === "fulfilled"
            ? oldRes.value.data?.results || oldRes.value.data || []
            : [];
        const newPostsRaw =
          newRes.status === "fulfilled"
            ? newRes.value.data?.results ?? newRes.value.data ?? []
            : [];

        const newPosts = newPostsRaw.map((post) => ({
          id: post.id,
          slug: post.slug,
          title: post.title,
          image: post.images?.[0]?.image || post.image || "",
        }));

        setPosts([...oldPosts, ...newPosts]);
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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Delete the blog post "${blog?.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        alert("Your session has expired. Please log in again.");
        return;
      }

      await axiosInstance.delete(`/api/posts/${title}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Blog post deleted successfully.");
      navigate("/blogs");
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Unable to delete this blog post.");
    }
  };

  if (loading) return <BlogDetailsSkeleton />;

  if (!blog) return <p style={{ textAlign: "center", marginTop: "2rem" }}>Blog not found!</p>;



  return (
    <div className="blog-detail-page">
      <div className="blog-detail-banner">
        <img
          src="/Images/Expressearth website images/BLOG/banner image/aerial-picture-river-surrounded-by-islands-covered-greenery-sunlight_181624-6504 (1) (1).avif"
          alt="Blog Banner"
          className="blog-detail-banner-image"
        />
        <h1 className="blog-detail-banner-title">{blog.title}</h1>
      </div>

      {canManagePosts && (
        <div className="blog-detail-actions">
          <Link
            to={`/edit-post/${blog.slug || encodeURIComponent(blog.title)}`}
            className="btn btn-outline-primary"
          >
            Edit Post
          </Link>
          <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>
            Delete Post
          </button>
        </div>
      )}

      <div className="blog-detail-layout">
        <div className="blog-detail-main">
          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="blog-detail-featured-image"
            />
          )}

          <div
            className="blog-detail-content"
            dangerouslySetInnerHTML={{ __html: blog.long_des }}
          />
          {blog.video_url && !videoEmbed && (
            <div className="blog-detail-watch-trigger">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setVideoEmbed(getEmbeddedVideoUrl(blog.video_url));
                }}
                className="blog-detail-watch-button"
              >
                Click to watch the video
              </button>
            </div>
          )}

          {videoEmbed && (
            <div className="blog-detail-video-block">
              <h4>Watch the Video</h4>
              <iframe
                src={videoEmbed}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video"
                className="blog-detail-video-frame"
              />
            </div>
          )}
        </div>

        <aside className="blog-detail-sidebar">
          <h3>Recent Posts</h3>
          {posts.length === 0 ? (
            <p>No recent posts available.</p>
          ) : (
            posts.slice(0, 7).map((post) => (
              <Link to={`/blogs/${post.slug}`} key={post.id} className="blog-detail-recent-link">
                <div className="blog-detail-recent-card">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="blog-detail-recent-image"
                    />
                  )}
                  <p className="blog-detail-recent-title">{post.title}</p>
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
