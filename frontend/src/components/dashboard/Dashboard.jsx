import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom"; // ✅ navigate from react-router-dom
import { API } from "../../config/api";

const parseEvent = (str) => {
  const parts = str.split(" - ");
  const name = parts[0] ?? str;
  const dateStr = parts[1] ?? "";
  const [month, day] = dateStr.split(" ");
  return { name, month: month ?? "", day: day ?? "" };
};

const EVENTS = [
  "Tech Conference - Dec 15",
  "Developer Meetup - Dec 25",
  "React Summit - Jan 5",
  "Open Source Day - Jan 12",
];

const Dashboard = () => {
  const navigate = useNavigate(); // ✅ hook not import

  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchRepositories = async () => {
      try {
        const response = await fetch(API.REPO_BY_USER(userId));
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setRepositories(data.repositories ?? []);
      } catch (err) {
        console.error("Error fetching repositories:", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(API.REPO_ALL);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setSuggestedRepositories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching suggested repositories:", err);
      }
    };

    Promise.all([fetchRepositories(), fetchSuggestedRepositories()]).finally(
      () => setLoading(false),
    );
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      setSearchResults(
        repositories.filter(
          (repo) =>
            repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (repo.description ?? "")
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
        ),
      );
    }
  }, [searchQuery, repositories]);

  return (
    <div className="dashboard-page">
      <Navbar />
      <section id="dashboard">
        {/* ── Left aside: Suggested ── */}
        <aside className="aside-suggested">
          <h3 className="section-title">Suggested</h3>

          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="suggested-card" style={{ height: 56 }}>
                <div
                  style={{
                    height: 12,
                    width: "60%",
                    borderRadius: 4,
                    background: "#e0eceb",
                  }}
                />
                <div
                  style={{
                    height: 10,
                    width: "80%",
                    borderRadius: 4,
                    background: "#edf5f3",
                    marginTop: 6,
                  }}
                />
              </div>
            ))
          ) : suggestedRepositories.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Nothing to suggest yet.
            </p>
          ) : (
            suggestedRepositories.slice(0, 8).map((repo) => (
              <div
                key={repo._id}
                className="suggested-card"
                onClick={() => navigate(`/repo/${repo._id}/view`)} // ✅ public view
              >
                <div className="suggested-card-name">📦 {repo.name}</div>
                <div className="suggested-card-desc">
                  {repo.description || "No description"}
                </div>
              </div>
            ))
          )}
        </aside>

        {/* ── Main ── */}
        <main className="main-repos">
          <div className="repos-header">
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Your Repositories
            </h2>
            {!loading && (
              <span className="repos-count">{repositories.length} repos</span>
            )}
          </div>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search repositories..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="repo-card"
                style={{ height: 96, background: "#f0f6f5" }}
              />
            ))
          ) : searchResults.length === 0 ? (
            <div className="empty-repos">
              <div className="empty-repos-icon">
                {searchQuery ? "🔍" : "📭"}
              </div>
              <h3>
                {searchQuery ? "No matches found" : "No repositories yet"}
              </h3>
              <p>
                {searchQuery
                  ? `Nothing matches "${searchQuery}"`
                  : "Create your first repository to get started."}
              </p>
            </div>
          ) : (
            searchResults.map((repo) => (
              <Link
                to={`/repo/${repo._id}`}
                key={repo._id}
                className="repo-card"
              >
                <div className="repo-card-header">
                  <span className="repo-card-name">{repo.name}</span>
                  {/* ✅ visibility is boolean in your model, not isPrivate */}
                  <span
                    className={`repo-visibility ${
                      repo.visibility === false ? "private" : "public"
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
                  <span style={{ marginLeft: "auto" }}>
                    Updated{" "}
                    {repo.updatedAt
                      ? new Date(repo.updatedAt).toLocaleDateString()
                      : "recently"}
                  </span>
                </div>
              </Link>
            ))
          )}
        </main>

        {/* ── Right aside: Events ── */}
        <aside className="aside-events">
          <h3 className="section-title">Upcoming</h3>
          {EVENTS.map((ev, i) => {
            const { name, month, day } = parseEvent(ev);
            return (
              <div key={i} className="event-item">
                <div className="event-date-badge">
                  <span className="event-date-month">{month}</span>
                  <span className="event-date-day">{day}</span>
                </div>
                <div className="event-info">
                  <div className="event-name">{name}</div>
                  <div className="event-type">Community event</div>
                </div>
              </div>
            );
          })}
        </aside>
      </section>
    </div>
  );
};

export default Dashboard;
