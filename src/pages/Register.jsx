// src/pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { MdHome } from "react-icons/md";

function validatePassword(pw) {
  if (pw.length < 6) return "Password must be at least 6 characters.";
  if (!/[A-Z]/.test(pw)) return "Password must contain an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Password must contain a lowercase letter.";
  return null;
}

export default function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const pwError = validatePassword(form.password);
    if (pwError) return toast.error(pwError);
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.photoURL);
      toast.success("Account created successfully! Welcome to HomeNest.");
      navigate("/");
    } catch (err) {
      const msg = err.code === "auth/email-already-in-use"
        ? "This email is already registered. Please login."
        : err.message || "Registration failed.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await googleLogin();
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      toast.error(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "var(--accent)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
          <MdHome size={20} /> HomeNest
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join HomeNest and start exploring properties</p>

        <button className="google-btn" onClick={handleGoogle} disabled={loading}>
          <FcGoogle size={20} />
          Sign up with Google
        </button>

        <div className="auth-divider">or register with email</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Photo URL <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span></label>
            <input
              type="url"
              name="photoURL"
              placeholder="https://example.com/photo.jpg"
              value={form.photoURL}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="pw-wrap">
              <input
                type={showPw ? "text" : "password"}
                name="password"
                placeholder="Min. 6 chars, uppercase & lowercase"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPw((p) => !p)}
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
            style={{ marginTop: "0.5rem" }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="auth-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
