package com.be.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.experimental.FieldDefaults;

@Builder
public record PredictModelRequest(
        @JsonProperty("major_code")
        String majorCode,

        @JsonProperty("student_score")
        double studentScore,

        @JsonProperty("subject_combination")
        String subjectCombination,

        @JsonProperty("target_year")
        String target_year
) {
}
