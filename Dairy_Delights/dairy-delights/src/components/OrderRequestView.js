import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderRequestsView = () => {
  const navigate = useNavigate();
  const [orderRequests, setOrderRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check authentication status
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (!isAuthenticated) {
      // If not authenticated, redirect to login page
      navigate("/login");
    } else {
      // Fetch orders from the json-server endpoint
      axios
        .get("http://localhost:3001/orders") // Endpoint for orders in json-server
        .then((response) => {
          setOrderRequests(response.data); // Set the response data
          setLoading(false); // Set loading state to false
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setLoading(false); // Stop loading on error
        });
    }
  }, [navigate, isAuthenticated]);

  const handleLogout = () => {
    // Clear authentication status
    localStorage.setItem("isAuthenticated", "false");
    navigate("/"); // Redirect to home page
  };



  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "white",
        height: "100vh",
      }}
    >
      {!isAuthenticated && (
        <Typography variant="h6">You need to login first!</Typography>
      )}
      {loading ? (
        <Typography variant="h6">Loading order requests...</Typography>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h4"
              gutterBottom
              style={{ color: "#274C77", fontFamily: "Protest Revolution" }}
            >
              Previous Orders
            </Typography>
            <IconButton
              onClick={handleLogout}
              aria-label="logout"
              style={{ color: "#274C77" }}
            >
              <Logout />
              Logout
            </IconButton>
          </div>
          {orderRequests.length > 0 ? (
            <TableContainer component={Paper}>
              <Table style={{ backgroundColor: "#6096BA" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#274C77",fontWeight:'700' }}>ID</TableCell>
                    <TableCell sx={{ color: "#274C77",fontWeight:'700' }}>Product Name</TableCell>
                    <TableCell sx={{ color: "#274C77",fontWeight:'700' }}>Quantity</TableCell>
                    <TableCell sx={{ color: "#274C77",fontWeight:'700' }}>Customer Name</TableCell>
                    <TableCell sx={{ color: "#274C77",fontWeight:'700' }}>Price</TableCell>
                    <TableCell sx={{ color: "#274C77",fontWeight:'700' }}>Total Amount</TableCell>
                    <TableCell sx={{ color: "#274C77",fontWeight:'700' }}>Date</TableCell>
                    <TableCell sx={{ color: "#274C77",fontWeight:'700' }}>Address</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderRequests.map((order) => {
                    if (order.items && Array.isArray(order.items)) {
                      // If order has an items array
                      return order.items.map((item, index) => (
                        <TableRow key={`${order.id}-${index}`}>
                          <TableCell sx={{ color: "white" }}>
                            {order.id}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {item.productName}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {item.quantity || "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {order.customer?.name || "Unknown"}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {item.price}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {item.price * item.quantity}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {new Date(order.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {order.customer?.address || "N/A"}
                          </TableCell>
                        </TableRow>
                      ));
                    } else {
                      // Single product orders
                      return (
                        <TableRow key={order.id}>
                          <TableCell sx={{ color: "white" }}>
                            {order.id}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {order.productName}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {order.quantity || "N/A"}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {order.firstName || order.customer?.name || "Unknown"}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {order.price}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {new Date(
                              order.deliveryDate || order.date
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell sx={{ color: "white" }}>
                            {order.address || order.customer?.address || "N/A"}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6">No previous orders found.</Typography>
          )}
        </>
      )}
    </div>
  );
};

export default OrderRequestsView;
