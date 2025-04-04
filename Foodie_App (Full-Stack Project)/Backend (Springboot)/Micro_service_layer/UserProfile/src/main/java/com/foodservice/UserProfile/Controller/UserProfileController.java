package com.foodservice.UserProfile.Controller;


import com.foodservice.UserProfile.Domain.UserProfile;
import com.foodservice.UserProfile.Service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user-profiles")
@CrossOrigin(origins = "http://localhost:3000")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @PostMapping("/save")
    public ResponseEntity<UserProfile> saveUserProfile(@RequestBody UserProfile userProfile) {
        return ResponseEntity.ok(userProfileService.saveUserProfile(userProfile));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfile> getUserProfile(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(userProfileService.getUserProfileByToken(token));
    }
}