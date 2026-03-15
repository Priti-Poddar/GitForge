import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../Navbar";
import "./Explore.css";
import { API } from "../../config/api";

const SORT_OPTIONS = [
  { value: "updated", label: "Recently updated" },
  { value: "stars", label: "Most stars" },
  { value: "forks", label: "Most forks" },
  { value: "name", label: "Name (A–Z)" },
];

const LANG_FILTERS = [
  "All",
  "JavaScript",
  "Python",
  "Java",
  "Go",
  "Rust",
  "TypeScript",
  "C++",
];

const LANG_COLORS = {
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Java: "#b07219",
  Go: "#00ADD8",
  Rust: "#dea584",
  TypeScript: "#3178c6",
  "C++": "#f34b7d",
};

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const Explore = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [input, setInput] = useState(searchParams.get("q") ?? "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState("updated");
  const [lang, setLang] = useState("All");

  const fetchRepos = useCallback(
    async (q) => {
      setLoading(true);
      try {
        const url = q
          ? API.REPO_SEARCH(q, sort, lang)
          : API.REPO_ALL;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setResults(Array.isArray(data) ? data : (data.repositories ?? []));
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [sort, lang],
  );

  useEffect(() => {
    fetchRepos(query);
  }, [fetchRepos, query]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = input.trim();
    setQuery(q);
    setSearchParams(q ? { q } : {});
  };

  return (
    <>
      <Navbar />
      <div className="explore-page">
        {/* ── Hero ── */}
        <div className="explore-hero">
          <div className="explore-hero-eyebrow">✦ discover &amp; explore</div>
          <h1>
            Find your next <span>project</span>
          </h1>
          <p>
            Browse repositories, discover talented developers, and find the
            tools that spark your next big idea.
          </p>

          <form className="explore-search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search repositories, topics, or developers..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus={!!searchParams.get("q")}
            />
            <button type="submit" className="explore-search-btn">
              Search
            </button>
          </form>
        </div>

        {/* ── Filters ── */}
        <div className="explore-filters">
          <label>Language:</label>
          {LANG_FILTERS.map((l) => (
            <button
              key={l}
              className={`filter-chip ${lang === l ? "active" : ""}`}
              onClick={() => setLang(l)}
            >
              {l !== "All" && (
                <span
                  style={{
                    display: "inline-block",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: LANG_COLORS[l] ?? "#ccc",
                    marginRight: 5,
                    verticalAlign: "middle",
                  }}
                />
              )}
              {l}
            </button>
          ))}

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-muted)",
              }}
            >
              Sort:
            </label>
            <select
              className="filter-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Results header ── */}
        <div className="explore-results-header">
          <h2>{query ? `Results for "${query}"` : "All repositories"}</h2>
          <span className="explore-results-count">
            {results.length} repo{results.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div className="explore-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: 170, borderRadius: 14 }}
              />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{query ? "🔍" : "🌱"}</div>
            <h3>{query ? "No repositories found" : "Nothing here yet"}</h3>
            <p>
              {query
                ? `No results match "${query}" — try a different term.`
                : "No public repositories yet. Be the first!"}
            </p>
          </div>
        ) : (
          <div className="explore-grid">
            {results.map((repo) => {
              const ownerName =
                repo.owner?.username ?? repo.userId?.slice(0, 8) ?? "user";
              const initials = ownerName.slice(0, 2).toUpperCase();
              return (
                <div
                  key={repo._id}
                  className="explore-card"
                  onClick={() => navigate(`/repo/${repo._id}`)}
                >
                  <div className="explore-card-header">
                    <div className="explore-card-avatar">{initials}</div>
                    <div className="explore-card-title">
                      <span className="explore-card-owner">{ownerName}</span>
                      <span className="explore-card-name">{repo.name}</span>
                    </div>
                  </div>

                  {repo.description && (
                    <p className="explore-card-desc">{repo.description}</p>
                  )}

                  <div className="explore-card-footer">
                    {repo.language && (
                      <span className="explore-card-lang">
                        <span
                          className="lang-dot"
                          style={{
                            background:
                              LANG_COLORS[repo.language] ??
                              "var(--yellow-dark)",
                          }}
                        />
                        {repo.language}
                      </span>
                    )}
                    <span>⭐ {repo.stars ?? 0}</span>
                    <span>🍴 {repo.forks ?? 0}</span>
                    {repo.updatedAt && (
                      <span style={{ marginLeft: "auto" }}>
                        {new Date(repo.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Explore;
