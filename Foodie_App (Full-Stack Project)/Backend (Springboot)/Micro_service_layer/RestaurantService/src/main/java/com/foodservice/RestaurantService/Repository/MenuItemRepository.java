package com.foodservice.RestaurantService.Repository;
import com.foodservice.RestaurantService.Model.MenuItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenuItemRepository extends MongoRepository<MenuItem, String> {

    // Retrieve menu items by restaurant ID
    List<MenuItem> findByRestaurantId(String restaurantId);
}


