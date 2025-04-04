// src/components/PendingRestaurants.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PendingRestaurants = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8084/api/restaurants/pending", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setPendingRestaurants(response.data))
      .catch((error) =>
        console.error("Error fetching pending restaurants:", error)
      );
  }, []);

  const handleRestaurantAction = async (restaurantId, action) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        `http://localhost:8084/api/restaurants/${action}/${restaurantId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Restaurant ${action} successfully!`);
      setPendingRestaurants(
        pendingRestaurants.filter((r) => r.id !== restaurantId)
      );
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
      alert(`Failed to ${action} restaurant.`);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/")} style={{ marginBottom: "10px" }}>
        ⬅ Back
      </button>

      <h2 style={{ textAlign: "center", color: "#28a745" }}>
        Pending Restaurant Approvals
      </h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          border: "1px solid #ddd",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f4f4f4", textAlign: "left" }}>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Restaurant Name
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Address
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Cuisine
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Image
            </th>
            <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {pendingRestaurants.length === 0 ? (
            <tr>
              <td
                colSpan="5"
                style={{
                  textAlign: "center",
                  padding: "12px",
                  fontStyle: "italic",
                }}
              >
                No pending approvals.
              </td>
            </tr>
          ) : (
            pendingRestaurants.map((restaurant) => (
              <tr key={restaurant.id} style={{ backgroundColor: "#fff" }}>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {restaurant.name}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {restaurant.address}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  {restaurant.cuisine}
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    style={{ width: "60px", height: "60px" }}
                  />
                </td>
                <td style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>
                  <button
                    onClick={() =>
                      handleRestaurantAction(restaurant.id, "approve")
                    }
                    style={{
                      padding: "8px",
                      backgroundColor: "#28a745",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "5px",
                    }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() =>
                      handleRestaurantAction(restaurant.id, "reject")
                    }
                    style={{
                      padding: "8px",
                      backgroundColor: "#dc3545",
                      color: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingRestaurants;
