package com.be.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "academic_score_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AcademicScoreProfile {
    @Id
    String id;

    String userId;
    String admissionMethod;
    int year;
    String source;
    List<SubjectScoreRecord> subjectScores;
    CompetencyTestResult competencyTestResult;
    double totalScore;
    Instant updatedAt;
}
