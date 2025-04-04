package com.foodservice.UserProfile.Repository;


import com.foodservice.UserProfile.Domain.UserProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserProfileRepository extends MongoRepository<UserProfile, String> {
    Optional<UserProfile> findByUserEmail(String userEmail);
}