package com.foodservice.RestaurantService.Config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@Configuration
public class ApiConfig {

    @Value("${google.places.api.key}")
    private String googlePlacesApiKey;

    @Value("${spoonacular.api.key}")
    private String spoonacularApiKey;

    public String getGooglePlacesApiKey() {
        return googlePlacesApiKey;
    }

    public String getSpoonacularApiKey() {
        return spoonacularApiKey;
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}


