// src/components/StarRating.jsx

export default function StarRating({ value, onChange, readOnly = false, size = "1.2rem" }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star${n <= value ? " filled" : ""}${readOnly ? " read-only" : ""}`}
          style={{ fontSize: size }}
          onClick={() => !readOnly && onChange && onChange(n)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
