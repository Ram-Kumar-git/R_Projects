package com.foodservice.UserService.Controller;

import com.foodservice.UserService.Domain.RegistrationDTO;
import com.foodservice.UserService.Domain.User;
import com.foodservice.UserService.Domain.UserProfileDTO;
import com.foodservice.UserService.Exception.InvalidCredentialsException;
import com.foodservice.UserService.Exception.UserAlreadyExistsException;
import com.foodservice.UserService.FeignClient.UserProfileClient;
import com.foodservice.UserService.Service.UserService;
import com.foodservice.UserService.Utility.SecurityTokenGenerator;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {
    private final UserService userService;
    private final UserProfileClient userProfileClient;
    private final SecurityTokenGenerator securityTokenGenerator;

    @Autowired
    public UserController(UserService userService, UserProfileClient userProfileClient, SecurityTokenGenerator securityTokenGenerator) {
        this.userService = userService;
        this.userProfileClient = userProfileClient;
        this.securityTokenGenerator = securityTokenGenerator;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationDTO registrationDTO)
            throws UserAlreadyExistsException {

        if (userService.doesUserExists(registrationDTO.getUserEmail())) {
            throw new UserAlreadyExistsException("User Already Exists");
        }

        // Save in MySQL
        User user = new User(registrationDTO.getUserEmail(), registrationDTO.getUserPassword());
        User registeredUser = userService.registerUser(user);

        // Save in MongoDB via Feign Client
        UserProfileDTO userProfileDTO = new UserProfileDTO(
                registrationDTO.getUserEmail(),
                registrationDTO.getFullName(),
                registrationDTO.getPhoneNumber(),
                registrationDTO.getAddress()
        );
        userProfileClient.saveUserProfile(userProfileDTO);

        // ✅ Generate JWT token for newly registered user
        String token = securityTokenGenerator.createToken(user);
        // ✅ Send both token and user details in response
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", registeredUser);


        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) throws InvalidCredentialsException {
        User loggedInUser = userService.findByUserEmailAndUserPassword(user.getUserEmail(), user.getUserPassword());

        if (loggedInUser == null) {
            throw new InvalidCredentialsException("Invalid Email or password");
        }

        // Generate JWT token
        String token = securityTokenGenerator.createToken(user);

        // Create a response object with token and user details
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", loggedInUser); // Send user details along with the token

        return ResponseEntity.ok(response);
    }
    @GetMapping("/validate-token")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        try {
            // ✅ Remove "Bearer " prefix before validation
            if (token.startsWith("Bearer ")) {
                token = token.substring(7); // Extract actual token
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token format.");
            }

            // ✅ Validate the token
            securityTokenGenerator.validateToken(token);

            // ✅ Extract email and return if valid
            String userEmail = securityTokenGenerator.extractEmailFromToken(token);
            return ResponseEntity.ok(userEmail);

        } catch (ExpiredJwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token expired. Please log in again.");
        } catch (JwtException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Token.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong.");
        }
    }
    }


