import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8086/api/cart";

function CartService() {
  const [cart, setCart] = useState({ items: [] });
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ Fetch Cart on Mount
  useEffect(() => {
    if (token) fetchCart();
  }, []);

  const fetchCart = async () => {
    if (!token) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/getcart`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🚀 Cart Response:", response.data);

      const cartItems = response.data.items || [];

      // ✅ Extract restaurant name from first item
      const restaurantName =
        cartItems.length > 0
          ? cartItems[0].restaurantName
          : "Unknown Restaurant";

      setCart({
        restaurantName: restaurantName,
        items: cartItems,
      });

      setCartCount(cartItems.length);
    } catch (error) {
      console.error(
        "❌ Error fetching cart:",
        error.response?.data || error.message
      );
    }
  };

  const updateQuantity = async (itemName, quantity) => {
    if (!itemName) return;
    if (quantity < 1) return removeFromCart(itemName);

    try {
      await axios.put(
        `${API_BASE_URL}/update-quantity?cartItemId=${encodeURIComponent(
          itemName
        )}&quantity=${quantity}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchCart();
    } catch (error) {
      console.error(
        "❌ Error updating quantity:",
        error.response?.data || error.message
      );
    }
  };

  const removeFromCart = async (itemName) => {
    if (!itemName) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/remove?cartItemId=${encodeURIComponent(itemName)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setCart((prevCart) => ({
        ...prevCart, // Preserve other cart properties
        items: prevCart.items.filter((item) => item.itemName !== itemName),
      }));

      setCartCount((prevCount) => Math.max(0, prevCount - 1)); // Prevent negative count
    } catch (error) {
      console.error(
        "❌ Error removing item:",
        error.response?.data || error.message
      );
    }
  };

  const handleCheckout = () => {
    if (!token) {
      alert("🚨 Please log in to proceed with checkout.");
      return;
    }

    if (cart.length === 0) {
      alert("🚫 Your cart is empty! Add items before checking out.");
      return;
    }

    navigate("/order");
  };

  const grossTotal =
    cart?.items && Array.isArray(cart.items)
      ? cart.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        )
      : 0;

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <button
        onClick={() => navigate("/")}
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

      <button
        onClick={() => navigate(-1)}
        style={{
          padding: "10px",
          background: "#ff0022",
          color: "white",
          fontSize: "15px",
          border: "none",
          cursor: "pointer",
          marginBottom: "10px",
          position: "absolute",
          left: "20px",
          borderRadius: "25px",
        }}
      >
        🍽⬅ Menu
      </button>

      <h2 style={{ color: "#04030f" }}>Your Cart ({cartCount})</h2>

      {/* ✅ Display restaurant name if cart has items */}
      {cart.items.length > 0 && (
        <h3
          style={{
            padding: "10px",
            borderRadius: "10px",
            textAlign: "center",
            width: "80%",
            margin: "auto",
            color: "#D35400",
          }}
        >
          Restaurant: {cart.restaurantName}
        </h3>
      )}

      {!cart || cart.length === 0 ? (
        <p>🛒 Your cart is empty.</p>
      ) : (
        <>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              backgroundColor: "#f8e9f2",
              border: "1px solid #ddd",
              borderRadius: "10px",
              width: "80%",
              margin: "auto",
            }}
          >
            {cart.items.map((item) => (
              <li
                key={item.itemName}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #ddd",
                  paddingBottom: "10px",
                  marginTop: "15px",
                  marginLeft: "10px",
                  paddingTop: "10px",
                }}
              >
                {/* 🖼 Item Image */}
                <img
                  src={item.imageUrl}
                  alt={item.itemName}
                  style={{
                    width: "10%",
                    height: "100px",
                    borderRadius: "10px",
                    objectFit: "fill",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/imgnotfound.jpg";
                  }}
                />

                {/* 📌 Item Name & Price */}
                <div
                  style={{
                    flex: "2",
                    textAlign: "left",
                    paddingLeft: "10px",
                    color: "#04030f",
                  }}
                >
                  <strong>{item.itemName}</strong>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                {/* ➕ ➖ Quantity Controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    gap: "8px",
                    backgroundColor: "white",
                  }}
                >
                  <button
                    onClick={() =>
                      updateQuantity(item.itemName, item.quantity - 1)
                    }
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.itemName, item.quantity + 1)
                    }
                    style={{
                      background: "transparent",
                      border: "none",
                      fontSize: "18px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>

                {/* 💰 Total Amount */}
                <strong
                  style={{ flex: "1", textAlign: "center", color: "green  " }}
                >
                  ₹{(item.price * item.quantity).toFixed(2)}
                </strong>

                {/* 🗑 Remove Button */}
                <button
                  onClick={() => removeFromCart(item.itemName)}
                  style={{
                    background: "red",
                    border: "none",
                    fontSize: "18px",
                    color: "red",
                    cursor: "pointer",
                    marginRight: "15px",
                  }}
                >
                  🗑
                </button>
              </li>
            ))}
          </ul>

          {/* ✅ Show Total and Checkout button only if cart has items */}
          {cart?.items?.length > 0 && (
            <>
              <h3 style={{ marginTop: "20px", color: "#04030f" }}>
                Total Amount: ₹{grossTotal.toFixed(2)}
              </h3>

              <button
                onClick={handleCheckout}
                style={{
                  padding: "10px",
                  background: "#28a745",
                  color: "white",
                  fontSize: "16px",
                  border: "none",
                  cursor: "pointer",
                  marginTop: "20px",
                  fontWeight: "bold",
                }}
              >
                Checkout
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default CartService;
