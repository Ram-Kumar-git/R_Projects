package com.foodservice.RestaurantService.Service;

import com.foodservice.RestaurantService.DTO.RestaurantResponseDTO;

import com.foodservice.RestaurantService.Util.CuisineDetector;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import org.json.JSONArray;
import org.json.JSONObject;
@Component
public class GooglePlacesClient {
    @Value("${google.places.api.key}")
    private String googleApiKey;

    private static final String GOOGLE_PLACES_SEARCH_URL =
            "https://maps.googleapis.com/maps/api/place/textsearch/json?query=%s&key=%s";

    private static final String GOOGLE_PLACES_DETAILS_URL =
            "https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=photos&key=%s";

    private static final String GOOGLE_PHOTO_URL =
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=%s&key=%s";

    @Autowired
    private CuisineDetector cuisineDetector;

    private final RestTemplate restTemplate = new RestTemplate();

    public List<RestaurantResponseDTO> searchRestaurants(String query) {
        List<RestaurantResponseDTO> restaurants = new ArrayList<>();

        // ✅ Step 1: Call Google Places Search API
        String searchUrl = String.format(GOOGLE_PLACES_SEARCH_URL, query, googleApiKey);


        ResponseEntity<String> searchResponse = restTemplate.getForEntity(searchUrl, String.class);


        try {
            JSONObject jsonResponse = new JSONObject(searchResponse.getBody());
            JSONArray results = jsonResponse.optJSONArray("results");

            if (results == null || results.length() == 0) {
                System.out.println("No results found for query: " + query);
                return restaurants;
            }

            for (int i = 0; i < results.length(); i++) {
                JSONObject place = results.getJSONObject(i);

                String name = place.optString("name", "Unknown");
                String address = place.optString("formatted_address", "No Address");
                String rating = place.has("rating") ? String.valueOf(place.getDouble("rating")) : "N/A";

                // ✅ Step 2: Fetch Place ID
                String placeId = place.optString("place_id", "");
//                System.out.println("Place ID for " + name + ": " + placeId);

                String imageUrl = fetchImageByPlaceId(placeId); // Fetch image using place_id

                String cuisine = cuisineDetector.detectCuisine(name);

                restaurants.add(new RestaurantResponseDTO(name, address, rating, imageUrl, cuisine ));
            }

        } catch (Exception e) {
            System.out.println("Error parsing Google Places API response: " + e.getMessage());
            e.printStackTrace();
        }

        return restaurants;
    }

    private String fetchImageByPlaceId(String placeId) {
        if (placeId.isEmpty()) {
            System.out.println("No place ID available, returning default image.");
            return "No Image Available";
        }

        try {
            // ✅ Step 3: Call Google Place Details API
            String detailsUrl = String.format(GOOGLE_PLACES_DETAILS_URL, placeId, googleApiKey);


            ResponseEntity<String> detailsResponse = restTemplate.getForEntity(detailsUrl, String.class);


            JSONObject detailsJson = new JSONObject(detailsResponse.getBody());
            JSONObject result = detailsJson.optJSONObject("result");

            if (result == null) {
                System.out.println("No result found for placeId: " + placeId);
                return "No Image Available";
            }

            JSONArray photosArray = result.optJSONArray("photos");
            if (photosArray != null && photosArray.length() > 0) {
                String photoReference = photosArray.getJSONObject(0).optString("photo_reference", "");

                if (!photoReference.isEmpty()) {
                    return String.format(GOOGLE_PHOTO_URL, photoReference, googleApiKey);
                }
            }
        } catch (Exception e) {
            System.out.println("Error fetching image: " + e.getMessage());
            e.printStackTrace();
        }

        return "No Image Available"; // Default image if no photo is found
    }
}
