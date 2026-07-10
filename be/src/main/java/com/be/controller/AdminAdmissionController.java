package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.dto.request.AdmissionInfoRequest;
import com.be.entity.AdmissionInfo;
import com.be.service.AdminAdmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/admissions")
@RequiredArgsConstructor
public class AdminAdmissionController {
    private final AdminAdmissionService adminAdmissionService;

    @GetMapping
    public ApiResponse<List<AdmissionInfo>> findAll(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String departmentCode,
            @RequestParam(required = false) String majorCode,
            @RequestParam(required = false) String programType,
            @RequestParam(required = false) String keyword
    ) {
        return ApiResponse.success(HttpStatus.OK, "Lấy thông tin tuyển sinh thành công",
                adminAdmissionService.findAll(year, departmentCode, majorCode, programType, keyword));
    }

    @GetMapping("/years")
    public ApiResponse<List<Integer>> findYears() {
        return ApiResponse.success(HttpStatus.OK, "Lấy danh sách năm tuyển sinh thành công",
                adminAdmissionService.findYears());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AdmissionInfo>> create(@Valid @RequestBody AdmissionInfoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                HttpStatus.CREATED, "Thêm thông tin tuyển sinh thành công", adminAdmissionService.create(request)));
    }

    @PatchMapping("/{id}")
    public ApiResponse<AdmissionInfo> update(
            @PathVariable String id,
            @Valid @RequestBody AdmissionInfoRequest request
    ) {
        return ApiResponse.success(HttpStatus.OK, "Cập nhật thông tin tuyển sinh thành công",
                adminAdmissionService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        adminAdmissionService.delete(id);
        return ApiResponse.success(HttpStatus.OK, "Xóa thông tin tuyển sinh thành công", null);
    }
}
