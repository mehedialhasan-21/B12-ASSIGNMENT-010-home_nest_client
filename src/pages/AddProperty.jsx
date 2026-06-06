// src/pages/AddProperty.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAxios from "../hooks/useAxios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const CATEGORIES = ["Rent", "Sale", "Commercial", "Land", "Apartment", "Villa", "Townhouse", "Penthouse"];

export default function AddProperty() {
  const { user } = useAuth();
  const axiosAuth = useAxios();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    propertyName: "",
    description: "",
    category: "Rent",
    price: "",
    location: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.price || isNaN(Number(form.price))) {
      return toast.error("Please enter a valid price.");
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        userEmail: user.email,
        userName: user.displayName || "",
        userPhoto: user.photoURL || "",
      };
      const res = await axiosAuth.post("/api/properties", payload);
      qc.invalidateQueries(["featured"]);
      qc.invalidateQueries(["allProperties"]);
      toast.success("Property listed successfully!");
      navigate(`/properties/${res.data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">Add a Property</h1>
        <p className="section-sub">Fill in the details below to list your property</p>

        <div className="form-card" style={{ maxWidth: 680 }}>
          <form onSubmit={handleSubmit}>
            <div className="grid-2" style={{ gap: "0" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <div className="form-group">
                  <label className="form-label">Property Name *</label>
                  <input
                    name="propertyName"
                    placeholder="e.g. Spacious 3-Bedroom Apartment in Gulshan"
                    value={form.propertyName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div className="form-group">
                  <label className="form-label">Description *</label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe the property — features, nearby facilities, condition…"
                    value={form.description}
                    onChange={handleChange}
                    required
                    style={{ resize: "vertical" }}
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select name="category" value={form.category} onChange={handleChange}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label">Price (৳) *</label>
                  <input
                    type="number"
                    name="price"
                    placeholder="e.g. 25000"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    name="location"
                    placeholder="e.g. Gulshan-2, Dhaka"
                    value={form.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={{ gridColumn: "1 / -1" }}>
                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    name="imageUrl"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={form.imageUrl}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label">Your Name</label>
                  <input
                    value={user?.displayName || ""}
                    readOnly
                    className="form-readonly"
                  />
                </div>
              </div>

              <div>
                <div className="form-group">
                  <label className="form-label">Your Email</label>
                  <input
                    value={user?.email || ""}
                    readOnly
                    className="form-readonly"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              style={{ marginTop: "0.5rem" }}
              disabled={loading}
            >
              {loading ? "Adding property…" : "Add Property"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
