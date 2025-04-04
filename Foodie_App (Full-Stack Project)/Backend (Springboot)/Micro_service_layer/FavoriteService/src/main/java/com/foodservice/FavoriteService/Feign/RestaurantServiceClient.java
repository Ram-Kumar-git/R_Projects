package com.foodservice.FavoriteService.Feign;
import com.foodservice.FavoriteService.DTO.RestaurantDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@FeignClient(name = "restaurant-service", url = "http://localhost:8084/api/restaurants")
public interface RestaurantServiceClient {

    @GetMapping("/search")
    ResponseEntity<List<RestaurantDTO>> searchRestaurants(@RequestParam("restaurantName") String restaurantName);


}