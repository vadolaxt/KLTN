package com.be.service;

import com.be.dto.request.AuthRequest;
import com.be.dto.request.RegisterRequest;
import com.be.dto.response.AuthResponse;
import com.be.entity.User;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthService {
    UserRepository userRepository;
    JwtService jwtService;
    PasswordEncoder passwordEncoder;
    JwtDecoder jwtDecoder;
    StringRedisTemplate redisTemplate;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    String googleClientId;

    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public void saveOtp(String email, String otp) {
        String key = "otp:" + email;
        redisTemplate.opsForValue().set(key, otp, 5, TimeUnit.MINUTES);
        log.info("Saving OTP value (" + otp + ") for email: " + email);
    }

    public long getTTL(String email) {
        String key = "otp:" + email;
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    public void checkUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.ACCOUNT_EXISTED);
        }
    }

    public String register(RegisterRequest request) {
        String redisKey = "otp:" + request.getEmail();
        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp == null) {
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }
        if (!request.getOtp().equals(storedOtp)) {
            throw new AppException(ErrorCode.OTP_MISMATCH);
        }

        redisTemplate.delete(redisKey);

        userRepository.save(User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .DOB(request.getDateOfBirth().toInstant())
                .identity(request.getIdentity())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build());
        return "Tài khoản đăng ký thành công";
    }

    public String createAccessCookie(String accessToken) {
        ResponseCookie accessCookie = ResponseCookie.from(
                        "accessToken",
                        accessToken
                )
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("Lax")
                .build();

        return accessCookie.toString();
    }

    public String createRefreshCookie(String refreshToken) {
        ResponseCookie refreshCookie = ResponseCookie.from(
                        "refreshToken",
                        refreshToken
                )
                .httpOnly(true)
                .secure(false)
                .path("/api/auth/refresh")
                .maxAge(30 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return refreshCookie.toString();
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new AppException(ErrorCode.INVALID_TOKEN);
            }
            return idToken.getPayload();
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    public AuthResponse loginGoogle(String idTokenString) {
        GoogleIdToken.Payload payload = verifyGoogleToken(idTokenString);

        String email = payload.getEmail();
        String firstName = (String) payload.get("given_name");
        String lastName = (String) payload.get("family_name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .build();
            return userRepository.save(newUser);
        });

        String accessToken = jwtService.generateToken(user, false);
        String refreshToken = jwtService.generateToken(user, true);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return AuthResponse.builder().
                    authenticated(false)
                    .build();
        }

        return AuthResponse.builder()
                .accessToken(jwtService.generateToken(user, false))
                .refreshToken(jwtService.generateToken(user, true))
                .authenticated(true)
                .build();
    }

    public String refreshToken(String refreshToken) {
        try {
            Jwt jwt = jwtDecoder.decode(refreshToken);
            String userId = jwt.getSubject();

            if (!"REFRESH_TOKEN".equals(jwt.getClaim("scope"))) {
                throw new AppException(ErrorCode.WRONG_TOKEN_TYPE);
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            return jwtService.generateToken(user, false);
        } catch (JwtException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }
}
