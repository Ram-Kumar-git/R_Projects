import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CART_API_BASE_URL = "http://localhost:8086/api/cart";
const USER_API_BASE_URL = "http://localhost:8081/api/user-profiles/me";
const ORDER_API_BASE_URL = "http://localhost:8086/api/orders/place";

function OrderPage() {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantName, setRestaurantName] = useState(""); // New state for restaurant name
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const [orderDate, setOrderDate] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      fetchCustomerDetails();
      fetchCartItems();
      setOrderDate(new Date().toLocaleDateString());
    }
  }, []);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(USER_API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomer(response.data);
    } catch (error) {
      console.error("Error fetching customer details:", error.response?.data || error.message);
    }
  };

  const fetchCartItems = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${CART_API_BASE_URL}/getcart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data.items || []);

      // Extract restaurant name from the first item in the cart
      if (response.data.items.length > 0) {
        setRestaurantName(response.data.items[0].restaurantName || "Unknown Restaurant");
      }
    } catch (error) {
      console.error("Error fetching cart:", error.response?.data || error.message);
      setCartItems([]);
    }
  };

  const placeOrder = async () => {
    if (cartItems.length === 0) {
      alert("Cannot place order. Cart is empty!");
      return;
    }
    try {
      const response = await axios.post(
        `${ORDER_API_BASE_URL}?paymentMethod=cards`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/payment", { state: { amount: grossAmount } });
    } catch (error) {
      alert("Failed to place order. Try again!");
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxAmount = totalAmount * 0.05;
  const grossAmount = totalAmount + taxAmount;

  if (!customer || cartItems.length === 0) {
    return <h2>⏳ Loading Order Summary...</h2>;
  }

  return (
    <div style={{ padding: "20px", marginLeft: "50px", textAlign: "left" }}>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          right: "20px",
          padding: "10px",
          background: "transparent",
          color: "red",
          fontSize: "40px",
          border: "none",
          cursor: "pointer",
          top: "1px",
        }}
      >
        🏠
      </button>

      <button
        onClick={() => navigate("/cart")}
        style={{
          position: "absolute",
          left: "20px",
          padding: "10px",
          background: "#ff0022",
          color: "white",
          fontSize: "15px",
          border: "none",
          cursor: "pointer",
          borderRadius: "25px",
        }}
      >
        🛒⬅ Cart
      </button>

      <h2 style={{ color: "#04030f", textAlign: "center" }}>Order Summary</h2>

      {/* Display Restaurant Name */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <strong>🏬 Restaurant:</strong> {restaurantName}
      </div>

      {/* Order Date Display */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <strong>📅 Order Date:</strong> {orderDate}
      </div>

      {/* Layout for Customer Details & Items List with Extra Margin */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginTop: "30px" }}>
        {/* Customer Details on Left */}
        <div style={{ width: "45%" , fontSize: "18px", backgroundColor: "#f8e9f2", padding: "40px", borderRadius: "10px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}>
          <h4>👤 Customer Details</h4>
          <p><strong>Name:</strong> {customer.fullName}</p>
          <p><strong>Email:</strong> {customer.userEmail}</p>
          <p><strong>Phone:</strong> {customer.phoneNumber}</p>
          <p><strong>Address:</strong> {customer.address}</p>
        </div>

        {/* Items List on Right */}
        <div style={{ width: "45%", textAlign: "left"}}>
          <h4>🛒 Items</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cartItems.map((item, index) => (
              <li key={index}>
                <strong>{item.itemName}</strong> - {item.quantity} x ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Order Summary */}
      <div style={{ textAlign: "right", marginTop: "20px", marginRight: "75px" , color: "#04030f"}}>
        <h5>Total Amount: ₹{totalAmount.toFixed(2)}</h5>
        <h5>GST (5%): ₹{taxAmount.toFixed(2)}</h5>
        <h4>Gross Amount: ₹{grossAmount.toFixed(2)}</h4>
      </div>

      {/* Centered Button */}
      <div style={{ display: "flex", justifyContent: "right", marginTop: "20px", marginRight: "75px" }}>
        <button
          onClick={placeOrder}
          style={{
            padding: "10px",
            background: "#28a745",
            color: "white",
            fontSize: "18px",
            border: "none",
            cursor: "pointer",
            borderRadius: "5px",
            fontWeight: "bold",
          }}
        >
          ✅ Proceed to Payment
        </button>
      </div>
    </div>
  );
}

export default OrderPage;
