package com.foodservice.OrderService.Repository;

import com.foodservice.OrderService.Domain.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserEmail(String userEmail);
}