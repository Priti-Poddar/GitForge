import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import logo from "../../assets/github-mark-white.svg";
import "./auth.css";
import {API} from "../../config/api";

const STRENGTH_COLOR = ["", "#B35656", "#d29922", "#87B6BC", "#5e9199"];
const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];

const getStrength = (pw) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { setCurrentUser } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(API.SIGNUP, {
        email,
        password,
        username,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);

      setSuccess("Account created! Redirecting...");
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const strength = getStrength(password);

  return (
    <div className="auth-page">
      <div className="auth-yellow-blob" />
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-img">
            <img src={logo} alt="GitForge" />
          </div>
          <span className="auth-logo-name">
            Git<span>Forge</span>
          </span>
          <span className="auth-logo-tagline">// join the forge</span>
        </div>

        <div className="auth-card">
          <h2 className="auth-card-title">Create your account</h2>

          {error && (
            <div
              className="auth-alert auth-alert-error"
              style={{ marginBottom: 16 }}
            >
              ⚠ {error}
            </div>
          )}
          {success && (
            <div
              className="auth-alert auth-alert-success"
              style={{ marginBottom: 16 }}
            >
              ✓ {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSignup}>
            <div className="auth-field">
              <label className="auth-label" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="auth-input"
                placeholder="cool-dev-42"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                autoFocus
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div className="auth-field">
              <label className="auth-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="auth-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />
              {password && (
                <div className="auth-strength">
                  <div className="auth-strength-bars">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="auth-strength-bar"
                        style={{
                          background:
                            i <= strength
                              ? STRENGTH_COLOR[strength]
                              : "var(--border)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="auth-strength-label"
                    style={{ color: STRENGTH_COLOR[strength] }}
                  >
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className={`auth-submit ${loading ? "loading" : ""}`}
              disabled={loading || !username || !email || !password}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>

        <div className="auth-footer-card">
          Already have an account? <Link to="/auth">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
