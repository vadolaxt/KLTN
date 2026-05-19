package com.be.dto.request;

import com.be.supportClass.SubjectScore;
import jakarta.validation.constraints.NotEmpty;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public record PredictScoreRequest(
        String majorCode,
        @NotEmpty(message = "Danh sách điểm không được để trống")
        List<SubjectScore> scores,
        String subjectCombination,
        int targetYear
) {
}
