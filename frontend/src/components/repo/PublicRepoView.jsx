import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./RepoDetails.css";

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
  { icon: "📁", name: "src", msg: "Initial project structure" },
  { icon: "📁", name: "public", msg: "Add public assets" },
  { icon: "📄", name: "README.md", msg: "Add README" },
  { icon: "📄", name: "package.json", msg: "Initial commit" },
  { icon: "📄", name: ".gitignore", msg: "Initial commit" },
];

/* ── Icons ── */
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
    stroke="#5e9199"
    strokeWidth="2.5"
  >
    <polyline points="20 6 9 17 4 12" />
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
  >
    <path d="M19 12H5M12 5l-7 7 7 7" />
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

const PublicRepoView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cloneType, setCloneType] = useState("HTTPS");
  const [copied, setCopied] = useState(false);
  const [issueCount, setIssueCount] = useState(0);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const res = await fetch(`http://localhost:3000/repo/${id}`);
        if (!res.ok) throw new Error("Repo not found");
        const data = await res.json();
        // fetchRepositoryById returns array
        const repoData = Array.isArray(data) ? data[0] : data;
        setRepo(repoData);

        // fetch issue count
        if (repoData) {
          const issueRes = await fetch(`http://localhost:3000/issue/all/${id}`);
          if (issueRes.ok) {
            const issues = await issueRes.json();
            setIssueCount(Array.isArray(issues) ? issues.length : 0);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cloneUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── Loading ── */
  if (loading)
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

  /* ── Not found ── */
  if (!repo)
    return (
      <>
        <Navbar />
        <div className="repo-detail-page">
          <div className="empty-state" style={{ marginTop: 48 }}>
            <div className="empty-state-icon">🔍</div>
            <h3>Repository not found</h3>
            <p>This repo may have been deleted or is private.</p>
            <button className="btn-primary" onClick={() => navigate(-1)}>
              Go back
            </button>
          </div>
        </div>
      </>
    );

  const ownerUsername = repo.owner?.username ?? "user";
  const ownerInitials = ownerUsername.slice(0, 2).toUpperCase();
  const isPrivate = repo.visibility === false;
  const langColor = LANG_COLORS[repo.language] ?? "#d4c94a";
  const cloneUrl = `https://gitforge.dev/${ownerUsername}/${repo.name}.git`;
  const sshUrl = `git@gitforge.dev:${ownerUsername}/${repo.name}.git`;

  return (
    <>
      <Navbar />
      <div className="repo-detail-page">
        {/* ── Back link ── */}
        <button
          onClick={() => navigate(-1)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            fontSize: 13,
            cursor: "pointer",
            padding: "16px 0 0",
            fontFamily: "var(--font-sans)",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--teal-dark)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--text-muted)")
          }
        >
          <BackIcon /> Back
        </button>

        {/* ── Header ── */}
        <div className="repo-header">
          <div className="repo-breadcrumb">
            {/* Owner avatar + name */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "var(--bg-muted)",
                border: "1.5px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "4px 10px 4px 6px",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, var(--teal-light), var(--sage))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  color: "var(--teal-dark)",
                  flexShrink: 0,
                }}
              >
                {ownerInitials}
              </div>
              <span
                style={{
                  fontSize: 14,
                  color: "var(--text-mid)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {ownerUsername}
              </span>
            </div>

            <span className="sep">/</span>
            <span className="repo-name">{repo.name}</span>
            <span
              className={`badge ${isPrivate ? "badge-red" : "badge-teal"}`}
              style={{ marginLeft: 6 }}
            >
              {isPrivate ? "Private" : "Public"}
            </span>
          </div>

          {repo.description && (
            <p className="repo-description">{repo.description}</p>
          )}

          {/* Actions — star, fork, issues */}
          <div className="repo-header-actions">
            <button className="repo-action-btn">
              <StarIcon /> Star
            </button>
            <button className="repo-action-btn">
              <ForkIcon /> Fork
            </button>
            <button
              className="repo-action-btn"
              onClick={() => navigate(`/repo/${id}/issues`)}
            >
              <IssueIcon /> Issues
              {issueCount > 0 && (
                <span
                  style={{
                    background: "rgba(135,182,188,0.15)",
                    color: "var(--teal-dark)",
                    border: "1px solid rgba(135,182,188,0.3)",
                    borderRadius: 99,
                    padding: "1px 7px",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {issueCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="repo-content">
          <div>
            {/* File explorer */}
            <div className="file-explorer">
              <div className="file-explorer-toolbar">
                <div className="branch-selector">
                  <BranchIcon /> main <ChevronIcon />
                </div>
                <div className="file-stats">
                  {repo.content?.length ?? 0} commit
                  {(repo.content?.length ?? 0) !== 1 ? "s" : ""}
                </div>
              </div>

              {/* Latest commit bar */}
              <div className="latest-commit-bar">
                <div className="commit-avatar">{ownerInitials}</div>
                <span className="commit-message">Initial commit</span>
                <span className="commit-hash" style={{ marginLeft: "auto" }}>
                  {(repo._id ?? "").slice(-7)}
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
                <FileIcon /> README.md
              </div>
              <div className="readme-body">
                <h1>{repo.name}</h1>
                <p>{repo.description || "No description provided."}</p>
                <h2>Getting Started</h2>
                <pre>
                  <code>git clone {cloneUrl}</code>
                </pre>
                <p>Install dependencies and run the project to get started.</p>
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

            {/* Owner card */}
            <div className="repo-sidebar-card">
              <h4>Owner</h4>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--teal-light), var(--sage))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontFamily: "var(--font-mono)",
                    fontWeight: 700,
                    color: "var(--teal-dark)",
                    border: "2px solid var(--border)",
                  }}
                >
                  {ownerInitials}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-dark)",
                    }}
                  >
                    {repo.owner?.username ?? ownerUsername}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--text-muted)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    @{ownerUsername}
                  </div>
                </div>
              </div>
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
                    onClick={handleCopy}
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
                      fontFamily: "var(--font-mono)",
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
      </div>
    </>
  );
};

export default PublicRepoView;
