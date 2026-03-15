import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../authContext";
import Navbar from "../Navbar";
import "../explore/Explore.css"; /* Settings styles are in Explore.css */
import "../auth/auth.css";
import { API } from "../../config/api";

const SECTIONS = [
  { key: "profile", label: "Public profile", icon: "👤" },
  { key: "account", label: "Account", icon: "⚙️" },
  { key: "password", label: "Password", icon: "🔒" },
  { key: "danger", label: "Delete account", icon: "⚠️", danger: true },
];
 
const Settings = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("profile");
  const [profile, setProfile] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    email: "",
  });
  const [passwords, setPasswords] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'success'|'error', text }

  useEffect(() => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    const fetchProfile = async () => {
      try {
        const res = await fetch(API.USER(currentUser));
        if (!res.ok) return;
        const data = await res.json();
        setProfile({
          name: data.name ?? "",
          bio: data.bio ?? "",
          location: data.location ?? "",
          website: data.website ?? "",
          email: data.email ?? "",
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [currentUser, navigate]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        API.USER_UPDATE(currentUser),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profile),
        },
      );
      if (!res.ok) throw new Error("Update failed");
      showMessage("success", "Profile updated successfully.");
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.next !== passwords.confirm) {
      showMessage("error", "New passwords do not match.");
      return;
    }
    if (passwords.next.length < 8) {
      showMessage("error", "Password must be at least 8 characters.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        API.USER_PASSWORD(currentUser),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: passwords.current,
            newPassword: passwords.next,
          }),
        },
      );
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.message ?? "Failed");
      }
      setPasswords({ current: "", next: "", confirm: "" });
      showMessage("success", "Password changed successfully.");
    } catch (err) {
      showMessage("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.prompt(`Type your username to confirm deletion:`);
    if (!confirmed) return;
    try {
      const res = await fetch(API.USER_DELETE(currentUser), {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      localStorage.removeItem("userId");
      setCurrentUser(null);
      navigate("/auth"); 
    } catch (err) {
      showMessage("error", err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setCurrentUser(null);
    navigate("/auth");
  };

  return (
    <>
      <Navbar />
      <div className="settings-page">
        {/* ── Nav ── */}
        <nav className="settings-nav">
          <span className="settings-nav-section">Account settings</span>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              className={`settings-nav-link ${activeSection === s.key ? "active" : ""} ${s.danger ? "danger" : ""}`}
              onClick={() => setActiveSection(s.key)}
            >
              {s.icon} {s.label}
            </button>
          ))}
          <div
            style={{
              borderTop: "1px solid var(--border-muted)",
              marginTop: "8px",
              paddingTop: "8px",
            }}
          >
            <button className="settings-nav-link danger" onClick={handleLogout}>
              🚪 Sign out
            </button>
          </div>
        </nav>

        {/* ── Content ── */}
        <div className="settings-content">
          {/* Flash message */}
          {message && (
            <div
              className={`auth-alert ${message.type === "success" ? "auth-alert-success" : "auth-alert-error"}`}
            >
              {message.text}
            </div>
          )}

          {/* Public profile */}
          {activeSection === "profile" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Public profile</h2>
                <p>
                  This information will be publicly visible on your profile.
                </p>
              </div>
              <div className="settings-section-body">
                {[
                  {
                    key: "name",
                    label: "Display name",
                    placeholder: "Your full name",
                  },
                  {
                    key: "email",
                    label: "Public email",
                    placeholder: "your@email.com",
                  },
                  {
                    key: "bio",
                    label: "Bio",
                    placeholder: "Tell others a little about yourself",
                    textarea: true,
                  },
                  {
                    key: "location",
                    label: "Location",
                    placeholder: "City, Country",
                  },
                  {
                    key: "website",
                    label: "Website",
                    placeholder: "https://yoursite.com",
                  },
                ].map((f) => (
                  <div key={f.key} className="settings-field">
                    <label>{f.label}</label>
                    {f.textarea ? (
                      <textarea
                        className="form-input form-textarea"
                        placeholder={f.placeholder}
                        value={profile[f.key]}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, [f.key]: e.target.value }))
                        }
                        style={{ minHeight: "80px" }}
                      />
                    ) : (
                      <input
                        type="text"
                        className="form-input"
                        placeholder={f.placeholder}
                        value={profile[f.key]}
                        onChange={(e) =>
                          setProfile((p) => ({ ...p, [f.key]: e.target.value }))
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="settings-section-footer">
                <p>All fields are optional and can be changed at any time.</p>
                <button
                  className="btn-primary"
                  onClick={handleProfileSave}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          )}

          {/* Account */}
          {activeSection === "account" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Account</h2>
                <p>Manage your account details.</p>
              </div>
              <div className="settings-section-body">
                <div className="settings-field">
                  <label>User ID</label>
                  <input
                    className="form-input form-input-mono"
                    value={currentUser ?? ""}
                    readOnly
                    style={{ opacity: 0.6 }}
                  />
                  <span className="hint">
                    This is your internal user ID and cannot be changed.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          {activeSection === "password" && (
            <div className="settings-section">
              <div className="settings-section-header">
                <h2>Change password</h2>
                <p>Use a strong password that you don't use elsewhere.</p>
              </div>
              <div className="settings-section-body">
                {[
                  {
                    key: "current",
                    label: "Current password",
                    placeholder: "••••••••",
                  },
                  {
                    key: "next",
                    label: "New password",
                    placeholder: "At least 8 characters",
                  },
                  {
                    key: "confirm",
                    label: "Confirm password",
                    placeholder: "Repeat new password",
                  },
                ].map((f) => (
                  <div key={f.key} className="settings-field">
                    <label>{f.label}</label>
                    <input
                      type="password"
                      className="form-input"
                      placeholder={f.placeholder}
                      value={passwords[f.key]}
                      onChange={(e) =>
                        setPasswords((p) => ({ ...p, [f.key]: e.target.value }))
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="settings-section-footer">
                <p />
                <button
                  className="btn-primary"
                  onClick={handlePasswordChange}
                  disabled={saving || !passwords.current || !passwords.next}
                >
                  {saving ? "Updating..." : "Update password"}
                </button>
              </div>
            </div>
          )}

          {/* Danger zone */}
          {activeSection === "danger" && (
            <div className="settings-section danger-zone">
              <div className="settings-section-header">
                <h2>Danger Zone</h2>
              </div>
              <div className="settings-section-body">
                <div className="danger-item">
                  <div className="danger-item-text">
                    <h3>Delete your account</h3>
                    <p>
                      Once you delete your account, all your repositories,
                      issues, and data will be permanently removed. This action
                      cannot be undone.
                    </p>
                  </div>
                  <button className="btn-danger" onClick={handleDeleteAccount}>
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;
