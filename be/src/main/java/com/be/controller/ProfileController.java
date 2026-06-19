package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.CertificateResultRequest;
import com.be.dto.request.ProfileRequest;
import com.be.dto.response.ProfileResponse;
import com.be.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProfileResponse>> getUserProfile(
            @CookieValue(name = "accessToken", required = false) String accessToken
    ) {

        ProfileResponse profileResponse = profileService.getUserProfile(accessToken);

        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Get user profile successfully",
                        profileResponse)
        );
    }

    @PostMapping("/edit")
    public ResponseEntity<ApiResponse<Void>> editUserProfile(
            @CookieValue(name = "accessToken", required = false) String accessToken,
            @RequestBody ProfileRequest request
    ) {
        profileService.editUserProfile(accessToken, request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Update user profile successfully",
                        null)
        );
    }
    @PostMapping("/edit-certificate")
    public ResponseEntity<ApiResponse<Void>> editCertificateResult(
            @CookieValue(name = "accessToken", required = false) String accessToken,
            @RequestBody CertificateResultRequest request
    ) {
        profileService.editCertificateResult(accessToken, request);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Update certificate successfully",
                        null)
        );
    }
}
