package com.foodservice.OrderService.Domain;

public class OrderItem {

    private String menuItem;
    private int quantity;
    private double price;
    private String imageUrl;
    private String restaurantName;

    public OrderItem() {}


    public OrderItem(String menuItem, int quantity, double price, String imageUrl, String restaurantName) {
        this.menuItem = menuItem;
        this.quantity = quantity;
        this.price = price;
        this.imageUrl = imageUrl;
        this.restaurantName = restaurantName;
    }

    // Getters and Setters

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(String menuItem) {
        this.menuItem = menuItem;
    }

    public int getQuantity() {
        return quantity;
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
        return "OrderItem{" +
                "menuItem='" + menuItem + '\'' +
                ", quantity=" + quantity +
                ", price=" + price +
                ", imageUrl='" + imageUrl + '\'' +
                ", restaurantName='" + restaurantName + '\'' +
                '}';
    }
}