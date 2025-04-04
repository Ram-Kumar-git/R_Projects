package com.foodservice.FavoriteService.Service;


import com.foodservice.FavoriteService.DTO.FavoriteDTO;
import com.foodservice.FavoriteService.Domain.Favorite;

import java.util.List;

public interface FavoriteService {
    Favorite addFavorite(FavoriteDTO favoriteDTO);
    List<Favorite> getFavorites(String userEmail);
    void removeFavorite(String userEmail, String restaurantName);
}