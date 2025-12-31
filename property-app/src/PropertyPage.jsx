import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./App.css";

function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetch("/properties.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.properties.find((p) => p.id === id);
        setProperty(found);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, [id]);

  if (!property) return <p>Loading property...</p>;

  return (
    <div className="property-page">
      <h2 className="type">{property.type}</h2>
      <p className="details">💵 Price: ${Number(property.price).toLocaleString()}</p>
      <p className="details">🛏️ Bedrooms: {property.bedrooms}</p>
      <p className="details">Location: {property.location}</p>
      <p className="description">{property.description}</p>
      <Link to="/">Back to results</Link>
    </div>
  );
}

export default PropertyPage;