package com.foodservice.UserService.Service;

import com.foodservice.UserService.Domain.User;
import com.foodservice.UserService.Exception.InvalidCredentialsException;
import com.foodservice.UserService.Exception.UserAlreadyExistsException;
import com.foodservice.UserService.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    private UserRepository userRepository;

    @Autowired
    public UserServiceImpl(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    @Override
    public User registerUser(User user) throws UserAlreadyExistsException {
        if (userRepository.findById(user.getUserEmail()).isPresent()) {
            throw new UserAlreadyExistsException("User Already Exists");
        }
        return userRepository.save(user);
    }

    @Override
    public User findByUserEmailAndUserPassword(String userEmail, String userPassword) throws InvalidCredentialsException {
        User loggedInUser = userRepository.findByUserEmailAndUserPassword(userEmail,userPassword);
        if(loggedInUser == null){
            throw new InvalidCredentialsException("Invalid Email Or Password");
        }
        return loggedInUser;

    }
    @Override
    public boolean doesUserExists(String userEmail){
        return userRepository.existsById(userEmail);
    }
    @Override
    public User findByUserEmail(String userEmail) {
        return userRepository.findById(userEmail).orElse(null);
    }
}


