package com.foodservice.RestaurantService.DTO;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MenuItemDTO {

    @JsonProperty("id")
    private String id;

    @JsonProperty("title")
    private String name;  // Map "title" to "name"

    @JsonProperty("restaurantChain")
    private String restaurantId; // Spoonacular doesn't have exact restaurant IDs

    @JsonProperty("image")
    private String imageUrl;

    private double price; // Spoonacular does not provide price directly

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}