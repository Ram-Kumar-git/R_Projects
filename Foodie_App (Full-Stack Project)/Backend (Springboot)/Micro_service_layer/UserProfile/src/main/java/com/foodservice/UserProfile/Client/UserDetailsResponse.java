package com.foodservice.UserProfile.Client;

public class UserDetailsResponse {
    private String userEmail;

    public UserDetailsResponse() {
    }

    public UserDetailsResponse(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    @Override
    public String toString() {
        return "UserDetailsResponse{" +
                "userEmail='" + userEmail + '\'' +
                '}';
    }
}
