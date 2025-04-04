package com.foodservice.OrderService.Client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.http.ResponseEntity;

@FeignClient(name = "restaurant-service", url = "http://localhost:8084/api/restaurants")
public interface RestaurantServiceClient {

    @GetMapping("/validate-menu-item")
    ResponseEntity<Boolean> validateMenuItem(
            @RequestParam("restaurantName") String restaurantName,
            @RequestParam("menuItem") String menuItem
    );
}