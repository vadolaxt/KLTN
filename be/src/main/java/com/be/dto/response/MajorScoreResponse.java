package com.be.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
public record MajorScoreResponse(
        List<MajorDTO> majorScores
) {
    @Builder
    @Getter
    public static class MajorDTO {
        String majorCode;
        String majorName;
        List<MethodScoreDTO> scores;
    }

    @Builder
    @Getter
    public static class MethodScoreDTO {
        String type;
        String combination;
        double rawScore;
        double convertedScore;
    }
}