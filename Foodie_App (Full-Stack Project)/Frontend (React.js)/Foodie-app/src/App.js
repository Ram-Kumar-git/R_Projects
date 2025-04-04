import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import ProtectedRoute from "./Components/ProtectedRoute";
import Header from "./Components/Header";
import RestaurantSearch from "./Components/RestaurantSearch";
import RestaurantCard from "./Components/RestaurantCard";
import RestaurantsList from "./Components/RestaurantList";
import OrderOnline from "./Components/OrderOnline";
import Footer from "./Components/Footer";
import FavoritesPage from "./Components/FavoritesPage";
import CartService from "./Components/CartService";
import PopularRestaurants from "./Components/PopularRestaurants";
import FAQ from "./Components/Faq";
import OrderPage from "./Components/Orderpage";
import RestaurantSlideshow from "./Components/RestaurantSlideShow";
import PaymentPage from "./Components/PaymentPage";
import MyOrders from "./Components/MyOrders";
import "./App.css";
import AddRestaurants from "./Components/AddRestaurants";
import Admin from "./Components/Admin";
import PendingRestaurants from "./Components/PendingRestaurants";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenPages = [
    "/search",
    "/restaurant-list",
    "/order-online",
    "/favorites",
    "/cart",
    "/popular-restaurants",
    "/order",
    "/payment",
    "/my-orders",
    "/add-restaurant",
    "/admin-orders",
    "/pending-restaurants",
  ];
  const isHiddenPage = hiddenPages.includes(location.pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("http://localhost:8080/api/users/validate-token", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => console.log("Token is valid"))
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert("Session expired. Please log in again.");
            localStorage.removeItem("token");
            navigate("/");
          }
        });
    }
  }, [navigate]);

  return (
    <div>
      {!isHiddenPage && (
        <>
          <Header />
          <RestaurantCard />
          <RestaurantSlideshow />
          <FAQ />
          <Footer />
        </>
      )}

      <Routes>
        {/* Public Routes */}
        <Route path="/search" element={<RestaurantSearch />} />
        <Route path="/restaurant-list" element={<RestaurantsList />} />
        <Route path="/order-online" element={<OrderOnline />} />
        <Route path="/popular-restaurants" element={<PopularRestaurants />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/cart" element={<CartService />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/add-restaurant" element={<AddRestaurants />} />
        </Route>
        {/* Admin-Only Routes */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin-orders" element={<Admin />} />
          <Route path="/pending-restaurants" element={<PendingRestaurants />} />
        </Route>
      </Routes>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWrapper;
