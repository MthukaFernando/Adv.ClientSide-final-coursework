import "./App.css";
import React, { useState } from "react";
import propertiesData from "./properties.json";

// Property cards
function PropertyCard({ property }) {
  return (
    <div className="property-card">
      <img className="property-img" src={property.picture} alt={property.type} />
      <div className="property-content">
        <h2 className="property-heading">{property.type}</h2>
        <p className="property-description">{property.description}</p>
        <p className="property-details">Price: {property.price}</p>
        <p className="property-details">Bedrooms: {property.bedrooms}</p>
        <p className="property-details">Location: {property.location}</p>
        <p className="property-details">Date Added: {property.added.day} {property.added.month}, {property.added.year}</p>
      </div>
    </div>
  );
}

function App() {
  // Input states
  const [inputType, setInputType] = useState("");
  const [inputMinPrice, setInputMinPrice] = useState("");
  const [inputMaxPrice, setInputMaxPrice] = useState("");
  const [inputDateAfter, setInputDateAfter] = useState("");
  const [inputMinBedrooms, setInputMinBedrooms] = useState("");
  const [inputMaxBedrooms, setInputMaxBedrooms] = useState("");
  const [inputPostcode, setInputPostcode] = useState("");

  // Applied states
  const [queryType, setQueryType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [dateAfter, setDateAfter] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [maxBedrooms, setMaxBedrooms] = useState("");
  const [postcode, setPostcode] = useState("");

  // Filter logic
  const filteredProperties = propertiesData.properties.filter((property) => {
    const typeMatch = queryType === "" || property.type === queryType;

    const priceMatch =
      (minPrice === "" || property.price >= Number(minPrice)) &&
      (maxPrice === "" || property.price <= Number(maxPrice));

    const bedroomsMatch =
      (minBedrooms === "" || property.bedrooms >= Number(minBedrooms)) &&
      (maxBedrooms === "" || property.bedrooms <= Number(maxBedrooms));

    const dateMatch =
      dateAfter === "" ||
      new Date(
        `${property.added.year}-${property.added.month}-${property.added.day}`
      ) >= new Date(dateAfter);

    const postcodeMatch =
      postcode === "" ||
      property.location.toLowerCase().includes(postcode.toLowerCase());

    return typeMatch && priceMatch && bedroomsMatch && dateMatch && postcodeMatch;
  });

  // Apply filters
  const applyFilters = () => {
    setQueryType(inputType);
    setMinPrice(inputMinPrice);
    setMaxPrice(inputMaxPrice);
    setMinBedrooms(inputMinBedrooms);
    setMaxBedrooms(inputMaxBedrooms);
    setDateAfter(inputDateAfter);
    setPostcode(inputPostcode);
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
          type="text"
          placeholder="Date after (YYYY-MM-DD)"
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