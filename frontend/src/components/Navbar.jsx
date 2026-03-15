import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/github.png";

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2.5" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const UserIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const Navbar = () => {
  const location = useLocation();

  // pull first 2 chars of userId for avatar initials
  const userId = localStorage.getItem("userId") ?? "";
  const initials = userId.slice(0, 2).toUpperCase() || "GF";

  return ( 
    <nav>
      {/* ── Brand ── */}
      <Link to="/" className="nav-brand">
        <div className="nav-logo-wrap">
          <img
            src={logo}
            alt="GitForge logo"
          />
        </div>
        <span className="nav-brand-name">
          Git<span>Forge</span>
        </span>
      </Link>

      {/* ── Links ── */}
      <div className="nav-links">
        <Link to="/repo/new" className="nav-link nav-link-create">
          <PlusIcon />
          <span>New Repo</span>
        </Link>

        <div className="nav-divider" />

        <Link to="/profile" className="nav-link nav-link-profile">
          <div className="nav-avatar">{initials}</div>
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
