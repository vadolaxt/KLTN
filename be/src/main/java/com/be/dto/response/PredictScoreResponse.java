package com.be.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;

import java.util.List;

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

            @JsonProperty("priority_score")
            double priorityScore,

            @JsonProperty("raw_priority_score")
            double rawPriorityScore,

            @JsonProperty("subject_combination")
            String subjectCombination,

            @JsonProperty("school_code")
            String schoolCode,

            @JsonProperty("school_name")
            String schoolName,

            @JsonProperty("combination_matched")
            boolean combinationMatched,

            @JsonProperty("predicted_cutoff")
            double predictCutOff,

            @JsonProperty("margin")
            double margin,

            @JsonProperty("admission_probability")
            double admissionProbability,

            @JsonProperty("previous_year")
            Integer previousYear,

            @JsonProperty("previous_year_cutoff_score")
            Double previousYearCutoffScore,

            @JsonProperty("two_years_ago")
            Integer twoYearsAgo,

            @JsonProperty("two_years_ago_cutoff_score")
            Double twoYearsAgoCutoffScore,

            @JsonProperty("top_k_majors")
            List<TopMajor> topKMajors,

            @JsonProperty("model")
            String model,

            @JsonProperty("pipeline")
            String pipeline
    ) {
    }

    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record TopMajor(
            @JsonProperty("major_code")
            String majorCode,

            @JsonProperty("major_name")
            String majorName,

            @JsonProperty("admission_probability")
            double admissionProbability
    ) {
    }
}
