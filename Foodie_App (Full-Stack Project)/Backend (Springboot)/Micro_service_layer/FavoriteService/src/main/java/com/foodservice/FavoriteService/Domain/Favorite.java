package com.foodservice.FavoriteService.Domain;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "favorites")
public class Favorite {

    @Id
    private String id;

    private String userEmail;
    private String restaurantName;
    private String restaurantAddress;
    private String imageUrl;

    // Default Constructor
    public Favorite() {}

    // Parameterized Constructor


    public Favorite(String id, String userEmail, String restaurantName, String restaurantAddress, String imageUrl) {
        this.id = id;
        this.userEmail = userEmail;
        this.restaurantName = restaurantName;
        this.restaurantAddress = restaurantAddress;
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getRestaurantAddress() {
        return restaurantAddress;
    }

    public void setRestaurantAddress(String restaurantAddress) {
        this.restaurantAddress = restaurantAddress;
    }

    @Override
    public String toString() {
        return "Favorite{" +
                "id='" + id + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", restaurantName='" + restaurantName + '\'' +
                ", restaurantAddress='" + restaurantAddress + '\'' +
                '}';
    }
}