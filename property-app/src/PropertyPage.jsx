import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./App.css";

function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0); // track which image is main

  // Load property data from JSON
  useEffect(() => {
    fetch("/properties.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.properties.find((p) => p.id === id);
        setProperty(found);
        setSelectedIndex(0); // start with first image
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, [id]);

  if (!property) return <p>Loading property...</p>;

  // Handle previous image
  const prevImage = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  // Handle next image
  const nextImage = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="property-page">
      {/* Main image with arrows */}
      <div className="main-image-container" style={{ position: "relative", maxWidth: "800px", margin: "0 auto" }}>
        <img
          src={property.images[selectedIndex]}
          alt="Main property"
          className="main-image"
          style={{ width: "100%", borderRadius: "12px" }}
        />
        <button
          onClick={prevImage}
          className="left-arrow"
          style={{
            position: "absolute",
            top: "50%",
            left: "10px",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            background: "rgba(0,0,0,0.3)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            width: "40px",
            height: "40px",
          }}
        >
          ‹
        </button>
        <button
          onClick={nextImage}
          className="right-arrow"
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            fontSize: "2rem",
            background: "rgba(0,0,0,0.3)",
            color: "white",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            width: "40px",
            height: "40px",
          }}
        >
          ›
        </button>
      </div>

      {/* Thumbnail bar */}
      <div className="thumbnail-bar">
        {property.images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumbnail ${index + 1}`}
            className={index === selectedIndex ? "active" : ""}
            onClick={() => setSelectedIndex(index)}
          />
        ))}
      </div>

      {/* Property details */}
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