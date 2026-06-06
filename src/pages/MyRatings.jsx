// src/pages/MyRatings.jsx
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../hooks/useAxios";
import LoadingSpinner from "../components/LoadingSpinner";
import StarRating from "../components/StarRating";
import { Link } from "react-router-dom";
import { MdCalendarToday } from "react-icons/md";

const PLACEHOLDER = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=70";

function fmt(date) {
  try { return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return "—"; }
}

export default function MyRatings() {
  const { user } = useAuth();
  const axiosAuth = useAxios();

  const { data, isLoading } = useQuery({
    queryKey: ["myRatings", user?.email],
    enabled: !!user?.email,
    queryFn: () =>
      axiosAuth
        .get(`/api/reviews/user/${user.email}`)
        .then((r) => r.data.data),
  });

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">My Ratings</h1>
        <p className="section-sub">
          {data ? `You've written ${data.length} review${data.length !== 1 ? "s" : ""}` : "Reviews you've left on properties"}
        </p>

        {isLoading ? (
          <LoadingSpinner />
        ) : !data?.length ? (
          <div className="empty-state">
            <h3>No reviews yet</h3>
            <p>You haven't reviewed any properties. Explore listings and share your feedback!</p>
            <Link to="/properties" className="btn btn-primary mt-2">
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="grid-3">
            {data.map((r) => (
              <div key={r._id} className="card">
                <img
                  src={r.propertyImage || PLACEHOLDER}
                  alt={r.propertyName}
                  className="card-img"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <div className="card-body">
                  <h3 className="card-title">{r.propertyName}</h3>
                  <StarRating value={r.rating} readOnly size="1rem" />
                  <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", marginTop: "0.25rem", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    "{r.reviewText}"
                  </p>
                  <div className="card-meta" style={{ marginTop: "auto", paddingTop: "0.4rem" }}>
                    <MdCalendarToday size={13} /> {fmt(r.createdAt)}
                  </div>
                  <div className="card-meta" style={{ fontSize: "0.8rem" }}>
                    Reviewed as: <strong style={{ color: "var(--text-primary)" }}>{r.reviewerName}</strong>
                  </div>
                </div>
                <div className="card-footer">
                  <Link
                    to={`/properties/${r.propertyId}`}
                    className="btn btn-outline btn-full btn-sm"
                  >
                    View Property
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
