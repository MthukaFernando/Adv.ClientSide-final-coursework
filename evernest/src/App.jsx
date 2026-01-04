import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import "./App.css";
import FavouritesPanel from "./FavouritesPanel";

// React Select options for property type
const typeOptions = [
  { value: "House", label: "House" },
  { value: "Flat", label: "Flat" },
  { value: "Bungalow", label: "Bungalow" },
  { value: "Penthouse", label: "Penthouse" },
];

// Price options
const priceOptions = [
  { value: 200000, label: "$200,000" },
  { value: 400000, label: "$400,000" },
  { value: 600000, label: "$600,000" },
  { value: 800000, label: "$800,000" },
  { value: 1000000, label: "$1,000,000" },
  { value: 1200000, label: "$1,200,000" },
  { value: 1400000, label: "$1,400,000" },
];

// Bedrooms options
const bedroomOptions = [
  ...Array.from({ length: 7 }, (_, i) => ({ value: i + 1, label: `${i + 1}` }))
];

// Postcode options
const postcodeOptions = [
  { value: "BR1", label: "BR1" },
  { value: "BR2", label: "BR2" },
  { value: "BR3", label: "BR3" },
  { value: "BR4", label: "BR4" },
  { value: "BR5", label: "BR5" },
  { value: "BR6", label: "BR6" },
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

  // Load saved filters from localStorage
  const savedFilters = JSON.parse(localStorage.getItem("filters") || "{}");

  const [inputType, setInputType] = useState(savedFilters.inputType || null);
  const [inputDateAfter, setInputDateAfter] = useState(
    savedFilters.inputDateAfter ? new Date(savedFilters.inputDateAfter) : null
  );
  const [inputMinPrice, setInputMinPrice] = useState(savedFilters.inputMinPrice || null);
  const [inputMaxPrice, setInputMaxPrice] = useState(savedFilters.inputMaxPrice || null);
  const [inputMinBedrooms, setInputMinBedrooms] = useState(savedFilters.inputMinBedrooms || null);
  const [inputMaxBedrooms, setInputMaxBedrooms] = useState(savedFilters.inputMaxBedrooms || null);
  const [inputPostcode, setInputPostcode] = useState(savedFilters.inputPostcode || null);

  // Favourites state
  const [favourites, setFavourites] = useState(() => {
    const saved = localStorage.getItem("favourites");
    return saved ? JSON.parse(saved) : [];
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    const filters = {
      inputType,
      inputDateAfter: inputDateAfter ? inputDateAfter.toISOString() : null,
      inputMinPrice,
      inputMaxPrice,
      inputMinBedrooms,
      inputMaxBedrooms,
      inputPostcode,
    };
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [
    inputType,
    inputDateAfter,
    inputMinPrice,
    inputMaxPrice,
    inputMinBedrooms,
    inputMaxBedrooms,
    inputPostcode,
  ]);

  // Favourites functions
  const addToFavourites = (property) => {
    setFavourites((prev) => {
      if (prev.find((p) => p.id === property.id)) return prev;
      const newFavourites = [...prev, property];
      localStorage.setItem("favourites", JSON.stringify(newFavourites));
      return newFavourites;
    });
  };

  const removeFromFavourites = (id) => {
    setFavourites((prev) => {
      const newFavourites = prev.filter((p) => p.id !== id);
      localStorage.setItem("favourites", JSON.stringify(newFavourites));
      return newFavourites;
    });
  };

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
        (!inputMinPrice || property.price >= inputMinPrice.value) &&
        (!inputMaxPrice || property.price <= inputMaxPrice.value);
      const bedroomsMatch =
        (!inputMinBedrooms || Number(property.bedrooms) >= Number(inputMinBedrooms)) &&
        (!inputMaxBedrooms || Number(property.bedrooms) <= Number(inputMaxBedrooms));
      const dateMatch =
        !inputDateAfter ||
        new Date(
          property.added.year,
          new Date(`${property.added.month} 1`).getMonth(),
          property.added.day
        ) >= inputDateAfter;
      const postcodeMatch =
        !inputPostcode || property.location.toLowerCase().includes(inputPostcode.toLowerCase());

      return typeMatch && priceMatch && bedroomsMatch && dateMatch && postcodeMatch;
    });

    setFilteredProperties(filtered);
  };

  // Automatically apply filters on load
  useEffect(() => {
    if (properties.length > 0) applyFilters();
  }, [properties]);

  // Reusable React Select styles
  const selectStyles = {
    control: (provided) => ({ ...provided, color: "black" }),
    singleValue: (provided) => ({ ...provided, color: "black" }),
    placeholder: (provided) => ({ ...provided, color: "black" }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "white",
      color: "black",
    }),
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
              You're just a few clicks away from your dream home
            </h2>

            <Select
              options={typeOptions}
              value={inputType}
              onChange={setInputType}
              placeholder="Select Type"
              isClearable
              styles={selectStyles}
            />
            <Select
              options={priceOptions}
              value={inputMinPrice}
              onChange={setInputMinPrice}
              placeholder="Min Price"
              isClearable
              styles={selectStyles}
            />
            <Select
              options={priceOptions}
              value={inputMaxPrice}
              onChange={setInputMaxPrice}
              placeholder="Max Price"
              isClearable
              styles={selectStyles}
            />
            <Select
              options={bedroomOptions}
              value={
                inputMinBedrooms
                  ? bedroomOptions.find((opt) => opt.value === Number(inputMinBedrooms))
                  : null
              }
              onChange={(selectedOption) =>
                setInputMinBedrooms(selectedOption ? selectedOption.value : null)
              }
              placeholder="Min Bedrooms"
              isClearable
              styles={selectStyles}
            />
            <Select
              options={bedroomOptions}
              value={
                inputMaxBedrooms
                  ? bedroomOptions.find((opt) => opt.value === Number(inputMaxBedrooms))
                  : null
              }
              onChange={(selectedOption) =>
                setInputMaxBedrooms(selectedOption ? selectedOption.value : null)
              }
              placeholder="Max Bedrooms"
              isClearable
              styles={selectStyles}
            />
            <Select
              options={postcodeOptions}
              value={inputPostcode ? postcodeOptions.find((opt) => opt.value === inputPostcode) : null}
              onChange={(selectedOption) => setInputPostcode(selectedOption ? selectedOption.value : null)}
              placeholder="Postal code"
              isClearable
              styles={selectStyles}
            />

            <DatePicker
              selected={inputDateAfter}
              onChange={(date) => setInputDateAfter(date)}
              placeholderText="Listed after"
              dateFormat="yyyy-MM-dd"
              className="date-picker"
            />

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