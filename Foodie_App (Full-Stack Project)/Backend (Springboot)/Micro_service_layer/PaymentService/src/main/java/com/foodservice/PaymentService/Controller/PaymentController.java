package com.foodservice.PaymentService.Controller;

import com.foodservice.PaymentService.DTO.PaymentRequestDTO;
import com.foodservice.PaymentService.DTO.PaymentResponseDTO;
import com.foodservice.PaymentService.Service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequestDTO request, HttpServletRequest httpRequest) {
        System.out.println("Processing payment request: " + request);
        try {
            PaymentResponseDTO response = paymentService.processPayment(request, httpRequest);
            System.out.println("Payment successful: " + response);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.out.println("Payment processing failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error processing payment: " + e.getMessage());
        }
    }
}
