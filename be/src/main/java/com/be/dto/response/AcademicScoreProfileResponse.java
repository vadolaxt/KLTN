package com.be.dto.response;

import com.be.entity.CompetencyTestResult;
import com.be.entity.NationalExamResult;
import com.be.entity.SchoolRecord;
import com.be.entity.Subject;
import lombok.Builder;

import java.util.Map;

@Builder
public record AcademicScoreProfileResponse(
        SchoolRecord schoolRecord,
        NationalExamResult nationalExamResult,
        CompetencyTestResult competencyTestResult,
        Map<String, Double> schoolRecordAvg
) {
}
