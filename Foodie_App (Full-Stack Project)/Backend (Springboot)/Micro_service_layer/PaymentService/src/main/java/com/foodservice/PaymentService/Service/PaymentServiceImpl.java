package com.foodservice.PaymentService.Service;

import com.foodservice.PaymentService.Config.OrderServiceClient;
import com.foodservice.PaymentService.Config.UserServiceClient;
import com.foodservice.PaymentService.DTO.PaymentRequestDTO;
import com.foodservice.PaymentService.DTO.PaymentResponseDTO;
import com.foodservice.PaymentService.Domain.Payment;
import com.foodservice.PaymentService.Repository.PaymentRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.PaymentMethod;
import com.stripe.param.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.stripe.model.Customer;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private UserServiceClient userServiceClient; // ✅ Fetch Email from Token

    @Autowired
    private OrderServiceClient orderServiceClient; // ✅ Fetch Latest Order ID

    @Override
    public PaymentResponseDTO processPayment(PaymentRequestDTO request, HttpServletRequest httpRequest) {
        try {
            // ✅ Step 1: Get JWT Token from Request Header
            String token = httpRequest.getHeader("Authorization");

            // ✅ Step 2: Fetch User Email from User Service
            ResponseEntity<String> response = userServiceClient.validateToken(token);
            String userEmail = response.getBody();
            System.out.println("✅ User Email: " + userEmail);

            // ✅ Step 3: Fetch Latest Order ID from Order Service
            String orderId = orderServiceClient.getLatestOrderId(token);
            System.out.println("✅ Latest Order ID: " + orderId);

            if (orderId == null) {
                throw new RuntimeException("⚠ No recent order found for this user.");
            }

            // ✅ Step 4: Handle Cash on Delivery (COD)
            if ("cod".equalsIgnoreCase(request.getPaymentMethod())) {
                Payment codPayment = new Payment();
                codPayment.setOrderId(orderId);
                codPayment.setUserEmail(userEmail);
                codPayment.setAmount(request.getAmount());
                codPayment.setCurrency(request.getCurrency());
                codPayment.setPaymentMethod("cod");
                codPayment.setStatus("PENDING");
                codPayment.setTransactionId("COD-" + orderId);

                paymentRepository.save(codPayment);

                // ✅ Step 5: Update Order Status in MongoDB
                orderServiceClient.updateOrderPaymentStatus(orderId, "PENDING", "cod");

                return new PaymentResponseDTO(
                        orderId,
                        codPayment.getTransactionId(),
                        request.getAmount(),
                        request.getCurrency(),
                        "PENDING"
                );
            }

            // ✅ Step 6: Ensure paymentMethodId is provided
            if (request.getPaymentMethodId() == null || request.getPaymentMethodId().isEmpty()) {
                throw new RuntimeException("❌ Payment method ID is required for card payments.");
            }

            Stripe.apiKey = "sk_test_51R0iq34EqZcfk7rC0JAdRzZF6836GiFyZSGctVm0e8cWmN7up014dDZsB8a5MhKzNfVMxYH1h781ztdnLdn1YPK800wY7LK87n";
            long amountInPaisa = (long) (request.getAmount() * 100);

            // ✅ Step 7: Retrieve or Create Stripe Customer
            Customer customer;
            List<Customer> existingCustomers = Customer.list(CustomerListParams.builder()
                    .setEmail(userEmail)
                    .build()).getData();

            if (!existingCustomers.isEmpty()) {
                customer = existingCustomers.get(0);
            } else {
                customer = Customer.create(CustomerCreateParams.builder()
                        .setEmail(userEmail)
                        .build());
            }

            // ✅ Step 8: Validate PaymentMethod ID before using
            PaymentMethod paymentMethod;
            try {
                paymentMethod = PaymentMethod.retrieve(request.getPaymentMethodId());
                System.out.println("✅ Valid PaymentMethod ID: " + paymentMethod.getId());
            } catch (StripeException e) {
                throw new RuntimeException("❌ Invalid payment method ID.");
            }

            // ✅ Step 9: Attach PaymentMethod to Customer (if not already attached)
            if (paymentMethod.getCustomer() == null) {
                paymentMethod.attach(PaymentMethodAttachParams.builder()
                        .setCustomer(customer.getId())
                        .build());
            }

            // ✅ Step 10: Set PaymentMethod as Default for Customer
            CustomerUpdateParams updateParams = CustomerUpdateParams.builder()
                    .setInvoiceSettings(CustomerUpdateParams.InvoiceSettings.builder()
                            .setDefaultPaymentMethod(request.getPaymentMethodId())
                            .build())
                    .build();
            customer.update(updateParams);

            // ✅ Step 11: Create and Confirm PaymentIntent
            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amountInPaisa)
                    .setCurrency(request.getCurrency().toLowerCase())
                    .setCustomer(customer.getId())
                    .setPaymentMethod(request.getPaymentMethodId())
                    .setConfirm(true)
                    .setCaptureMethod(PaymentIntentCreateParams.CaptureMethod.AUTOMATIC)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .setAllowRedirects(PaymentIntentCreateParams.AutomaticPaymentMethods.AllowRedirects.NEVER)
                                    .build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);
            System.out.println("✅ Payment Intent Created: " + paymentIntent.getId());

            // ✅ Step 12: Save Payment in Database
            Payment cardPayment = new Payment();
            cardPayment.setOrderId(orderId);
            cardPayment.setUserEmail(userEmail);
            cardPayment.setAmount(request.getAmount());
            cardPayment.setCurrency(request.getCurrency());
            cardPayment.setPaymentMethod("card");
            cardPayment.setStatus(paymentIntent.getStatus());
            cardPayment.setTransactionId(paymentIntent.getId());

            paymentRepository.save(cardPayment);

            // ✅ Step 13: Update Order Status in MongoDB after successful payment
            orderServiceClient.updateOrderPaymentStatus(orderId, paymentIntent.getStatus(), "card");

            return new PaymentResponseDTO(
                    orderId,
                    paymentIntent.getId(),
                    request.getAmount(),
                    request.getCurrency(),
                    paymentIntent.getStatus()
            );

        } catch (StripeException e) {
            e.printStackTrace();
            throw new RuntimeException("❌ Stripe Error: " + e.getCode() + " - " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("❌ Payment failed: " + e.getMessage());
        }
    }

/**
     * ✅ Helper Method: Check if there is an existing PaymentIntent for the given orderId.
     */
    private PaymentIntent findExistingPaymentIntent(String orderId) {
        // ✅ Check if there is a previous payment record for this order
        Payment existingPayment = paymentRepository.findByOrderId(orderId);
        if (existingPayment != null) {
            try {
                return PaymentIntent.retrieve(existingPayment.getTransactionId());
            } catch (StripeException e) {
                return null; // If not found, return null
            }
        }
        return null;
    }
}
