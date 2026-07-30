import React, { useContext, useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { create_case_study_url } from "../api/urls";
import QuickLinksNew from "./QuickLinksNew";
import "./AdminNew.css";

const initialForm = {
  title: "",
  shortDescription: "",
  slug: "",
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
};

const MAX_IMAGES = 5;

const createSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/'/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const flattenFieldErrors = (obj, prefix = "") => {
  if (!obj || typeof obj !== "object") return [];

  return Object.entries(obj).flatMap(([field, value]) => {
    const label = prefix ? `${prefix}.${field}` : field;

    if (Array.isArray(value)) {
      const text = value.filter((v) => typeof v === "string").join(", ");
      if (!text.trim()) return [];
      return [field === "non_field_errors" ? text : `${label}: ${text}`];
    }

    if (typeof value === "string") {
      if (!value.trim()) return [];
      return [field === "non_field_errors" ? value : `${label}: ${value}`];
    }

    if (value && typeof value === "object")
      return flattenFieldErrors(value, label);

    return [];
  });
};

const getApiMessage = (payload, fallback) => {
  const message =
    payload?.message ??
    payload?.detail ??
    payload?.error ??
    payload?.data?.message ??
    payload?.data?.detail;

  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;

  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const source =
      payload.errors && typeof payload.errors === "object"
        ? payload.errors
        : payload;
    const fieldErrors = flattenFieldErrors(source);
    if (fieldErrors.length) return fieldErrors.join(" | ");
  }

  return fallback;
};

function CreateCaseStudyNew() {
  const { getValidAccessToken } = useContext(AuthContext);
  const [form, setForm] = useState(initialForm);
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const previewsRef = useRef(null);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(
    () => () => {
      previewsRef.current?.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [],
  );

  const updateField = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "title" && !isSlugEdited ? { slug: createSlug(value) } : {}),
    }));
  };

  const updateSlug = (e) => {
    const slug = createSlug(e.target.value);
    setIsSlugEdited(Boolean(slug));
    setForm((prev) => ({ ...prev, slug }));
  };

  const handleImages = (e) => {
    const selectedFiles = Array.from(e.target.files ?? []);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!selectedFiles.length) return;

    const validFiles = selectedFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    if (!validFiles.length) return;

    const remainingSlots = MAX_IMAGES - images.length;
    if (remainingSlots <= 0) {
      alert(`You can upload a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const filesToAdd = validFiles.slice(0, remainingSlots);
    setImages((prev) => [...prev, ...filesToAdd]);
    setPreviews((prev) => [
      ...prev,
      ...filesToAdd.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const target = prev[index];
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((_, i) => i !== index);
    });
  };

  const resetForm = () => {
    previews.forEach((item) => URL.revokeObjectURL(item.url));
    setForm(initialForm);
    setIsSlugEdited(false);
    setContent("");
    setImages([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!images.length) {
      alert("Please upload at least one case study image.");
      return;
    }

    const data = new FormData();
    data.append("title", form.title.trim());
    data.append("short_description", form.shortDescription.trim());
    data.append("content", content);
    data.append("slug", form.slug.trim());
    data.append("meta_title", form.metaTitle.trim());
    data.append("meta_description", form.metaDescription.trim());
    data.append("og_title", form.ogTitle.trim());
    data.append("og_description", form.ogDescription.trim());
    images.forEach((file) => data.append("images", file));

    setIsSubmitting(true);
    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        alert("Session expired. Please login again.");
        return;
      }

      const res = await axiosInstance.post(create_case_study_url, data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert(getApiMessage(res?.data, "Case study created successfully."));
      resetForm();
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(
        getApiMessage(
          err?.response?.data,
          "Unable to create the case study. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="admin-new-page">
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
          <div>
            <span className="text-muted text-uppercase small fw-semibold">
              Admin workspace
            </span>
            <h1 className="h3 mt-1 mb-1">Create Case Study New</h1>
            <p className="text-muted mb-0">
              Write, format, and publish a new project case study.
            </p>
          </div>
          <Link className="btn btn-outline-secondary" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>

        <QuickLinksNew />

        <form className="card shadow-sm p-4" onSubmit={handleSubmit}>
          <div className="admin-new-form-grid mb-3">
            <div>
              <div className="mb-3">
                <label className="form-label">Case Study Title</label>
                <input
                  type="text"
                  name="title"
                  maxLength="200"
                  placeholder="Enter case study title"
                  className="form-control"
                  value={form.title}
                  onChange={updateField}
                  required
                />
                <small className="text-muted d-block mt-1">
                  {form.title.length}/200 characters ({200 - form.title.length}{" "}
                  remaining)
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Short Description</label>
                <textarea
                  name="shortDescription"
                  placeholder="Write a short summary of the case study"
                  className="form-control"
                  rows="3"
                  value={form.shortDescription}
                  onChange={updateField}
                  required
                />
              </div>

              <div className="mb-0">
                <label className="form-label">Case Study Images</label>
                <div className="admin-new-upload">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="form-control"
                    disabled={images.length >= MAX_IMAGES}
                    onChange={handleImages}
                    ref={fileInputRef}
                  />
                  <small className="text-muted d-block mt-2">
                    Upload up to {MAX_IMAGES} images, with a maximum total size
                    of 2.5 MB ({images.length}/{MAX_IMAGES} selected).
                  </small>
                </div>

                {previews.length > 0 && (
                  <div className="d-flex flex-wrap gap-3 mt-3">
                    {previews.map((item, index) => (
                      <figure key={item.url} className="position-relative m-0">
                        <img
                          alt={item.name}
                          src={item.url}
                          style={{
                            width: 120,
                            height: 90,
                            objectFit: "cover",
                            borderRadius: 6,
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => removeImage(index)}
                        >
                          &times;
                        </button>
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="admin-new-editor mb-0">
              <label className="form-label">Case Study Content</label>
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                placeholder="Write the complete case study content here..."
              />
            </div>
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
                maxLength="255"
                placeholder="example-case-study-title"
                className="form-control"
                value={form.slug}
                onChange={updateSlug}
                required
              />
              <small className="text-muted d-block mt-1">
                {form.slug.length}/255 characters ({255 - form.slug.length}{" "}
                remaining)
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Meta Title</label>
              <input
                type="text"
                name="metaTitle"
                maxLength="255"
                className="form-control"
                value={form.metaTitle}
                onChange={updateField}
                required
              />
              <small className="text-muted d-block mt-1">
                {form.metaTitle.length}/255 characters (
                {255 - form.metaTitle.length} remaining)
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Meta Description</label>
              <textarea
                name="metaDescription"
                rows="3"
                className="form-control"
                value={form.metaDescription}
                onChange={updateField}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Open Graph Title</label>
              <input
                type="text"
                name="ogTitle"
                maxLength="255"
                className="form-control"
                value={form.ogTitle}
                onChange={updateField}
                required
              />
              <small className="text-muted d-block mt-1">
                {form.ogTitle.length}/255 characters (
                {255 - form.ogTitle.length} remaining)
              </small>
            </div>

            <div className="mb-0">
              <label className="form-label">Open Graph Description</label>
              <textarea
                name="ogDescription"
                rows="3"
                className="form-control"
                value={form.ogDescription}
                onChange={updateField}
                required
              />
            </div>
          </fieldset>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Submit Case Study"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default CreateCaseStudyNew;
