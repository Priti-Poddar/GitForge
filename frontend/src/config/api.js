// src/config/api.js
// ─────────────────────────────────────────
// Single source of truth for all API URLs.
// Never hardcode localhost:3000 in components.
// ─────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const API = {
  // ── Auth ──────────────────────────────
  SIGNUP: `${BASE_URL}/signup`,
  LOGIN: `${BASE_URL}/login`,

  // ── User ──────────────────────────────
  USER: (id) => `${BASE_URL}/user/${id}`,
  USER_PROFILE: (id) => `${BASE_URL}/userProfile/${id}`,
  USER_PASSWORD: (id) => `${BASE_URL}/user/${id}/password`,
  USER_FOLLOW: (id) => `${BASE_URL}/user/follow/${id}`,
  USER_UNFOLLOW: (id) => `${BASE_URL}/user/unfollow/${id}`,
  USER_UPDATE:(id) => `${BASE_URL}/updateProfile/${id}`,
  USER_DELETE:(id) => `${BASE_URL}/deleteProfile/${id}`,
  ALL_USERS: `${BASE_URL}/allUsers`,
  // ── Repositories ──────────────────────
  REPO_CREATE: `${BASE_URL}/repo/create`,
  REPO_ALL: `${BASE_URL}/repo/all`,
  REPO_BY_USER: (userId) => `${BASE_URL}/repo/user/${userId}`,
  REPO_BY_ID: (id) => `${BASE_URL}/repo/${id}`,
  REPO_UPDATE: (id) => `${BASE_URL}/repo/update/${id}`,
  REPO_DELETE: (id) => `${BASE_URL}/repo/delete/${id}`,
  REPO_TOGGLE: (id) => `${BASE_URL}/repo/toggle/${id}`,
  REPO_SEARCH: (q, sort, lang) =>
    `${BASE_URL}/repo/search?q=${encodeURIComponent(q)}&sort=${sort}&lang=${lang}`,

  // ── Issues ────────────────────────────
  ISSUE_CREATE: (repoId) => `${BASE_URL}/issue/create/${repoId}`,
  ISSUE_ALL: (repoId) => `${BASE_URL}/issue/all/${repoId}`,
  ISSUE_BY_ID: (id) => `${BASE_URL}/issue/${id}`,
  ISSUE_UPDATE: (id) => `${BASE_URL}/issue/update/${id}`,
  ISSUE_DELETE: (id) => `${BASE_URL}/issue/delete/${id}`,
};

export default BASE_URL;
