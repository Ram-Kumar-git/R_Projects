package com.foodservice.PaymentService.DTO;



public class PaymentRequestDTO {
    private String orderId;
    private String userEmail;
    private double amount;
    private String currency = "inr";  // Default INR
    private String paymentMethod;
    private String paymentMethodId;


    public PaymentRequestDTO(String orderId, String userEmail, double amount, String currency, String paymentMethod, String paymentMethodId) {
        this.orderId = orderId;
        this.userEmail = userEmail;
        this.amount = amount;
        this.currency = currency;
        this.paymentMethod = paymentMethod;
        this.paymentMethodId = paymentMethodId;
    }

    public PaymentRequestDTO() {
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    @Override
    public String toString() {
        return "PaymentRequestDTO{" +
                "orderId='" + orderId + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", amount=" + amount +
                ", currency='" + currency + '\'' +
                ", paymentMethod='" + paymentMethod + '\'' +
                ", paymentMethodId='" + paymentMethodId + '\'' +
                '}';
    }
}