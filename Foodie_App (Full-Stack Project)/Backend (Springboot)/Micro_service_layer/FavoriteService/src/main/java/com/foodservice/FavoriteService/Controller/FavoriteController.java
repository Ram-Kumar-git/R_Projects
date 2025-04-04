package com.foodservice.FavoriteService.Controller;
import com.foodservice.FavoriteService.DTO.FavoriteDTO;
import com.foodservice.FavoriteService.Domain.Favorite;
import com.foodservice.FavoriteService.Feign.UserServiceClient;
import com.foodservice.FavoriteService.Repository.FavoriteRepository;
import com.foodservice.FavoriteService.Service.FavoriteServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "http://localhost:3000")
public class FavoriteController {

    @Autowired
    private FavoriteServiceImpl favoriteService;
    @Autowired
    private UserServiceClient userServiceClient;
    @Autowired
    private FavoriteRepository favoriteRepository;


    @PostMapping("/add")
    public ResponseEntity<?> addFavorite(@RequestHeader("Authorization") String token,
                                         @RequestBody FavoriteDTO favoriteDTO) {
        token = token.replace("Bearer ", "").trim();
        Favorite savedFavorite = favoriteService.addFavorite(token, favoriteDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedFavorite);
    }

    @DeleteMapping("/remove")
    public ResponseEntity<String> removeFavorite(
            @RequestHeader("Authorization") String token,
            @RequestBody Favorite favoriteRequest) {

        // ✅ Validate JWT Token
        ResponseEntity<String> response = userServiceClient.validateToken(token);
        if (!response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(response.getStatusCode()).body("Invalid Token");
        }
        String userEmail = response.getBody(); // Extract email from token

        // ✅ Fetch all matching favorites using both name and address
        List<Favorite> existingFavorites = favoriteRepository.findByUserEmailAndRestaurantNameAndRestaurantAddress(
                userEmail, favoriteRequest.getRestaurantName(), favoriteRequest.getRestaurantAddress()
        );

        if (existingFavorites.isEmpty()) {
            return ResponseEntity.status(404).body("Restaurant not found in favorites!");
        }

        // ✅ Delete the exact favorite entry
        favoriteRepository.deleteAll(existingFavorites);
        return ResponseEntity.ok("Restaurant removed from favorites!");
    }
    @GetMapping("/user")
    public ResponseEntity<List<Favorite>> getUserFavorites(@RequestHeader("Authorization") String token) {
        // ✅ Validate Token using User Service
        ResponseEntity<String> response = userServiceClient.validateToken(token);

        if (!response.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.status(response.getStatusCode()).body(null);
        }

        // ✅ Extract Email from Response
        String email = response.getBody();

        // ✅ Fetch Favorites by Email
        List<Favorite> favorites = favoriteRepository.findByUserEmail(email);
        return ResponseEntity.ok(favorites);
    }
}