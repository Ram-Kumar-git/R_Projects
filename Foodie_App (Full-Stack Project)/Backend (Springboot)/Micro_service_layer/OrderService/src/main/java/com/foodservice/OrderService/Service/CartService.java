package com.foodservice.OrderService.Service;

import com.foodservice.OrderService.DTO.CartRequestDTO;
import com.foodservice.OrderService.DTO.CartResponseDTO;

public interface CartService {
    CartResponseDTO addToCart(CartRequestDTO cartRequest, String token);
    CartResponseDTO removeFromCart(String userEmail, String cartItemId);
    CartResponseDTO getCart(String userEmail);
    CartResponseDTO updateQuantity(String userEmail, String cartItemId, int quantity);
}