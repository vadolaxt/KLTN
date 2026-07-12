package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.response.AdminDashboardResponse;
import com.be.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {
    private final AdminDashboardService adminDashboardService;

    @GetMapping
    public ResponseEntity<ApiResponse<AdminDashboardResponse>> dashboard(
            @RequestParam(defaultValue = "NLU") String schoolCode,
            @RequestParam(required = false) Integer year) {
        return ResponseEntity.ok(ApiResponse.success(
                HttpStatus.OK,
                "Admission dashboard loaded",
                adminDashboardService.getDashboard(schoolCode, year)));
    }
}
