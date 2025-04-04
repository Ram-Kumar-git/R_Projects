package com.foodservice.RestaurantService.DTO;

import java.util.List;

public class RestaurantResponseDTO {
    private String name;
    private String address;
    private String rating;
    private String imageUrl;
    private String cuisine;


    public RestaurantResponseDTO() {}


    public RestaurantResponseDTO(String name, String address, String rating, String imageUrl, String cuisine) {
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.cuisine = cuisine;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }
}