package com.foodservice.RestaurantService.Model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "restaurants")
public class Restaurant {
    @Id
    private String id;
    private String name;
    private String address;
    private String rating;
    private String imageUrl;
    private String cuisine;  // ✅ New field for cuisine

    @Indexed(name = "createdAtIndex", expireAfterSeconds = 86400) // Auto-expire after 24 hours
    private Long createdAt;

    public Restaurant() {}

    public Restaurant(String id, String name, String address, String rating, Long createdAt, String imageUrl, String cuisine) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.rating = rating;
        this.imageUrl = imageUrl;
        this.cuisine = cuisine;
        this.createdAt = createdAt;
    }

    // Getters and setters
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getRating() { return rating; }
    public void setRating(String rating) { this.rating = rating; }

    public Long getCreatedAt() { return createdAt; }
    public void setCreatedAt(Long createdAt) { this.createdAt = createdAt; }

    public String getCuisine() {
        return cuisine;
    }

    public void setCuisine(String cuisine) {
        this.cuisine = cuisine;
    }
}
