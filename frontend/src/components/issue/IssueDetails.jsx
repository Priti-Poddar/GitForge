import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./Issues.css";
import { API } from "../../config/api";

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

const EditIcon = () => (
  <svg
    width="13"
    height="13"
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

const TrashIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await fetch(API.ISSUE_BY_ID(id));
        if (!res.ok) throw new Error("Not found");
        setIssue(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssue();
  }, [id]);

  const handleToggleStatus = async () => {
    setClosing(true);
    const newStatus = issue.status === "closed" ? "open" : "closed";
    try {
      const res = await fetch(API.ISSUE_UPDATE(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: issue.title,
          description: issue.description,
          status: newStatus,
        }),
      });
      if (!res.ok) throw new Error("Update failed");
      setIssue((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    } finally {
      setClosing(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(`Delete issue "${issue?.title}"? This cannot be undone.`)
    )
      return;
    try {
      const res = await fetch(API.ISSUE_DELETE(id), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      navigate(-1);
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="issue-detail-page">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 14,
              paddingTop: 32,
            }}
          >
            {[50, 75, 40, 90, 60].map((w, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 16, width: `${w}%`, borderRadius: 6 }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ── Not found ── */
  if (!issue) {
    return (
      <>
        <Navbar />
        <div className="issue-detail-page">
          <div className="empty-state" style={{ marginTop: 40 }}>
            <div className="empty-state-icon">🔍</div>
            <h3>Issue not found</h3>
            <p>This issue may have been deleted.</p>
            <button className="btn-primary" onClick={() => navigate(-1)}>
              Go back
            </button>
          </div>
        </div>
      </>
    );
  }

  const isClosed = issue.status === "closed";

  return (
    <>
      <Navbar />
      <div className="issue-detail-page">
        {/* Back */}
        <Link to={`/repo/${issue.repository}`} className="back-link">
          <BackIcon /> Back to issues
        </Link>

        {/* Header */}
        <div className="issue-detail-header">
          <div className="issue-detail-number">
            Issue #{issue._id?.slice(-6)}
          </div>
          <h1 className="issue-detail-title">{issue.title}</h1>
          <div className="issue-detail-meta">
            <span
              className={`issue-status-pill ${isClosed ? "closed" : "open"}`}
            >
              {isClosed ? <IssueClosedIcon /> : <IssueOpenIcon />}
              {isClosed ? "Closed" : "Open"}
            </span>
            {issue.createdAt && (
              <span>
                Opened on{" "}
                {new Date(issue.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {issue.updatedAt && issue.updatedAt !== issue.createdAt && (
              <span>
                · Updated {new Date(issue.updatedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Body grid */}
        <div className="issue-detail-body-grid">
          {/* Description card */}
          <div className="issue-body-card">
            <div className="issue-body-card-header">
              <span>Description</span>
              <button
                className="issue-action-btn"
                style={{ opacity: 1 }}
                onClick={() => navigate(`/issues/${id}/edit`)}
              >
                <EditIcon /> Edit
              </button>
            </div>
            {issue.description ? (
              <div className="issue-body-content">{issue.description}</div>
            ) : (
              <div className="issue-body-empty">No description provided.</div>
            )}
          </div>

          {/* Sidebar */}
          <div className="issue-sidebar-card">
            {/* Status */}
            <div className="issue-sidebar-section">
              <div className="issue-sidebar-label">Status</div>
              <span
                className={`issue-status-pill ${isClosed ? "closed" : "open"}`}
                style={{ fontSize: 13, padding: "4px 12px" }}
              >
                {isClosed ? <IssueClosedIcon /> : <IssueOpenIcon />}
                {isClosed ? "Closed" : "Open"}
              </span>
            </div>

            {/* Actions */}
            <div className="issue-sidebar-section">
              <div className="issue-sidebar-label">Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button
                  className="issue-action-btn"
                  style={{
                    opacity: 1,
                    padding: "8px 12px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "center",
                  }}
                  onClick={handleToggleStatus}
                  disabled={closing}
                >
                  {isClosed ? <IssueOpenIcon /> : <IssueClosedIcon />}
                  {closing
                    ? "Updating..."
                    : isClosed
                      ? "Reopen issue"
                      : "Close issue"}
                </button>

                <button
                  className="issue-action-btn"
                  style={{
                    opacity: 1,
                    padding: "8px 12px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "center",
                  }}
                  onClick={() => navigate(`/issues/${id}/edit`)}
                >
                  <EditIcon /> Edit issue
                </button>

                <button
                  className="issue-action-btn delete"
                  style={{
                    opacity: 1,
                    padding: "8px 12px",
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    justifyContent: "center",
                  }}
                  onClick={handleDelete}
                >
                  <TrashIcon /> Delete issue
                </button>
              </div>
            </div>

            {/* Dates */}
            <div className="issue-sidebar-section">
              <div className="issue-sidebar-label">Timeline</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {issue.createdAt && (
                  <span>
                    Created: {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                )}
                {issue.updatedAt && (
                  <span>
                    Updated: {new Date(issue.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default IssueDetail;
