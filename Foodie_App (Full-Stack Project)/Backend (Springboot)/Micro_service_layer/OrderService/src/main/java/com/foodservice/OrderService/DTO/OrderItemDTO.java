package com.foodservice.OrderService.DTO;

public class OrderItemDTO {
    private String itemName;
    private int quantity;
    private double price;
    private String imageUrl;
    private String restaurantName;

    public OrderItemDTO() {}

    public OrderItemDTO(String itemName, int quantity, double price,String imageUrl,String restaurantName) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.price = price;
        this.imageUrl=imageUrl;
        this.restaurantName=restaurantName;
    }

    // Getters and Setters
    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }


    @Override
    public String toString() {
        return "OrderItemDTO{" +
                "itemName='" + itemName + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", imageUrl='" + imageUrl + '\'' +
                ", restaurantName='" + restaurantName + '\'' +
                '}';
    }
}