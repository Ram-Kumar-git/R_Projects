import React from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CardMedia,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderView = ({ cartItems, handlePlaceOrder }) => {
  
  const navigate = useNavigate();
  const handlePlaceOrderAndNavigate = () => {
    handlePlaceOrder(); // Empty the cart
    navigate("/ProductDetails", { state: { cartItems } }); // Navigate to ProductDetails
  };

  return (
    <div style={{ padding: "20px", height: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        style={{ fontFamily: "Protest Revolution", color: "#274C77" }}
      >
        {cartItems.length > 0
          ? "Items in your cart! Add more or checkout."
          : "OOPS ! Your cart is empty"}
      </Typography>

      {cartItems.length > 0 ? (
        <img
          src="../dairies/whitebg.jpg"
          alt="Cart has items"
          style={{
            width: "1%",
            height: "1%",
            marginTop: 0,
            marginBottom: 1,
          }}
        />
      ) : (
        <img
          src="../dairies/empty-cart.jpeg"
          alt="Cart is empty"
          style={{ width: "50%", height: "30vh", marginBottom: "20px" }}
        />
      )}

      <Grid container spacing={4}>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                style={{
                  backgroundColor: "#6096BA",
                  color: "white",

                  marginBottom: "",
                }}
              >
                <CardContent>
                  <CardMedia
                    component="img"
                    image={item.image}
                    alt={item.productName}
                    sx={{ height: 200, objectFit: "fill", width: "100%" }}
                  />
                  <Typography variant="h6">{item.productName}</Typography>
                  <Typography variant="body2">
                    {item.description}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    ₹{item.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="h6"
            style={{ marginLeft: "400px", color: "#FF424C", marginTop: "20px" }}
          >
            Looks like you have not added anything to you cart. Go ahead &
            explore top categories.
          </Typography>
        )}
      </Grid>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px" }}
        onClick={handlePlaceOrderAndNavigate}
        disabled={cartItems.length === 0}
      >
        Place Order
      </Button>
      <Button
        variant="contained"
        onClick={() => navigate("/")}
        style={{
          marginLeft: "10px",
          marginTop: "20px",
          backgroundColor: "#274C77",
        }}
      >
        Back to Home
      </Button>
    </div>
  );
};

export default OrderView;