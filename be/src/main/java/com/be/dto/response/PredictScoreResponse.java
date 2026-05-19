package com.be.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Builder;

@Builder
public record PredictScoreResponse(
        @JsonProperty("result")
        PredictResult result
) {
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PredictResult(
            @JsonProperty("target_year")
            String targetYear,

            @JsonProperty("combination_matched")
            boolean combinationMatched,

            @JsonProperty("predicted_cutoff")
            double predictCutOff,

            @JsonProperty("margin")
            double margin,

            @JsonProperty("admission_probability")
            double admissionProbability
    ) {
    }
}