package com.be.dto.response;

import com.be.entity.CompetencyTestResult;
import com.be.entity.NationalExamResult;
import com.be.entity.SchoolRecord;
import lombok.Builder;

@Builder
public record AcademicScoreProfileResponse(
        SchoolRecord schoolRecord,
        NationalExamResult nationalExamResult,
        CompetencyTestResult competencyTestResult
) {
}
