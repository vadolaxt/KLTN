package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.AuthRequest;
import com.be.dto.response.AuthResponse;
import com.be.service.AuthService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.naming.AuthenticationException;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @RequestBody AuthRequest request) {

        AuthResponse response = authService.login(request);

        if (!response.isAuthenticated()) {
            return ResponseEntity.ok(
                    ApiResponse.error(HttpStatus.UNAUTHORIZED, "Sai password hoặc email")
            );
        }

        ResponseCookie accessCookie = ResponseCookie.from(
                        "accessToken",
                        response.getAccessToken()
                )
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("Lax")
                .build();

        ResponseCookie refreshCookie = ResponseCookie.from(
                        "refreshToken",
                        response.getRefreshToken()
                )
                .httpOnly(true)
                .secure(false)
                .path("/api/auth/refresh")
                .maxAge(30 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(
                        ApiResponse.success(HttpStatus.OK, "Tạo token thành công", response)
                );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {

        String newToken = authService.refreshToken(refreshToken);

        ResponseCookie accessCookie = ResponseCookie.from(
                        "accessToken",
                        newToken
                )
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("Lax")
                .build();

        AuthResponse response = AuthResponse.builder()
                .accessToken(newToken)
                .authenticated(true)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie.toString())
                .body(
                        ApiResponse.success(HttpStatus.OK, "Làm mới token thành công", response)
                );
    }
}
