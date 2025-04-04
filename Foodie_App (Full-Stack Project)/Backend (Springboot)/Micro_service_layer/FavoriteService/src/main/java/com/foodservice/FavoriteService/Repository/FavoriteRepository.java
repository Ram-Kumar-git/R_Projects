package com.foodservice.FavoriteService.Repository;

import com.foodservice.FavoriteService.Domain.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends MongoRepository<Favorite, String> {

    List<Favorite> findByUserEmailAndRestaurantNameAndRestaurantAddress(String userEmail, String restaurantName, String restaurantAddress);

    List<Favorite> findByUserEmail(String userEmail);
    List<Favorite> findByUserEmailAndRestaurantName(String userEmail, String restaurantName);

}