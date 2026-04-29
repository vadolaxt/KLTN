package com.be.service;

import com.be.dto.response.AuthResponse;
import com.be.entity.User;
import com.be.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthService {
    UserRepository userRepository;
    JwtService jwtService;
    PasswordEncoder encoder;
    private final JwtDecoder jwtDecoder;

    public AuthResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        boolean validPassword = encoder.matches(password, user.getPassword());
        if (!validPassword) {
            throw new RuntimeException("Sai mật khẩu");
        }

        return AuthResponse.builder()
                .token(jwtService.generateToken(user.getEmail(), "USER"))
                .build();
    }

    public String refreshToken(String token) {
        Jwt jwt;
        jwt = jwtDecoder.decode(token); // nho try catch token invalid

        User user = userRepository.findByLastName(jwt.getSubject()).orElseThrow(() -> new RuntimeException("user not found")); // xem lai cai exception

        return jwtService.generateToken(user.getLastName(), "USER");
    }
}
