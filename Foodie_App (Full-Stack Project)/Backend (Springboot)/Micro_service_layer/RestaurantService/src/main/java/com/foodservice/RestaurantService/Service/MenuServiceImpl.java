package com.foodservice.RestaurantService.Service;

import com.foodservice.RestaurantService.Config.ApiConfig;
import com.foodservice.RestaurantService.DTO.MenuResponseDTO;
import com.foodservice.RestaurantService.Exception.MenuNotFoundException;
import com.foodservice.RestaurantService.Model.MenuItem;
import com.foodservice.RestaurantService.Repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class MenuServiceImpl implements MenuService {

    private static final String DUMMY_MENU_API = "https://api.spoonacular.com/food/menuItems/search?query=%s&apiKey=%s";

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private ApiConfig apiConfig;

    @Autowired
    private SpoonacularService spoonacularService;

    @Override
    public List<MenuResponseDTO> getMenuByRestaurantId(String restaurantId) {
        // Check MongoDB Cache first
        List<MenuItem> cachedMenu = menuItemRepository.findByRestaurantId(restaurantId);
        if (!cachedMenu.isEmpty()) {
            return cachedMenu.stream().map(MenuResponseDTO::new).toList();
        }

        // Fetch from external API (Dummy API used as OpenMenu is paid)
        String apiUrl = String.format(DUMMY_MENU_API, restaurantId, apiConfig.getSpoonacularApiKey());
        ResponseEntity<Map> response = restTemplate.getForEntity(apiUrl, Map.class);
        List<Map<String, Object>> results = (List<Map<String, Object>>) response.getBody().get("menuItems");

        if (results == null || results.isEmpty()) {
            throw new MenuNotFoundException("Menu not found for Restaurant ID: " + restaurantId);
        }

        // Convert API response to MenuItem objects
        List<MenuItem> menuItems = results.stream().map(this::mapToMenuItem).collect(Collectors.toList());

        // Store in MongoDB Cache
        menuItemRepository.saveAll(menuItems);

        return menuItems.stream().map(MenuResponseDTO::new).toList();
    }

    private MenuItem mapToMenuItem(Map<String, Object> data) {
        MenuItem menuItem = new MenuItem();
        menuItem.setId((String) data.get("id"));
        menuItem.setRestaurantId((String) data.get("restaurantId"));
        menuItem.setName((String) data.get("title"));
        menuItem.setPrice(data.get("price") != null ? (double) data.get("price") : 0.0);
        menuItem.setImageUrl((String) data.get("image"));

        return menuItem;
    }
    public List<MenuItem> getMenuByCuisine(String cuisineType) {
        return spoonacularService.fetchMenuByCuisine(cuisineType);
    }
}



