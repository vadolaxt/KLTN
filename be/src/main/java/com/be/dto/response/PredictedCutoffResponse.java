package com.be.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PredictedCutoffResponse(
        @JsonProperty("predictions")
        List<PredictedCutoff> predictions
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PredictedCutoff(
            @JsonProperty("major_code")
            String majorCode,

            @JsonProperty("predicted_cutoff")
            double predictedCutoff
    ) {
    }
}
