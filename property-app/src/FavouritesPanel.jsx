import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

function FavouritesPanel({ favourites, onRemove }) {
  return (
    <div className="favourites-panel">
      <h3>My Favourites</h3>
      {favourites.length === 0 ? (
        <p>No favourites yet.</p>
      ) : (
        favourites.map((property) => (
          <div key={property.id} className="fav-card">
            <img src={property.picture} alt={property.type} className="fav-img" />
            <div className="fav-content">
              <p>Type: {property.type}</p>
              <p>Price: {property.price}</p>
              <p>Bedrooms: {property.bedrooms}</p>
              <p>Address: {property.location}</p>
              <div className="fav-buttons">
                <Link to={`/property/${property.id}`}>
                  <button className="view-button">View property</button>
                </Link>
                <button className="remove-button" onClick={() => onRemove(property.id)}>
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