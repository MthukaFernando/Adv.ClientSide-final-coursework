import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function FavouritesPanel({ favourites, onRemove, onAdd }) {
  const [isOver, setIsOver] = useState(false);

  return (
    <div
      className={`favourites-panel ${isOver ? "highlight" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsOver(true);
      }}
      onDragLeave={() => setIsOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsOver(false);
        const propertyData = e.dataTransfer.getData("property");
        if (!propertyData) return;
        const property = JSON.parse(propertyData);
        onAdd(property);
      }}
    >
      <h3 className="fav-heading">My Favourites</h3>
      {favourites.length === 0 ? (
        <div className="placeholder">
          <p>Drag and drop a property here<br />or click "Add to favourites"</p>
        </div>
      ) : (
        favourites.map((property) => (
          <div
            key={property.id}
            className="fav-card"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("property", JSON.stringify(property));
              e.dataTransfer.effectAllowed = "move";
            }}
          >
            <img src={property.picture} alt={property.type} className="fav-img" />
            <div className="fav-content">
              <p>Type: {property.type}</p>
              <p>Price: ${property.price}</p>
              <p className="no-need-for-query">Bedrooms: {property.bedrooms}</p>
              <p className="no-need-for-query">Address: {property.location}</p>
              <div className="fav-buttons">
                <Link to={`/property/${property.id}`}>
                  <button className="view-button">View property</button>
                </Link>
                <button
                  className="remove-button"
                  onClick={() => onRemove(property.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default FavouritesPanel;