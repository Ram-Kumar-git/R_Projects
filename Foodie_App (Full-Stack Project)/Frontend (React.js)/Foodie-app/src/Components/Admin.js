// src/pages/Admin.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8086/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const headerStyle = {
    padding: "10px",
    border: "1px solid #ddd",
  };
  
  const cellStyle = {
    padding: "10px",
    border: "1px solid #ddd",
  };
  

  return (
    <div style={{ padding: "20px" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          right: "20px",
          padding: "10px",
          fontSize: "30px",
          background: "transparent",
          color: "red",
          border: "none",
          cursor: "pointer",
        }}
      >
        🏠
      </button>

      <h2
        style={{ textAlign: "center", marginBottom: "20px", color: "#212529" }}
      >
        Admin Dashboard
      </h2>

      {/* Dropdown Menu */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        <select
          onChange={(e) => navigate(e.target.value)}
          style={{
            padding: "10px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          <option value="">Select Option</option>
          <option value="/pending-restaurants">
            View Pending Restaurant Requests
          </option>
        </select>
      </div>

      <h3
  style={{
    textAlign: "center",
    marginBottom: "15px",
    color: "#007bff",
    fontSize: "20px",
  }}
>
  All Orders
</h3>

<table
  style={{
    width: "100%",
    borderCollapse: "collapse",
    border: "2px solid #007bff",
    fontSize: "14px",
    textAlign: "left",
  }}
>
  <thead>
    <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
      <th style={headerStyle}>Order ID</th>
      <th style={headerStyle}>User Email</th>
      <th style={headerStyle}>Restaurant</th>
      <th style={headerStyle}>Items</th>
      <th style={headerStyle}>Total Price</th>
      <th style={headerStyle}>Status</th>
      <th style={headerStyle}>Payment Method</th>
      <th style={headerStyle}>Order Date</th>
    </tr>
  </thead>
  <tbody>
    {orders.map((order, index) => (
      <tr
        key={order.orderId}
        style={{
          backgroundColor: index % 2 === 0 ? "#fff" : "#f9f9f9",
          borderBottom: "1px solid #ddd",
          transition: "background 0.3s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#e3f2fd")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = index % 2 === 0 ? "#fff" : "#f9f9f9")
        }
      >
        <td style={cellStyle}>{order.orderId}</td>
        <td style={cellStyle}>{order.userEmail}</td>
        <td style={cellStyle}>{order.restaurantName}</td>
        <td style={cellStyle}>
          {order.items.map((item) => `${item.itemName} (${item.quantity})`).join(", ")}
        </td>
        <td style={cellStyle}>₹{order.totalAmount.toFixed(2)}</td>
        <td style={cellStyle}>{order.status}</td>
        <td style={cellStyle}>{order.paymentMethod}</td>
        <td style={cellStyle}>{new Date(order.orderDate).toLocaleString()}</td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
  );
};

export default Admin;
