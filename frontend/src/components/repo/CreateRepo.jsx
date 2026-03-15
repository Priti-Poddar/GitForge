import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./CreateRepo.css";
import { API } from "../../config/api";

const LICENSES = [
  "None",
  "MIT",
  "Apache 2.0",
  "GPL v3",
  "BSD 2-Clause",
  "BSD 3-Clause",
  "LGPL v2.1",
  "Mozilla 2.0",
  "Unlicense",
];
const GITIGNORES = [
  "None",
  "Node",
  "Python",
  "Java",
  "Go",
  "Rust",
  "C++",
  "React",
  "Vue",
  "Django",
];
const SUGGESTIONS = [
  "stellar-forge",
  "code-nexus",
  "pixel-lab",
  "dev-vault",
  "orbit-kit",
  "minted-api",
];

const FolderIcon = () => (
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
    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
  </svg>
);

const CreateRepo = () => {
  const navigate = useNavigate();

  // Pick a random suggestion once on mount
  const suggestion = useMemo(
    () => SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)],
    [],
  );

  const [form, setForm] = useState({
    name: "",
    description: "",
    visibility: "public", // "public" | "private"
    initReadme: false,
    gitignore: "None",
    license: "None",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Auto-slugify name
  const handleNameChange = (e) => {
    const slugged = e.target.value
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");
    setForm((prev) => ({ ...prev, name: slugged }));
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Repository name is required.";
    else if (form.name.length < 2)
      errs.name = "Name must be at least 2 characters.";
    else if (!/^[a-zA-Z0-9._-]+$/.test(form.name))
      errs.name =
        "Only letters, numbers, hyphens, dots, and underscores allowed.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(API.REPO_CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // ✅ matches createRepository controller fields:
          name: form.name,
          description: form.description,
          // controller uses boolean `visibility`: true = public
          visibility: form.visibility === "public",
          owner: userId, // controller expects `owner` (not userId)
          // optional extras — backend ignores unknown fields gracefully
          content: [],
          issues: [],
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.message || data.error || "Failed to create repository",
        );

      // controller returns { message, repositoryID }
      const newId = data.repositoryID ?? data._id ?? data.id ?? "";
      navigate(`/repo/${newId}`);
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-page">
        <h1>
          <FolderIcon />
          Create a new repository
        </h1>
        <p className="create-repo-subtitle">
          A repository contains all project files, including the revision
          history.
        </p>

        {/* Submit error */}
        {errors.submit && (
          <div className="form-submit-error">
            <span>⚠</span> {errors.submit}
          </div>
        )}

        <form className="create-repo-form" onSubmit={handleSubmit}>
          {/* ── Section 1: Name + Description ── */}
          <div className="form-section">
            <p className="form-section-title">Repository details</p>

            <div className="form-field">
              <label htmlFor="name">
                Repository name <span className="required">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className={`form-input form-input-mono ${errors.name ? "error" : ""}`}
                placeholder="my-awesome-project"
                value={form.name}
                onChange={handleNameChange}
                autoFocus
                autoComplete="off"
              />
              {errors.name ? (
                <span className="form-error-msg">⚠ {errors.name}</span>
              ) : (
                <span className="hint">
                  Short and memorable works best. Need inspiration? How about{" "}
                  <strong>{suggestion}</strong>?
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="description">
                Description <span className="optional">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                className="form-input form-textarea"
                placeholder="A short description of your project..."
                value={form.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* ── Section 2: Visibility ── */}
          <div className="form-section">
            <p className="form-section-title">Visibility</p>

            <div className="form-field">
              <div className="visibility-options">
                {[
                  {
                    value: "public",
                    icon: "🌐",
                    label: "Public",
                    desc: "Anyone on the internet can see this repository. You choose who can commit.",
                  },
                  {
                    value: "private",
                    icon: "🔒",
                    label: "Private",
                    desc: "You choose who can see and commit to this repository.",
                  },
                ].map((opt) => (
                  <label
                    key={opt.value}
                    className={`visibility-card ${form.visibility === opt.value ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value={opt.value}
                      checked={form.visibility === opt.value}
                      onChange={handleChange}
                    />
                    <span className="visibility-card-icon">{opt.icon}</span>
                    <div>
                      <div className="visibility-card-label">{opt.label}</div>
                      <div className="visibility-card-desc">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Section 3: Initialize ── */}
          <div className="form-section">
            <p className="form-section-title">Initialize</p>

            <div className="form-field">
              <div className="init-options">
                <label className="init-option">
                  <input
                    type="checkbox"
                    name="initReadme"
                    checked={form.initReadme}
                    onChange={handleChange}
                  />
                  <div className="init-option-text">
                    <span className="init-option-label">
                      📄 Add a README file
                    </span>
                    <span className="init-option-desc">
                      This is where you can write a long description for your
                      project.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="gitignore">.gitignore template</label>
                <select
                  id="gitignore"
                  name="gitignore"
                  className="form-input"
                  value={form.gitignore}
                  onChange={handleChange}
                >
                  {GITIGNORES.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="license">License</label>
                <select
                  id="license"
                  name="license"
                  className="form-input"
                  value={form.license}
                  onChange={handleChange}
                >
                  {LICENSES.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="form-submit-area">
            <button
              type="submit"
              className="btn-create"
              disabled={loading || !form.name.trim()}
            >
              {loading ? (
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    style={{ animation: "spin 0.8s linear infinite" }}
                  >
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  </svg>
                  Creating...
                </>
              ) : (
                "Create repository"
              )}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default CreateRepo;
