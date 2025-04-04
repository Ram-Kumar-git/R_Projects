import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteIcon from "./FavoriteIcon"; // Import the FavoriteIcon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";


function RestaurantSearch() {
  const [query, setQuery] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [menus, setMenus] = useState({});
  const [cartItems, setCartItems] = useState([]);
   // Snackbar state
   const [snackbarOpen, setSnackbarOpen] = useState(false);
   const [snackbarMessage, setSnackbarMessage] = useState("");
   const [snackbarSeverity, setSnackbarSeverity] = useState("success");
 

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("query");

    if (searchQuery) {
      setQuery(searchQuery);
      fetchRestaurants(searchQuery);
    }
  }, [location.search]);

  const showSnackbar = (message, severity = "success") => {
    console.log("📢 Snackbar Triggered:", message, severity); // Debug Log
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  const increaseQuantity = async (restaurant, item) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("User not authenticated. Please log in.", "error");
        setTimeout(() => {
          navigate("/");
        }, 3000);
        return;
      }

      console.log("✅ Increasing quantity for:", item);
      console.log("📌 Restaurant Name:", restaurant.name);

      let existingCartItems = [];

      try {
        // 🔥 Fetch existing cart from backend
        const cartResponse = await axios.get(
          "http://localhost:8086/api/cart/getcart",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("🔥 Fetched Cart Response:", cartResponse.data);
        existingCartItems = cartResponse.data.items || [];
      } catch (error) {
        if (error.response?.status === 404) {
          console.warn("🚨 Cart not found, assuming empty cart.");
          existingCartItems = []; // Initialize empty cart
        } else {
          console.error(
            "🚨 Unexpected error fetching cart:",
            error.response?.data || error.message
          );
          showSnackbar("Failed to retrieve cart.", "error");
          return;
        }
      }

      // 🔍 Find the item in the cart
      const existingItemIndex = existingCartItems.findIndex(
        (cartItem) => cartItem.itemName === item.name
      );

      if (existingItemIndex !== -1) {
        existingCartItems[existingItemIndex].quantity += 1;
      } else {
        existingCartItems.push({
          itemName: item.name,
          price: item.price,
          quantity: 1,
          imageUrl: item.imageUrl,
        });
      }

      console.log(
        "📌 Updated Cart Before Sending:",
        JSON.stringify(existingCartItems, null, 2)
      );

      // 🔥 Debug: Check final request payload
      const requestPayload = {
        restaurantName: restaurant.name,
        items: existingCartItems,
      };
      console.log(
        "📤 Sending to API:",
        JSON.stringify(requestPayload, null, 2)
      );

      // 🔄 Update cart via backend
      const response = await axios.post(
        "http://localhost:8086/api/cart/add",
        requestPayload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Cart updated successfully:", response.data);

      // 🔥 Fetch updated cart from backend to ensure changes reflect
      const updatedCartResponse = await axios.get(
        "http://localhost:8086/api/cart/getcart",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("🚀 Updated Cart from Backend:", updatedCartResponse.data);

      // **Ensure React state updates properly**
      setCartItems([...updatedCartResponse.data.items]);
      showSnackbar(`Item added to cart successfully`);
    } catch (error) {
      console.error(
        "🚨 Error updating quantity:",
        error.response?.data || error.message
      );

      if (error.response) {
        console.error(
          "📛 Full Error Response:",
          JSON.stringify(error.response.data, null, 2)
        );
      }

      showSnackbar("Failed to add item to cart.", "error");
    }
  };

  const decreaseQuantity = async (item) => {
    try {
      const token = localStorage.getItem("token");

      console.log("Decreasing quantity for item:", item);

      // Encode the itemName to make sure it's URL-safe
      const encodedItemName = encodeURIComponent(item.name);

      // Send the request to the backend with the encoded item name as a query parameter
      const response = await axios.delete(
        `http://localhost:8086/api/cart/remove?cartItemId=${encodedItemName}`, // Using query parameter
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Cart response:", response.data);

      // Update cart state to reflect the decrease in quantity
      setCartItems((prevCart) => {
        const updatedCart = prevCart
          .map((cartItem) =>
            cartItem.itemName === item.name // Compare by itemName
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
          .filter((cartItem) => cartItem.quantity > 0); // Remove items with quantity 0

        return [...updatedCart]; // Ensure React detects change
      });
      showSnackbar(`Item removed from cart successfully`, "info");
    } catch (error) {
      console.error(
        "Error decreasing quantity in cart:",
        error.response?.data || error.message
      );
      showSnackbar("Failed to remove item from cart.", "error");
    }
  };


  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("🚨 No token found! User must be logged in.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8086/api/cart/getcart`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("✅ Cart fetched successfully:", response.data);
      setCartItems(response.data.items || []); // Ensure it updates
    } catch (error) {
      console.error("🚨 Failed to fetch cart. Session might have expired.");
    }
  };

  useEffect(() => {
    fetchCart(); // Fetch cart on component mount
  }, []);

  const fetchRestaurants = async (searchQuery) => {
    try {
      const response = await axios.get(
        `http://localhost:8084/api/restaurants/search?restaurantName=${searchQuery}`
      );
      const uniqueRestaurants = Array.from(
        new Map(
          response.data.map((item) => [item.name + item.address, item])
        ).values()
      );
      setRestaurants(uniqueRestaurants);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      alert("Failed to fetch restaurants. Check backend connection.");
    }
  };
  const fetchMenu = async (restaurantName) => {
    setMenus({});
    setSelectedRestaurant(restaurantName);

    try {
      const response = await axios.get(
        `http://localhost:8084/api/restaurants/${restaurantName}/menu`
      );
      setMenus((prevMenus) => ({
        ...prevMenus,
        [restaurantName]: response.data,
      }));
    } catch (error) {
      console.error("Error fetching menu:", error);
      alert("Failed to fetch menu. Check backend connection.");
    }
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };
  const handleRestaurantClick = (restaurantName) => {
    if (selectedRestaurant === restaurantName) {
      setSelectedRestaurant("");
      setMenus({});
    } else {
      fetchMenu(restaurantName);
    }
  };

  return (
    <div
      style={{
        maxWidth: "2000px",
        margin: "20px auto",
        textAlign: "center",
        fontFamily: "Arial",
        color: "black",
        padding: "10px",
        minHeight: "1 00vh",
        position: "relative",
      }}
    >
      {/* Show Home button only if NOT on the home page */}
      {!isHomePage && (
        <button
          onClick={() => (window.location.href = "/")}
          style={{
            padding: "0 0 37px 0",
            background: "transparent",
            color: "red",
            fontSize: "35px",
            border: "none",
            cursor: "pointer",
            position: "absolute",
            top: "2px",
            right: "20px",
          }}
        >
          🏠
        </button>
      )}
      {/* Display error message if it exists */}
      {/* {errorMessage && <p style={{ color: "red", fontWeight: "bold", backgroundColor:"white", top:"10px" }}>{errorMessage}</p>} */}

      {/* Search Bar should always be visible */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          className="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for restaurants or foods..."
          style={{
            padding: "10px",
            width: "400px",
            height: "40px",
            fontSize: "18px",
            borderRadius: "10px",
            color: "black",
            textAlign: "center",
            outline: "none",
            border: "1px solid gray",
            caretColor: "black",
          }}
        />

        {/* Search Button */}
        <button
          onClick={handleSearch}
          style={{
            padding: "5px 15px",
            fontSize: "18px",
            borderRadius: "10px",
            backgroundColor: "#ff0022",
            color: "white",
            cursor: "pointer",
            boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          Search
        </button>
      </div>

      {/* Restaurant List (Only appears after search) */}
      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {restaurants.map((restaurant) => (
          <li
            key={`${restaurant.name}-${restaurant.address || "unknown"}`} // Unique Key
            style={{
              padding: "15px",
              border: "1px solid gray",
              margin: "10px 0",
              borderRadius: "10px",
              backgroundColor: "#FFEFD5",
              boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
              fontSize: "18px",
              fontWeight: "bold",
              transition: "background-color 0.3s ease",
              width: "80%",
              marginLeft: "140px",
            }}
          >
            <button
              onClick={() => navigate("/cart", { state: { cart: cartItems } })}
              style={{
                position: "absolute",
                top: "10px",
                right: "100px",
                padding: "5px 10px",
                fontSize: "18px",
                borderRadius: "10px",
                backgroundColor: "#04030f",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
            <FontAwesomeIcon icon={faShoppingCart} size="lg" />(
              {(cartItems ?? []).reduce(
                (total, item) => total + item.quantity,
                0
              )}
              )
            </button>

            <div
              onClick={() => handleRestaurantClick(restaurant.name)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                width="100"
              />
              <span>
                {restaurant.name} - {restaurant.address}
              </span>
              <FavoriteIcon
                restaurantName={restaurant.name}
                restaurantAddress={restaurant.address}
                imageUrl={restaurant.imageUrl}
              />
            </div>
            {selectedRestaurant === restaurant.name &&
              menus[restaurant.name] && (
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "15px",
                  }}
                >
                  {menus[restaurant.name].map((item, index) => (
                    <div
                      key={index}
                      style={{
                        width: "250px",
                        border: "1px solid lightgray",
                        borderRadius: "10px",
                        padding: "10px",
                        backgroundColor: "#edfdfb",
                        boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                        cursor: "pointer",
                        textAlign: "center",
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between", // Ensures consistent spacing
                        paddingBottom: "50px", // Space for buttons
                        minHeight: "250px", // Ensures card height remains fixed
                      }}
                    >
                      <img
                        src={item.imageUrl}
                        alt="{item.name}"
                        onError={(e) => (e.target.src = "/imgnotfound.jpg")}
                        style={{
                          width: "100%",
                          height: "100px",
                          borderRadius: "10px",
                          objectFit: "fill",
                        }}
                      />
                      <p
                        style={{
                          fontWeight: "bold",
                          marginTop: "5px",
                          fontSize: "14px",
                          minHeight: "30px", // Ensures consistent space for different name lengths
                        }}
                      >
                        {item.name}
                      </p>
                      <p style={{ color: "green", fontSize: "14px", marginTop: "5px" }}>
                        ₹{item.price}
                      </p>

                      {/* ADD button with quantity controls */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px", // Adjust as needed
                          left: "50%",
                          transform: "translateX(-50%)", // Center align
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          padding: "1px",
                          width: "35%", // Optional, if you want full width
                          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                        // Prevent triggering parent onClick
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevents event bubbling
                            decreaseQuantity(item); // Only pass `item`, not `e`
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "25px",
                            color: item.quantity > 1 ? "#2ca862" : "red", // Red color for delete action
                            cursor: "pointer",
                          }}
                        >
                          &#8722;
                        </button>
                        {/* Display updated quantity here */}
                        <span style={{ margin: "0 10px", fontSize: "16px" }}>
                          {cartItems?.find(
                            (cartItem) => cartItem.itemName === item.name
                          )?.quantity ?? 0}
                        </span>

                        {/* Plus Button */}
                        <button
                          onClick={() => increaseQuantity(restaurant, item)}
                          style={{
                            background: "transparent",
                            border: "none",
                            fontSize: "25px",
                            color: "#2ca862",
                            cursor: "pointer",
                          }}
                        >
                          &#43;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </li>
        ))}
      </ul>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <MuiAlert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ fontSize: "0.8rem", padding: "15px 20px", minWidth: "200px" }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </div>
  );
}

export default RestaurantSearch;
