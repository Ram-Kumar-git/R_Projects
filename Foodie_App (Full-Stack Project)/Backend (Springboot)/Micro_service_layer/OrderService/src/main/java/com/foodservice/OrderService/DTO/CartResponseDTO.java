package com.foodservice.OrderService.DTO;

import java.util.List;

public class CartResponseDTO {
    private String userEmail;
    private List<OrderItemDTO> items;


    public CartResponseDTO() {}

    public CartResponseDTO(String userEmail, List<OrderItemDTO> items) {
        this.userEmail = userEmail;
        this.items = items;

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


    @Override
    public String toString() {
        return "CartResponseDTO{" +
                "userEmail='" + userEmail + '\'' +
                ", items=" + items +

                '}';
    }
}