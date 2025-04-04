package com.foodservice.UserService.Repository;

import com.foodservice.UserService.Domain.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, String> {
    User findByUserEmailAndUserPassword(String userEmail, String userPassword);
}
