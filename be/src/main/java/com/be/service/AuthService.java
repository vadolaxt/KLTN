package com.be.service;

import com.be.dto.request.AuthRequest;
import com.be.dto.response.AuthResponse;
import com.be.entity.User;
import com.be.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    UserRepository userRepository;
    JwtService jwtService;
    PasswordEncoder passwordEncoder;
    private final JwtDecoder jwtDecoder;

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return AuthResponse.builder().
                    authenticated(false)
                    .build();
        }

        return AuthResponse.builder()
                .accessToken(jwtService.generateToken(user.getEmail(), user.getRole().toString(), false))
                .refreshToken(jwtService.generateToken(user.getEmail(), user.getRole().toString(), true))
                .authenticated(true)
                .build();
    }

    public String refreshToken(String refreshToken) {
        try {
            Jwt jwt = jwtDecoder.decode(refreshToken);
            String email = jwt.getSubject();

            if (!"REFRESH_TOKEN".equals(jwt.getClaim("scope"))) {
                throw new RuntimeException("Invalid token type");
            }

            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("user not found"));

            return jwtService.generateToken(user.getEmail(), "USER", false);
        } catch (JwtException e) {
            throw new RuntimeException("Refresh token expired or invalid");
        }
    }
}
