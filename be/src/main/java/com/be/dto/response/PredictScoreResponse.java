package com.be.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;

@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public record PredictScoreResponse(
        @JsonProperty("result")
        PredictResult result
) {
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PredictResult(
            @JsonProperty("major_code")
            String majorCode,

            @JsonProperty("major_name")
            String majorName,

            @JsonProperty("target_year")
            int targetYear,

            @JsonProperty("student_score")
            double studentScore,

            @JsonProperty("subject_combination")
            String subjectCombination,

            @JsonProperty("combination_matched")
            boolean combinationMatched,

            @JsonProperty("predicted_cutoff")
            double predictCutOff,

            @JsonProperty("margin")
            double margin,

            @JsonProperty("admission_probability")
            double admissionProbability,

            @JsonProperty("model")
            String model,

            @JsonProperty("pipeline")
            String pipeline
    ) {
    }
}
