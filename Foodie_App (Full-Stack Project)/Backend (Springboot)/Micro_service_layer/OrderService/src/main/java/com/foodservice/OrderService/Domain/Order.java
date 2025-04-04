package com.foodservice.OrderService.Domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    private String orderId; // ✅ Changed 'id' to 'orderId' to match method names

    private String userEmail;
    private List<OrderItem> items;
    private double totalAmount;
    private String status; // PENDING, PLACED, CANCELLED
    private String paymentMethod;
    private LocalDateTime orderDate;
    private String restaurantName;

// ✅ Added this field

    public Order() {}



    public Order( String userEmail, List<OrderItem> items, double totalAmount, String status, String paymentMethod, LocalDateTime orderDate, String restaurantName) {
        this.userEmail = userEmail;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.orderDate = orderDate;
        this.restaurantName = restaurantName;
    }

    // ✅ Getters and Setters
    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
    public String getOrderId() { // ✅ Now matches the method name
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public LocalDateTime getOrderDate() { // ✅ Now matches the method name
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }
}