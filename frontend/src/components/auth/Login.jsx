import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../../authContext";
import logo from "../../assets/github-mark-white.svg";
import "./auth.css";
import {API} from "../../config/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(API.LOGIN, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      setCurrentUser(res.data.userId);
      window.location.href = "/";
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

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
          <span className="auth-logo-tagline">// forge your code legacy</span>
        </div>

        <div className="auth-card">
          <h2 className="auth-card-title">Sign in to GitForge</h2>

          {error && (
            <div
              className="auth-alert auth-alert-error"
              style={{ marginBottom: 16 }}
            >
              ⚠ {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleLogin}>
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
                autoFocus
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <button
              type="submit"
              className={`auth-submit ${loading ? "loading" : ""}`}
              disabled={loading || !email || !password}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        <div className="auth-footer-card">
          New to GitForge? <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
