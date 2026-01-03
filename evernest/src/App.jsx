import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import "./App.css";
import FavouritesPanel from "./FavouritesPanel";

// React Select options for property type
const typeOptions = [
  { value: "", label: "All Types" },
  { value: "House", label: "House" },
  { value: "Flat", label: "Flat" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Penthouse", label: "Penthouse" },
];

// Property card component
function PropertyCard({ property, addToFavourites }) {
  return (
    <div
      className="property-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("property", JSON.stringify(property));
        e.dataTransfer.effectAllowed = "copy";
      }}
    >
      <img
        className="property-img"
        src={property.picture}
        alt={property.type}
      />
      <div className="property-content">
        <h2 className="property-heading">{property.type}</h2>
        <p className="short-description">{property.shortDescription}</p>
        <p className="property-details">
          💵 Price: ${Number(property.price).toLocaleString()}
        </p>
        <p className="property-details">🛏️ Bedrooms: {property.bedrooms}</p>
        <p className="property-details">Address: {property.location}</p>
        <p className="property-details">
          🗓️ Date Added: {property.added.day} {property.added.month},{" "}
          {property.added.year}
        </p>
        <div className="action-buttons">
          <Link to={`/property/${property.id}`}>
            <button>View property</button>
          </Link>
          <button onClick={() => addToFavourites(property)}>
            Add to favourites
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);

  // Filter input states
  const [inputType, setInputType] = useState(null);
  const [inputMinPrice, setInputMinPrice] = useState("");
  const [inputMaxPrice, setInputMaxPrice] = useState("");
  const [inputDateAfter, setInputDateAfter] = useState(null);
  const [inputMinBedrooms, setInputMinBedrooms] = useState("");
  const [inputMaxBedrooms, setInputMaxBedrooms] = useState("");
  const [inputPostcode, setInputPostcode] = useState("");

  // Favourites state
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  // Add property to favourites
  const addToFavourites = (property) => {
    setFavourites((prev) => {
      if (prev.find((p) => p.id === property.id)) return prev;
      const newFavourites = [...prev, property];
      localStorage.setItem("favourites", JSON.stringify(newFavourites));
      return newFavourites;
    });
  };

  // Remove property from favourites
  const removeFromFavourites = (id) => {
    setFavourites((prev) => {
      const newFavourites = prev.filter((p) => p.id !== id);
      localStorage.setItem("favourites", JSON.stringify(newFavourites));
      return newFavourites;
    });
  };

  // Remove all favourites
  const removeAllFavourites = () => {
    setFavourites([]);
    localStorage.setItem("favourites", JSON.stringify([]));
  };

  // Load JSON
  useEffect(() => {
    fetch("properties.json")
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
      const typeMatch = !inputType || inputType.value === "" || property.type === inputType.value;
      const priceMatch =
        (!inputMinPrice || Number(property.price) >= Number(inputMinPrice)) &&
        (!inputMaxPrice || Number(property.price) <= Number(inputMaxPrice));
      const bedroomsMatch =
        (!inputMinBedrooms ||
          Number(property.bedrooms) >= Number(inputMinBedrooms)) &&
        (!inputMaxBedrooms ||
          Number(property.bedrooms) <= Number(inputMaxBedrooms));
      const dateMatch =
        !inputDateAfter ||
        new Date(
          property.added.year,
          new Date(`${property.added.month} 1`).getMonth(),
          property.added.day
        ) >= inputDateAfter;
      const postcodeMatch =
        !inputPostcode ||
        property.location.toLowerCase().includes(inputPostcode.toLowerCase());

      return (
        typeMatch && priceMatch && bedroomsMatch && dateMatch && postcodeMatch
      );
    });

    setFilteredProperties(filtered);
  };

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">everNest</h1>
      </header>

      <div className="main-container">
        <div
          className="content-container"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const propertyData = e.dataTransfer.getData("property");
            if (!propertyData) return;
            const property = JSON.parse(propertyData);
            removeFromFavourites(property.id);
          }}
        >
          {/* Filters */}
          <form
            className="filters"
            onSubmit={(e) => {
              e.preventDefault();
              applyFilters();
            }}
          >
            <h2 className="quote">
              You're just a few steps away from your dream home
            </h2>

            <Select
              options={typeOptions}
              value={inputType}
              onChange={setInputType}
              placeholder="All Types"
              styles={{
                control: (provided) => ({ ...provided, color: "black" }),
                singleValue: (provided) => ({ ...provided, color: "black" }),
                placeholder: (provided) => ({ ...provided, color: "black" }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: "white",
                  color: "black",
                }),
              }}
            />

            {/* Row 1: Price inputs */}
            <input
              type="number"
              placeholder="Min Price ($)"
              value={inputMinPrice}
              onChange={(e) => setInputMinPrice(e.target.value)}
            />
            <input
              type="number"
              placeholder="Max Price ($)"
              value={inputMaxPrice}
              onChange={(e) => setInputMaxPrice(e.target.value)}
            />

            {/* Row 2: Bedroom and postcode inputs */}
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

            {/* Date picker */}
            <DatePicker
              selected={inputDateAfter}
              onChange={(date) => setInputDateAfter(date)}
              placeholderText="Date after"
              dateFormat="yyyy-MM-dd"
              className="date-picker"
            />

            {/* Row 3: Search button */}
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          {/* Results */}
          <div className="results">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  addToFavourites={addToFavourites}
                />
              ))
            ) : (
              <p className="no-properties">
                Oops! We couldn't find any properties that match your filter😔😔
              </p>
            )}
          </div>
        </div>

        {/* Favourites panel */}
        <FavouritesPanel
          favourites={favourites}
          onRemove={removeFromFavourites}
          onAdd={addToFavourites}
          onRemoveAll={removeAllFavourites}
        />
      </div>
    </div>
  );
}

export default App;
