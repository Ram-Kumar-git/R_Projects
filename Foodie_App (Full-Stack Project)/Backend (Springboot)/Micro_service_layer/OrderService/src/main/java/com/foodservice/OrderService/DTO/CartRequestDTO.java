package com.foodservice.OrderService.DTO;

import java.util.List;



public class CartRequestDTO {

    private String userEmail;

    private String restaurantName; // Add this field

    private List<OrderItemDTO> items;
    public CartRequestDTO() {}
    public CartRequestDTO(String userEmail, String restaurantName, List<OrderItemDTO> items) {

        this.userEmail = userEmail;

        this.restaurantName = restaurantName;

        this.items = items;

    }



    // Getters and Setters

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

    @Override
    public String toString() {
        return "CartRequestDTO{" +
                "userEmail='" + userEmail + '\'' +
                ", restaurantName='" + restaurantName + '\'' +
                ", items=" + items +
                '}';
    }
}