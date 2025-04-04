package com.foodservice.OrderService.Service;
import com.foodservice.OrderService.DTO.OrderResponseDTO;

import java.util.List;

public interface OrderService {
    OrderResponseDTO placeOrder(String token, String paymentMethod);
    List<OrderResponseDTO> getUserOrders(String token);
    OrderResponseDTO cancelOrder(String orderId, String token);
    String getLatestOrderId(String token);
    void updatePaymentStatus(String orderId, String status, String paymentMethod);
    List<OrderResponseDTO> getAllOrders();
}