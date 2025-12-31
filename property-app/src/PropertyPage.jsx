import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./App.css";

function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    fetch("/properties.json")
      .then((res) => res.json())
      .then((data) => {
        const found = data.properties.find((p) => p.id === id);
        setProperty(found);
        setSelectedIndex(0);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, [id]);

  if (!property) return <p>Loading property...</p>;

  const prevImage = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="property-page">
      {/* Back button at top-left */}
      {/* Main image with arrows */}
      <div className="main-image-container">
        <img
          src={property.images[selectedIndex]}
          alt="Main property"
          className="main-image"
        />
        <button onClick={prevImage} className="left-arrow">‹</button>
        <button onClick={nextImage} className="right-arrow">›</button>
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

      {/*Table for displaying property type, price, no. of bedrooms, and location */}
      <table className="property-details-table">
        <thead>
          <tr>
            <th>🏠 Type</th>
            <th>💵 Price</th>
            <th>🛏️ Bedrooms</th>
            <th>📍 Location</th>
          </tr>
        </thead>
        <tbody>
          <td>{property.type}</td>
          <td>${Number(property.price).toLocaleString()}</td>
          <td>{property.bedrooms}</td>
          <td>{property.location}</td>
        </tbody>
      </table>

      {/* The react tabs */}
      <div className="tab-container">
        <Tabs>
          <TabList>
            <Tab>Description</Tab>
            <Tab>Floor Plan</Tab>
            <Tab>Map</Tab>
          </TabList>

          <TabPanel>
            <p className="description">{property.description}</p>
          </TabPanel>

          <TabPanel>
            <img src={property.floor} alt="Floor plan" className="floor-plan"/>
          </TabPanel>

          <TabPanel>
            <div className="map-container">
              <iframe
                src={property.map}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="google-map"
              ></iframe>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      <div className="back-button-container">
        <Link to="/" className="back-button">← Back</Link>
      </div>
    </div>
  );
}

export default PropertyPage;