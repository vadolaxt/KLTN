package com.be.dto.request;

import com.be.entity.SubjectScore;
import jakarta.validation.constraints.NotEmpty;
import lombok.Builder;

import java.util.List;

@Builder
public record PredictScoreRequest(
        String schoolCode,

        String admissionMethod,

        String majorCode,

        @NotEmpty(message = "Danh sách điểm không được để trống")
        List<SubjectScore> scores,

        String subjectCombination,
        int targetYear
) {
}
