package com.be.controller;

import com.be.dto.ApiResponse;
import com.be.entity.AdmissionInfo;
import com.be.repository.AdmissionInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/admissions")
@RequiredArgsConstructor
public class AdmissionLookupController {
    private final AdmissionInfoRepository admissionInfoRepository;

    @GetMapping
    public ApiResponse<List<AdmissionInfo>> findAll(
            @RequestParam(defaultValue = "2026") int year,
            @RequestParam(defaultValue = "NLU") String schoolCode
    ) {
        List<AdmissionInfo> admissions = admissionInfoRepository.findByYear(year).stream()
                .filter(item -> schoolCode.equalsIgnoreCase(item.getSchoolCode()))
                .sorted(Comparator.comparing(AdmissionInfo::getDepartmentCode)
                        .thenComparing(AdmissionInfo::getMajorCode)
                        .thenComparing(AdmissionInfo::getProgramType))
                .toList();
        return ApiResponse.success(HttpStatus.OK, "Lấy dữ liệu tra cứu tuyển sinh thành công", admissions);
    }

    @GetMapping("/years")
    public ApiResponse<List<Integer>> findYears(
            @RequestParam(defaultValue = "NLU") String schoolCode
    ) {
        List<Integer> years = admissionInfoRepository.findAll().stream()
                .filter(item -> schoolCode.equalsIgnoreCase(item.getSchoolCode()))
                .map(AdmissionInfo::getYear)
                .distinct()
                .sorted(Comparator.reverseOrder())
                .toList();
        return ApiResponse.success(HttpStatus.OK, "Lấy danh sách năm tuyển sinh thành công", years);
    }
}
