package com.be.ultis;

import com.be.entity.Subject;
import com.be.entity.SubjectCombination;
import com.be.entity.SubjectScore;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Comparator;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ScoreHelper {

    private static final String PERCENTILE_FILE = "bach phan vi.csv";
    private static final List<String> COMPETENCY_COMBINATIONS = List.of("A00", "A01", "B00", "C01", "D01");


    public double convertNationalScore(double score) {
        return roundToTwoDecimals(score);
    }

    public double convertSchoolRecordScore(double score) {
        return roundToTwoDecimals(score / 1.125);
    }

    public Map<String, Double> convertCompetencyScore(double score) {
        Map<String, Double> result = new LinkedHashMap<>();

        for (String combination : COMPETENCY_COMBINATIONS) {
            // gia tri abcd trong bach phan vi
            double[] abcd = getPercentileValue(score, combination);

            double a = abcd[0];
            double b = abcd[1];
            double c = abcd[2];
            double d = abcd[3];

            double convertedScore = 0.0;

            if (d != c) {
                convertedScore = a + ((score - c) * (b - a)) / (d - c);
            }

            result.put(combination, roundToTwoDecimals(convertedScore));
        }

        return result;
    }

    public double calculatePriorityScore(double convertedBaseScore, double rawPriorityScore) {
        if (!Double.isFinite(convertedBaseScore) || !Double.isFinite(rawPriorityScore) || rawPriorityScore <= 0) {
            return 0.0;
        }

        double priorityScore = convertedBaseScore >= 22.5
                ? ((30.0 - Math.min(convertedBaseScore, 30.0)) / 7.5) * rawPriorityScore
                : rawPriorityScore;
        return roundToTwoDecimals(Math.max(priorityScore, 0.0));
    }

    public double resolveCompetencyPriorityLevel(String priorityArea, String priorityGroup) {
        double areaScore = switch (priorityArea == null ? "KV3" : priorityArea.trim().toUpperCase()) {
            case "KV1" -> 30.0;
            case "KV2-NT" -> 20.0;
            case "KV2" -> 10.0;
            default -> 0.0;
        };
        double groupScore = switch (priorityGroup == null ? "NONE" : priorityGroup.trim().toUpperCase()) {
            case "UT1" -> 80.0;
            case "UT2" -> 40.0;
            default -> 0.0;
        };
        return areaScore + groupScore;
    }

    public double calculateCompetencyPriorityScore(double rawCompetencyScore, double priorityLevel) {
        if (!Double.isFinite(rawCompetencyScore) || !Double.isFinite(priorityLevel) || priorityLevel <= 0) {
            return 0.0;
        }
        double score = Math.max(0.0, Math.min(rawCompetencyScore, 1200.0));
        double priorityScore = score >= 900.0
                ? ((1200.0 - score) / 300.0) * priorityLevel
                : priorityLevel;
        return roundToTwoDecimals(Math.max(priorityScore, 0.0));
    }


    // doc file csv (bach phan vi) va lay ra cac cận trong file bach phan vi
    private double[] getPercentileValue(double score, String combination) {
        InputStream inputStream = getClass()
                .getClassLoader()
                .getResourceAsStream(PERCENTILE_FILE);

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(inputStream, StandardCharsets.UTF_8)
        )) {
            String line;
            int combinationIndex = COMPETENCY_COMBINATIONS.indexOf(combination);

            while ((line = reader.readLine()) != null) {
                if (line.isBlank()) {
                    continue;
                }

                String[] columns = line.split(",", -1);

                int startColumn = 1 + combinationIndex * 4;

                String dgnlUpper = columns[startColumn];      // can tren dgnl
                String dgnlLower = columns[startColumn + 1];  // can duoi dgnl
                String thptUpper = columns[startColumn + 2];  // can tren thpt
                String thptLower = columns[startColumn + 3];  // can duoi thpt


                double d = Double.parseDouble(dgnlUpper);
                double c = Double.parseDouble(dgnlLower);
                double b = Double.parseDouble(thptUpper);
                double a = Double.parseDouble(thptLower);

                if (score >= c && score <= d) {
                    return new double[]{
                            a,
                            b,
                            c,
                            d
                    };
                }
            }
        } catch (Exception ignored) {
        }

        return new double[]{0, 0, 0, 0};
    }


    // lay ra mon thay the de tinh toan cho pthuc ket hop
    // ko lay 2 mon toan va van
    public Subject getReplacementSubject(
            SubjectCombination combination,
            Map<String, Double> schoolRecord,
            Map<String, Double> nationalScoreMap
    ) {
        if (combination == null || combination.getSubjects() == null) {
            return null;
        }

        return combination.getSubjects().stream()
                .filter(subject -> subject != null)
                .filter(subject -> !"TOAN".equalsIgnoreCase(subject.getCode()) && !"VAN".equalsIgnoreCase(subject.getCode()))
                .filter(subject ->
                        schoolRecord.containsKey(subject.getId())
                                && nationalScoreMap.containsKey(subject.getId())
                )
                // chi xet nhung mon co diem hoc ba > thpt
                .filter(subject ->
                        schoolRecord.get(subject.getId())
                                > nationalScoreMap.get(subject.getId())
                )
                // lay mon co do lech lon nhay
                .max(Comparator.comparingDouble(subject ->
                        schoolRecord.get(subject.getId())
                                - nationalScoreMap.get(subject.getId())
                ))
                .orElse(null);
    }

    // lay ra ds ten cac mon co trong to hop
    public List<String> getSubjectNames(SubjectCombination combination) {
        if (combination.getSubjects() == null) {
            return List.of();
        }

        return combination.getSubjects().stream()
                .filter(subject -> subject != null)
                .map(Subject::getSubjectName)
                .collect(Collectors.toList());
    }

    // lam tron toi 2 chu so thap phan
    public double roundToTwoDecimals(double score) {
        return Math.round(score * 100.0) / 100.0;
    }

    // tinh toan diem cua pthuc ket hop
    public double calculateCombinedScore(
            SubjectCombination combination,
            Subject replacementSubject,
            Map<String, Double> schoolRecord,
            Map<String, Double> nationalScoreMap
    ) {
        if (combination == null || combination.getSubjects() == null) {
            return 0.0;
        }

        double totalScore = combination.getSubjects().stream()
                .mapToDouble(subject -> {
                    if (replacementSubject != null
                            && replacementSubject.getId().equals(subject.getId())) {
                        return schoolRecord.getOrDefault(subject.getId(), 0.0);
                    }

                    return nationalScoreMap.getOrDefault(subject.getId(), 0.0);
                })
                .sum();

        return Math.round(totalScore * 100.0) / 100.0;
    }

    public double calculateTotalScore(
            SubjectCombination combination,
            Map<String, Double> subjectScoreMap
    ) {
        if (combination == null || combination.getSubjects() == null) {
            return 0.0;
        }

        double totalScore = combination.getSubjects().stream()
                .filter(subject -> subject != null)
                .mapToDouble(subject -> subjectScoreMap.getOrDefault(subject.getId(), 0.0))
                .sum();

        return roundToTwoDecimals(totalScore);
    }

    // dùng cho học bạ hoặc THPT
    public double convertMajorScore(
            SubjectCombination combination,
            List<String> coreSubjectCodes,
            Map<String, Double> subjectScoreMap
    ) {
        return convertMajorScoreByResolver(
                combination,
                coreSubjectCodes,
                subject -> subjectScoreMap.getOrDefault(subject.getId(), 0.0)
        );
    }

    // dùng cho phương thức kết hợp
    public double convertMajorCombinedScore(
            SubjectCombination combination,
            List<String> coreSubjectCodes,
            Subject replacementSubject,
            Map<String, Double> schoolRecord,
            Map<String, Double> nationalScoreMap
    ) {
        return convertMajorScoreByResolver(
                combination,
                coreSubjectCodes,
                subject -> {
                    if (replacementSubject != null
                            && replacementSubject.getId().equals(subject.getId())) {
                        return schoolRecord.getOrDefault(subject.getId(), 0.0);
                    }

                    return nationalScoreMap.getOrDefault(subject.getId(), 0.0);
                }
        );
    }

    private double convertMajorScoreByResolver(
            SubjectCombination combination,
            List<String> coreSubjectCodes,
            Function<Subject, Double> scoreResolver
    ) {
        if (combination == null || combination.getSubjects() == null) {
            return 0.0;
        }

        if (coreSubjectCodes == null || coreSubjectCodes.isEmpty()) {
            double totalScore = combination.getSubjects().stream()
                    .filter(subject -> subject != null)
                    .mapToDouble(scoreResolver::apply)
                    .sum();

            return roundToTwoDecimals(totalScore);
        }

        Set<String> coreSubjectCodeSet = new HashSet<>(coreSubjectCodes);

        double weightedTotalScore = 0.0;
        int matchedCoreSubjectCount = 0;

        for (Subject subject : combination.getSubjects()) {
            if (subject == null) {
                continue;
            }

            double subjectScore = scoreResolver.apply(subject);

            boolean isCoreSubject = subject.getCode() != null
                    && coreSubjectCodeSet.contains(subject.getCode());

            if (isCoreSubject) {
                // môn chung nhân hệ số 2
                weightedTotalScore += subjectScore * 2;
//                weightedTotalScore += subjectScore * 1;
                matchedCoreSubjectCount++;
            } else {
                weightedTotalScore += subjectScore;
            }
        }

        if (matchedCoreSubjectCount >= 2) {
            return roundToTwoDecimals(weightedTotalScore * 30 / 50);
//            return roundToTwoDecimals(weightedTotalScore * 30 / 30);
        }

        if (matchedCoreSubjectCount == 1) {
            return roundToTwoDecimals(weightedTotalScore * 30 / 40);
//            return roundToTwoDecimals(weightedTotalScore * 30 / 30);
        }

        return roundToTwoDecimals(weightedTotalScore);
    }
}
