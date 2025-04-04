package com.foodservice.RestaurantService.Controller;


import com.foodservice.RestaurantService.Config.UserServiceClient;
import com.foodservice.RestaurantService.DTO.RestaurantResponseDTO;
import com.foodservice.RestaurantService.Model.MenuItem;
import com.foodservice.RestaurantService.Model.Restaurant;
import com.foodservice.RestaurantService.Model.RestaurantRequest;
import com.foodservice.RestaurantService.Repository.RestaurantRequestRepository;
import com.foodservice.RestaurantService.Service.RestaurantServiceImpl;
import com.foodservice.RestaurantService.Service.SpoonacularService;
import com.foodservice.RestaurantService.Util.CuisineDetector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

    @Autowired
    private RestaurantServiceImpl restaurantService;

    @Autowired
    private SpoonacularService spoonacularService;

    @Autowired
    private UserServiceClient userServiceClient;

    @Autowired
    private RestaurantRequestRepository restaurantRequestRepository;

    @Autowired
    private CuisineDetector cuisineDetector;
    @GetMapping("/search")
    public List<RestaurantResponseDTO> searchRestaurant(@RequestParam("restaurantName") String restaurantName) {
        if (restaurantName == null || restaurantName.isEmpty()) {
            throw new IllegalArgumentException("Restaurant name cannot be empty");
        }

        // Correct method call with proper parameter
        List<RestaurantResponseDTO> restaurant = restaurantService.getRestaurants(restaurantName);

        if (restaurant == null) {
            throw new RuntimeException("Restaurant not found: " + restaurantName);
        }

        return restaurant;
    }
    @GetMapping
    public ResponseEntity<List<RestaurantResponseDTO>> getAllRestaurants() {
        List<RestaurantResponseDTO> restaurants = restaurantService.getAllRestaurants();
        return ResponseEntity.ok(restaurants);
    }

    @GetMapping("/{restaurantName}/menu")
    public List<MenuItem> getMenuForRestaurant(@PathVariable String restaurantName) {
        String cuisine = cuisineDetector.detectCuisine(restaurantName); // Map cuisine
        return spoonacularService.fetchMenuByQuery(cuisine);
    }
    @GetMapping("/validate-menu-item")
    public ResponseEntity<Boolean> validateMenuItem(
            @RequestParam("restaurantName") String restaurantName,
            @RequestParam("menuItem") String menuItem) {

        List<MenuItem> menu = getMenuForRestaurant(restaurantName);

        boolean isValid = menu.stream().anyMatch(item -> item.getName().equalsIgnoreCase(menuItem));

        return ResponseEntity.ok(isValid);
    }

//    @PostMapping("/add")
//    public ResponseEntity<String> addRestaurant(
//            @RequestHeader("Authorization") String token, // ✅ Requires authentication
//            @RequestBody Restaurant restaurant) {
//
//        // ✅ Validate User Token
//        ResponseEntity<String> response = userServiceClient.validateToken(token);
//        if (!response.getStatusCode().is2xxSuccessful()) {
//            return ResponseEntity.status(401).body("Unauthorized: Invalid Token");
//        }
//
//        // ✅ Save the restaurant
//        restaurantService.addRestaurant(restaurant);
//        return ResponseEntity.ok("Restaurant added successfully!");
//    }
// ✅ Add a new restaurant request (Requires Authentication)
@PostMapping("/add")
public ResponseEntity<RestaurantRequest> addRestaurantRequest(
        @RequestBody RestaurantRequest request,
        @RequestHeader("Authorization") String token) {
    return ResponseEntity.ok(restaurantService.addRestaurantRequest(request, token));
}

    // ✅ Get all pending requests (Requires Authentication)
    @GetMapping("/pending")
    public ResponseEntity<List<RestaurantRequest>> getPendingRequests(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(restaurantService.getPendingRequests(token));
    }

    // ✅ Approve restaurant request (Requires Authentication)
    @PostMapping("/approve/{id}")
    public ResponseEntity<String> approveRestaurant(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        restaurantService.approveRestaurant(id, token);
        return ResponseEntity.ok("Restaurant Approved");
    }

    // ✅ Reject restaurant request (Requires Authentication)
    @PostMapping("/reject/{id}")
    public ResponseEntity<String> rejectRestaurant(
            @PathVariable String id,
            @RequestHeader("Authorization") String token) {
        restaurantService.rejectRestaurant(id, token);
        return ResponseEntity.ok("Restaurant Rejected");
    }

    @GetMapping("/status")
    public ResponseEntity<List<RestaurantRequest>> getApprovalStatus(@RequestHeader("Authorization") String token) {
        ResponseEntity<String> response = userServiceClient.validateToken(token);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.emptyList()); // ✅ Always return an array, never null
        }

        String email = response.getBody();
        List<RestaurantRequest> requests = restaurantRequestRepository.findByUserEmail(email);

        return ResponseEntity.ok(requests != null ? requests : Collections.emptyList()); // ✅ Ensure response is always a list
    }





}


