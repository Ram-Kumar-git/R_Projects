package com.foodservice.OrderService.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private String orderId;
    private String userEmail;
    private List<OrderItemDTO> items;
    private double totalAmount;
    private String status;
    private String paymentMethod;
    private LocalDateTime orderDate;
    private String restaurantName;

    public OrderResponseDTO() {}

    public OrderResponseDTO(String orderId, String userEmail, List<OrderItemDTO> items, double totalAmount, String status, String paymentMethod, LocalDateTime orderDate,String restaurantName) {
        this.orderId = orderId;
        this.userEmail = userEmail;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = status;
        this.paymentMethod = paymentMethod;
        this.orderDate = orderDate;
        this.restaurantName = restaurantName;

    }

    public OrderResponseDTO(String status, String userEmail, List<OrderItemDTO> items, double totalAmount, String paymentMethod, LocalDateTime orderDate, String restaurantName) {
        this.status = status;
        this.userEmail = userEmail;
        this.items = items;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.orderDate = orderDate;
        this.restaurantName = restaurantName;
    }

    // Getters and Setters

    public String getOrderId() {
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

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
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

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    @Override
    public String toString() {
        return "OrderResponseDTO{" +
                "orderId='" + orderId + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", items=" + items +
                ", totalAmount=" + totalAmount +
                ", status='" + status + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", orderDate=" + orderDate +
                ", restaurantName='" + restaurantName + '\'' +
                '}';
    }
}