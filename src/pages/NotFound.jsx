// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>
        The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>
      <Link to="/" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
        Back to Home
      </Link>
    </div>
  );
}
