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
                .filter(score -> score != null && score.getSubject() != null && score.getScore() > 0)
                .collect(Collectors.groupingBy(
                        score -> score.getSubject().getId(),
                        LinkedHashMap::new,
                        Collectors.collectingAndThen(
                                Collectors.averagingDouble(SubjectScore::getScore),
                                avg -> Math.round(avg * 100.0) / 100.0 // Làm tròn 2 chữ số thập phân
                        )
                ));
    }
}