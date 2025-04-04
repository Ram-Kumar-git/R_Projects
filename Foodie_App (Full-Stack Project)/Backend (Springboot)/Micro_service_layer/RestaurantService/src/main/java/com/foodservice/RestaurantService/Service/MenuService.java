package com.foodservice.RestaurantService.Service;

import com.foodservice.RestaurantService.DTO.MenuResponseDTO;
import com.foodservice.RestaurantService.Model.MenuItem;

import java.util.List;

public interface MenuService {

    // Fetch menu items for a given restaurant ID (Check in DB first, then OpenMenu API)
    List<MenuResponseDTO> getMenuByRestaurantId(String restaurantId);
    public List<MenuItem> getMenuByCuisine(String cuisineType);
}


