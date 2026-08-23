package com.be.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Builder
public record MajorScoreResponse(
        List<MajorDTO> majorScores,
        String priorityArea,
        String priorityGroup
) {
    @Builder
    @Getter
    public static class MajorDTO {
        String majorCode;
        String majorName;
        String priorityArea;
        String priorityGroup;
        List<MethodScoreDTO> scores;
    }

    @Builder
    @Getter
    public static class MethodScoreDTO {
        String type;
        String combination;
        double rawScore;
        double baseConvertedScore;
        double priorityScore;
        double convertedScore;
    }
}
