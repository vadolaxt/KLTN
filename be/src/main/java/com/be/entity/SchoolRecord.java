package com.be.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import org.springframework.data.annotation.Transient;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SchoolRecord {

    @Builder.Default
    List<SubjectScore> subjectScoreRecords = new ArrayList<>();

    @Transient
    public Map<String, Double> getAvgScore() {
        if (subjectScoreRecords == null || subjectScoreRecords.isEmpty()) {
            return new LinkedHashMap<>();
        }

        return subjectScoreRecords.stream()
                .collect(Collectors.groupingBy(
                        score -> score.getSubject().getId(),
                        LinkedHashMap::new,
                        Collectors.collectingAndThen(
                                Collectors.averagingDouble(SubjectScore::getScore),
                                avg -> Math.round(avg * 100.0) / 100.0 // Làm tròn 2 chữ số thập phân
                        )
                ));
    }

    public static void main(String[] args) {
        Subject subject1 = Subject.builder()
                .id("1")
                .code("MATH")
                .subjectName("Toán")
                .build();
        Subject subject2 = Subject.builder()
                .id("2")
                .code("PHYSIC")
                .subjectName("Vật lý")
                .build();

        SubjectScore s1 = SubjectScore.builder()
                .subject(subject1)
                .score(8)
                .gradeLevel(10)
                .semester(1)
                .build();
        SubjectScore s2 = SubjectScore.builder()
                .subject(subject1)
                .score(9)
                .gradeLevel(10)
                .semester(2)
                .build();
        SubjectScore s3 = SubjectScore.builder()
                .subject(subject2)
                .score(8)
                .gradeLevel(10)
                .semester(1)
                .build();
        SubjectScore s4 = SubjectScore.builder()
                .subject(subject2)
                .score(9)
                .gradeLevel(10)
                .semester(2)
                .build();

        List<SubjectScore> subjectScores = Arrays.asList(s1, s2, s3, s4);

        SchoolRecord schoolRecord = SchoolRecord.builder()
                .subjectScoreRecords(subjectScores)
                .build();

        System.out.println(schoolRecord.getAvgScore());
    }
}