package com.foodservice.RestaurantService.Util;

import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CuisineDetector {

    private static final Map<String, String> CUISINE_MAP = new HashMap<>();

    static {
        // ✅ Manually map popular restaurants to cuisines
        CUISINE_MAP.put("Domino's", "Italian");
        CUISINE_MAP.put("McDonald's", "American");
        CUISINE_MAP.put("KFC", "American");
        CUISINE_MAP.put("Sangeetha", "Asian");
        CUISINE_MAP.put("Saravana Bhavan", "South Indian");
        CUISINE_MAP.put("Mainland China", "Chinese");
        CUISINE_MAP.put("fried rice", "Chinese");
        CUISINE_MAP.put("noodles", "Chinese");
        CUISINE_MAP.put("fast food", "Chinese");
        CUISINE_MAP.put("Burger King", "American");
        CUISINE_MAP.put("Subway", "Healthy");
        CUISINE_MAP.put("Taco Bell", "Mexican");
        CUISINE_MAP.put("Punjab Grill", "Indian");
        CUISINE_MAP.put("Bikanervala", "Indian");
        CUISINE_MAP.put("pizza", "italian");
        CUISINE_MAP.put("pasta", "italian");
        CUISINE_MAP.put("italy", "italian");
        CUISINE_MAP.put("italian", "italian");
        CUISINE_MAP.put("sushi", "japanese");
        CUISINE_MAP.put("burger", "american");
        CUISINE_MAP.put("biryani", "Biryani");
        CUISINE_MAP.put("tacos", "mexican");
        CUISINE_MAP.put("subway", "healthy");
        CUISINE_MAP.put("sandwich","healthy");
        CUISINE_MAP.put("ice cream", "vanilla ice cream");
        CUISINE_MAP.put("icecream", "vanilla ice cream");
        CUISINE_MAP.put("ibaco", "vanilla ice cream");
        CUISINE_MAP.put("cafe", "Cafe");
        CUISINE_MAP.put("coffee", "Coffee");
        CUISINE_MAP.put("bakery", "Bakery");
        CUISINE_MAP.put("starbucks", "Coffee");
        CUISINE_MAP.put("barista", "Coffee");
        CUISINE_MAP.put("costa coffee", "Coffee");
        CUISINE_MAP.put("tea", "Beverage");
        CUISINE_MAP.put("chai", "Beverage");
        CUISINE_MAP.put("cake", "Dessert");
        CUISINE_MAP.put("pastry", "Bakery");
        CUISINE_MAP.put("Mezze", "Mediterranean");
        CUISINE_MAP.put("Brasa", "Mediterranean");
        CUISINE_MAP.put("22 Constanzaa", "Mediterranean");
        CUISINE_MAP.put("Azzuri Bay", "Mediterranean");
        CUISINE_MAP.put("Kefi at Taj Club House", "Mediterranean");
        CUISINE_MAP.put("Flechazo", "Mediterranean");
        CUISINE_MAP.put("Tamu Tamu", "Mediterranean");
        CUISINE_MAP.put("IGNNA By Midnight Sun", "Mediterranean");
        CUISINE_MAP.put("asian", "Asian");
        // 🔹 Indian Cuisines
        CUISINE_MAP.put("biryani", "Biryani");
        CUISINE_MAP.put("butter chicken", "Indian");
        CUISINE_MAP.put("dal makhani", "Indian");
        CUISINE_MAP.put("paneer", "Indian");
        CUISINE_MAP.put("south indian", "South Indian");
        CUISINE_MAP.put("tandoori", "Indian");
        CUISINE_MAP.put("chole bhature", "Indian");

        // 🔹 Asian Cuisines
        CUISINE_MAP.put("chinese", "Chinese");
        CUISINE_MAP.put("szechuan", "Chinese");
        CUISINE_MAP.put("dimsum", "Chinese");
        CUISINE_MAP.put("ramen", "Japanese");
        CUISINE_MAP.put("sushi", "Japanese");
        CUISINE_MAP.put("korean", "Korean");
        CUISINE_MAP.put("thai", "Thai");

        // 🔹 European Cuisines
        CUISINE_MAP.put("greek", "Greek");
        CUISINE_MAP.put("french", "French");
        CUISINE_MAP.put("spanish", "Spanish");
        CUISINE_MAP.put("german", "German");
        CUISINE_MAP.put("british", "British");

        // 🔹 American & Latin Cuisines
        CUISINE_MAP.put("american", "American");
        CUISINE_MAP.put("bbq", "American");
        CUISINE_MAP.put("mexican", "Mexican");
        CUISINE_MAP.put("taco", "Mexican");
        CUISINE_MAP.put("burrito", "Mexican");
        CUISINE_MAP.put("cajun", "Cajun");
        CUISINE_MAP.put("club", "Cajun");
        CUISINE_MAP.put("caribbean", "Caribbean");
        CUISINE_MAP.put("juice", "Caribbean");
        CUISINE_MAP.put("european", "European");



        // 🔹 Additional Global Cuisines
        CUISINE_MAP.put("mediterranean", "Mediterranean");
        CUISINE_MAP.put("irish", "Irish");
        CUISINE_MAP.put("jewish", "Jewish");
        CUISINE_MAP.put("latin american", "Latin American");
        CUISINE_MAP.put("nordic", "Nordic");
        CUISINE_MAP.put("southern", "Southern");
        CUISINE_MAP.put("vietnamese", "Vietnamese");

    }

    public static String detectCuisine(String restaurantName) {
        System.out.println("🧐 Detecting cuisine for: " + restaurantName); // Debugging
        for (Map.Entry<String, String> entry : CUISINE_MAP.entrySet()) {
            if (restaurantName.toLowerCase().contains(entry.getKey().toLowerCase())) {
                System.out.println("✅ Matched cuisine: " + entry.getValue()); // Debugging
                return entry.getValue();
            }
        }
        System.out.println("❌ No match found, returning General");
        return "General";
    }



}
