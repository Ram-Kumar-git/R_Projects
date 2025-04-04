import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Snackbar } from "@mui/material";

const stripePromise = loadStripe(
  "pk_test_51R0iq34EqZcfk7rCLLmzu2vFYLMq4ruYB99dxsEt3hLyUYqP0UhAQlJMuGW9fqoxeXjNFw7vPyJXOK2XH5XldBrt00ampVJ1Ca"
);
const PAYMENT_API_URL = "http://localhost:8087/api/payments/process";

function PaymentForm({ totalAmount, token }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handlePayment = async () => {
    if (!stripe || !elements) return;
    setIsProcessing(true);

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement),
      });

      if (error) {
        setSnackbar({
          open: true,
          message: `❌ Card Error: ${error.message}`,
          severity: "error",
        });
        setIsProcessing(false);
        return;
      }

      const requestBody = {
        amount: totalAmount,
        currency: "INR",
        paymentMethod: "cards",
        paymentMethodId: paymentMethod.id,
      };

      const response = await axios.post(PAYMENT_API_URL, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Payment Response:", response.data); // Debugging

      if (response.data.status === "succeeded") {
        setSnackbar({
          open: true,
          message:
            "🎉 Payment successful! Order confirmed. View your Orders from My Orders in Home page. Your order will be delivered soon.",
          severity: "success",
        });
        setTimeout(() => navigate("/"), 5000); // Delay navigation for Snackbar to be visible
      } else {
        setSnackbar({
          open: true,
          message: "❌ Payment failed. Try again.",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: "❌ Payment failed. Try again.",
        severity: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      <br />
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        style={{
          padding: "12px 20px",
          background: isProcessing ? "#ccc" : "#28a745",
          color: "white",
          fontSize: "18px",
          border: "none",
          cursor: isProcessing ? "not-allowed" : "pointer",
        }}
      >
        {isProcessing ? "Processing..." : "✅ Confirm Payment"}
      </button>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      />
    </div>
  );
}

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const totalAmount = location.state?.amount || 0;
  const [paymentMethod, setPaymentMethod] = useState("cards");
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleCODPayment = async () => {
    setIsProcessing(true);
    try {
      const requestBody = {
        amount: totalAmount,
        currency: "INR",
        paymentMethod: "cod",
      };

      await axios.post(PAYMENT_API_URL, requestBody, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbar({
        open: true,
        message: "🎉 COD Order Confirmed! View your Orders from My Orders in Home page. Your order will be delivered soon.",
        severity: "success",
      });

      // Delay navigation to allow Snackbar to be visible
      setTimeout(() => navigate("/"), 3000); // 3-second delay
    } catch (error) {
      setSnackbar({
        open: true,
        message: "❌ COD Payment failed. Try again.",
        severity: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Payment Portal</h2>
      <h3
        style={{
          fontSize: "30px",
          marginBottom: "5%",
          marginTop: "2%",
          fontWeight: "bolder",
        }}
      >
        {" "}
        Total Amount: ₹{totalAmount.toFixed(2)}
      </h3>

      <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
        <h3 style={{ fontSize: "20px", marginTop: "10px" }}>
          Select Payment Method
        </h3>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="cards">💳 Debit/Credit Card</option>
          <option value="upi" disabled>
            📲 UPI (Coming Soon)
          </option>
          <option value="netbanking" disabled>
            🏦 Net Banking (Coming Soon)
          </option>
          <option value="cod">🏡 Cash on Delivery</option>
        </select>
      </div>
      <br />
      <br />

      {paymentMethod === "cards" && (
        <Elements stripe={stripePromise}>
          <PaymentForm totalAmount={totalAmount} token={token} />
        </Elements>
      )}

      {paymentMethod === "cod" && (
        <button
          onClick={handleCODPayment}
          disabled={isProcessing}
          style={{
            padding: "12px 20px",
            background: isProcessing ? "#ccc" : "#28a745",
            color: "white",
            fontSize: "18px",
            border: "none",
            cursor: isProcessing ? "not-allowed" : "pointer",
          }}
        >
          {isProcessing ? "Processing..." : "🏡 Confirm COD Order"}
        </button>
      )}

      <br />
      <br />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
      />

      <p style={{ color: "red", fontWeight: "bolder" }}>WARNING:</p>
      <p>Don't reload or click back while on the payment page.</p>
      <p>
        If you enter an incorrect card number or face any payment issues, don’t
        worry! Your order will be treated as Cash on Delivery.<br></br>
        If you are charged, the refund will be processed back to your bank
        account within 3 business days.
      </p>
    </div>
  );
}

export default PaymentPage;
