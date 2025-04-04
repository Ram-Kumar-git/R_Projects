package com.foodservice.OrderService.Service;

import com.foodservice.OrderService.Client.UserServiceClient;
import com.foodservice.OrderService.DTO.OrderItemDTO;
import com.foodservice.OrderService.DTO.OrderResponseDTO;
import com.foodservice.OrderService.Domain.Cart;
import com.foodservice.OrderService.Domain.Order;
import com.foodservice.OrderService.Repository.CartRepository;
import com.foodservice.OrderService.Repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    @Override
    public OrderResponseDTO placeOrder(String token, String paymentMethod) {
        // 🔹 Extract email from token using UserServiceClient
        ResponseEntity<String> response = userServiceClient.validateToken(token);
        String userEmail = response.getBody();

        // 🔹 Fetch cart details using extracted email
        Cart cart = cartRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart is empty"));

        // 🔹 Calculate total amount
        double totalAmount = cart.getItems().stream()
                .mapToDouble(item -> item.getQuantity() * item.getPrice())
                .sum();
        System.out.println(cart.getItems());

        String restaurantName = cart.getItems().get(0).getRestaurantName();


        // 🔹 Create and save the order
        Order order = new Order(userEmail, cart.getItems(), totalAmount, "PENDING", paymentMethod, LocalDateTime.now(),restaurantName); // ✅ Set orderDate
        orderRepository.save(order);

        // 🔹 Clear the cart after placing the order
        cartRepository.deleteByUserEmail(userEmail);

        return new OrderResponseDTO(
                order.getOrderId(), // ✅ Use getOrderId() instead of getId()
                userEmail,
                order.getItems().stream()
                        .map(item -> new OrderItemDTO(item.getMenuItem(), item.getQuantity(), item.getPrice(), item.getImageUrl(),item.getRestaurantName()))
                        .collect(Collectors.toList()),
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getOrderDate(),
                order.getRestaurantName()
        );

    }



    @Override
    public List<OrderResponseDTO> getUserOrders(String token) {
        // 🔹 Extract userEmail from token
        String userEmail = userServiceClient.validateToken(token).getBody();

        List<Order> orders = orderRepository.findByUserEmail(userEmail);

        return orders.stream()
                .map(order -> new OrderResponseDTO(
                        order.getOrderId(),
                        userEmail,
                        order.getItems().stream()  // ✅ Convert List<OrderItem> to List<OrderItemDTO>
                                .map(item -> new OrderItemDTO(item.getMenuItem(), item.getQuantity(), item.getPrice(), item.getImageUrl(),item.getRestaurantName()))
                                .collect(Collectors.toList()),
                        order.getTotalAmount(),
                        order.getStatus(),
                        order.getPaymentMethod(),
                        order.getOrderDate(),
                        order.getRestaurantName()
                ))
                .collect(Collectors.toList());


    }


    @Override
    public OrderResponseDTO cancelOrder(String orderId, String token) {
        // 🔹 Extract email from token
        String userEmail = userServiceClient.validateToken(token).getBody();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        // 🔹 Authorization check: Ensure user can only cancel their own order
        if (!order.getUserEmail().equals(userEmail)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized to cancel this order");
        }

        order.setStatus("CANCELLED");
        orderRepository.save(order);

        // ✅ Convert List<OrderItem> to List<OrderItemDTO>
        List<OrderItemDTO> orderItemDTOs = order.getItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getMenuItem(), // Ensure correct field mapping
                        item.getQuantity(),
                        item.getPrice(),
                        item.getImageUrl(),
                        item.getRestaurantName()
                ))
                .collect(Collectors.toList());

        return new OrderResponseDTO(
                order.getOrderId(),
                order.getUserEmail(),
                orderItemDTOs, // ✅ Corrected to pass List<OrderItemDTO>
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getOrderDate(),
                order.getRestaurantName()
        );
    }

    public String getLatestOrderId(String token) {
        ResponseEntity<String> response = userServiceClient.validateToken(token);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Invalid token");
        }

        String userEmail = response.getBody();

        List<Order> orders = orderRepository.findByUserEmail(userEmail);

        // ✅ Ensure orders exist
        if (orders.isEmpty()) {
            return "No orders found";
        }

        // ✅ Handle null orderDate by placing nulls last
        return orders.stream()
                .filter(order -> order.getOrderDate() != null) // ✅ Remove orders with null dates
                .max(Comparator.comparing(Order::getOrderDate)) // ✅ Get latest order
                .map(Order::getOrderId)
                .orElse("No valid orders found");
    }

    @Transactional
    @Override
    public void updatePaymentStatus(String orderId, String status, String paymentMethod) {
        Optional<Order> orderOptional = orderRepository.findById(orderId);
        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();
            order.setStatus(status);
            order.setPaymentMethod(paymentMethod);
            orderRepository.save(order);
            System.out.println("✅ Order Updated: " + orderId + " - Status: " + status + " - PaymentMethod: " + paymentMethod);
        } else {
            throw new RuntimeException("⚠ Order not found with ID: " + orderId);
        }
    }
    @Override
    public List<OrderResponseDTO> getAllOrders() {
        // 🔹 Fetch all orders from the repository
        List<Order> orders = orderRepository.findAll();

        return orders.stream()
                .map(order -> new OrderResponseDTO(
                        order.getOrderId(),
                        order.getUserEmail(),  // ✅ Include user email for identification
                        order.getItems().stream()
                                .map(item -> new OrderItemDTO(item.getMenuItem(), item.getQuantity(), item.getPrice(), item.getImageUrl(), item.getRestaurantName()))
                                .collect(Collectors.toList()),
                        order.getTotalAmount(),
                        order.getStatus(),
                        order.getPaymentMethod(),
                        order.getOrderDate(),
                        order.getRestaurantName()
                ))
                .collect(Collectors.toList());
    }
}