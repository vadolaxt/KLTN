package com.be.ultis;

import com.be.entity.Subject;
import com.be.entity.SubjectCombination;
import com.be.entity.SubjectScore;
import com.be.score.AdmissionScorePolicy;
import com.be.score.AdmissionScorePolicy.ScoreBreakdown;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ScoreHelper {
    private final AdmissionScorePolicy admissionScorePolicy;

    public ScoreHelper(AdmissionScorePolicy admissionScorePolicy) {
        this.admissionScorePolicy = admissionScorePolicy;
    }

    public double convertNationalScore(double score) {
        return roundToTwoDecimals(score);
    }

    public double convertSchoolRecordScore(double score) {
        return admissionScorePolicy.convertSchoolRecordToNational(score);
    }

    public double convertNationalToSchoolRecord(double score) {
        return admissionScorePolicy.convertNationalToSchoolRecord(score);
    }

    public double convertNationalToCompetency(double score, String combination) {
        return admissionScorePolicy.convertNationalToCompetency(score, combination);
    }

    public Map<String, Double> convertCompetencyScore(double score) {
        return admissionScorePolicy.convertCompetencyToNational(score);
    }

    public double calculatePriorityScore(double convertedBaseScore, double rawPriorityScore) {
        return admissionScorePolicy.calculateStandardPriority(convertedBaseScore, rawPriorityScore);
    }

    public ScoreBreakdown calculateSchoolRecordAdmissionScore(double score, double priorityLevel) {
        return admissionScorePolicy.calculateSchoolRecordAdmissionScore(score, priorityLevel);
    }

    public double resolvePriorityLevel(String priorityArea, String priorityGroup) {
        return admissionScorePolicy.resolveStandardPriorityLevel(priorityArea, priorityGroup);
    }

    public double resolveCompetencyPriorityLevel(String priorityArea, String priorityGroup) {
        return admissionScorePolicy.resolveCompetencyPriorityLevel(priorityArea, priorityGroup);
    }

    public double calculateCompetencyPriorityScore(double rawCompetencyScore, double priorityLevel) {
        return admissionScorePolicy.calculateCompetencyPriority(rawCompetencyScore, priorityLevel);
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

    public List<String> getMissingSubjectNames(
            SubjectCombination combination,
            Map<String, Double> subjectScoreMap
    ) {
        if (combination == null || combination.getSubjects() == null) {
            return List.of();
        }
        return combination.getSubjects().stream()
                .filter(subject -> subject != null)
                .filter(subject -> subjectScoreMap.getOrDefault(subject.getId(), 0.0) <= 0)
                .map(Subject::getSubjectName)
                .toList();
    }

    public List<String> getMissingCombinedSubjectNames(
            SubjectCombination combination,
            Subject replacementSubject,
            Map<String, Double> schoolRecord,
            Map<String, Double> nationalScoreMap
    ) {
        if (combination == null || combination.getSubjects() == null) {
            return List.of();
        }
        return combination.getSubjects().stream()
                .filter(subject -> subject != null)
                .filter(subject -> {
                    double score = replacementSubject != null && replacementSubject.getId().equals(subject.getId())
                            ? schoolRecord.getOrDefault(subject.getId(), 0.0)
                            : nationalScoreMap.getOrDefault(subject.getId(), 0.0);
                    return score <= 0;
                })
                .map(Subject::getSubjectName)
                .toList();
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
