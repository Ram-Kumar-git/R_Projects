import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart } from "react-icons/fa";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

function FavoriteIcon({ restaurantName, restaurantAddress, imageUrl }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token); // 🔹 Get stored token
        if (!token) {
          console.warn("User is not authenticated!");
          return;
        }

        const response = await axios.get(
          "http://localhost:8085/api/favorites/user",
          {
            headers: { Authorization: `Bearer ${token}` }, // ✅ Pass token in headers
          }
        );

        const favoriteRestaurants = response.data || [];
        const isFav = favoriteRestaurants.some(
          (fav) =>
            fav.restaurantName === restaurantName &&
            fav.restaurantAddress === restaurantAddress
        );

        setIsFavorite(isFav);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [restaurantName, restaurantAddress]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token);
    if (!token) {
      alert("User is not authenticated!");
      return;
    }

    if (!isFavorite) {
      try {
        await axios.post(
          "http://localhost:8085/api/favorites/add",
          { restaurantName, restaurantAddress, imageUrl }, // ✅ Match DTO structure
          {
            headers: {
              Authorization: `Bearer ${token}`, // ✅ Include Authorization header
              "Content-Type": "application/json",
            },
          }
        );
        setIsFavorite(true);
        setSnackbarMessage(`Restaurant added to favorites!`);
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error adding to favorites:", error);
        alert("Failed to add favorite. Check backend connection.");
      }
    } else {
      try {
        await axios.delete("http://localhost:8085/api/favorites/remove", {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include Authorization header
            "Content-Type": "application/json",
          },
          data: { restaurantName, restaurantAddress, imageUrl }, // ✅ DELETE requests require `data`
        });
        setIsFavorite(false);
        setSnackbarMessage(`Restaurant removed from favorites!`);
        setOpenSnackbar(true);
      } catch (error) {
        console.error("Error removing from favorites:", error);
        alert("Failed to remove favorite.");
      }
    }
  };
  return (
    <>
      <FaHeart
        onClick={toggleFavorite}
        style={{
          color: isFavorite ? "red" : "gray",
          cursor: "pointer",
          fontSize: "22px",
          marginLeft: "10px",
        }}
      />

      {/* Snackbar Component */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setOpenSnackbar(false)}
          severity="success"
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default FavoriteIcon;
