package com.foodservice.PaymentService.Repository;

import com.foodservice.PaymentService.Domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // ✅ Custom Query Method to Find Payment by Order ID
    Payment findByOrderId(String orderId);
}