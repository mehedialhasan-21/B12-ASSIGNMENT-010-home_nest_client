// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { toast } from "react-toastify";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { MdHome } from "react-icons/md";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setDropOpen(false);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch {
      toast.error("Logout failed. Try again.");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/properties", label: "All Properties" },
    ...(user
      ? [
          { to: "/add-property", label: "Add Property" },
          { to: "/my-properties", label: "My Properties" },
          { to: "/my-ratings", label: "My Ratings" },
        ]
      : []),
  ];

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <MdHome size={22} />
          HomeNest
        </Link>

        {/* Desktop links */}
        <ul className={`nav-links${menuOpen ? " open" : ""}`}>
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="nav-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={dark ? "Switch to Light" : "Switch to Dark"}
          >
            {dark ? <FiSun /> : <FiMoon />}
          </button>

          {!loading && (
            <>
              {user ? (
                <div className="nav-avatar-wrap" ref={dropRef}>
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="avatar"
                      className="nav-avatar"
                      onClick={() => setDropOpen((p) => !p)}
                    />
                  ) : (
                    <div
                      className="nav-avatar-fallback"
                      onClick={() => setDropOpen((p) => !p)}
                    >
                      {user.displayName?.[0]?.toUpperCase() ||
                        user.email?.[0]?.toUpperCase()}
                    </div>
                  )}

                  {dropOpen && (
                    <div className="nav-dropdown">
                      <div className="nav-dropdown-info">
                        <div className="nav-dropdown-name">
                          {user.displayName || "User"}
                        </div>
                        <div className="nav-dropdown-email">{user.email}</div>
                      </div>
                      <Link
                        to="/edit-profile"
                        className="nav-dropdown-link"
                        onClick={() => setDropOpen(false)}
                      >
                        Edit Profile
                      </Link>
                      <button
                        className="nav-dropdown-btn"
                        onClick={handleLogout}
                      >
                        Log out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline btn-sm">
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-primary btn-sm">
                    Sign Up
                  </Link>
                </>
              )}
            </>
          )}

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
