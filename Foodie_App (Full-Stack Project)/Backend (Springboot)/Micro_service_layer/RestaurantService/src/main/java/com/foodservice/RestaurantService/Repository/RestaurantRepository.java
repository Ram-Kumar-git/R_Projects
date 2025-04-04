package com.foodservice.RestaurantService.Repository;

import com.foodservice.RestaurantService.Model.Restaurant;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.mongodb.repository.Query;


public interface RestaurantRepository extends MongoRepository<Restaurant, String> {
    @Query("{ 'name' : { $regex: ?0, $options: 'i' } }") // Case-insensitive partial match
    List<Restaurant> findByNameContaining(String name);

    Optional<Restaurant> findByNameIgnoreCase(String name);
}