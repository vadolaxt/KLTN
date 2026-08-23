package com.be.service;

import com.be.dto.response.MajorScoreResponse;
import com.be.dto.response.ViewScoreResponse;
import com.be.entity.AcademicScoreProfile;
import com.be.entity.CandidateProfile;
import com.be.entity.Major;
import com.be.entity.NationalExamResult;
import com.be.entity.Subject;
import com.be.entity.SubjectCombination;
import com.be.repository.AcademicScoreProfileRepository;
import com.be.repository.CandidateProfileRepository;
import com.be.repository.MajorRepository;
import com.be.repository.SubjectCombinationRepository;
import com.be.score.AdmissionScorePolicy.ScoreBreakdown;
import com.be.ultis.ScoreHelper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ScoreService {
    AuthService authService;
    AcademicScoreProfileRepository academicScoreProfileRepository;
    CandidateProfileRepository candidateProfileRepository;
    SubjectCombinationRepository subjectCombinationRepository;
    MajorRepository majorRepository;
    ScoreHelper scoreHelper;

    // diem cac to hop pthuc hoc ba
    private List<ViewScoreResponse.CombinationScoreDTO> buildSchoolRecordCombination(
            List<SubjectCombination> combinations,
            Map<String, Double> schoolRecord,
            double priorityLevel
    ) {
        return combinations.stream()
                .map(combination -> {
                    List<String> missingSubjects = scoreHelper.getMissingSubjectNames(combination, schoolRecord);
                    boolean complete = missingSubjects.isEmpty();
                    double totalScore = 0.0;

                    if (combination.getSubjects() != null) {
                        totalScore = combination.getSubjects().stream()
                                .mapToDouble(subject -> schoolRecord.getOrDefault(subject.getId(), 0.0))
                                .sum();
                    }

                    ScoreBreakdown calculation = scoreHelper.calculateSchoolRecordAdmissionScore(
                            complete ? totalScore : 0.0, priorityLevel);

                    return ViewScoreResponse.CombinationScoreDTO.builder()
                            .combination(combination.getCode())
                            .subjectList(scoreHelper.getSubjectNames(combination))
                            .complete(complete)
                            .missingSubjects(missingSubjects)
                            .score(totalScore)
                            .priorityScore(calculation.sourcePriority())
                            .totalScore(calculation.sourceTotal())
                            .convertScore(calculation.convertedTotal())
                            .build();
                })
                .collect(Collectors.toList());
    }

    // diem cac to hop pthuc thpt
    private List<ViewScoreResponse.CombinationScoreDTO> buildNationalCombination(
            List<SubjectCombination> combinations,
            Map<String, Double> nationalScoreMap,
            double priorityLevel
    ) {
        return combinations.stream()
                .map(combination -> {
                    List<String> missingSubjects = scoreHelper.getMissingSubjectNames(combination, nationalScoreMap);
                    boolean complete = missingSubjects.isEmpty();
                    double totalScore = 0.0;

                    if (combination.getSubjects() != null) {
                        totalScore = combination.getSubjects().stream()
                                .mapToDouble(subject -> nationalScoreMap.getOrDefault(subject.getId(), 0.0))
                                .sum();
                    }
                    double priorityScore = complete && totalScore > 0
                            ? scoreHelper.calculatePriorityScore(totalScore, priorityLevel) : 0.0;
                    double finalScore = complete ? Math.min(totalScore + priorityScore, 30.0) : 0.0;
                    return ViewScoreResponse.CombinationScoreDTO.builder()
                            .combination(combination.getCode())
                            .subjectList(scoreHelper.getSubjectNames(combination))
                            .complete(complete)
                            .missingSubjects(missingSubjects)
                            .score(totalScore)
                            .priorityScore(priorityScore)
                            .totalScore(finalScore)
                            .convertScore(finalScore)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // diem cac to hop pthuc ket hop
    private List<ViewScoreResponse.CombineMethodScoreDTO> buildCombineMethodCombination(
            List<SubjectCombination> combinations,
            Map<String, Double> schoolRecord,
            Map<String, Double> nationalScoreMap,
            double priorityLevel
    ) {
        return combinations.stream()
                .map(combination -> {
                    Subject replacementSubject = scoreHelper.getReplacementSubject(
                            combination,
                            schoolRecord,
                            nationalScoreMap
                    );

                    double totalScore = scoreHelper.calculateCombinedScore(
                            combination,
                            replacementSubject,
                            schoolRecord,
                            nationalScoreMap
                    );
                    List<String> missingSubjects = scoreHelper.getMissingCombinedSubjectNames(
                            combination, replacementSubject, schoolRecord, nationalScoreMap);
                    boolean complete = missingSubjects.isEmpty();
                    double priorityScore = complete && totalScore > 0
                            ? scoreHelper.calculatePriorityScore(totalScore, priorityLevel) : 0.0;
                    double finalScore = complete ? Math.min(totalScore + priorityScore, 30.0) : 0.0;

                    return ViewScoreResponse.CombineMethodScoreDTO.builder()
                            .combination(combination.getCode())
                            .subjectList(scoreHelper.getSubjectNames(combination))
                            .complete(complete)
                            .missingSubjects(missingSubjects)
                            .replacedSubject(
                                    replacementSubject == null
                                            ? null
                                            : replacementSubject.getSubjectName()
                            )
                            .score(totalScore)
                            .priorityScore(priorityScore)
                            .totalScore(finalScore)
                            .convertScore(finalScore)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // diem dgnl
    private ViewScoreResponse.CompetencyScoreDTO buildCompetencyScore(
            AcademicScoreProfile profile,
            CandidateProfile candidateProfile
    ) {
        double score = profile.getCompetencyTestResult().getScore();
        double priorityLevel = scoreHelper.resolveCompetencyPriorityLevel(
                candidateProfile.getPriorityArea(), candidateProfile.getPriorityGroup());
        double priorityScore = scoreHelper.calculateCompetencyPriorityScore(score, priorityLevel);
        double totalScore = Math.min(score + priorityScore, 1200.0);

        return ViewScoreResponse.CompetencyScoreDTO.builder()
                .score((int) score)
                .priorityScore(priorityScore)
                .totalScore(totalScore)
                .convertScore(scoreHelper.convertCompetencyScore(totalScore))
                .build();
    }

    public ViewScoreResponse getUserScore(String token) {
        String userId = authService.getUserIdFromToken(token);
        List<SubjectCombination> combinations = subjectCombinationRepository.findAllByOrderByCodeAsc();
        AcademicScoreProfile profile = academicScoreProfileRepository.findByUserId(userId).orElse(null);
        CandidateProfile candidateProfile = candidateProfileRepository.findByUserId(userId)
                .orElseGet(() -> CandidateProfile.builder().userId(userId).build());

        Map<String, Double> schoolRecord = profile.getSchoolRecord().getAvgScore();
        double priorityLevel = scoreHelper.resolvePriorityLevel(
                candidateProfile.getPriorityArea(), candidateProfile.getPriorityGroup());

        NationalExamResult nationalExamResult = profile.getNationalExamResult();
        Map<String, Double> nationalScoreMap = nationalExamResult.getSubjectScores().stream()
                .filter(subjectScore -> subjectScore.getSubject() != null)
                .collect(Collectors.toMap(
                        subjectScore -> subjectScore.getSubject().getId(),
                        subjectScore -> subjectScore.getScore(),
                        (oldScore, newScore) -> newScore
                ));

        List<ViewScoreResponse.CombinationScoreDTO> schoolRecordCombination =
                buildSchoolRecordCombination(combinations, schoolRecord, priorityLevel);

        List<ViewScoreResponse.CombinationScoreDTO> nationalCombination =
                buildNationalCombination(combinations, nationalScoreMap, priorityLevel);

        List<ViewScoreResponse.CombineMethodScoreDTO> combineMethodCombination =
                buildCombineMethodCombination(combinations, schoolRecord, nationalScoreMap, priorityLevel);

        ViewScoreResponse.CompetencyScoreDTO competencyScore = buildCompetencyScore(profile, candidateProfile);

        return ViewScoreResponse.builder()
                .schoolRecordMethodScore(schoolRecordCombination)
                .nationalMethodScore(nationalCombination)
                .competencyMethod(competencyScore)
                .combineMethodScore(combineMethodCombination)
                .build();
    }

    public MajorScoreResponse getMajorScore(String token) {
        String userId = authService.getUserIdFromToken(token);

        AcademicScoreProfile profile = academicScoreProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ điểm của người dùng"));
        CandidateProfile candidateProfile = candidateProfileRepository.findByUserId(userId)
                .orElseGet(() -> CandidateProfile.builder().userId(userId).build());

        Map<String, Double> schoolRecord = profile.getSchoolRecord().getAvgScore();
        double priorityLevel = scoreHelper.resolvePriorityLevel(
                candidateProfile.getPriorityArea(), candidateProfile.getPriorityGroup());

        NationalExamResult nationalExamResult = profile.getNationalExamResult();
        Map<String, Double> nationalScoreMap = nationalExamResult.getSubjectScores().stream()
                .filter(subjectScore -> subjectScore.getSubject() != null)
                .collect(Collectors.toMap(
                        subjectScore -> subjectScore.getSubject().getId(),
                        subjectScore -> subjectScore.getScore(),
                        (oldScore, newScore) -> newScore
                ));

        ViewScoreResponse.CompetencyScoreDTO competency = buildCompetencyScore(profile, candidateProfile);

        List<Major> majors = majorRepository.findAllByOrderByDepartmentCodeAsc();

        List<MajorScoreResponse.MajorDTO> majorScores = majors.stream()
                .filter(Objects::nonNull)
                .map(major -> {
                    List<SubjectCombination> majorCombinations =
                            major.getCombinations() == null
                                    ? List.of()
                                    : major.getCombinations().stream()
                                    .filter(Objects::nonNull)
                                    .toList();

                    List<MajorScoreResponse.MethodScoreDTO> scores = new ArrayList<>();

                    // học bạ
                    majorCombinations.stream()
                            .filter(combination -> scoreHelper.getMissingSubjectNames(
                                    combination, schoolRecord).isEmpty())
                            .map(combination -> {
                                double rawScore = scoreHelper.calculateTotalScore(
                                        combination,
                                        schoolRecord
                                );

                                ScoreBreakdown calculation = scoreHelper.calculateSchoolRecordAdmissionScore(
                                        rawScore, priorityLevel);

                                return MajorScoreResponse.MethodScoreDTO.builder()
                                        .type("SCHOOL_RECORD")
                                        .combination(combination.getCode())
                                        .rawScore(rawScore)
                                        .baseConvertedScore(calculation.convertedBase())
                                        .priorityScore(calculation.sourcePriority())
                                        .convertedScore(calculation.convertedTotal())
                                        .build();
                            })
                            .max(Comparator.comparingDouble(
                                    MajorScoreResponse.MethodScoreDTO::getConvertedScore
                            ))
                            .ifPresent(scores::add);

                    // thpt
                    majorCombinations.stream()
                            .filter(combination -> scoreHelper.getMissingSubjectNames(
                                    combination, nationalScoreMap).isEmpty())
                            .map(combination -> {
                                double rawScore = scoreHelper.calculateTotalScore(
                                        combination,
                                        nationalScoreMap
                                );
                                double priorityScore = rawScore > 0
                                        ? scoreHelper.calculatePriorityScore(rawScore, priorityLevel) : 0.0;

                                return MajorScoreResponse.MethodScoreDTO.builder()
                                        .type("NATIONAL")
                                        .combination(combination.getCode())
                                        .rawScore(rawScore)
                                        .baseConvertedScore(rawScore)
                                        .priorityScore(priorityScore)
                                        .convertedScore(Math.min(rawScore + priorityScore, 30.0))
                                        .build();
                            })
                            .max(Comparator.comparingDouble(
                                    MajorScoreResponse.MethodScoreDTO::getConvertedScore
                            ))
                            .ifPresent(scores::add);

                    // kết hợp
                    majorCombinations.stream()
                            .filter(combination -> {
                                Subject replacementSubject = scoreHelper.getReplacementSubject(
                                        combination, schoolRecord, nationalScoreMap);
                                return scoreHelper.getMissingCombinedSubjectNames(
                                        combination, replacementSubject, schoolRecord, nationalScoreMap).isEmpty();
                            })
                            .map(combination -> {
                                Subject replacementSubject = scoreHelper.getReplacementSubject(
                                        combination,
                                        schoolRecord,
                                        nationalScoreMap
                                );

                                double rawScore = scoreHelper.calculateCombinedScore(
                                        combination,
                                        replacementSubject,
                                        schoolRecord,
                                        nationalScoreMap
                                );

                                double convertedScore = scoreHelper.convertMajorCombinedScore(
                                        combination,
                                        major.getCoreSubject(),
                                        replacementSubject,
                                        schoolRecord,
                                        nationalScoreMap
                                );
                                double priorityScore = convertedScore > 0
                                        ? scoreHelper.calculatePriorityScore(convertedScore, priorityLevel) : 0.0;

                                return MajorScoreResponse.MethodScoreDTO.builder()
                                        .type("COMBINE")
                                        .combination(combination.getCode())
                                        .rawScore(rawScore)
                                        .baseConvertedScore(convertedScore)
                                        .priorityScore(priorityScore)
                                        .convertedScore(Math.min(convertedScore + priorityScore, 30.0))
                                        .build();
                            })
                            .max(Comparator.comparingDouble(
                                    MajorScoreResponse.MethodScoreDTO::getConvertedScore
                            ))
                            .ifPresent(scores::add);

                    // dgnl
                    if (competency != null && competency.getConvertScore() != null) {
                        double rawCompetencyScore = profile.getCompetencyTestResult().getScore();
                        Map<String, Double> baseCompetencyScores = scoreHelper.convertCompetencyScore(rawCompetencyScore);
                        majorCombinations.stream()
                                .map(SubjectCombination::getCode)
                                .filter(Objects::nonNull)
                                .filter(competency.getConvertScore()::containsKey)
                                .map(combinationCode -> MajorScoreResponse.MethodScoreDTO.builder()
                                        .type("COMPETENCY")
                                        .combination(combinationCode)
                                        .rawScore(rawCompetencyScore)
                                        .baseConvertedScore(baseCompetencyScores.getOrDefault(combinationCode, 0.0))
                                        .priorityScore(scoreHelper.roundToTwoDecimals(Math.max(
                                                competency.getConvertScore().get(combinationCode)
                                                        - baseCompetencyScores.getOrDefault(combinationCode, 0.0), 0.0)))
                                        .convertedScore(competency.getConvertScore().get(combinationCode))
                                        .build()
                                )
                                .max(Comparator.comparingDouble(
                                        MajorScoreResponse.MethodScoreDTO::getConvertedScore
                                ))
                                .ifPresent(scores::add);
                    }

                    return MajorScoreResponse.MajorDTO.builder()
                            .majorCode(major.getCode())
                            .majorName(major.getName())
                            .priorityArea(candidateProfile.getPriorityArea())
                            .priorityGroup(candidateProfile.getPriorityGroup())
                            .scores(scores)
                            .build();
                })
                .collect(Collectors.toList());

        return MajorScoreResponse.builder()
                .majorScores(majorScores)
                .priorityArea(candidateProfile.getPriorityArea())
                .priorityGroup(candidateProfile.getPriorityGroup())
                .build();
    }
}
