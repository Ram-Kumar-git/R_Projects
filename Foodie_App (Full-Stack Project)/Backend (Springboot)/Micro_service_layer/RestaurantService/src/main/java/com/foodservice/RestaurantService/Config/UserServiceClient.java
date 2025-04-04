package com.foodservice.RestaurantService.Config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

@FeignClient(name = "user-service", url = "http://localhost:8080/api/users")
public interface UserServiceClient {

    @GetMapping("/validate-token")
    ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token);
}