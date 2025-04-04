package com.foodservice.UserService.Service;

import com.foodservice.UserService.Domain.User;
import com.foodservice.UserService.Exception.InvalidCredentialsException;
import com.foodservice.UserService.Exception.UserAlreadyExistsException;

public interface UserService {
    User registerUser(User user) throws UserAlreadyExistsException;
    User findByUserEmailAndUserPassword(String userEmail, String userPassword) throws InvalidCredentialsException;
    boolean doesUserExists(String email);
    User findByUserEmail(String userEmail);
}
