package com.foodservice.RestaurantService.Repository;

import com.foodservice.RestaurantService.Model.RestaurantRequest;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface RestaurantRequestRepository extends MongoRepository<RestaurantRequest, String> {
    List<RestaurantRequest> findByStatus(String status);
    List<RestaurantRequest> findByUserEmail(String userEmail);

}