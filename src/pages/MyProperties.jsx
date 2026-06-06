// src/pages/MyProperties.jsx
import { useAuth } from "../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxios from "../hooks/useAxios";
import LoadingSpinner from "../components/LoadingSpinner";
import { MdLocationOn, MdCalendarToday } from "react-icons/md";

const PLACEHOLDER = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=70";

function fmt(date) {
  try { return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  catch { return "—"; }
}

export default function MyProperties() {
  const { user } = useAuth();
  const axiosAuth = useAxios();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["myProperties", user?.email],
    enabled: !!user?.email,
    queryFn: () =>
      axiosAuth
        .get(`/api/properties/user/${user.email}`)
        .then((r) => r.data.data),
  });

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: "Delete Property?",
      text: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      background: "var(--bg-card)",
      color: "var(--text-primary)",
    });

    if (!result.isConfirmed) return;

    try {
      await axiosAuth.delete(`/api/properties/${id}`);
      qc.setQueryData(["myProperties", user.email], (old) =>
        old ? old.filter((p) => p._id !== id) : old
      );
      qc.invalidateQueries(["featured"]);
      qc.invalidateQueries(["allProperties"]);
      toast.success("Property deleted successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete property.");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">My Properties</h1>
        <p className="section-sub">
          {data ? `You have ${data.length} listed propert${data.length === 1 ? "y" : "ies"}` : "Manage your property listings"}
        </p>

        {isLoading ? (
          <LoadingSpinner />
        ) : !data?.length ? (
          <div className="empty-state">
            <h3>No properties yet</h3>
            <p>You haven't listed any properties. Start now!</p>
            <Link to="/add-property" className="btn btn-primary mt-2">
              Add a Property
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {data.map((p) => (
              <div key={p._id} className="my-prop-card">
                <img
                  src={p.imageUrl || PLACEHOLDER}
                  alt={p.propertyName}
                  className="my-prop-img"
                  onError={(e) => { e.target.src = PLACEHOLDER; }}
                />
                <div className="my-prop-body">
                  <span className={`card-badge badge-${p.category}`}>{p.category}</span>
                  <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.05rem", fontWeight: 600 }}>
                    {p.propertyName}
                  </h3>
                  <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" }}>
                    <span className="card-meta"><MdLocationOn size={13} />{p.location}</span>
                    <span className="card-meta"><MdCalendarToday size={13} />{fmt(p.createdAt)}</span>
                  </div>
                  <div style={{ fontWeight: 700, color: "var(--accent)", fontSize: "1.05rem" }}>
                    ৳ {Number(p.price).toLocaleString()}
                  </div>
                  <div className="my-prop-actions">
                    <Link to={`/properties/${p._id}`} className="btn btn-outline btn-sm">
                      View Details
                    </Link>
                    <Link to={`/update-property/${p._id}`} className="btn btn-primary btn-sm">
                      Update
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(p._id, p.propertyName)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
