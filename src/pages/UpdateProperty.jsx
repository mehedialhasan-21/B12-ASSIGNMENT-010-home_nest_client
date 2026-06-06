// src/pages/UpdateProperty.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import useAxios from "../hooks/useAxios";
import LoadingSpinner from "../components/LoadingSpinner";

const CATEGORIES = ["Rent", "Sale", "Commercial", "Land", "Apartment", "Villa", "Townhouse", "Penthouse"];

export default function UpdateProperty() {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosAuth = useAxios();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: () => axiosAuth.get(`/api/properties/${id}`).then((r) => r.data.data),
  });

  const [form, setForm] = useState({
    propertyName: "",
    description: "",
    category: "Rent",
    price: "",
    location: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (property) {
      setForm({
        propertyName: property.propertyName || "",
        description: property.description || "",
        category: property.category || "Rent",
        price: property.price || "",
        location: property.location || "",
        imageUrl: property.imageUrl || "",
      });
    }
  }, [property]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.price || isNaN(Number(form.price))) {
      return toast.error("Please enter a valid price.");
    }
    setSaving(true);
    try {
      const res = await axiosAuth.put(`/api/properties/${id}`, {
        ...form,
        price: Number(form.price),
      });
      qc.setQueryData(["property", id], res.data.data);
      qc.invalidateQueries(["myProperties"]);
      qc.invalidateQueries(["featured"]);
      qc.invalidateQueries(["allProperties"]);
      toast.success("Property updated successfully!");
      navigate(`/properties/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update property.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">Update Property</h1>
        <p className="section-sub">Edit the details of your listing</p>

        <div className="form-card" style={{ maxWidth: 680 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Property Name *</label>
              <input
                name="propertyName"
                value={form.propertyName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                required
                style={{ resize: "vertical" }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Price (৳) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Image URL</label>
              <input
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input value={user?.displayName || ""} readOnly className="form-readonly" />
              </div>
              <div className="form-group">
                <label className="form-label">Your Email</label>
                <input value={user?.email || ""} readOnly className="form-readonly" />
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={saving}>
                {saving ? "Saving…" : "Update Property"}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate(`/properties/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
