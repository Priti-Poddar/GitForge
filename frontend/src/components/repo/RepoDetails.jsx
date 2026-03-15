import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./RepoDetails.css";
import IssuesTab from "../issue/IssuesTab";
import { API } from "../../config/api";

const TABS = ["Code", "Issues", "Settings"];

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  TypeScript: "#3178c6",
  "C++": "#f34b7d",
};

const MOCK_FILES = [
  {
    icon: "📁",
    name: "src",
    msg: "Initial project structure",
    time: "3 days ago",
  },
  { icon: "📁", name: "public", msg: "Add public assets", time: "3 days ago" },
  { icon: "📄", name: "README.md", msg: "Add README", time: "3 days ago" },
  {
    icon: "📄",
    name: "package.json",
    msg: "Initial commit",
    time: "3 days ago",
  },
  { icon: "📄", name: ".gitignore", msg: "Initial commit", time: "3 days ago" },
];

/* ── icon components ── */
const CodeIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);
const IssueIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
const SettingsIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const BranchIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <line x1="6" y1="3" x2="6" y2="15" />
    <circle cx="18" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <path d="M18 9a9 9 0 01-9 9" />
  </svg>
);
const ChevronIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);
const StarIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const ForkIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="18" cy="18" r="3" />
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="6" y1="9" x2="6" y2="15" />
    <line x1="9" y1="6" x2="15" y2="6" />
  </svg>
);
const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const FileIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
);
const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#3dbe60"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Code");
  const [cloneType, setCloneType] = useState("HTTPS");
  const [copied, setCopied] = useState(false);

  const userId = localStorage.getItem("userId");
  const [issueCount, setIssueCount] = useState(0);

  useEffect(() => {
    if (!id) return;
    fetch(API.ISSUE_ALL(id))
      .then((r) => r.json())
      .then((data) => setIssueCount(Array.isArray(data) ? data.length : 0))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await fetch(API.REPO_BY_ID(id));
        if (!res.ok) throw new Error("Repo not found");
        const data = await res.json();
        // fetchRepositoryById returns an array via .find() — grab first element
        setRepo(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  const handleCopyClone = () => {
    navigator.clipboard.writeText(cloneUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${repo?.name}"? This cannot be undone.`))
      return;
    try {
      const res = await fetch(API.REPO_DELETE(id), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      navigate("/");
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleToggle = async () => {
    try {
      const res = await fetch(API.REPO_TOGGLE(id), {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Toggle failed");
      // Refresh repo data to reflect updated visibility
      const updatedRes = await fetch(API.REPO_BY_ID(id));
      if (!updatedRes.ok) throw new Error("Failed to refresh repo data");
      const updatedData = await updatedRes.json();
      setRepo(Array.isArray(updatedData) ? updatedData[0] : updatedData);
    } catch (err) {
      alert("Failed to change visibility: " + err.message);
    }
  }

  const handleUpdate = async () => {
    try {
      const res = await fetch(API.REPO_UPDATE(id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: repo.name }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Update failed");
        return;
      }

      const data = await res.json();
      setRepo((prev) => ({ ...prev, name: data.repository.name }));
      alert("Repository renamed successfully");
    } catch (err) {
      alert("Update failed: " + err.message);
    }
  };


  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="repo-detail-page">
          <div
            style={{
              padding: "48px 0",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[60, 40, 80, 55].map((w, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 18, borderRadius: 6, width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ── Not found ── */
  if (!repo) {
    return (
      <>
        <Navbar />
        <div className="repo-detail-page">
          <div className="empty-state" style={{ marginTop: 48 }}>
            <div className="empty-state-icon">🔍</div>
            <h3>Repository not found</h3>
            <p>This repo may have been deleted or you don't have access.</p>
            <button className="btn-primary" onClick={() => navigate("/")}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  // owner is a populated object: { _id, username, ... }
  const ownerUsername = repo.owner?.username ?? "user";
  const ownerId =
    repo.owner?._id?.toString?.() ?? repo.owner?.toString?.() ?? "";
  const isOwner = ownerId === userId;
  // controller uses boolean visibility: true=public, false=private
  const isPrivate = repo.visibility === false;
  const cloneUrl = `https://gitforge.dev/${ownerUsername}/${repo.name}.git`;
  const sshUrl = `git@gitforge.dev:${ownerUsername}/${repo.name}.git`;
  const ownerInitials = ownerUsername.slice(0, 2).toUpperCase();
  const langColor = LANG_COLORS[repo.language] ?? "#d4c94a";

  return (
    <>
      <Navbar />
      <div className="repo-detail-page">
        {/* ── Header ── */}
        <div className="repo-header">
          <div className="repo-breadcrumb">
            <Link to="/profile">{ownerUsername}</Link>
            <span className="sep">/</span>
            <span className="repo-name">{repo.name}</span>
            <span
              className={`badge ${isPrivate ? "badge-red" : "badge-green"}`}
              style={{ marginLeft: 6 }}
            >
              {isPrivate ? "Private" : "Public"}
            </span>
          </div>

          {repo.description && (
            <p className="repo-description">{repo.description}</p>
          )}

          <div className="repo-header-actions">
            <button className="repo-action-btn">
              <StarIcon />
              Star
            </button>
            <button className="repo-action-btn">
              <ForkIcon />
              Fork
            </button>
            {isOwner && (
              <button className="repo-action-btn danger" onClick={handleDelete}>
                <TrashIcon /> Delete
              </button>
            )}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="repo-tabs">
          {TABS.map((tab) =>
            !isOwner && tab === "Settings" ? null : (
              <button
                key={tab}
                className={`repo-tab ${activeTab === tab ? "active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "Code" && <CodeIcon />}
                {tab === "Issues" && <IssueIcon />}
                {tab === "Settings" && <SettingsIcon />}
                {tab}
              </button>
            ),
          )}
        </div>

        {/* ══ CODE TAB ══ */}
        {activeTab === "Code" && (
          <div className="repo-content">
            <div>
              {/* File explorer */}
              <div className="file-explorer">
                <div className="file-explorer-toolbar">
                  <div className="branch-selector">
                    <BranchIcon />
                    main
                    <ChevronIcon />
                  </div>
                  <div className="file-stats">
                    {repo.content?.length ?? 0} commit
                    {(repo.content?.length ?? 0) !== 1 ? "s" : ""}
                  </div>
                </div>

                {/* Latest commit */}
                <div className="latest-commit-bar">
                  <div className="commit-avatar">{ownerInitials}</div>
                  <span className="commit-message">Initial commit</span>
                  <span className="commit-hash" style={{ marginLeft: "auto" }}>
                    {(repo._id ?? "abc1234").slice(-7)}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-muted)",
                      marginLeft: 8,
                    }}
                  >
                    {repo.createdAt
                      ? new Date(repo.createdAt).toLocaleDateString()
                      : "recently"}
                  </span>
                </div>

                {/* Files */}
                {MOCK_FILES.map((file) => (
                  <div key={file.name} className="file-row">
                    <span className="file-row-icon">{file.icon}</span>
                    <span className="file-row-name">{file.name}</span>
                    <span className="file-row-msg">{file.msg}</span>
                  </div>
                ))}
              </div>

              {/* README */}
              <div className="readme-card">
                <div className="readme-header">
                  <FileIcon />
                  README.md
                </div>
                <div className="readme-body">
                  <h1>{repo.name}</h1>
                  <p>{repo.description || "No description provided."}</p>
                  <h2>Getting Started</h2>
                  <pre>
                    <code>git clone {cloneUrl}</code>
                  </pre>
                  <p>
                    Install dependencies and run the project to get started.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Sidebar ── */}
            <aside className="repo-sidebar">
              {/* About */}
              <div className="repo-sidebar-card">
                <h4>About</h4>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--text-mid)",
                    marginBottom: 12,
                    lineHeight: 1.6,
                  }}
                >
                  {repo.description || "No description provided."}
                </p>
                {repo.topics?.length > 0 && (
                  <div style={{ marginBottom: 12 }}>
                    {repo.topics.map((t) => (
                      <span key={t} className="topic-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                {[
                  { label: "🐛 Issues", val: issueCount },
                  {
                    label: "👁 Visibility",
                    val: isPrivate ? "Private" : "Public",
                  },
                ].map((s) => (
                  <div key={s.label} className="stat-row">
                    <span>{s.label}</span>
                    <span className="stat-row-val">{s.val}</span>
                  </div>
                ))}
              </div>

              {/* Clone */}
              <div className="repo-sidebar-card">
                <h4>Clone</h4>
                <div className="clone-section">
                  <div className="clone-tabs">
                    {["HTTPS", "SSH"].map((t) => (
                      <button
                        key={t}
                        className={`clone-tab ${cloneType === t ? "active" : ""}`}
                        onClick={() => setCloneType(t)}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="clone-url-box">
                    <input
                      className="clone-url-input"
                      readOnly
                      value={cloneType === "HTTPS" ? cloneUrl : sshUrl}
                    />
                    <button
                      className="clone-copy-btn"
                      onClick={handleCopyClone}
                      title={copied ? "Copied!" : "Copy URL"}
                    >
                      {copied ? <CheckIcon /> : <CopyIcon />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Language */}
              {repo.language && (
                <div className="repo-sidebar-card">
                  <h4>Language</h4>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--text-mid)",
                    }}
                  >
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: langColor,
                        flexShrink: 0,
                        boxShadow: `0 0 6px ${langColor}66`,
                      }}
                    />
                    {repo.language}
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        color: "var(--text-muted)",
                      }}
                    >
                      100%
                    </span>
                  </div>
                  <div
                    className="lang-bar"
                    style={{
                      background: `linear-gradient(90deg, ${langColor}, ${langColor}99)`,
                    }}
                  />
                </div>
              )}
            </aside>
          </div>
        )}

        {/* ══ ISSUES TAB ══ */}
        {activeTab === "Issues" && <IssuesTab repoId={id} />}

        {/* ══ SETTINGS TAB ══ */}
        {activeTab === "Settings" && isOwner && (
          <div
            style={{
              maxWidth: 640,
              marginTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 20,
            }}
          >
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Repository name</h2>
                <p>
                  Rename this repository. All existing links will redirect
                  automatically.
                </p>
              </div>
              <div className="settings-section-body">
                <div className="settings-field">
                  <label>New name</label>
                  <input
                    className="form-input form-input-mono"
                    defaultValue={repo.name}
                  />
                </div>
              </div>
              <div className="settings-section-footer">
                <button className="btn-primary" onClick={handleUpdate}>
                  Rename
                </button>
              </div>
            </div>

            <div className="settings-section danger-zone">
              <div className="settings-section-header">
                <h2>Danger Zone</h2>
              </div>
              <div className="settings-section-body">
                <div className="danger-item">
                  <div className="danger-item-text">
                    <h3>Change visibility</h3>
                    <p>Currently {isPrivate ? "private" : "public"}.</p>
                  </div>
                  <button className="btn-danger" onClick={handleToggle}>
                    Change visibility
                  </button>
                </div>
                <div className="danger-item">
                  <div className="danger-item-text">
                    <h3>Delete this repository</h3>
                    <p>Once deleted, there is no going back.</p>
                  </div>
                  <button className="btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RepoDetail;
