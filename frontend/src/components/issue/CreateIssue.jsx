
import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./Issues.css";
import { API } from "../../config/api";

const BugIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M8 2l1.88 1.88M14.12 3.88L16 2" />
    <path d="M9 7.13v-1a3.003 3.003 0 116 0v1" />
    <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 014-4h4a4 4 0 014 4v3c0 3.3-2.7 6-6 6z" />
    <path d="M12 20v-9M6.53 9C4.6 8.8 3 7.1 3 5M6 13H2M3 21c0-3 1.5-6 3-8M20.47 9C22.4 8.8 24 7.1 24 5M18 13h4M21 21c0-3-1.5-6-3-8" />
  </svg>
);

const BackIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

export const CreateIssue = () => {
  const { repoId } = useParams(); // route: /repo/:repoId/issues/new
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", description: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name])
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required.";
    else if (form.title.length < 3)
      errs.title = "Title must be at least 3 characters.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    // ✅ Guard: repoId must exist before submitting
    if (!repoId) {
      setAlert({
        type: "error",
        text: "No repository selected. Please open this page from a repository.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(API.ISSUE_CREATE(repoId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          // repository: repoId,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || data.error || "Failed to create issue");

      setAlert({ type: "success", text: "Issue created successfully!" });
      setTimeout(
        () => navigate(repoId ? `/repo/${repoId}/issues` : "/issues"),
        1200,
      );
    } catch (err) {
      setAlert({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="issue-form-page">
        <Link
          to={repoId ? `/repo/${repoId}/issues` : "/issues"}
          className="back-link"
        >
          <BackIcon /> Back to issues
        </Link>

        <h1>
          <BugIcon /> Open a new issue
        </h1>
        <p className="issue-form-subtitle">
          Describe the bug or feature request clearly so it can be addressed.
        </p>

        {alert && (
          <div
            className={`issue-form-alert ${alert.type}`}
            style={{ marginBottom: 20 }}
          >
            {alert.type === "success" ? "✓" : "⚠"} {alert.text}
          </div>
        )}

        <form className="issue-form" onSubmit={handleSubmit}>
          <div className="issue-form-field">
            <label htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              className={`issue-form-input ${errors.title ? "error" : ""}`}
              placeholder="Short, descriptive title..."
              value={form.title}
              onChange={handleChange}
              autoFocus
            />
            {errors.title && (
              <span className="issue-form-error">⚠ {errors.title}</span>
            )}
          </div>

          <div className="issue-form-field">
            <label htmlFor="description">
              Description{" "}
              <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              className="issue-form-input issue-form-textarea"
              placeholder="Provide steps to reproduce, expected behavior, screenshots, etc."
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="issue-form-footer">
            <button
              type="submit"
              className="btn-issue-submit"
              disabled={loading || !form.title.trim()}
            >
              {loading ? "Submitting..." : "Submit issue"}
            </button>
            <button
              type="button"
              className="btn-issue-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateIssue;
