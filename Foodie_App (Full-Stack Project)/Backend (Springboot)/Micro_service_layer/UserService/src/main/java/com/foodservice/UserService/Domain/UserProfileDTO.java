package com.foodservice.UserService.Domain;


public class UserProfileDTO {
    private String userEmail;
    private String fullName;
    private String phoneNumber;
    private String address;

    // Constructors, Getters & Setters

    public UserProfileDTO() {
    }

    public UserProfileDTO(String userEmail, String fullName, String phoneNumber, String address) {
        this.userEmail = userEmail;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public String toString() {
        return "UserProfileDTO{" +
                "userEmail='" + userEmail + '\'' +
                ", fullName='" + fullName + '\'' +
                ", phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                '}';
    }
}