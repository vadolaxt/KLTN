package com.be.sgu.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.PredictScoreRequest;
import com.be.dto.response.PredictScoreResponse;
import com.be.sgu.entity.SguMajor;
import com.be.sgu.repository.SguMajorRepository;
import com.be.sgu.service.SguPredictService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/predict/sgu")
public class SguPredictController {
    private final SguPredictService predictService;
    private final SguMajorRepository majorRepository;

    public SguPredictController(SguPredictService predictService, SguMajorRepository majorRepository) {
        this.predictService = predictService;
        this.majorRepository = majorRepository;
    }

    @GetMapping("/majors")
    public ResponseEntity<ApiResponse<List<SguMajor>>> getMajors() {
        List<SguMajor> majors = majorRepository.findAll().stream()
                .sorted(Comparator.comparing(SguMajor::getCode))
                .toList();
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK, "SGU majors loaded successfully", majors)
        );
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PredictScoreResponse>> predict(@RequestBody PredictScoreRequest request) {
        return ResponseEntity.ok(
                ApiResponse.success(HttpStatus.OK, "SGU prediction completed", predictService.predict(request))
        );
    }
}
