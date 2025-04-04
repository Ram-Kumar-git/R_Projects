package com.foodservice.RestaurantService.Service;

import com.foodservice.RestaurantService.DTO.SpoonacularResponse;
import com.foodservice.RestaurantService.Model.MenuItem;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpoonacularService {

    private static final Logger logger = LoggerFactory.getLogger(SpoonacularService.class);

    @Value("${spoonacular.api.key}")
    private String spoonacularApiKey;

    private final RestTemplate restTemplate;

    public SpoonacularService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetch menu items based on cuisine type (e.g., Italian, Chinese, Indian).
     * @param cuisineType The type of cuisine.
     * @return List of menu items.
     */
    public List<MenuItem> fetchMenuByCuisine(String cuisineType) {
        String url = "https://api.spoonacular.com/food/menuItems/search?query=" + cuisineType + "&apiKey=" + spoonacularApiKey;

        SpoonacularResponse response = restTemplate.getForObject(url, SpoonacularResponse.class);

        if (response == null || response.getMenuItems() == null || response.getMenuItems().isEmpty()) {
            logger.warn("No menu items found for cuisine: {}", cuisineType);
            return List.of();
        }

        logger.info("Fetched {} menu items for cuisine: {}", response.getMenuItems().size(), cuisineType);

        return response.getMenuItems().stream()
                .map(dto -> new MenuItem(
                        dto.getId(),
                        null, // Spoonacular does not provide restaurant-specific data
                        dto.getName(),
                        "No description available",
                        generateRandomPrice(),  // ✅ Set random price
                        dto.getImageUrl()
                ))
                .collect(Collectors.toList());
    }

    public List<MenuItem> fetchMenuByQuery(String cuisine) {
        String url = "https://api.spoonacular.com/food/menuItems/search?query=" + cuisine + "&apiKey=" + spoonacularApiKey;

        SpoonacularResponse response = restTemplate.getForObject(url, SpoonacularResponse.class);

        if (response == null || response.getMenuItems() == null || response.getMenuItems().isEmpty()) {
            logger.warn("No menu items found for cuisine: " + cuisine);
            return List.of();
        }

        return response.getMenuItems().stream()
                .map(dto -> new MenuItem(
                        dto.getId(),
                        dto.getRestaurantId(),
                        dto.getName(),
                        "", // No description provided
                        generateRandomPrice(),  // ✅ Set random price
                        dto.getImageUrl()
                ))
                .collect(Collectors.toList());
    }

    /**
     * Generates a random price between ₹100 and ₹300.
     */
    private double generateRandomPrice() {
        double randomPrice = 100 + (Math.random() * 200);  // Generates value between 100 and 300
        return Math.round(randomPrice * 100.0) / 100.0;   // ✅ Rounds to 2 decimal places
    }


}