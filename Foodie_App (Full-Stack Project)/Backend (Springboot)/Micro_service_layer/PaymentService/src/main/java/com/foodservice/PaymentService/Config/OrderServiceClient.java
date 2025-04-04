package com.foodservice.PaymentService.Config;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@FeignClient(name = "order-service", url = "http://localhost:8086/api/orders")
public interface OrderServiceClient {

    @GetMapping("/latest-order-id")
    String getLatestOrderId(@RequestHeader("Authorization") String token);

    @PutMapping("/order/updatePaymentStatus/{orderId}")
    void updateOrderPaymentStatus(@PathVariable String orderId, @RequestParam String status, @RequestParam String paymentMethod);
}