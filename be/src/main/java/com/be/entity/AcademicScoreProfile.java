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
import java.time.Year;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Builder.Default
    int admissionYear = Year.now().getValue(); // năm xét tuyển

    SchoolRecord schoolRecord; // học bạ
    NationalExamResult nationalExamResult; // điểm thpt
    CompetencyTestResult competencyTestResult; // dgnl

//    @Transient
//    // annotation tạo khi có entity
//    public double totalScore() {
//        return 1.0;
//    }
}
