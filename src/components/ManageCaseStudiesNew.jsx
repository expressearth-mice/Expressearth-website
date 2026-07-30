import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import {
  case_study_detail_url,
  case_study_url,
  update_case_study_url,
  delete_case_study_url,
} from "../api/urls";
import QuickLinksNew from "./QuickLinksNew";
import "./AdminNew.css";

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

// New-format case studies return `images` as an array of {id, image, image_url};
// old-format case studies return a single `image` string (or `images` as a string). Normalize both to an array.
const getImageList = (item) => {
  if (!item) return [];
  if (Array.isArray(item.images)) return item.images;
  if (typeof item.images === "string" && item.images.trim()) {
    return [{ id: null, image: item.images }];
  }
  if (typeof item.image === "string" && item.image.trim()) {
    return [{ id: null, image: item.image }];
  }
  return [];
};

function ManageCaseStudiesNew() {
  const { id: caseStudySlug } = useParams();
  const navigate = useNavigate();
  const { getValidAccessToken } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [caseStudies, setCaseStudies] = useState([]);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState(null);
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

  const loadCaseStudies = useCallback(async () => {
    try {
      const res = await axiosInstance.get(case_study_url);
      setCaseStudies(res.data?.results ?? res.data ?? []);
      setPageError("");
    } catch (err) {
      console.error("Error fetching case studies:", err);
      setPageError("Unable to load case studies. Please try again.");
    }
  }, []);

  const loadCaseStudyDetail = useCallback(async () => {
    if (!caseStudySlug) {
      setSelectedCaseStudy(null);
      setIsEditing(false);
      return;
    }

    try {
      const res = await axiosInstance.get(case_study_detail_url(caseStudySlug));
      setSelectedCaseStudy(res.data);
      setPageError("");
    } catch (err) {
      console.error("Error fetching case study:", err);
      setPageError("Unable to load this case study.");
    }
  }, [caseStudySlug]);

  useEffect(() => {
    let active = true;

    const loadPage = async () => {
      setIsLoading(true);
      await Promise.all([loadCaseStudies(), loadCaseStudyDetail()]);
      if (active) setIsLoading(false);
    };

    loadPage();
    return () => {
      active = false;
    };
  }, [loadCaseStudies, loadCaseStudyDetail]);

  const startEditing = () => {
    if (!selectedCaseStudy) return;
    setEditForm({
      title: selectedCaseStudy.title || "",
      shortDescription: selectedCaseStudy.short_description || "",
      slug: selectedCaseStudy.slug || "",
      metaTitle: selectedCaseStudy.meta_title || "",
      metaDescription: selectedCaseStudy.meta_description || "",
      ogTitle: selectedCaseStudy.og_title || "",
      ogDescription: selectedCaseStudy.og_description || "",
    });
    setEditContent(selectedCaseStudy.content || "");
    setExistingImages(getImageList(selectedCaseStudy));
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

  const saveCaseStudy = async (e) => {
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
        alert("Session expired. Please login again.");
        return;
      }

      const res = await axiosInstance.put(
        update_case_study_url(selectedCaseStudy.id),
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert(getApiMessage(res?.data, "Case study updated successfully."));
      setIsEditing(false);
      setReplacementImage(null);

      const updatedSlug = res.data?.slug || editForm.slug;
      await loadCaseStudies();
      if (updatedSlug !== caseStudySlug) {
        navigate(`/case-studies-new/${updatedSlug}`, { replace: true });
      } else {
        await loadCaseStudyDetail();
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      alert(
        getApiMessage(err?.response?.data, "Unable to update the case study."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCaseStudy = async () => {
    const confirmed = window.confirm(
      `Delete the case study "${selectedCaseStudy?.title}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        alert("Session expired. Please login again.");
        return;
      }

      const res = await axiosInstance.delete(
        delete_case_study_url(selectedCaseStudy.id),
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      alert(getApiMessage(res?.data, "Case study deleted successfully."));
      navigate("/case-studies-new", { replace: true });
      await loadCaseStudies();
    } catch (err) {
      console.error(
        "Error deleting case study:",
        err.response?.data || err.message,
      );
      alert(
        getApiMessage(err?.response?.data, "Unable to delete this case study."),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const renderCard = (caseStudy) => {
    const caseStudyImages = getImageList(caseStudy);
    return (
      <Link
        className="admin-new-card"
        key={caseStudy.id}
        to={`/case-studies-new/${encodeURIComponent(caseStudy.slug)}`}
      >
        <div className="admin-new-card__image">
          {caseStudyImages[0]?.image ? (
            <img alt={caseStudy.title} src={caseStudyImages[0].image} />
          ) : (
            <span className="text-muted">No image</span>
          )}
        </div>
        <div className="admin-new-card__body">
          <h2 className="h6 mb-1">{caseStudy.title}</h2>
          <p className="text-muted small mb-2">
            {caseStudy.short_description || "No short description available."}
          </p>
          <span className="text-success small fw-semibold">
            View full case study
          </span>
        </div>
      </Link>
    );
  };

  return (
    <main className="admin-new-page">
      <div className="container-fluid px-4">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
          <div>
            <span className="text-muted text-uppercase small fw-semibold">
              Admin workspace
            </span>
            <h1 className="h3 mt-1 mb-1">
              {caseStudySlug ? "Case Study Details" : "Manage Case Studies New"}
            </h1>
            <p className="text-muted mb-0">
              {caseStudySlug ? "Review, edit, or delete this case study." : ""}
            </p>
          </div>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary" to="/dashboard">
              Dashboard
            </Link>
            <Link className="btn btn-success" to="/create-case-studies-new">
              Create Case Study
            </Link>
          </div>
        </div>

        <QuickLinksNew />

        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
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
          !caseStudySlug &&
          (caseStudies.length ? (
            <section className="admin-new-grid" aria-label="All case studies">
              {caseStudies.map(renderCard)}
            </section>
          ) : (
            <div className="text-center py-5">
              <h2 className="h5">No case studies found</h2>
              <p className="text-muted">
                Published case studies returned by the API will appear here.
              </p>
              <Link className="btn btn-success" to="/create-case-studies-new">
                Create the first case study
              </Link>
            </div>
          ))}

        {!isLoading && !pageError && caseStudySlug && selectedCaseStudy && (
          <div className="row g-4">
            <div className="col-lg-9">
              <Link className="d-inline-block mb-3" to="/case-studies-new">
                &larr; Back to all case studies
              </Link>

              {!isEditing ? (
                <>
                  <div className="d-flex gap-2 mb-3">
                    <button
                      className="btn btn-success"
                      onClick={startEditing}
                      type="button"
                    >
                      Edit Case Study
                    </button>
                    <button
                      className="btn btn-danger"
                      disabled={isDeleting}
                      onClick={deleteCaseStudy}
                      type="button"
                    >
                      {isDeleting ? "Deleting..." : "Delete Case Study"}
                    </button>
                  </div>
                  {getImageList(selectedCaseStudy)[0]?.image && (
                    <img
                      alt={selectedCaseStudy.title}
                      className="admin-new-detail__hero"
                      src={getImageList(selectedCaseStudy)[0].image}
                    />
                  )}
                  <h2 className="h3">{selectedCaseStudy.title}</h2>
                  <p className="text-muted">
                    {selectedCaseStudy.short_description}
                  </p>
                  <div
                    className="admin-new-detail__content"
                    dangerouslySetInnerHTML={{
                      __html: selectedCaseStudy.content || "",
                    }}
                  />
                  {getImageList(selectedCaseStudy).length > 0 && (
                    <div className="mt-4">
                      <h3 className="h6">Case Study Images</h3>
                      <div className="d-flex flex-wrap gap-2">
                        {getImageList(selectedCaseStudy).map((img, index) => (
                          <img
                            key={img.id || index}
                            alt={`${selectedCaseStudy.title} ${index + 1}`}
                            src={img.image}
                            style={{
                              width: 240,
                              height: 125,
                              objectFit: "contain",
                              background: "#f1f1f1",
                              borderRadius: 6,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <form className="card shadow-sm p-4" onSubmit={saveCaseStudy}>
                  <h2 className="h5 mb-3">Edit Case Study</h2>

                  <div className="mb-3">
                    <label className="form-label">Case Study Title</label>
                    <input
                      type="text"
                      name="title"
                      maxLength="200"
                      className="form-control"
                      value={editForm.title}
                      onChange={updateField}
                      required
                    />
                    <small className="text-muted d-block mt-1">
                      {editForm.title.length}/200 characters (
                      {200 - editForm.title.length} remaining)
                    </small>
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
                              alt={`Case study ${index + 1}`}
                              src={img.image}
                              style={{
                                width: 240,
                                height: 125,
                                objectFit: "contain",
                                background: "#f1f1f1",
                                borderRadius: 6,
                              }}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-danger position-absolute top-0 end-0"
                              onClick={() => deleteExistingImage(img.id, index)}
                            >
                              &times;
                            </button>
                          </figure>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-3 admin-new-editor">
                    <label className="form-label">Case Study Content</label>
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
                        maxLength="255"
                        className="form-control"
                        value={editForm.slug}
                        onChange={updateSlug}
                        required
                      />
                      <small className="text-muted d-block mt-1">
                        {editForm.slug.length}/255 characters (
                        {255 - editForm.slug.length} remaining)
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Title</label>
                      <input
                        type="text"
                        name="metaTitle"
                        maxLength="255"
                        className="form-control"
                        value={editForm.metaTitle}
                        onChange={updateField}
                        required
                      />
                      <small className="text-muted d-block mt-1">
                        {editForm.metaTitle.length}/255 characters (
                        {255 - editForm.metaTitle.length} remaining)
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Meta Description</label>
                      <textarea
                        name="metaDescription"
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
                        maxLength="255"
                        className="form-control"
                        value={editForm.ogTitle}
                        onChange={updateField}
                        required
                      />
                      <small className="text-muted d-block mt-1">
                        {editForm.ogTitle.length}/255 characters (
                        {255 - editForm.ogTitle.length} remaining)
                      </small>
                    </div>

                    <div className="mb-0">
                      <label className="form-label">
                        Open Graph Description
                      </label>
                      <textarea
                        name="ogDescription"
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
                      className="btn btn-success"
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
              <h2 className="h6 mb-3">Other Case Studies</h2>
              <div className="d-flex flex-column gap-3">
                {caseStudies
                  .filter(
                    (cs) => String(cs.id) !== String(selectedCaseStudy.id),
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

export default ManageCaseStudiesNew;
