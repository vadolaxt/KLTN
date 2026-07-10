package com.be.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.util.List;

public record AdmissionInfoRequest(
        String schoolCode,
        @Min(2000) @Max(2100) Integer year,
        String departmentCode,
        String majorName,
        String majorCode,
        @Min(1) Integer admissionQuota,
        @Min(0) @Max(30) Double cutoffScore,
        @Size(min = 1) List<String> combinationCodes,
        String programType,
        String note
) {
}
