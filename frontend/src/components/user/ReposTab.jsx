import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../repo/RepoDetails.css";
import { API } from "../../config/api";

const ReposTab = ({ userId }) => {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchRepos = async () => {
      try {
        const res = await fetch(API.REPO_BY_USER(userId));

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        const data = await res.json();
        const list = data.repositories ?? (Array.isArray(data) ? data : []);
        setRepos(list);
      } catch (err) {
        console.error("ReposTab error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [userId]);

  if (loading)
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton"
            style={{ height: 88, borderRadius: 14 }}
          />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="empty-state">
        <div className="empty-state-icon">⚠️</div>
        <h3>Could not load repositories</h3>
        <p>{error}</p>
      </div>
    );

  if (repos.length === 0)
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📭</div>
        <h3>No repositories yet</h3>
        <p>Create your first repository to get started.</p>
        <button className="btn-primary" onClick={() => navigate("/repo/new")}>
          + New repository
        </button>
      </div>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {repos.map((repo) => (
        <div
          key={repo._id}
          className="repo-card"
          onClick={() => navigate(`/repo/${repo._id}`)}
          style={{ cursor: "pointer" }}
        >
          <div className="repo-card-header">
            <span className="repo-card-name">📦 {repo.name}</span>
            <span
              className={`badge ${
                repo.visibility === false ? "badge-red" : "badge-teal"
              }`}
            >
              {repo.visibility === false ? "Private" : "Public"}
            </span>
          </div>
          {repo.description && (
            <p className="repo-card-desc">{repo.description}</p>
          )}
          <div className="repo-card-meta">
            {repo.language && (
              <>
                <span className="repo-meta-dot" />
                <span>{repo.language}</span>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReposTab;
