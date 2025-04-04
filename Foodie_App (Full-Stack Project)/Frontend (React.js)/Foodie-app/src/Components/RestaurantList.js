import React, { useState, useEffect } from "react";
import axios from "axios"; // Using Axios for API call
import { useNavigate } from "react-router-dom";

const RestaurantsList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch restaurants from backend API
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8084/api/restaurants"
        ); // Replace with your actual API URL
        setRestaurants(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 10);
  };

  const handleCloseTab = () => {
    window.close(); // Close the tab when clicked
  };

  // Function to open Google Maps with the restaurant's address
  const openGoogleMaps = (name, address) => {
    const formattedQuery = encodeURIComponent(`${name}, ${address}`);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${formattedQuery}`,
      "_blank"
    );
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      {/* Header with Back Button */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ color: "#04030f", textAlign: "center", flexGrow: 1 }}>
          Restaurants available for Dining!
        </h2>
        <button
        onClick={() => navigate("/")}
        style={{
          padding: "10px",
          background: "transparent",
          color: "red",
          fontSize: "40px",
          border: "none",
          cursor: "pointer",
          marginBottom: "10px",
          position: "absolute",
          right: "20px",
        }}
      >
        🏠
      </button>
      </div>

      {loading ? (
        <p>Loading restaurants...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : restaurants.length === 0 ? (
        <p>No restaurants available.</p>
      ) : (
        <ul
          style={{
            listStyleType: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {restaurants.slice(0, visibleCount).map((restaurant) => (
            <li
              key={restaurant.id}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "10px",
                cursor: "pointer",
                color: "#007BFF",
                backgroundColor: "#fff",
                textAlign: "center",
                boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              onClick={() =>
                openGoogleMaps(restaurant.name, restaurant.address)
              }
            >
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
              <h3 style={{ margin: "10px 0", fontSize: "16px", color: "#333" }}>
                {restaurant.name}
              </h3>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {restaurant.address}
              </p>
            </li>
          ))}
        </ul>
      )}

      {visibleCount < restaurants.length && (
        <button
          onClick={handleShowMore}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            cursor: "pointer",
            backgroundColor: "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Show More
        </button>
      )}
    </div>
  );
};

export default RestaurantsList;