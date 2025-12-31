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
      <h1>{property.type}</h1>
      <p>💵 Price: ${Number(property.price).toLocaleString()}</p>
      <p>🛏️ Bedrooms: {property.bedrooms}</p>
      <p>Location: {property.location}</p>
      <p>{property.description}</p>
      <Link to="/">Back to results</Link>
    </div>
  );
}

export default PropertyPage;