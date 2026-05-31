package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.PredictScoreRequest;
import com.be.dto.response.PredictScoreResponse;
import com.be.entity.Major;
import com.be.repository.MajorRepository;
import com.be.service.PredictScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/predict")
public class PredictController {

    @Autowired
    PredictScoreService predictScoreService;

    @Autowired
    MajorRepository majorRepository;

    @GetMapping("/majors")
    public ResponseEntity<ApiResponse<List<Major>>> getMajors() {
        List<Major> majors = majorRepository.findAll(Sort.by(Sort.Direction.ASC, "code"));
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK, "Majors loaded successfully", majors)
        );
    }

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
