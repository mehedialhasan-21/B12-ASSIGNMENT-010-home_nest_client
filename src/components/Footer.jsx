// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { MdHome, MdEmail, MdPhone, MdLocationOn } from "react-icons/md";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link
              to="/"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "1.25rem",
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                color: "var(--accent)",
              }}
            >
              <MdHome size={20} />
              HomeNest
            </Link>
            <p>
              Your trusted partner in finding the perfect home — whether you're
              renting, buying, or investing.
            </p>
            <div className="footer-social" style={{ marginTop: "1rem" }}>
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="X/Twitter"><FaXTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">All Properties</Link></li>
              <li><Link to="/add-property">Post a Property</Link></li>
              <li><Link to="/my-properties">My Listings</Link></li>
              <li><Link to="/my-ratings">My Reviews</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <a
                  href="mailto:hello@homenest.io"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <MdEmail /> hello@homenest.io
                </a>
              </li>
              <li>
                <a
                  href="tel:+8801700000000"
                  style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}
                >
                  <MdPhone /> +880 1700-000000
                </a>
              </li>
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.4rem",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                <MdLocationOn style={{ flexShrink: 0, marginTop: "2px" }} />
                Gulshan, Dhaka, Bangladesh
              </li>
            </ul>
            <div style={{ marginTop: "1rem" }}>
              <a
                href="#"
                style={{
                  fontSize: "0.82rem",
                  color: "var(--text-secondary)",
                  marginRight: "0.75rem",
                }}
              >
                Terms & Conditions
              </a>
              <a
                href="#"
                style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} HomeNest. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
