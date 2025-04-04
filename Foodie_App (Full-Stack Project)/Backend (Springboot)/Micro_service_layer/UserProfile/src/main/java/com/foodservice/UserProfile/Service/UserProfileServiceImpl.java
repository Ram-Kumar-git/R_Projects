package com.foodservice.UserProfile.Service;

import com.foodservice.UserProfile.Client.UserDetailsResponse;
import com.foodservice.UserProfile.Client.UserServiceClient;
import com.foodservice.UserProfile.Domain.UserProfile;
import com.foodservice.UserProfile.Repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserProfileServiceImpl implements UserProfileService {
    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserServiceClient userServiceClient;

    public UserProfile saveUserProfile(UserProfile userProfile) {
        return userProfileRepository.save(userProfile);
    }

    @Override
    public UserProfile getUserProfileByToken(String token) {
        // Call validate-token endpoint to get the email
        ResponseEntity<String> response = userServiceClient.validateToken(token);

        // Extract email from response body
        String userEmail = response.getBody();

        if (userEmail == null || userEmail.isEmpty()) {
            throw new RuntimeException("Invalid or expired token");
        }

        // Fetch user profile from database using email
        return userProfileRepository.findByUserEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User profile not found for email: " + userEmail));
    }
}