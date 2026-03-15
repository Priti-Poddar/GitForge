import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./Issues.css";
import { API } from "../../config/api";
/* ── Icons ── */
const IssueOpenIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
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

const IssueClosedIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
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

const SearchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const IssueList = () => {
  const { repoId } = useParams(); // route: /repo/:repoId/issues
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("open"); // "open" | "closed" | "all"
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchIssues();
  }, [repoId]);

  // IssueList.jsx — fix fetchIssues
  const fetchIssues = async () => {
    setLoading(true);
    try {
      const url = repoId
        ? API.ISSUE_ALL(repoId) // scoped to repo
        :API.ISSUE_ALL; // global list
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setIssues(Array.isArray(data) ? data : []); // ← no more .filter()
    } catch (err) {
      console.error(err);
      setIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this issue? This cannot be undone.")) return;
    try {
      const res = await fetch(API.ISSUE_DELETE(id), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setIssues((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const filtered = issues.filter((issue) => {
    const matchStatus =
      filter === "all"
        ? true
        : filter === "open"
          ? issue.status !== "closed"
          : issue.status === "closed";
    // const matchSearch = issue.title
    //   ?.toLowerCase()
    //   .includes(searchQuery.toLowerCase());
    // return matchStatus && matchSearch;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      issue.title?.toLowerCase().includes(q) ||
      issue.description?.toLowerCase().includes(q);

    return matchStatus && matchSearch;
  });

  const openCount = issues.filter((i) => i.status !== "closed").length;
  const closedCount = issues.filter((i) => i.status === "closed").length;

  return (
    <>
      <Navbar />
      <div className="issues-page">
        {/* Header */}
        <div className="issues-page-header">
          <div>
            <h1 className="issues-page-title">
              <IssueOpenIcon size={22} />
              Issues
            </h1>
            <p className="issues-page-subtitle">
              Track bugs, feature requests, and other tasks.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              if (!repoId) {
                alert(
                  "Please navigate to a specific repository to create an issue.",
                );
                return;
              }
              navigate(`/repo/${repoId}/issues/new`);
            }}
          >
            <PlusIcon /> New issue
          </button>
        </div>

        {/* Toolbar */}
        <div className="issues-toolbar">
          <div className="issues-search">
            <span className="issues-search-icon">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => {
                console.log("search:", e.target.value); // ← confirm it fires
                setSearchQuery(e.target.value);
              }}
            />
          </div>

          <div className="status-filter">
            <button
              className={`status-btn ${filter === "open" ? "active-open" : ""}`}
              onClick={() => setFilter("open")}
            >
              <IssueOpenIcon /> {openCount} Open
            </button>
            <button
              className={`status-btn ${filter === "closed" ? "active-closed" : ""}`}
              onClick={() => setFilter("closed")}
            >
              <IssueClosedIcon /> {closedCount} Closed
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="issue-list">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="issue-row" style={{ cursor: "default" }}>
                <div
                  className="skeleton"
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    className="skeleton"
                    style={{ height: 14, width: "60%" }}
                  />
                  <div
                    className="skeleton"
                    style={{ height: 11, width: "35%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{searchQuery ? "🔍" : "✅"}</div>
            <h3>
              {searchQuery
                ? "No matching issues"
                : filter === "closed"
                  ? "No closed issues"
                  : "No open issues"}
            </h3>
            <p>
              {searchQuery
                ? `Nothing matches "${searchQuery}"`
                : filter === "open"
                  ? "Great job! Everything's resolved."
                  : "No issues have been closed yet."}
            </p>
            {!searchQuery && filter === "open" && (
              <button
                className="btn-primary"
                onClick={() =>
                  navigate(
                    repoId ? `/repo/${repoId}/issues/new` : "/issues/new",
                  )
                }
              >
                <PlusIcon /> Open an issue
              </button>
            )}
          </div>
        ) : (
          <div className="issue-list">
            <div className="issue-list-header">
              <span>
                {filtered.length} issue{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
            {filtered.map((issue) => (
              <div
                key={issue._id}
                className="issue-row"
                onClick={() => navigate(`/issues/${issue._id}`)}
              >
                {/* Status icon */}
                <div
                  className={`issue-status-icon ${issue.status === "closed" ? "closed" : "open"}`}
                >
                  {issue.status === "closed" ? (
                    <IssueClosedIcon size={10} />
                  ) : (
                    <IssueOpenIcon size={10} />
                  )}
                </div>

                {/* Body */}
                <div className="issue-row-body">
                  <div className="issue-row-title">{issue.title}</div>
                  <div className="issue-row-meta">
                    <span
                      className={`issue-status-pill ${issue.status === "closed" ? "closed" : "open"}`}
                    >
                      {issue.status === "closed" ? "Closed" : "Open"}
                    </span>
                    {issue.createdAt && (
                      <span>
                        Opened {new Date(issue.createdAt).toLocaleDateString()}
                      </span>
                    )}
                    {issue._id && (
                      <span
                        style={{ fontFamily: "var(--font-mono)", fontSize: 11 }}
                      >
                        #{issue._id.slice(-6)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="issue-row-actions"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="issue-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/issues/${issue._id}/edit`);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="issue-action-btn delete"
                    onClick={(e) => handleDelete(e, issue._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default IssueList;
