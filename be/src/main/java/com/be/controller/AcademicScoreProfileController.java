package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.AcademicScoreProfileRequest;
import com.be.dto.response.AcademicScoreProfileResponse;
import com.be.service.AcademicScoreProfileService;
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

import java.util.List;


@RestController
@RequestMapping("/api/academic-profile")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AcademicScoreProfileController {
    AcademicScoreProfileService academicProfileService;

    @GetMapping
    public ResponseEntity<ApiResponse<AcademicScoreProfileResponse>> getAcademicScoreProfile(
            @CookieValue(name = "accessToken", required = false) String accessToken
    ){
        AcademicScoreProfileResponse response = academicProfileService.getAcademicScoreProfile(accessToken);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Get academic score profile successfully",
                        response)
        );
    }

    @PostMapping("/edit")
    public ResponseEntity<ApiResponse<Void>> editUserProfile(
            @CookieValue(name = "accessToken", required = false) String accessToken,
            @RequestBody AcademicScoreProfileRequest request
    ) {
        academicProfileService.editAcademicScoreProfile(accessToken, request);

        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Cập nhật hồ sơ bảng điểm thành công!",
                        null)
        );
    }
}
