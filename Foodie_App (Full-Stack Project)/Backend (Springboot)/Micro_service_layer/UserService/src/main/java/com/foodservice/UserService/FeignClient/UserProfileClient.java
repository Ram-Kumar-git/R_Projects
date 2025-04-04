package com.foodservice.UserService.FeignClient;

import com.foodservice.UserService.Domain.UserProfileDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "user-profile-service", url = "http://localhost:8081/api/user-profiles")
public interface UserProfileClient {
    @PostMapping("/save")
    ResponseEntity<UserProfileDTO> saveUserProfile(@RequestBody UserProfileDTO userProfileDTO);
}