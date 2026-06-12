package com.be.mapper;

import com.be.dto.response.AcademicScoreProfileResponse;
import com.be.entity.AcademicScoreProfile;
import org.springframework.stereotype.Component;

@Component
public class AcademicScoreProfileMapper {
    public AcademicScoreProfileResponse toAcademicScoreProfileResponse(AcademicScoreProfile profile) {
        if (profile == null) {
            return null;
        }
        return AcademicScoreProfileResponse.builder()
                .schoolRecord(profile.getSchoolRecord())
                .nationalExamResult(profile.getNationalExamResult())
                .competencyTestResult(profile.getCompetencyTestResult())
                .build();
    }
}
