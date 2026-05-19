package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.PredictScoreRequest;
import com.be.dto.response.PredictScoreResponse;
import com.be.service.PredictScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/predict")
public class PredictController {

    @Autowired
    PredictScoreService predictScoreService;


    @PostMapping
    public ResponseEntity<ApiResponse<PredictScoreResponse>> sendMessage(
            @RequestBody PredictScoreRequest request
    ) {
        PredictScoreResponse response = predictScoreService.predictScore(request);
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK, "Message sent successfully", response)
        );
    }
}
