// src/pages/EditProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function EditProfile() {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [saving, setSaving] = useState(false);

  // Initialize fields once user is loaded
  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
      setPhotoURL(user.photoURL || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      return toast.error("Display Name cannot be empty.");
    }

    setSaving(true);
    try {
      await updateUserProfile(name.trim(), photoURL.trim());
      toast.success("Profile updated successfully!");
      // Redirect to home page or previous page
      navigate("/");
    } catch (err) {
      console.error("Profile edit error:", err);
      toast.error(err.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="page" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h1 className="section-title" style={{ textAlign: "center" }}>Edit Profile</h1>
        <p className="section-sub" style={{ textAlign: "center", marginBottom: "2rem" }}>
          Manage your personal account settings below
        </p>

        <div className="form-card" style={{ maxWidth: 520, width: "100%", padding: "2.5rem" }}>
          {/* Avatar Preview */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "2rem" }}>
            {photoURL ? (
              <img
                src={photoURL}
                alt="avatar-preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid var(--primary)",
                  boxShadow: "var(--shadow)",
                  marginBottom: "1rem"
                }}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80";
                }}
              />
            ) : (
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-light)",
                  color: "var(--primary)",
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "3px solid var(--primary)",
                  boxShadow: "var(--shadow)",
                  marginBottom: "1rem"
                }}
              >
                {name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
              </div>
            )}
            <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Avatar Preview</span>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email (Read-only) */}
            <div className="form-group">
              <label className="form-label">Email Address (Read-only)</label>
              <input
                type="email"
                value={user.email || ""}
                disabled
                style={{
                  backgroundColor: "var(--border)",
                  cursor: "not-allowed",
                  opacity: 0.8
                }}
              />
            </div>

            {/* Display Name */}
            <div className="form-group">
              <label className="form-label">Display Name *</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Photo URL */}
            <div className="form-group">
              <label className="form-label">Profile Photo URL</label>
              <input
                type="url"
                placeholder="Enter photo link (e.g. https://unsplash.com/...)"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
              />
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/")}
                style={{ flex: 1 }}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
