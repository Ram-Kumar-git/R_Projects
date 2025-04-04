package com.foodservice.OrderService.Domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Document(collection = "cart")
public class Cart {

    @Id
    private String id;
    private String userEmail;
    private List<OrderItem> items;
    private String restaurantName;

    public Cart() {}

    public Cart(String userEmail, List<OrderItem> items,String restaurantName) {
        this.userEmail = userEmail;
        this.items = items;
        this.restaurantName=restaurantName;
    }

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
}