import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
  background: #fafafa;
`;

const ItemsList = styled.div`
  margin-top: 10px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #ddd;
  padding: 10px 0;
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  padding-bottom: 5px;
`;

const formatDate = (isoDate) => {
  if (!isoDate) return "N/A";

  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) {
      console.error("Invalid Date:", isoDate);
      return "Invalid Date";
    }

    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Date Parsing Error:", error);
    return "Invalid Date";
  }
};

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8086/api/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container>
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
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <OrdersList>
          {orders.map((order) => (
            <OrderCard key={order.orderId}>
              {/* Order ID, Status & Restaurant Name */}
              <OrderHeader>
                <p>Order ID: {order.orderId}</p>
                <p
                  style={{
                    color: order.status === "PENDING" ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  Status: {order.status}
                </p>
              </OrderHeader>

              <OrderHeader>
                <p>
                  <strong>Restaurant:</strong>{" "}
                  {order.restaurantName || "Unknown"}
                </p>
              </OrderHeader>

              {/* Payment Method and Order Date */}
              <OrderHeader>
                <p>Payment Method: {order.paymentMethod}</p>
                <p>
                  <strong>Order Date:</strong> {formatDate(order?.orderDate)}
                </p>
              </OrderHeader>

              {/* Order Items */}
              <ItemsList>
                {order.items.map((item, index) => (
                  <OrderItem key={index}>
                    <ItemImage src={item.imageUrl} alt={item.itemName} />
                    <div>
                      <p>
                        <strong>{item.itemName}</strong>
                      </p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ₹{item.price.toFixed(2)}</p>
                      <p>
                        <strong>Restaurant:</strong>{" "}
                        {item.restaurantName || "Unknown"}
                      </p>
                    </div>
                  </OrderItem>
                ))}
              </ItemsList>

              {/* Total Amount */}
              <p style={{ textAlign: "right", fontWeight: "bold" }}>
                Total: ₹{order.totalAmount.toFixed(2)}
              </p>
            </OrderCard>
          ))}
        </OrdersList>
      )}
    </Container>
  );
};

export default MyOrders;
