import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./App.css";

function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}properties.json`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.properties.find((p) => p.id === id);
        setProperty(found);
      })
      .catch((err) => console.error("Error loading JSON:", err));
  }, [id]);

  if (!property) return <p>Loading property...</p>;

  // Prepare images for react-image-gallery
  const galleryImages = property.images.map((img) => ({
    original: `${import.meta.env.BASE_URL}${img}`,
    thumbnail: `${import.meta.env.BASE_URL}${img}`,
  }));

  return (
    <div className="property-page">
      {/* Image gallery */}
      <ImageGallery
        items={galleryImages}
        showPlayButton={false}
        showFullscreenButton={false}
        thumbnailPosition="bottom"
      />

      {/* Desktop table */}
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
          <tr>
            <td>{property.type}</td>
            <td>${Number(property.price).toLocaleString()}</td>
            <td>{property.bedrooms}</td>
            <td>{property.location}</td>
          </tr>
        </tbody>
      </table>

      {/* Mobile table */}
      <table className="property-details-table-mobile">
        <tbody>
          <tr>
            <th>🏠 Type</th>
            <td>{property.type}</td>
          </tr>
          <tr>
            <th>💵 Price</th>
            <td>${Number(property.price).toLocaleString()}</td>
          </tr>
          <tr>
            <th>🛏️ Bedrooms</th>
            <td>{property.bedrooms}</td>
          </tr>
          <tr>
            <th>📍 Location</th>
            <td>{property.location}</td>
          </tr>
        </tbody>
      </table>

      {/* Tabs */}
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
            <img src={property.floor} alt="Floor plan" className="floor-plan" />
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

      {/* Back button */}
      <div className="back-button-container">
        <Link to="/" className="back-button">
          ← Back
        </Link>
      </div>
    </div>
  );
}

export default PropertyPage;