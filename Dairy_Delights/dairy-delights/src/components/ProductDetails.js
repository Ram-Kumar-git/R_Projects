import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

const ProductDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;
  const cartItems = location.state?.cartItems || [];

  const [items, setItems] = useState(
    product
      ? [{ ...product, quantity: 1 }]
      : cartItems.map((item) => ({ ...item, quantity: 1 }))
  );

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const totalPrice = items.reduce(
    (sum, item) => sum + item.quantity * parseFloat(item.price || 0),
    0
  );

  const updateQuantity = (index, increment) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + increment) }
          : item
      )
    );
  };

  const removeItem = (index) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    const orderData = {
      customer: { ...data },
      items,
      totalPrice,
      date: new Date().toISOString(),
    };

    try {
      await axios.post("http://localhost:3001/orders", orderData);

      setSnackbarMessage("Order placed successfully!");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);

      setSnackbarMessage("Error placing order. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  if (!items.length) {
    return (
      <Typography
        variant="h3"
        sx={{ fontFamily: "Protest Revolution", color: "#274C77", height: "75vh" }}
      >
        No products found.
      </Typography>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography
        variant="h3"
        gutterBottom
        style={{ color: "#274C77", fontFamily: "Protest Revolution" }}
      >
        Order Details
      </Typography>

      <TableContainer component={Paper} style={{ marginBottom: "20px" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#437382" }}>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Image
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Product Name
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Description
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Quantity
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Actions
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Total Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img
                    src={item.image}
                    alt={item.productName}
                    style={{ width: "50px", height: "50px" }}
                  />
                </TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => updateQuantity(index, -1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => updateQuantity(index, 1)}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => removeItem(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>₹{item.price * item.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography
        variant="span"
        style={{
          marginTop: "20px",
          fontFamily: "Concert One",
          fontWeight: 600,
          fontSize: "1.5em",
          color: "#274C77",
          marginLeft: "77vw",
          borderBottom: "5px solid #274C77",
        }}
      >
        Total Price: ₹{totalPrice}
      </Typography>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          width: "70%",
          backgroundColor: "#95b8d0",
          padding: "20px",
          borderRadius: "8px",
          margin: "20px auto",
        }}
      >
        <TextField
          label="Name"
          fullWidth
          {...register("name", {
            required: "Name is required",
            pattern: {
              value: /^[A-Za-z\s]+$/,
              message: "Name must only contain alphabets and spaces",
            },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Email"
          fullWidth
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z][a-zA-Z0-9_.]*@[a-zA-Z]+\.[a-zA-Z]{2,}$/,
              message:
                "Invalid email format. It should not start with a number.",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Address"
          fullWidth
          multiline
          rows={3}
          {...register("address", {
            required: "Address is required",
          })}
          error={!!errors.address}
          helperText={errors.address?.message}
          style={{ marginBottom: "10px" }}
        />
        <TextField
          label="Pincode"
          fullWidth
          type="number"
          {...register("pincode", {
            required: "Pincode is required",
            pattern: {
              value: /^\d{6}$/,
              message: "Pincode must be exactly 6 digits.",
            },
          })}
          error={!!errors.pincode}
          helperText={errors.pincode?.message}
          style={{ marginBottom: "10px" }}
        />
        <Button
          type="submit"
          variant="contained"
          style={{ marginRight: "10px", backgroundColor: "#274559" }}
        >
          Place Order
        </Button>
        <Button
          variant="outlined"
          color="#274C77"
          onClick={() => navigate("/")}
        >
          Cancel
        </Button>
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ProductDetails;