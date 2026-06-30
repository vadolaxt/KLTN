package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.response.MajorScoreResponse;
import com.be.dto.response.ViewScoreResponse;
import com.be.service.ScoreService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/score")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ScoreController {
    ScoreService scoreService;

    @GetMapping
    public ResponseEntity<ApiResponse<ViewScoreResponse>> getUserScore(
            @CookieValue(name = "accessToken", required = false) String token
    ) {
        ViewScoreResponse response = scoreService.getUserScore(token);

        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Get user score successfully",
                        response)
        );
    }

    @GetMapping("major")
    public ResponseEntity<ApiResponse<MajorScoreResponse>> getMajorScore(
            @CookieValue(name = "accessToken", required = false) String token
    ) {
        MajorScoreResponse response = scoreService.getMajorScore(token);
        return ResponseEntity.ok(
                ApiResponse.success(
                        HttpStatus.OK,
                        "Get major score successfully",
                        response)
        );
    }
}
