package com.foodservice.PaymentService.Service;

import com.foodservice.PaymentService.DTO.PaymentRequestDTO;
import com.foodservice.PaymentService.DTO.PaymentResponseDTO;
import jakarta.servlet.http.HttpServletRequest;

public interface PaymentService {
    PaymentResponseDTO processPayment(PaymentRequestDTO request, HttpServletRequest httpRequest);
}