import React, { useState, useEffect } from "react";
import "./App.css";

// Property card component
function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <img
        className="property-img"
        src={property.picture}
        alt={property.type}
      />
      <div className="property-content">
        <h2 className="property-heading">{property.type}</h2>
        <p className="property-details">
          Price: ${Number(property.price).toLocaleString()}
        </p>
        <p className="property-details">
          Bedrooms: {Number(property.bedrooms)}
        </p>
        <p className="property-details">Location: {property.location}</p>
        <p className="property-details">
          Date Added: {property.added.day} {property.added.month}, {property.added.year}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Filter input states
  const [inputType, setInputType] = useState("");
  const [inputMinPrice, setInputMinPrice] = useState("");
  const [inputMaxPrice, setInputMaxPrice] = useState("");
  const [inputDateAfter, setInputDateAfter] = useState("");
  const [inputMinBedrooms, setInputMinBedrooms] = useState("");
  const [inputMaxBedrooms, setInputMaxBedrooms] = useState("");
  const [inputPostcode, setInputPostcode] = useState("");

  // Load JSON from public folder
  useEffect(() => {
    fetch("/properties.json")
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.properties);
        setFilteredProperties(data.properties);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  // Apply filters
  const applyFilters = () => {
    const filtered = properties.filter((property) => {
      const typeMatch = !inputType || property.type === inputType;

      const priceMatch =
        (!inputMinPrice || Number(property.price) >= Number(inputMinPrice)) &&
        (!inputMaxPrice || Number(property.price) <= Number(inputMaxPrice));

      const bedroomsMatch =
        (!inputMinBedrooms || Number(property.bedrooms) >= Number(inputMinBedrooms)) &&
        (!inputMaxBedrooms || Number(property.bedrooms) <= Number(inputMaxBedrooms));

      const dateMatch =
        !inputDateAfter ||
        new Date(`${property.added.year}-${property.added.month}-${property.added.day}`) >=
          new Date(inputDateAfter);

      const postcodeMatch =
        !inputPostcode ||
        property.location.toLowerCase().includes(inputPostcode.toLowerCase());

      return typeMatch && priceMatch && bedroomsMatch && dateMatch && postcodeMatch;
    });

    setFilteredProperties(filtered);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">everNest</h1>
      </header>

      {/* Filters */}
      <form
        className="filters"
        onSubmit={(e) => {
          e.preventDefault();
          applyFilters();
        }}
      >
        <h2 className="quote">You're just a few steps away from your dream home</h2>

        {/* Row 1 */}
        <select value={inputType} onChange={(e) => setInputType(e.target.value)}>
          <option value="">All Types</option>
          <option value="House">House</option>
          <option value="Flat">Flat</option>
          <option value="Bungalow">Bungalow</option>
          <option value="Penthouse">Penthouse</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={inputMinPrice}
          onChange={(e) => setInputMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={inputMaxPrice}
          onChange={(e) => setInputMaxPrice(e.target.value)}
        />
        <input
          type="date"
          placeholder="Date after"
          value={inputDateAfter}
          onChange={(e) => setInputDateAfter(e.target.value)}
        />

        {/* Row 2 */}
        <input
          type="number"
          placeholder="Min Bedrooms"
          value={inputMinBedrooms}
          onChange={(e) => setInputMinBedrooms(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Bedrooms"
          value={inputMaxBedrooms}
          onChange={(e) => setInputMaxBedrooms(e.target.value)}
        />
        <input
          type="text"
          placeholder="Postcode (e.g., BR1)"
          value={inputPostcode}
          onChange={(e) => setInputPostcode(e.target.value)}
        />

        {/* Row 3 */}
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {/* Results */}
      <div className="results">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <p>No properties match your filters.</p>
        )}
      </div>
    </div>
  );
}

export default App;