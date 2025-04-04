package com.foodservice.OrderService.Controller;

import com.foodservice.OrderService.DTO.CartRequestDTO;
import com.foodservice.OrderService.DTO.CartResponseDTO;
import com.foodservice.OrderService.Service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000",allowedHeaders = "*",methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},allowCredentials = "true")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartResponseDTO> addToCart(
            @RequestBody CartRequestDTO cartRequest,
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(cartService.addToCart(cartRequest, token));
    }

    @CrossOrigin(origins = "http://localhost:3000")
    @DeleteMapping("/remove")
    public ResponseEntity<CartResponseDTO> removeFromCart(
            @RequestHeader("Authorization") String token,
            @RequestParam String cartItemId) {
        return ResponseEntity.ok(cartService.removeFromCart(token, cartItemId));
    }

    @GetMapping("/getcart")
    public ResponseEntity<CartResponseDTO> getCart(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(cartService.getCart(token));
    }

    @PutMapping("/update-quantity")
    public ResponseEntity<CartResponseDTO> updateQuantity(
            @RequestHeader("Authorization") String token,
            @RequestParam String cartItemId, // Change from PathVariable to RequestParam
            @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(token, cartItemId, quantity));
    }


}