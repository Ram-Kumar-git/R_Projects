package com.foodservice.RestaurantService.Service;

import com.foodservice.RestaurantService.DTO.MenuResponseDTO;
import com.foodservice.RestaurantService.DTO.RestaurantResponseDTO;
import com.foodservice.RestaurantService.Model.MenuItem;
import com.foodservice.RestaurantService.Model.Restaurant;

import java.util.List;

public interface RestaurantService {

    List<RestaurantResponseDTO> getRestaurants(String query);
    List<RestaurantResponseDTO> getAllRestaurants();
    List<MenuResponseDTO> getMenuByRestaurantId(String restaurantId);
    List<MenuItem> getMenuForRestaurant(String restaurantName);
    String addRestaurant(Restaurant restaurant);


}


