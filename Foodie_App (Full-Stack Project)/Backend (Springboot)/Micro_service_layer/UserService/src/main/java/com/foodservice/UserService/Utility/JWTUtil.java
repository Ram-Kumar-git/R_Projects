package com.foodservice.UserService.Utility;

import com.foodservice.UserService.Domain.User;
import com.foodservice.UserService.Exception.InvalidTokenException;
import com.foodservice.UserService.Exception.TokenExpiredException;
import io.jsonwebtoken.*;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JWTUtil implements SecurityTokenGenerator {

    private static final String SECRET_KEY = "SecretKey"; // Use same key across services

    @Override
    public String createToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email", user.getUserEmail());
        return generateToken(claims, user.getUserEmail());
    }

    private String generateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setIssuer("Foodservice")
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60)) // 1 hour validity
                .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // HS256 for symmetric key
                .compact();
    }
    @Override
    public String extractEmailFromToken(String token) {
        Claims claims = Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token.replace("Bearer ", "")) // Remove "Bearer " prefix
                .getBody();
        return claims.get("email", String.class);
    }
    public void validateToken(String token) {
        try {
            Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token.replace("Bearer ", ""));
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException("Token expired. Please log in again."); // ⛔ Throw custom exception
        } catch (UnsupportedJwtException | MalformedJwtException | IllegalArgumentException e) {
            throw new InvalidTokenException("Invalid token.");
        }
    }

}
