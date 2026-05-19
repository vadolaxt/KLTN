package com.be.dto.response;

import lombok.Builder;

@Builder
public record PredictScoreResponse(
        String targetYear,
        boolean combinationMatched,
        double predictCutOff,
        double margin,
        double admissionProbability
) {
}
