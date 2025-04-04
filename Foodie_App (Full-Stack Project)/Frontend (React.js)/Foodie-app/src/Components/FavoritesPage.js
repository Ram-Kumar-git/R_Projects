import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [quantities, setQuantities] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        alert("User is not authenticated!");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8085/api/favorites/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const uniqueFavorites = response.data.reduce((acc, fav) => {
          if (!acc.some((item) => item.id === fav.id)) {
            acc.push(fav);
          }
          return acc;
        }, []);

        setFavorites(uniqueFavorites);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        alert("Failed to load favorites.");
      }
    };

    fetchFavorites();
  }, [token]);
  const navigate = useNavigate();

  const increaseQuantity = (index) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: (prev[index] || 0) + 1,
    }));
  };

  const decreaseQuantity = (index) => {
    setQuantities((prev) => ({
      ...prev,
      [index]: prev[index] > 0 ? prev[index] - 1 : 0,
    }));
  };


  const removeFavorite = async (restaurant) => {
    if (!token) {
      alert("User is not authenticated!");
      return;
    }

    try {
      await axios.delete("http://localhost:8085/api/favorites/remove", {
        headers: { Authorization: `Bearer ${token}` },
        data: {
          restaurantName: restaurant.restaurantName,
          restaurantAddress: restaurant.restaurantAddress,
        },
      });

      setFavorites(favorites.filter((fav) => fav.id !== restaurant.id));
      if (selectedRestaurant === restaurant.id) {
        setSelectedRestaurant(null);
        setMenu([]);
      }
    } catch (error) {
      console.error(
        "Error removing favorite:",
        error.response?.data || error.message
      );
      alert(
        `Failed to remove favorite: ${error.response?.data || error.message}`
      );
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", position: "relative" }}>
      {/* Home Button */}
      <button
        onClick={() => window.close()}
        style={{
          padding: "10px",
          background: "transparent",
          color: "red",
          fontSize: "30px",
          border: "none",
          cursor: "pointer",
          marginBottom: "10px",
          position: "absolute",
          right: "20px",
        }}
      >
        🏠
      </button>
      
      <h2 style={{ color: "#04030f" }}>Favorites</h2>

      {favorites.length === 0 ? (
        <p>No favorite restaurants yet.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {favorites.map((fav) => (
            <div
              key={fav.id}
              style={{
                backgroundColor: "white",
                boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "center",
                position: "relative",
                maxWidth: "350px",
                margin: "0 auto",
                border: "1px solid lightgray",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
              onClick={() =>
                navigate(
                  `/search?query=${encodeURIComponent(
                    fav.restaurantName.replace(/\|/g, "%7C")
                  )}`
                )
              }
            >
              {/* Restaurant Image */}
              <img
                src={fav.imageUrl}
                alt={fav.restaurantName}
                style={{
                  width: "100%",
                  height: "130px",
                  borderRadius: "10px",
                  objectFit: "fill",
                }}
              />

              {/* Restaurant Name */}
              <h3 style={{ margin: "5px 0", color: "#0056b3" }}>
                {fav.restaurantName}
              </h3>

              {/* Restaurant Address */}
              <p style={{ color: "gray", fontSize: "12px", flexGrow: 1 }}>
                {fav.restaurantAddress}
              </p>

              {/* Remove Button (Now Aligned Properly) */}
              <div style={{ marginTop: "auto", paddingTop: "10px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent fetchMenu from triggering
                    removeFavorite(fav);
                  }}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "70%",
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {selectedRestaurant && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f8f8f8",
            borderRadius: "10px",
            boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "70%",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h4 style={{ color: "#0056b3", marginBottom: "15px" }}>
            {
              favorites.find((fav) => fav.id === selectedRestaurant)
                ?.restaurantName
            }{" "}
            Menu
          </h4>

          {/* Grid layout for uniform menu cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
              justifyContent: "center",
            }}
          >
            {menu.map((item, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: "white",
                  padding: "10px",
                  borderRadius: "10px",
                  boxShadow: "2px 4px 8px rgba(0, 0, 0, 0.1)",
                  textAlign: "center",
                  minWidth: "150px", // Ensure minimum width
                  maxWidth: "200px", // Set a maximum width
                  height: "230px", // Fixed height for all cards
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                {/* Menu Image */}
                <img
                  src={item.imageUrl || "https://via.placeholder.com/150"}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "80px",
                    objectFit: "fit",
                    borderRadius: "5px",
                  }}
                />

                {/* Menu Name */}
                <h5
                  style={{ fontSize: "14px", margin: "5px 0", color: "#333" }}
                >
                  {item.name}
                </h5>

                {/* Price */}
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#0056b3",
                  }}
                >
                  ₹{item.price}
                </p>

                {/* Quantity & Add to Cart */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    onClick={() => decreaseQuantity(index)}
                    style={{
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      padding: "7px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <span>{quantities[index] || 0}</span>
                  <button
                    onClick={() => increaseQuantity(index)}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      padding: "7px 10px",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
