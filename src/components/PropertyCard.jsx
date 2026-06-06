// src/components/PropertyCard.jsx
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { useAuth } from "../context/AuthContext";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80";

export default function PropertyCard({ property }) {
  const { user } = useAuth();
  const { _id, propertyName, category, description, location, price, imageUrl } =
    property;

  const detailsPath = `/properties/${_id}`;
  const badgeClass = `card-badge badge-${category}`;

  return (
    <div className="card">
      <img
        src={imageUrl || PLACEHOLDER}
        alt={propertyName}
        className="card-img"
        onError={(e) => { e.target.src = PLACEHOLDER; }}
      />
      <div className="card-body">
        <span className={badgeClass}>{category}</span>
        <h3 className="card-title">{propertyName}</h3>
        {description && (
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </p>
        )}
        <div className="card-meta">
          <MdLocationOn size={14} />
          {location}
        </div>
        <div className="card-price">৳ {Number(price).toLocaleString()}</div>
      </div>
      <div className="card-footer">
        {user ? (
          <Link to={detailsPath} className="btn btn-primary btn-full btn-sm">
            View Details
          </Link>
        ) : (
          <Link
            to="/login"
            state={{ from: { pathname: detailsPath } }}
            className="btn btn-outline btn-full btn-sm"
          >
            Login to View Details
          </Link>
        )}
      </div>
    </div>
  );
}
