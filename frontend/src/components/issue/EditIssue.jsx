import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./Issues.css";
import { API } from "../../config/api";

const EditIcon = () => (
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
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
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

const IssueOpenIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const IssueClosedIcon = () => (
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
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const EditIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "open",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState(null);

  // Load existing issue
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await fetch(API.ISSUE_BY_ID(id));
        if (!res.ok) throw new Error("Issue not found");
        const data = await res.json();
        setForm({
          title: data.title ?? "",
          description: data.description ?? "",
          status: data.status ?? "open",
        });
      } catch (err) {
        setAlert({
          type: "error",
          text: "Could not load issue: " + err.message,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

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

    setSaving(true);
    setAlert(null);
    try {
      const res = await fetch(API.ISSUE_UPDATE(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          status: form.status,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || "Update failed");
      }

      setAlert({ type: "success", text: "Issue updated successfully!" });
      setTimeout(() => navigate(`/issues/${id}`), 1200);
    } catch (err) {
      setAlert({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="issue-form-page">
        <Link to={`/issues/${id}`} className="back-link">
          <BackIcon /> Back to issue
        </Link>

        <h1>
          <EditIcon /> Edit issue
        </h1>
        <p className="issue-form-subtitle">
          Update the title, description, or status of this issue.
        </p>

        {alert && (
          <div
            className={`issue-form-alert ${alert.type}`}
            style={{ marginBottom: 20 }}
          >
            {alert.type === "success" ? "✓" : "⚠"} {alert.text}
          </div>
        )}

        {loading ? (
          <div className="issue-form" style={{ gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: i === 2 ? 120 : 42, borderRadius: 8 }}
              />
            ))}
          </div>
        ) : (
          <form className="issue-form" onSubmit={handleSubmit}>
            {/* Title */}
            <div className="issue-form-field">
              <label htmlFor="title">
                Title <span className="required">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`issue-form-input ${errors.title ? "error" : ""}`}
                placeholder="Issue title..."
                value={form.title}
                onChange={handleChange}
                autoFocus
              />
              {errors.title && (
                <span className="issue-form-error">⚠ {errors.title}</span>
              )}
            </div>

            {/* Description */}
            <div className="issue-form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="issue-form-input issue-form-textarea"
                placeholder="Describe the issue..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Status toggle */}
            <div className="issue-form-field">
              <label>Status</label>
              <div className="status-toggle">
                <button
                  type="button"
                  className={`status-toggle-btn ${form.status !== "closed" ? "selected-open" : ""}`}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, status: "open" }))
                  }
                >
                  <IssueOpenIcon /> Open
                </button>
                <button
                  type="button"
                  className={`status-toggle-btn ${form.status === "closed" ? "selected-closed" : ""}`}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, status: "closed" }))
                  }
                >
                  <IssueClosedIcon /> Closed
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="issue-form-footer">
              <button
                type="submit"
                className="btn-issue-submit"
                disabled={saving || !form.title.trim()}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                className="btn-issue-cancel"
                onClick={() => navigate(`/issues/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default EditIssue;
