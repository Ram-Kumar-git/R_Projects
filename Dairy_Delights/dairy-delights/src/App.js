import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./components/Header";
import LandView from "./components/LandView";
import Footer from "./components/Footer";
import SearchNote from "./components/SearchNote";
import OrderView from "./components/OrderView";
import ProductDetails from "./components/ProductDetails";
import LoginView from "./components/Loginview";
import OrderRequestsView from "./components/OrderRequestView";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

export default function App() {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // Cart state

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  
  useEffect(() => {
    let filtered = products;
    if (searchText) {
      filtered = filtered.filter(
        (product) =>
          product.productName &&
          product.productName.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    if (categoryFilter) {
      filtered = filtered.filter(
        (product) => product.category && product.category === categoryFilter
      );
    }
    setFilteredProducts(filtered);
  }, [searchText, categoryFilter, products]);

  const handleSearchNoteChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleClearSearchNote = () => {
    setSearchText("");
  };

  const handleCategoryChange = (category) => {
    setCategoryFilter(category);
  };

  const handleAddToCart = (product) => {
    setCartItems((prevCartItems) => [...prevCartItems, product]);
  };

const handlePlaceOrder=()=>{
  setCartItems([]);
}
  return (
    <Router>
      <div className="App">
      <SearchNote
          onSearchNote={handleSearchNoteChange}
          searchText={searchText}
          onClearSearchNote={handleClearSearchNote}
        />
        <Header cartItems={cartItems} onCategoryClick={handleCategoryChange} />
        
        <Routes>
          <Route
            path="/"
            element={
              <LandView
                products={filteredProducts}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route path="/OrderView" element={<OrderView cartItems={cartItems}handlePlaceOrder={handlePlaceOrder}/>} />
          <Route path="/ProductDetails" element={<ProductDetails/>} />
          <Route path="/login" element={<LoginView />} />
        <Route path="/order-requests" element={<OrderRequestsView />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}
