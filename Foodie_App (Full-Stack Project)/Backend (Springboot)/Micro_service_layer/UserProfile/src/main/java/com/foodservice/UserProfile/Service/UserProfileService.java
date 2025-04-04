package com.foodservice.UserProfile.Service;

import com.foodservice.UserProfile.Domain.UserProfile;

import java.util.Optional;

public interface UserProfileService {
    public UserProfile saveUserProfile(UserProfile userProfile);
    public UserProfile getUserProfileByToken(String token);
}
