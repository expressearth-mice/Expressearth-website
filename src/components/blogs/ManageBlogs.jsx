import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import {
  blog_detail_url,
  blog_url,
  update_blog_url,
  delete_blog_url,
} from "../../api/urls";
import QuickLinksNew from "../QuickLinksNew";
import "../AdminNew.css";

const emptyEditForm = {
  title: "",
  shortDescription: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
};

const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getApiMessage = (payload, fallback) => {
  const message =
    payload?.message ??
    payload?.detail ??
    payload?.error ??
    payload?.data?.message ??
    payload?.data?.detail;

  if (Array.isArray(message)) return message.join(", ");
  return typeof message === "string" && message.trim() ? message : fallback;
};

function ManageBlogs() {
  const { title: blogSlug } = useParams();
  const navigate = useNavigate();
  const { getValidAccessToken } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [editContent, setEditContent] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [replacementImage, setReplacementImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pageError, setPageError] = useState("");

  const loadBlogs = useCallback(async () => {
    try {
      const res = await axiosInstance.get(blog_url);
      setBlogs(res.data?.results ?? res.data ?? []);
      setPageError("");
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setPageError("Unable to load blogs. Please try again.");
    }
  }, []);

  const loadBlogDetail = useCallback(async () => {
    if (!blogSlug) {
      setSelectedBlog(null);
      setIsEditing(false);
      return;
    }

    try {
      const res = await axiosInstance.get(blog_detail_url(blogSlug));
      setSelectedBlog(res.data);
      setPageError("");
    } catch (err) {
      console.error("Error fetching blog:", err);
      setPageError("Unable to load this blog.");
    }
  }, [blogSlug]);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setIsLoading(true);
      await Promise.all([loadBlogs(), loadBlogDetail()]);
      if (active) setIsLoading(false);
    };

    loadPage();
    return () => {
      active = false;
    };
  }, [loadBlogs, loadBlogDetail]);

  const startEditing = () => {
    if (!selectedBlog) return;
    setEditForm({
      title: selectedBlog.title || "",
      shortDescription: selectedBlog.short_description || "",
      slug: selectedBlog.slug || "",
      metaTitle: selectedBlog.meta_title || "",
      metaDescription: selectedBlog.meta_description || "",
      ogTitle: selectedBlog.og_title || "",
      ogDescription: selectedBlog.og_description || "",
    });
    setEditContent(selectedBlog.content || "");
    setExistingImages(selectedBlog.images || []);
    setDeletedImageIds([]);
    setReplacementImage(null);
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setExistingImages([]);
    setDeletedImageIds([]);
    setReplacementImage(null);
    setIsEditing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const updateField = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateSlug = (e) => {
    setEditForm((prev) => ({ ...prev, slug: createSlug(e.target.value) }));
  };

  const handleReplacementImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setReplacementImage(file);
  };

  const deleteExistingImage = (imageId, index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    if (imageId) setDeletedImageIds((prev) => [...prev, imageId]);
  };

  const saveBlog = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", editForm.title.trim());
    data.append("short_description", editForm.shortDescription.trim());
    data.append("content", editContent);
    data.append("slug", editForm.slug.trim());
    data.append("meta_title", editForm.metaTitle.trim());
    data.append("meta_description", editForm.metaDescription.trim());
    data.append("og_title", editForm.ogTitle.trim());
    data.append("og_description", editForm.ogDescription.trim());

    if (deletedImageIds.length > 0) {
      data.append("deleted_images", JSON.stringify(deletedImageIds));
    }
    if (replacementImage) data.append("image", replacementImage);

    setIsSaving(true);
    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        alert("Your session has expired. Please log in again.");
        return;
      }

      const res = await axiosInstance.patch(
        update_blog_url(selectedBlog.id),
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      alert(getApiMessage(res?.data, "Blog updated successfully."));
      setIsEditing(false);
      setReplacementImage(null);

      const updatedSlug = res.data?.slug || editForm.slug;
      await loadBlogs();
      if (updatedSlug !== blogSlug) {
        navigate(`/blogs-new/${updatedSlug}`, { replace: true });
      } else {
        await loadBlogDetail();
      }
    } catch (err) {
      console.error("Error updating blog:", err);
      alert(
        getApiMessage(err?.response?.data, "Unable to update the blog."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteBlog = async () => {
    const confirmed = window.confirm(
      `Delete the blog "${selectedBlog?.title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        alert("Your session has expired. Please log in again.");
        return;
      }

      const res = await axiosInstance.delete(
        delete_blog_url(selectedBlog.id),
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      alert(getApiMessage(res?.data, "Blog deleted successfully."));
      navigate("/blogs-new", { replace: true });
      await loadBlogs();
    } catch (err) {
      console.error("Error deleting blog:", err);
      alert(
        getApiMessage(err?.response?.data, "Unable to delete the blog."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCard = (blog) => (
    <Link
      className="admin-new-card"
      key={blog.id}
      to={`/blogs-new/${encodeURIComponent(blog.slug)}`}
    >
      <div className="admin-new-card__image">
        {blog.images?.[0]?.image ? (
          <img alt={blog.title} src={blog.images[0].image} />
        ) : blog.image ? (
          <img alt={blog.title} src={blog.image} />
        ) : (
          <span className="text-muted">No image</span>
        )}
      </div>
      <div className="admin-new-card__body">
        <h2 className="h6 mb-1">{blog.title}</h2>
        <p className="text-muted small mb-2">
          {blog.short_description || "No short description available."}
        </p>
        <span className="text-primary small fw-semibold">View full post</span>
      </div>
    </Link>
  );

  return (
    <main className="admin-new-page">
      <div className="container">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
          <div>
            <span className="text-muted text-uppercase small fw-semibold">
              Admin workspace
            </span>
            <h1 className="h3 mt-1 mb-1">
              {blogSlug ? "Blog Details" : "Manage Blog Posts New"}
            </h1>
            <p className="text-muted mb-0">
              {blogSlug ? "Review, edit, or delete this article." : ""}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary" to="/dashboard">
              Dashboard
            </Link>
            <Link className="btn btn-primary" to="/create-post-new">
              Create Blog Post
            </Link>
          </div>
        </div>

        <QuickLinksNew />

        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!isLoading && pageError && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{pageError}</span>
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => window.location.reload()}
              type="button"
            >
              Try Again
            </button>
          </div>
        )}

        {!isLoading &&
          !pageError &&
          !blogSlug &&
          (blogs.length ? (
            <section className="admin-new-grid" aria-label="All blog posts">
              {blogs.map(renderCard)}
            </section>
          ) : (
            <div className="text-center py-5">
              <h2 className="h5">No blogs found</h2>
              <p className="text-muted">
                Published blogs returned by the API will appear here.
              </p>
              <Link className="btn btn-primary" to="/create-post-new">
                Create the first blog
              </Link>
            </div>
          ))}

        {!isLoading && !pageError && blogSlug && selectedBlog && (
          <div className="row g-4">
            <div className="col-lg-9">
              <Link className="d-inline-block mb-3" to="/blogs-new">
                &larr; Back to all blogs
              </Link>

              {!isEditing ? (
                <>
                  <div className="d-flex gap-2 mb-3">
                    <button
                      className="btn btn-primary"
                      onClick={startEditing}
                      type="button"
                    >
                      Edit Blog
                    </button>
                    <button
                      className="btn btn-danger"
                      disabled={isDeleting}
                      onClick={deleteBlog}
                      type="button"
                    >
                      {isDeleting ? "Deleting..." : "Delete Blog"}
                    </button>
                  </div>
                  {selectedBlog.images?.[0]?.image && (
                    <img
                      alt={selectedBlog.title}
                      className="admin-new-detail__hero"
                      src={selectedBlog.images[0].image}
                    />
                  )}
                  <h2 className="h3">{selectedBlog.title}</h2>
                  <p className="text-muted">
                    {selectedBlog.short_description}
                  </p>
                  <div
                    className="admin-new-detail__content"
                    dangerouslySetInnerHTML={{
                      __html: selectedBlog.content || "",
                    }}
                  />
                  {selectedBlog.images && selectedBlog.images.length > 0 && (
                    <div className="mt-4">
                      <h3 className="h6">Blog Images</h3>
                      <div className="d-flex flex-wrap gap-2">
                        {selectedBlog.images.map((img, index) => (
                          <img
                            key={img.id || index}
                            alt={`${selectedBlog.title} ${index + 1}`}
                            src={img.image}
                            style={{
                              width: 100,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 6,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <form className="card shadow-sm p-4" onSubmit={saveBlog}>
                  <h2 className="h5 mb-3">Edit Blog</h2>

                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={editForm.title}
                      onChange={updateField}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Short Description</label>
                    <textarea
                      name="shortDescription"
                      className="form-control"
                      rows="3"
                      value={editForm.shortDescription}
                      onChange={updateField}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Add / Replace Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleReplacementImage}
                      ref={fileInputRef}
                    />
                    <small className="text-muted">
                      Leave empty to keep the current images.
                    </small>
                  </div>

                  {existingImages.length > 0 && (
                    <div className="mb-3">
                      <h3 className="h6">
                        Existing Images ({existingImages.length})
                      </h3>
                      <div className="d-flex flex-wrap gap-2">
                        {existingImages.map((img, index) => (
                          <figure
                            key={img.id || index}
                            className="position-relative m-0"
                          >
                            <img
                              alt={`Blog ${index + 1}`}
                              src={img.image}
                              style={{
                                width: 100,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 6,
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              onClick={() =>
                                deleteExistingImage(img.id, index)
                              }
                            >
                              &times;
                            </button>
                          </figure>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3 admin-new-editor">
                    <label className="form-label">Blog Content</label>
                    <ReactQuill
                      theme="snow"
                      value={editContent}
                      onChange={setEditContent}
                    />
                  </div>

                  <fieldset className="border rounded p-3 mb-3">
                    <legend className="float-none w-auto px-2 fs-6 fw-semibold">
                      SEO Settings
                    </legend>

                    <div className="mb-3">
                      <label className="form-label">URL Slug</label>
                      <input
                        type="text"
                        name="slug"
                        className="form-control"
                        value={editForm.slug}
                        onChange={updateSlug}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Title</label>
                      <input
                        type="text"
                        name="metaTitle"
                        maxLength="60"
                        className="form-control"
                        value={editForm.metaTitle}
                        onChange={updateField}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Description</label>
                      <textarea
                        name="metaDescription"
                        maxLength="160"
                        rows="3"
                        className="form-control"
                        value={editForm.metaDescription}
                        onChange={updateField}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Open Graph Title</label>
                      <input
                        type="text"
                        name="ogTitle"
                        maxLength="60"
                        className="form-control"
                        value={editForm.ogTitle}
                        onChange={updateField}
                        required
                      />
                    </div>

                    <div className="mb-0">
                      <label className="form-label">
                        Open Graph Description
                      </label>
                      <textarea
                        name="ogDescription"
                        maxLength="200"
                        rows="3"
                        className="form-control"
                        value={editForm.ogDescription}
                        onChange={updateField}
                        required
                      />
                    </div>
                  </fieldset>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary"
                      disabled={isSaving}
                      type="submit"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      disabled={isSaving}
                      onClick={cancelEditing}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            <aside className="col-lg-3">
              <h2 className="h6 mb-3">Other Posts</h2>
              <div className="d-flex flex-column gap-3">
                {blogs
                  .filter(
                    (blog) => String(blog.id) !== String(selectedBlog.id),
                  )
                  .slice(0, 5)
                  .map(renderCard)}
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

export default ManageBlogs;
