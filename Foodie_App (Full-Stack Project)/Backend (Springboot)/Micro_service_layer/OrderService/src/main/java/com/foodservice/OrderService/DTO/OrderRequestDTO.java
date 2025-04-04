package com.foodservice.OrderService.DTO;

import java.util.List;

public class OrderRequestDTO {
    private String userEmail;
    private List<OrderItemDTO> items;
    private String paymentMethod;

    public OrderRequestDTO() {}

    public OrderRequestDTO(String userEmail, List<OrderItemDTO> items, String paymentMethod) {
        this.userEmail = userEmail;
        this.items = items;
        this.paymentMethod = paymentMethod;
    }

    // Getters and Setters

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    @Override
    public String toString() {
        return "OrderRequestDTO{" +
                "userEmail='" + userEmail + '\'' +
                ", items=" + items +
                ", paymentMethod='" + paymentMethod + '\'' +
                '}';
    }
}