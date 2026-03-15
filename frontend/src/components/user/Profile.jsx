import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import ReposTab from "./ReposTab";
import { useAuth } from "../../authContext";
import {API} from "../../config/api";


/* ── Icons ── */
const OverviewIcon = () => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);
const RepoIcon = () => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);
const LocationIcon = () => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const LinkIcon = () => (
  <svg
    viewBox="0 0 24 24"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
  </svg>
);
const LogoutIcon = () => (
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
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const SettingsIcon = () => (
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
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const TABS = ["Overview", "Repositories"];

const Profile = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();

  const [userDetails, setUserDetails] = useState({ username: "username" });
  const [activeTab, setActiveTab] = useState("Overview");
  const [repoCount, setRepoCount] = useState(0);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    // Read userId inside effect — always reliable
    const storedId = localStorage.getItem("userId");

    if (!storedId) {
      navigate("/auth");
      return;
    }

    setUserId(storedId);

    const fetchData = async () => {
      try {
        // Fetch user profile
        const res = await axios.get(
          API.USER_PROFILE(storedId),
        );
        setUserDetails(res.data);

        // Fetch repo count
        const repoRes = await fetch(
          API.REPO_BY_USER(storedId),
        );
        if (repoRes.ok) {
          const repoData = await repoRes.json();
          const repos =
            repoData.repositories ?? (Array.isArray(repoData) ? repoData : []);
          setRepoCount(repos.length);
        }
      } catch (err) {
        console.error("Cannot fetch user details:", err);
      }
    };

    fetchData();
  }, []); // run once on mount

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };

  const initials = userDetails.username?.slice(0, 2).toUpperCase() ?? "GF";
  const isOwnProfile = userDetails._id?.toString() === userId;

  return (
    <div className="profile-page">
      <Navbar />

      {/* ── Tab nav ── */}
      <div className="profile-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`profile-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "Overview" ? <OverviewIcon /> : <RepoIcon />}
            {tab}
            {tab === "Repositories" && (
              <span className="tab-count">{repoCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Body ── */}
      <div className="profile-page-wrapper">
        {/* ── Sidebar ── */}
        <aside className="user-profile-section">
          <div className="profile-avatar-wrap">
            <div className="profile-image">
              {userDetails.avatar ? (
                <img src={userDetails.avatar} alt={userDetails.username} />
              ) : (
                initials
              )}
            </div>
            <span className="profile-status-dot" title="Online" />
          </div>

          <div className="name">
            <h3>{userDetails.name || userDetails.username}</h3>
          </div>
          <p className="profile-handle">@{userDetails.username}</p>

          {/* Edit profile / Settings button */}
          {isOwnProfile && (
            <button
              className="follow-btn"
              onClick={() => navigate("/settings")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                background: "var(--bg-muted)",
                color: "var(--text-dark)",
                border: "1.5px solid var(--border)",
                boxShadow: "none",
              }}
            >
              <SettingsIcon /> Edit profile
            </button>
          )}

          {/* Stats */}
          <div className="follower">
            <div className="follower-stat">
              <span className="follower-count">
                {userDetails.followers?.length ?? 0}
              </span>
              <span className="follower-label">Followers</span>
            </div>
            <div className="follower-stat">
              <span className="follower-count">
                {userDetails.followedUsers?.length ?? 0}
              </span>
              <span className="follower-label">Following</span>
            </div>
          </div>

          {/* Meta */}
          <div className="profile-meta">
            {userDetails.location && (
              <span className="profile-meta-item">
                <LocationIcon />
                {userDetails.location}
              </span>
            )}
            {userDetails.website && (
              <span className="profile-meta-item">
                <LinkIcon />
                <a
                  href={userDetails.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--teal-dark)" }}
                >
                  {userDetails.website.replace(/^https?:\/\//, "")}
                </a>
              </span>
            )}
          </div>

          {/* Account Settings link */}
          {isOwnProfile && (
            <button
              onClick={() => navigate("/settings")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 7,
                width: "100%",
                padding: "8px",
                marginTop: 4,
                background: "transparent",
                color: "var(--text-muted)",
                border: "1.5px dashed var(--border)",
                borderRadius: "var(--radius-sm)",
                fontSize: 13,
                cursor: "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-sans)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--teal)";
                e.currentTarget.style.color = "var(--teal-dark)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
            >
              <SettingsIcon /> Account Settings
            </button>
          )}
        </aside>

        {/* ── Main ── */}
        <div className="heat-map-section">
          {activeTab === "Overview" && (
            <>
              <div>
                <p className="contribution-label">
                  <strong>247 contributions</strong> in the last year
                </p>
                <div className="heatmap-card">
                  <HeatMapProfile />
                </div>
              </div>

              {/* Pinned repos */}
              {userDetails.repositories?.length > 0 && (
                <div>
                  <h3 className="pinned-header">Pinned repositories</h3>
                  <div className="pinned-grid">
                    {userDetails.repositories.slice(0, 4).map((repo) => {
                      if (!repo || typeof repo === "string" || !repo.name)
                        return null;
                      return (
                        <div
                          key={repo._id}
                          className="pinned-card"
                          onClick={() => navigate(`/repo/${repo._id}`)}
                        >
                          <span className="pinned-card-name">
                            📦 {repo.name}
                          </span>
                          {repo.description && (
                            <p className="pinned-card-desc">
                              {repo.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "Repositories" && <ReposTab userId={userId} />}
        </div>
      </div>

      {/* ── Logout FAB ── */}
      <button id="logout" onClick={handleLogout}>
        <LogoutIcon /> Sign out
      </button>
    </div>
  );
};

export default Profile;
