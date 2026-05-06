package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.AuthRequest;
import com.be.dto.request.RegisterRequest;
import com.be.dto.response.AuthResponse;
import com.be.service.AuthService;
import com.be.service.EmailService;
import jakarta.validation.Valid;
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

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthController {
    AuthService authService;
    EmailService emailService;

    @PostMapping("/send-otp")
    public ResponseEntity<ApiResponse<Long>> sendOtp(
            @Valid @RequestBody AuthRequest request) {

        String otp = authService.generateOtp();
        authService.saveOtp(request.getEmail(), otp);
        emailService.sendOtpEmail(request.getEmail(), otp);

        long otpTTL = authService.getTTL(request.getEmail());

        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "OTP sent to email: " + request.getEmail(),
                        otpTTL)
        );
    }

    @PostMapping("/check-user")
    public ResponseEntity<ApiResponse<Void>> checkUser(
            @Valid @RequestBody RegisterRequest request
    ) {
        authService.checkUser(request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "This email can be used to create new account",
                        null)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody RegisterRequest request) {

        String registerResponse = authService.register(request);

        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.CREATED, "Account created successfully", registerResponse)
        );
    }

    @PostMapping("/login-google")
    public ResponseEntity<ApiResponse<AuthResponse>> loginWithGoogle(
            @RequestBody Map<String, String> request) {

        String idToken = request.get("idToken");
        AuthResponse response = authService.loginGoogle(idToken);
        String accessCookie = authService.createAccessCookie(response.getAccessToken());
        String refreshCookie = authService.createRefreshCookie(response.getRefreshToken());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie)
                .header(HttpHeaders.SET_COOKIE, refreshCookie)
                .body(
                        ApiResponse.success(HttpStatus.OK, "Đăng nhập bằng Google thành công", response)
                );
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest request) {

        AuthResponse response = authService.login(request);

        if (!response.isAuthenticated()) {
            return ResponseEntity.ok(
                    ApiResponse.error(HttpStatus.UNAUTHORIZED, "Sai password hoặc email")
            );
        }

        String accessCookie = authService.createAccessCookie(response.getAccessToken());
        String refreshCookie = authService.createRefreshCookie(response.getRefreshToken());

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie)
                .header(HttpHeaders.SET_COOKIE, refreshCookie)
                .body(
                        ApiResponse.success(HttpStatus.OK, "Tạo token thành công", response)
                );
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @CookieValue(name = "refreshToken", required = false) String refreshToken) {

        String newToken = authService.refreshToken(refreshToken);
        String accessCookie = authService.createAccessCookie(newToken);

        AuthResponse response = AuthResponse.builder()
                .accessToken(newToken)
                .authenticated(true)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, accessCookie)
                .body(
                        ApiResponse.success(HttpStatus.OK, "Làm mới token thành công", response)
                );
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout() {
        ResponseCookie deleteAccessCookie = ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(false) // Đổi thành true khi lên Production (HTTPS)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        ResponseCookie deleteRefreshCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false)
                .path("/api/auth/refresh") // Phải khớp path lúc khởi tạo
                .maxAge(0)
                .sameSite("Lax")
                .build();

        return ResponseEntity
                .ok()
                .header(HttpHeaders.SET_COOKIE, deleteAccessCookie.toString())
                .header(HttpHeaders.SET_COOKIE, deleteRefreshCookie.toString())
                .body(ApiResponse.success(HttpStatus.OK, "Đã xóa session", null));
    }
}
