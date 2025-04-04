package com.foodservice.RestaurantService.Service;

import com.foodservice.RestaurantService.Config.UserServiceClient;
import com.foodservice.RestaurantService.DTO.MenuResponseDTO;
import com.foodservice.RestaurantService.DTO.RestaurantResponseDTO;
import com.foodservice.RestaurantService.Model.MenuItem;
import com.foodservice.RestaurantService.Model.RestaurantRequest;
import com.foodservice.RestaurantService.Repository.MenuItemRepository;
import com.foodservice.RestaurantService.Repository.RestaurantRepository;
import com.foodservice.RestaurantService.Model.Restaurant;
import com.foodservice.RestaurantService.Repository.RestaurantRequestRepository;
import com.foodservice.RestaurantService.Util.CuisineDetector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantServiceImpl {

    @Autowired
    private GooglePlacesClient googlePlacesClient;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private SpoonacularService spoonacularService;

    @Autowired
    private RestaurantRequestRepository restaurantRequestRepository;

    @Autowired
    private  UserServiceClient userServiceClient;

    private static final String API_KEY = "AIzaSyD8F4ziQLJeQEs1hvwhqkaxyfWuJC2Ywtc";

    public List<RestaurantResponseDTO> getRestaurants(String query) {
        // Check MongoDB cache first
        List<Restaurant> cachedRestaurants = restaurantRepository.findByNameContaining(query);

        if (!cachedRestaurants.isEmpty()) {
            System.out.println("Returning cached results for query: " + query);
            return cachedRestaurants.stream()
                    .map(restaurant -> new RestaurantResponseDTO(
                            restaurant.getName(), restaurant.getAddress(),
                            restaurant.getRating(),restaurant.getImageUrl(),restaurant.getCuisine()))
                    .collect(Collectors.toList());
        }

        // If not in cache, fetch from Google Places API
        System.out.println("Fetching data from Google Places API for: " + query);
        List<RestaurantResponseDTO> apiResponse = googlePlacesClient.searchRestaurants(query);

        if (apiResponse.isEmpty()) {
            System.out.println("Google Places API returned no results for query: " + query);
            return apiResponse; // Return empty response if API has no results
        }

        // Save fetched data in MongoDB for caching
        List<Restaurant> restaurantsToSave = apiResponse.stream()
                .map(dto -> new Restaurant(null, dto.getName(), dto.getAddress(),
                        dto.getRating(),System.currentTimeMillis(), dto.getImageUrl(),dto.getCuisine()))
                .collect(Collectors.toList());

        restaurantRepository.saveAll(restaurantsToSave);

        // Verify if data is saved in MongoDB
        System.out.println("Saved Restaurants in MongoDB: " + restaurantRepository.findAll());

        return apiResponse;
    }
    public List<RestaurantResponseDTO> getAllRestaurants() {
        List<Restaurant> allRestaurants = restaurantRepository.findAll();

        return allRestaurants.stream()
                .map(restaurant -> new RestaurantResponseDTO(
                        restaurant.getName(),
                        restaurant.getAddress(),
                        restaurant.getRating(),restaurant.getImageUrl(), restaurant.getCuisine()))
                .collect(Collectors.toList());
    }

// ✅ User submits a new restaurant request (Requires Authentication)
public RestaurantRequest addRestaurantRequest(RestaurantRequest request, String token) {
    // ✅ Extract email from token
    ResponseEntity<String> response = userServiceClient.validateToken(token);

    if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
        throw new RuntimeException("Unauthorized"); // Handle authentication failure
    }

    String email = response.getBody(); // ✅ Email from token
    request.setUserEmail(email); // ✅ Set user email in request

    return restaurantRequestRepository.save(request); // ✅ Save with user email
}


    // ✅ Admin fetches all pending requests (Requires Authentication)
    public List<RestaurantRequest> getPendingRequests(String token) {
        validateToken(token); // ✅ Check authentication
        return restaurantRequestRepository.findByStatus("PENDING");
    }

    // ✅ Admin approves a restaurant request (Requires Authentication)
    public void approveRestaurant(String requestId, String token) {
        validateToken(token); // ✅ Check authentication

        RestaurantRequest request = restaurantRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Move to Restaurant collection
        Restaurant newRestaurant = new Restaurant(
                request.getId(), request.getName(), request.getAddress(),
                request.getRating(), System.currentTimeMillis(),
                request.getImageUrl(), request.getCuisine()
        );
        restaurantRepository.save(newRestaurant);
        request.setStatus("APPROVED");
        // Remove from requests
        restaurantRequestRepository.save(request);
    }

    // ✅ Admin rejects a restaurant request (Requires Authentication)
    public void rejectRestaurant(String requestId, String token) {
        validateToken(token); // ✅ Check authentication

        RestaurantRequest request = restaurantRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        request.setStatus("REJECTED");
        restaurantRequestRepository.save(request); // Keep for reference
    }

    // ✅ Validate Token (Ensures user is authenticated)
    private void validateToken(String token) {
        userServiceClient.validateToken("Bearer " + token);
    }

}