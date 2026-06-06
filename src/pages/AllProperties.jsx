// src/pages/AllProperties.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { MdLocationOn, MdSearch } from "react-icons/md";
import LoadingSpinner from "../components/LoadingSpinner";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PLACEHOLDER = "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80";
const CATEGORIES = ["", "Rent", "Sale", "Commercial", "Land", "Apartment", "Villa", "Townhouse", "Penthouse"];

export default function AllProperties() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("date_desc");
  const [category, setCategory] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search input
  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(window._searchTimer);
    window._searchTimer = setTimeout(() => setDebouncedSearch(val), 400);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["allProperties", debouncedSearch, sort, category],
    queryFn: () =>
      axios
        .get(`${API}/api/properties`, {
          params: {
            search: debouncedSearch || undefined,
            sort: sort || undefined,
            category: category || undefined,
            limit: 50,
          },
        })
        .then((r) => r.data),
  });

  const properties = data?.data || [];

  return (
    <div className="page">
      <div className="container">
        <h1 className="section-title">All Properties</h1>
        <p className="section-sub">
          {data?.totalCount
            ? `Showing ${properties.length} of ${data.totalCount} properties`
            : "Browse all available properties"}
        </p>

        {/* Toolbar */}
        <div className="toolbar">
          <div style={{ position: "relative", flex: 1, maxWidth: 300 }}>
            <MdSearch
              style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Search by property name…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ paddingLeft: "2.2rem" }}
            />
          </div>

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.filter(Boolean).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>

        {isLoading ? (
          <LoadingSpinner />
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <h3>No properties found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid-3">
            {properties.map((p) => {
              const badgeClass = `card-badge badge-${p.category}`;
              return (
                <div key={p._id} className="card">
                  <img
                    src={p.imageUrl || PLACEHOLDER}
                    alt={p.propertyName}
                    className="card-img"
                    onError={(e) => { e.target.src = PLACEHOLDER; }}
                  />
                  <div className="card-body">
                    <span className={badgeClass}>{p.category}</span>
                    <h3 className="card-title">{p.propertyName}</h3>
                    <div className="card-meta">
                      <MdLocationOn size={14} />
                      {p.location}
                    </div>
                    <div
                      className="card-meta"
                      style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}
                    >
                      Posted by {p.userName || "Owner"}
                    </div>
                    <div className="card-price">৳ {Number(p.price).toLocaleString()}</div>
                  </div>
                  <div className="card-footer">
                    <Link
                      to={`/properties/${p._id}`}
                      className="btn btn-primary btn-full btn-sm"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
