package com.be.dto.response;

import lombok.Builder;
import lombok.Getter;

import java.util.List;
import java.util.Map;

@Builder
public record ViewScoreResponse(
        List<CombinationScoreDTO> schoolRecordMethodScore,
        List<CombinationScoreDTO> nationalMethodScore,
        CompetencyScoreDTO competencyMethod,
        List<CombineMethodScoreDTO> combineMethodScore
) {
    @Builder
    @Getter
    public static class CombinationScoreDTO {
        private String combination;
        private List<String> subjectList;
        private boolean complete;
        private List<String> missingSubjects;
        private double score;
        private double priorityScore;
        private double totalScore;
        private double convertScore;
    }

    @Builder
    @Getter
    public static class CompetencyScoreDTO {
        private double score;
        private double priorityScore;
        private double totalScore;
        private Map<String, Double> convertScore;
    }

    @Builder
    @Getter
    public static class CombineMethodScoreDTO {
        private String combination;
        private List<String> subjectList;
        private String replacedSubject;
        private boolean complete;
        private List<String> missingSubjects;
        private double score;
        private double priorityScore;
        private double totalScore;
        private double convertScore;
    }

}
