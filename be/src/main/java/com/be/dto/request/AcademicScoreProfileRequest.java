package com.be.dto.request;

import com.be.entity.CompetencyTestResult;
import com.be.entity.NationalExamResult;
import com.be.entity.SchoolRecord;
import com.be.entity.SubjectScoreRecord;
import lombok.Builder;

import java.util.List;

@Builder
public record AcademicScoreProfileRequest(
        SchoolRecord schoolRecord,
        NationalExamResult nationalExamResult,
        CompetencyTestResult competencyTestResult
) {
}