import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Issues.css";
import { API } from "../../config/api";

const IssuesTab = ({ repoId }) => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("open");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        // IssuesTab.jsx — fix the fetch URL
        const res = await fetch(API.ISSUE_ALL(repoId));
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        // const all = Array.isArray(data) ? data : [];
        setIssues(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, [repoId]);

  const filtered = issues.filter((i) =>
    filter === "open" ? i.status !== "closed" : i.status === "closed",
  );

  const handleDelete = async (e, issueId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this issue?")) return;
    await fetch(API.ISSUE_DELETE(issueId), {
      method: "DELETE",
    });
    setIssues((prev) => prev.filter((i) => i._id !== issueId));
  };

  return (
    <div
      style={{
        marginTop: 24,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["open", "closed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "6px 14px",
                borderRadius: "var(--radius-sm)",
                border: "1.5px solid",
                borderColor:
                  filter === f
                    ? f === "open"
                      ? "var(--teal)"
                      : "var(--rose-light)"
                    : "var(--border)",
                background:
                  filter === f
                    ? f === "open"
                      ? "rgba(135,182,188,0.12)"
                      : "var(--rose-pale)"
                    : "var(--bg-card)",
                color:
                  filter === f
                    ? f === "open"
                      ? "var(--teal-dark)"
                      : "var(--rose)"
                    : "var(--text-muted)",
                fontWeight: filter === f ? 600 : 400,
                fontSize: 13,
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
              }}
            >
              {
                issues.filter((i) =>
                  f === "open" ? i.status !== "closed" : i.status === "closed",
                ).length
              }{" "}
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <button
          className="btn-primary"
          onClick={() => navigate(`/repo/${repoId}/issues/new`)}
        >
          + New issue
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 64, borderRadius: 10 }}
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            {filter === "open" ? "✅" : "🐛"}
          </div>
          <h3>{filter === "open" ? "No open issues" : "No closed issues"}</h3>
          <p>
            {filter === "open"
              ? "All issues are resolved!"
              : "No issues closed yet."}
          </p>
          {filter === "open" && (
            <button
              className="btn-primary"
              onClick={() => navigate(`/repo/${repoId}/issues/new`)}
            >
              + New issue
            </button>
          )}
        </div>
      ) : (
        <div
          className="issue-list"
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            boxShadow: "var(--shadow-card)",
          }}
        >
          {filtered.map((issue) => (
            <div
              key={issue._id}
              onClick={() => navigate(`/issues/${issue._id}`)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 18px",
                borderBottom: "1px solid var(--border-soft)",
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg-muted)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Status dot */}
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  marginTop: 4,
                  flexShrink: 0,
                  background:
                    issue.status === "closed"
                      ? "var(--rose-light)"
                      : "var(--teal)",
                }}
              />

              {/* Body */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--text-dark)",
                    marginBottom: 4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {issue.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 12,
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-mono)",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      padding: "1px 8px",
                      borderRadius: 99,
                      fontSize: 11,
                      fontWeight: 600,
                      background:
                        issue.status === "closed"
                          ? "var(--rose-pale)"
                          : "rgba(135,182,188,0.15)",
                      color:
                        issue.status === "closed"
                          ? "var(--rose)"
                          : "var(--teal-dark)",
                      border: `1px solid ${
                        issue.status === "closed"
                          ? "rgba(179,86,86,0.3)"
                          : "rgba(135,182,188,0.4)"
                      }`,
                    }}
                  >
                    {issue.status === "closed" ? "Closed" : "Open"}
                  </span>
                  {issue.createdAt && (
                    <span>
                      Opened {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  )}
                  <span>#{issue._id?.slice(-6)}</span>
                </div>
              </div>

              {/* Actions */}
              <div
                style={{ display: "flex", gap: 6, flexShrink: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/issues/${issue._id}/edit`);
                  }}
                  style={{
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-card)",
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleDelete(e, issue._id)}
                  style={{
                    padding: "4px 10px",
                    fontSize: 12,
                    cursor: "pointer",
                    border: "1.5px solid rgba(179,86,86,0.4)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg-card)",
                    color: "var(--rose)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IssuesTab;
