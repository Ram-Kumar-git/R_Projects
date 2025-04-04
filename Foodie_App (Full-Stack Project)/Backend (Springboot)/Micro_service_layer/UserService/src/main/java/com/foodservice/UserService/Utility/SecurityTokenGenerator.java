package com.foodservice.UserService.Utility;

import com.foodservice.UserService.Domain.User;

public interface SecurityTokenGenerator {
    String createToken(User user);
    String extractEmailFromToken(String token);
    void validateToken(String token);
}
