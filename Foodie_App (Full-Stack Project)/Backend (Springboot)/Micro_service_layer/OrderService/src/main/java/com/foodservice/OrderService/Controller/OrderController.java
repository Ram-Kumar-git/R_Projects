package com.foodservice.OrderService.Controller;

import com.foodservice.OrderService.DTO.OrderResponseDTO;
import com.foodservice.OrderService.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000",allowedHeaders = "*",methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS},allowCredentials = "true")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<OrderResponseDTO> placeOrder(
            @RequestHeader("Authorization") String token, // ✅ Get token from request header
            @RequestParam String paymentMethod) {

        return ResponseEntity.ok(orderService.placeOrder(token, paymentMethod)); // ✅ Pass token instead of userEmail
    }

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrders(
            @RequestHeader("Authorization") String token) { // ✅ Get token from request header

        return ResponseEntity.ok(orderService.getUserOrders(token)); // ✅ Pass token for email extraction
    }


    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<OrderResponseDTO> cancelOrder(
            @PathVariable String orderId,
            @RequestHeader("Authorization") String token) { // ✅ Get token from request header

        return ResponseEntity.ok(orderService.cancelOrder(orderId, token)); // ✅ Pass token for email extraction
    }

    @GetMapping("/latest-order-id")
    public ResponseEntity<String> getLatestOrderId(
            @RequestHeader("Authorization") String token) { // ✅ Expecting Authorization header

        String latestOrderId = orderService.getLatestOrderId(token); // ✅ Implement this method in OrderService
        return ResponseEntity.ok(latestOrderId);
    }
    @PutMapping("order/updatePaymentStatus/{orderId}")
    public void updateOrderPaymentStatus(
            @PathVariable String orderId,
            @RequestParam String status,
            @RequestParam String paymentMethod) {
        orderService.updatePaymentStatus(orderId, status, paymentMethod);
    }

    @GetMapping("/all")
    public ResponseEntity<List<OrderResponseDTO>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

}