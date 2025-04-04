package com.foodservice.FavoriteService.Service;

import com.foodservice.FavoriteService.DTO.FavoriteDTO;
import com.foodservice.FavoriteService.DTO.RestaurantDTO;
import com.foodservice.FavoriteService.Domain.Favorite;
import com.foodservice.FavoriteService.Feign.RestaurantServiceClient;
import com.foodservice.FavoriteService.Feign.UserServiceClient;
import com.foodservice.FavoriteService.Repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.List;

import org.springframework.web.server.ResponseStatusException;


@Service
public class FavoriteServiceImpl {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Autowired
    private RestaurantServiceClient restaurantServiceClient;

    @Autowired
    private UserServiceClient userServiceClient;
    public Favorite addFavorite(String token, FavoriteDTO favoriteDTO) {
        // Validate Token and Extract Email
        ResponseEntity<String> response = userServiceClient.validateToken("Bearer " + token);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token!");
        }

        String userEmail = response.getBody();
        String restaurantName = favoriteDTO.getRestaurantName();
        String restaurantAddress = favoriteDTO.getRestaurantAddress();

        // Fetch restaurant details
        ResponseEntity<List<RestaurantDTO>> restaurantResponse = restaurantServiceClient.searchRestaurants(restaurantName);
        if (restaurantResponse.getBody() == null || restaurantResponse.getBody().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found!");
        }

        // Find the matching restaurant and get the image URL
        RestaurantDTO matchingRestaurant = restaurantResponse.getBody().stream()
                .filter(r -> r.getName().equalsIgnoreCase(restaurantName) && r.getAddress().equalsIgnoreCase(restaurantAddress))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid restaurant details!"));

        String imageUrl = matchingRestaurant.getImageUrl(); // Extract image URL

        // Create & Save Favorite
        Favorite favorite = new Favorite();
        favorite.setUserEmail(userEmail);
        favorite.setRestaurantName(restaurantName);
        favorite.setRestaurantAddress(restaurantAddress);
        favorite.setImageUrl(imageUrl); // Store image URL

        return favoriteRepository.save(favorite);
    }

    public void removeFavorite(String token, String restaurantName, String restaurantAddress) {
        // Validate Token and Extract Email
        ResponseEntity<String> response = userServiceClient.validateToken("Bearer " + token);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token!");
        }

        String userEmail = response.getBody();

        // Find and delete the favorite
        Favorite favorite = favoriteRepository.findByUserEmailAndRestaurantNameAndRestaurantAddress(userEmail, restaurantName, restaurantAddress)
                .stream()  // Convert list to stream
                .findFirst() // Get the first match
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Favorite not found!"));

        favoriteRepository.delete(favorite);
    }
}