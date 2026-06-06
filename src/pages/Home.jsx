// src/pages/Home.jsx
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import PropertyCard from "../components/PropertyCard";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  MdVerified,
  MdSupportAgent,
  MdTrendingUp,
  MdSearch,
} from "react-icons/md";
import { FaHandshake } from "react-icons/fa";
import { BsShieldCheck } from "react-icons/bs";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const slides = [
  {
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&q=80",
    title: "Find Your Dream Home",
    sub: "Browse thousands of verified listings across Bangladesh. Rent, buy, or invest with confidence.",
    cta: "Explore Properties",
    to: "/properties",
  },
  {
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80",
    title: "Premium Properties Await",
    sub: "From cozy apartments to luxury villas — discover properties that match your lifestyle.",
    cta: "View Listings",
    to: "/properties",
  },
  {
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80",
    title: "List Your Property Today",
    sub: "Reach thousands of potential buyers and renters. Post your listing in minutes.",
    cta: "Post a Property",
    to: "/add-property",
  },
];

const whyUs = [
  {
    icon: <MdVerified />,
    title: "Verified Listings",
    desc: "Every property goes through our verification process so you only see trustworthy listings.",
  },
  {
    icon: <MdSearch />,
    title: "Smart Search",
    desc: "Filter by price, location, category, and more to find exactly what you're looking for.",
  },
  {
    icon: <MdSupportAgent />,
    title: "24/7 Support",
    desc: "Our support team is always ready to help you navigate your real estate journey.",
  },
  {
    icon: <FaHandshake />,
    title: "Easy Transactions",
    desc: "Simplified process from browsing to closing — we make property deals stress-free.",
  },
  {
    icon: <BsShieldCheck />,
    title: "Secure Platform",
    desc: "Your data and transactions are protected with industry-standard security measures.",
  },
  {
    icon: <MdTrendingUp />,
    title: "Best Market Value",
    desc: "We provide real-time market insights to help you get the best value for every deal.",
  },
];

const testimonials = [
  {
    text: "HomeNest made finding our family apartment so easy. The search filters are incredibly helpful and the listings are accurate.",
    name: "Fatema Khanam",
    role: "Tenant, Dhaka",
    initials: "FK",
  },
  {
    text: "I listed my property and got serious inquiries within days. The platform is clean and professional.",
    name: "Rafiqul Islam",
    role: "Property Owner, Chittagong",
    initials: "RI",
  },
  {
    text: "As a first-time buyer, HomeNest guided me through everything. The detailed listings helped me make the right choice.",
    name: "Nusrat Jahan",
    role: "Buyer, Sylhet",
    initials: "NJ",
  },
];

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: () =>
      axios.get(`${API}/api/properties/featured`).then((r) => r.data.data),
  });

  return (
    <div>
      {/* ── Hero Slider ─────────────────────────────── */}
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        style={{ marginTop: "var(--nav-h)" }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="hero-section">
              <img src={s.img} alt={s.title} className="hero-img" />
              <div className="hero-overlay" />
              <div className="container hero-content">
                <h1>{s.title}</h1>
                <p>{s.sub}</p>
                <Link to={s.to} className="btn btn-primary">
                  {s.cta}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* ── Stats ───────────────────────────────────── */}
      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {[
              { num: "2,400+", label: "Properties Listed" },
              { num: "1,800+", label: "Happy Clients" },
              { num: "64", label: "Cities Covered" },
              { num: "98%", label: "Satisfaction Rate" },
            ].map((s) => (
              <div key={s.label}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Featured Properties ──────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Featured Properties</h2>
          <p className="section-sub">
            Freshly listed — explore our newest real estate offerings
          </p>

          {isLoading ? (
            <LoadingSpinner />
          ) : data?.length ? (
            <div className="grid-3">
              {data.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>No properties yet</h3>
              <p>Be the first to list a property!</p>
              <Link to="/add-property" className="btn btn-primary mt-2">
                Post a Property
              </Link>
            </div>
          )}

          {data?.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <Link to="/properties" className="btn btn-outline">
                View All Properties
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────── */}
      <section className="section" style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="container">
          <h2 className="section-title">Why Choose HomeNest?</h2>
          <p className="section-sub">
            We're committed to making your real estate journey smooth and rewarding
          </p>
          <div className="why-grid">
            {whyUs.map((w) => (
              <div key={w.title} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>
          <p className="section-sub">
            Real stories from people who found their home through HomeNest
          </p>
          <div className="grid-3">
            {testimonials.map((t) => (
              <div key={t.name} className="testi-card">
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.initials}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────── */}
      <section
        style={{
          background: "var(--accent)",
          padding: "4rem 0",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div className="container">
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "2rem",
              marginBottom: "0.75rem",
            }}
          >
            Ready to Find Your Next Property?
          </h2>
          <p style={{ opacity: 0.9, marginBottom: "1.75rem", fontSize: "1.05rem" }}>
            Join thousands of buyers, renters, and investors already using HomeNest.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/properties"
              style={{
                padding: "0.7rem 1.75rem",
                background: "#fff",
                color: "var(--accent)",
                borderRadius: "var(--radius)",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Browse Properties
            </Link>
            <Link
              to="/register"
              style={{
                padding: "0.7rem 1.75rem",
                background: "transparent",
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.7)",
                borderRadius: "var(--radius)",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
