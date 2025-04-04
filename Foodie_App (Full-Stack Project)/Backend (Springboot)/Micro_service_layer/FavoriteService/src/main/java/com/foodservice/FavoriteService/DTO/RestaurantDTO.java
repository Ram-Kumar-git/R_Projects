package com.foodservice.FavoriteService.DTO;

public class RestaurantDTO {

    private String name;
    private String address;
    private String rating;
    private String imageUrl;

    // Default Constructor
    public RestaurantDTO() {}

    // Parameterized Constructor


    public RestaurantDTO(String name, String address, String rating, String imageUrl) {
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRating() {
        return rating;
    }

    public void setRating(String rating) {
        this.rating = rating;
    }

    @Override
    public String toString() {
        return "RestaurantDTO{" +
                "name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", rating='" + rating + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}