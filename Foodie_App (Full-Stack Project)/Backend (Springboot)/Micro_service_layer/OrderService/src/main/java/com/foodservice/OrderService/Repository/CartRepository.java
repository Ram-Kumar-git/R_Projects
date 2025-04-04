package com.foodservice.OrderService.Repository;

import com.foodservice.OrderService.Domain.Cart;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface CartRepository extends MongoRepository<Cart, String> {
    Optional<Cart> findByUserEmail(String userEmail);
    void deleteByUserEmail(String userEmail);
}