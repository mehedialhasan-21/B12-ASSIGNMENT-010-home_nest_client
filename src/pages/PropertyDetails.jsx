// src/pages/PropertyDetails.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import useAxios from "../hooks/useAxios";
import StarRating from "../components/StarRating";
import LoadingSpinner from "../components/LoadingSpinner";
import { MdLocationOn, MdCategory, MdCalendarToday, MdPerson } from "react-icons/md";

const PLACEHOLDER = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=1200&q=80";

function fmt(date) {
  try { return format(new Date(date), "dd MMM yyyy"); } catch { return "—"; }
}

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosAuth = useAxios();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: property, isLoading: propLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => axiosAuth.get(`/api/properties/${id}`).then((r) => r.data.data),
  });

  const { data: reviews, isLoading: revLoading } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => axiosAuth.get(`/api/reviews/property/${id}`).then((r) => r.data),
  });

  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) return toast.error("Please select a star rating.");
    if (!reviewText.trim()) return toast.error("Please write a review.");
    setSubmitting(true);
    try {
      await axiosAuth.post("/api/reviews", {
        propertyId: id,
        rating,
        reviewText: reviewText.trim(),
      });
      toast.success("Review submitted!");
      setRating(0);
      setReviewText("");
      qc.invalidateQueries(["reviews", id]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (propLoading) return <LoadingSpinner />;
  if (!property) return (
    <div className="page"><div className="container empty-state"><h3>Property not found.</h3></div></div>
  );

  const isOwner = user?.email === property.userEmail;

  return (
    <div className="page">
      <div className="container">
        {/* Image */}
        <img
          src={property.imageUrl || PLACEHOLDER}
          alt={property.propertyName}
          className="detail-img"
          onError={(e) => { e.target.src = PLACEHOLDER; }}
        />

        <div className="detail-grid">
          {/* Left — main info */}
          <div>
            <span className={`card-badge badge-${property.category}`} style={{ marginBottom: "0.75rem", display: "inline-block" }}>
              {property.category}
            </span>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.75rem", marginBottom: "0.5rem" }}>
              {property.propertyName}
            </h1>
            <div className="detail-price-big" style={{ marginBottom: "1.25rem" }}>
              ৳ {Number(property.price).toLocaleString()}
            </div>

            <div className="detail-info-block" style={{ marginBottom: "1.25rem" }}>
              <div style={{ marginBottom: "1rem" }}>
                <div className="detail-label">Description</div>
                <div className="detail-value" style={{ lineHeight: 1.7 }}>{property.description}</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div className="detail-label">Location</div>
                  <div className="detail-value" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <MdLocationOn size={15} color="var(--accent)" />{property.location}
                  </div>
                </div>
                <div>
                  <div className="detail-label">Category</div>
                  <div className="detail-value" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <MdCategory size={15} color="var(--accent)" />{property.category}
                  </div>
                </div>
                <div>
                  <div className="detail-label">Posted On</div>
                  <div className="detail-value" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <MdCalendarToday size={15} color="var(--accent)" />{fmt(property.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="detail-label">Listed By</div>
                  <div className="detail-value" style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
                    <MdPerson size={15} color="var(--accent)" />{property.userName || "Owner"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right — sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {/* Posted by card */}
            <div className="detail-info-block">
              <h3 style={{ fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.95rem" }}>Posted By</h3>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {property.userPhoto ? (
                  <img src={property.userPhoto} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                    {property.userName?.[0] || "U"}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem" }}>{property.userName || "Owner"}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", wordBreak: "break-all" }}>{property.userEmail}</div>
                </div>
              </div>
            </div>

            {/* Avg rating */}
            {reviews && (
              <div className="detail-info-block" style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "var(--accent)" }}>{reviews.averageRating || "—"}</div>
                <StarRating value={Math.round(reviews.averageRating)} readOnly />
                <div style={{ fontSize: "0.83rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                  {reviews.count} review{reviews.count !== 1 ? "s" : ""}
                </div>
              </div>
            )}

            {isOwner && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button className="btn btn-outline btn-full" onClick={() => navigate(`/update-property/${id}`)}>
                  Edit Property
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Reviews Section ─────────────────────────────── */}
        <div style={{ marginTop: "2.5rem" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.4rem", marginBottom: "1.5rem" }}>
            Ratings & Reviews
          </h2>

          {/* Add review form */}
          {user && !isOwner && (
            <div className="detail-info-block" style={{ marginBottom: "1.75rem" }}>
              <h3 style={{ fontWeight: 600, marginBottom: "1rem", fontSize: "0.95rem" }}>Write a Review</h3>
              <form onSubmit={submitReview}>
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <StarRating value={rating} onChange={setRating} size="1.6rem" />
                </div>
                <div className="form-group">
                  <label className="form-label">Review</label>
                  <textarea
                    rows={3}
                    placeholder="Share your experience with this property…"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    style={{ resize: "vertical" }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Submitting…" : "Submit Review"}
                </button>
              </form>
            </div>
          )}

          {/* Reviews list */}
          {revLoading ? (
            <LoadingSpinner />
          ) : reviews?.data?.length === 0 ? (
            <div className="empty-state" style={{ padding: "2rem 0" }}>
              <p>No reviews yet. Be the first to review this property!</p>
            </div>
          ) : (
            reviews?.data?.map((r) => (
              <div key={r._id} className="review-card">
                <div className="review-header">
                  {r.reviewerPhoto ? (
                    <img src={r.reviewerPhoto} className="review-avatar" alt="" />
                  ) : (
                    <div className="review-avatar" style={{ background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "0.85rem" }}>
                      {r.reviewerName?.[0] || "U"}
                    </div>
                  )}
                  <div className="review-name">{r.reviewerName}</div>
                  <div className="review-date">{fmt(r.createdAt)}</div>
                </div>
                <StarRating value={r.rating} readOnly size="1rem" />
                <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>{r.reviewText}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
