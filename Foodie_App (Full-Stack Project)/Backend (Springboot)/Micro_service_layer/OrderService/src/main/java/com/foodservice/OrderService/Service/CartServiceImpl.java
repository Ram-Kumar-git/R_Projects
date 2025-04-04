package com.foodservice.OrderService.Service;

import com.foodservice.OrderService.Client.UserServiceClient;
import com.foodservice.OrderService.DTO.CartRequestDTO;
import com.foodservice.OrderService.DTO.CartResponseDTO;
import com.foodservice.OrderService.DTO.OrderItemDTO;
import com.foodservice.OrderService.Domain.Cart;
import com.foodservice.OrderService.Domain.OrderItem;
import com.foodservice.OrderService.Repository.CartRepository;
import com.foodservice.OrderService.Client.RestaurantServiceClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private RestaurantServiceClient restaurantServiceClient;

    @Autowired
    private UserServiceClient userServiceClient;

    // Extract userEmail from JWT token
    private String extractUserEmailFromToken(String token) {
        ResponseEntity<String> response = userServiceClient.validateToken(token);
        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token");
        }
        return response.getBody(); // Assuming user email is returned in response body
    }

    @Override
    public CartResponseDTO addToCart(CartRequestDTO cartRequest, String token) {
        String userEmail = extractUserEmailFromToken(token);
        List<OrderItemDTO> items = cartRequest.getItems();
        String newRestaurantName = cartRequest.getRestaurantName(); // Get new restaurant name

        // Validate each menu item with the Restaurant Service
        for (OrderItemDTO item : items) {
            boolean isValidItem = restaurantServiceClient.validateMenuItem(newRestaurantName, item.getItemName()).getBody();
            if (!isValidItem) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid menu item: " + item.getItemName());
            }
        }

        // Fetch the existing cart (if available)
        Optional<Cart> existingCart = cartRepository.findByUserEmail(userEmail);

        if (existingCart.isPresent()) {
            Cart cart = existingCart.get();

            // If cart contains items from another restaurant, prompt the user
            if (!cart.getItems().isEmpty() && !cart.getRestaurantName().equalsIgnoreCase(newRestaurantName)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "Your cart contains items from another restaurant. Would you like to reset your cart?");
            }

            // Update the cart with new items
            List<OrderItem> orderItems = items.stream()
                    .map(dto -> new OrderItem(dto.getItemName(), dto.getQuantity(), dto.getPrice(), dto.getImageUrl(), newRestaurantName))
                    .collect(Collectors.toList());

            cart.setItems(orderItems);
            cart.setRestaurantName(newRestaurantName); // Update restaurant name
            cartRepository.save(cart);

            return new CartResponseDTO(userEmail, items);
        }

        // Create new cart if it doesn't exist
        List<OrderItem> orderItems = items.stream()
                .map(dto -> new OrderItem(dto.getItemName(), dto.getQuantity(), dto.getPrice(), dto.getImageUrl(), newRestaurantName))
                .collect(Collectors.toList());

        Cart newCart = new Cart(userEmail, orderItems, newRestaurantName);
        cartRepository.save(newCart);

        return new CartResponseDTO(userEmail, items);
    }

    @Override
    public CartResponseDTO removeFromCart(String token, String cartItemId) {
        String userEmail = extractUserEmailFromToken(token);

        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        List<OrderItem> updatedItems = cart.getItems().stream()
                .filter(item -> !item.getMenuItem().equalsIgnoreCase(cartItemId)) // Case-insensitive match
                .collect(Collectors.toList());

        if (updatedItems.isEmpty()) {
            cartRepository.deleteByUserEmail(userEmail);
            throw new ResponseStatusException(HttpStatus.OK, "Cart is now empty");
        } else {
            cart.setItems(updatedItems);
            cartRepository.save(cart);
        }

        List<OrderItemDTO> responseItems = updatedItems.stream()
                .map(item -> new OrderItemDTO(item.getMenuItem(), item.getQuantity(), item.getPrice(), item.getImageUrl(), item.getRestaurantName()))
                .collect(Collectors.toList());

        return new CartResponseDTO(userEmail, responseItems);
    }

    @Override
    public CartResponseDTO getCart(String token) {
        String userEmail = extractUserEmailFromToken(token);

        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        // Use the cart's restaurant name instead of fetching it from items
        String restaurantName = cart.getRestaurantName();

        List<OrderItemDTO> responseItems = cart.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getMenuItem(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getImageUrl(),
                        restaurantName)) // Ensure restaurantName is set
                .collect(Collectors.toList());

        return new CartResponseDTO(userEmail, responseItems);
    }

    @Override
    public CartResponseDTO updateQuantity(String token, String cartItemId, int quantity) {
        String userEmail = extractUserEmailFromToken(token);

        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart not found"));

        List<OrderItem> updatedItems = cart.getItems().stream()
                .map(item -> {
                    if (item.getMenuItem().equals(cartItemId)) {
                        return new OrderItem(item.getMenuItem(), quantity, item.getPrice(), item.getImageUrl(), item.getRestaurantName());
                    }
                    return item;
                })
                .collect(Collectors.toList());

        cart.setItems(updatedItems);
        cartRepository.save(cart);

        List<OrderItemDTO> responseItems = updatedItems.stream()
                .map(item -> new OrderItemDTO(item.getMenuItem(), item.getQuantity(), item.getPrice(), item.getImageUrl(), item.getRestaurantName()))
                .collect(Collectors.toList());

        return new CartResponseDTO(userEmail, responseItems);
    }

}