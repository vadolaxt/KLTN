package com.be.service;

import com.be.dto.response.MajorScoreResponse;
import com.be.dto.response.ViewScoreResponse;
import com.be.entity.AcademicScoreProfile;
import com.be.entity.Major;
import com.be.entity.NationalExamResult;
import com.be.entity.Subject;
import com.be.entity.SubjectCombination;
import com.be.repository.AcademicScoreProfileRepository;
import com.be.repository.MajorRepository;
import com.be.repository.SubjectCombinationRepository;
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
    SubjectCombinationRepository subjectCombinationRepository;
    MajorRepository majorRepository;
    ScoreHelper scoreHelper;

    // diem cac to hop pthuc hoc ba
    private List<ViewScoreResponse.CombinationScoreDTO> buildSchoolRecordCombination(
            List<SubjectCombination> combinations,
            Map<String, Double> schoolRecord
    ) {
        return combinations.stream()
                .map(combination -> {
                    double totalScore = 0.0;

                    if (combination.getSubjects() != null) {
                        totalScore = combination.getSubjects().stream()
                                .mapToDouble(subject -> schoolRecord.getOrDefault(subject.getId(), 0.0))
                                .sum();
                    }

                    return ViewScoreResponse.CombinationScoreDTO.builder()
                            .combination(combination.getCode())
                            .subjectList(scoreHelper.getSubjectNames(combination))
                            .score(totalScore)
                            .convertScore(scoreHelper.convertSchoolRecordScore(totalScore))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // diem cac to hop pthuc thpt
    private List<ViewScoreResponse.CombinationScoreDTO> buildNationalCombination(
            List<SubjectCombination> combinations,
            Map<String, Double> nationalScoreMap
    ) {
        return combinations.stream()
                .map(combination -> {
                    double totalScore = 0.0;

                    if (combination.getSubjects() != null) {
                        totalScore = combination.getSubjects().stream()
                                .mapToDouble(subject -> nationalScoreMap.getOrDefault(subject.getId(), 0.0))
                                .sum();
                    }


                    return ViewScoreResponse.CombinationScoreDTO.builder()
                            .combination(combination.getCode())
                            .subjectList(scoreHelper.getSubjectNames(combination))
                            .score(totalScore)
                            .convertScore(scoreHelper.convertNationalScore(totalScore))
                            .build();
                })
                .collect(Collectors.toList());
    }

    // diem cac to hop pthuc ket hop
    private List<ViewScoreResponse.CombineMethodScoreDTO> buildCombineMethodCombination(
            List<SubjectCombination> combinations,
            Map<String, Double> schoolRecord,
            Map<String, Double> nationalScoreMap
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

                    return ViewScoreResponse.CombineMethodScoreDTO.builder()
                            .combination(combination.getCode())
                            .subjectList(scoreHelper.getSubjectNames(combination))
                            .replacedSubject(
                                    replacementSubject == null
                                            ? null
                                            : replacementSubject.getSubjectName()
                            )
                            .score(totalScore)
                            .build();
                })
                .collect(Collectors.toList());
    }

    // diem dgnl
    private ViewScoreResponse.CompetencyScoreDTO buildCompetencyScore(
            AcademicScoreProfile profile
    ) {
        double score = profile.getCompetencyTestResult().getScore();

        return ViewScoreResponse.CompetencyScoreDTO.builder()
                .score((int) score)
                .convertScore(scoreHelper.convertCompetencyScore(score))
                .build();
    }

    public ViewScoreResponse getUserScore(String token) {
        String userId = authService.getUserIdFromToken(token);
        List<SubjectCombination> combinations = subjectCombinationRepository.findAllByOrderByCodeAsc();
        AcademicScoreProfile profile = academicScoreProfileRepository.findByUserId(userId).orElse(null);

        Map<String, Double> schoolRecord = profile.getSchoolRecord().getAvgScore();

        NationalExamResult nationalExamResult = profile.getNationalExamResult();
        Map<String, Double> nationalScoreMap = nationalExamResult.getSubjectScores().stream()
                .filter(subjectScore -> subjectScore.getSubject() != null)
                .collect(Collectors.toMap(
                        subjectScore -> subjectScore.getSubject().getId(),
                        subjectScore -> subjectScore.getScore(),
                        (oldScore, newScore) -> newScore
                ));

        List<ViewScoreResponse.CombinationScoreDTO> schoolRecordCombination =
                buildSchoolRecordCombination(combinations, schoolRecord);

        List<ViewScoreResponse.CombinationScoreDTO> nationalCombination =
                buildNationalCombination(combinations, nationalScoreMap);

        List<ViewScoreResponse.CombineMethodScoreDTO> combineMethodCombination =
                buildCombineMethodCombination(combinations, schoolRecord, nationalScoreMap);

        ViewScoreResponse.CompetencyScoreDTO competencyScore = buildCompetencyScore(profile);

        return ViewScoreResponse.builder()
                .schoolRecordMethodScore(schoolRecordCombination)
                .nationalMethodScore(nationalCombination)
                .competencyMethod(competencyScore)
                .combineMethodScore(combineMethodCombination)
                .build();
    }

//    public MajorScoreResponse getMajorScore(String token) {
//        ViewScoreResponse userScore = getUserScore(token);
//        List<Major> majors = majorRepository.findAllByOrderByDepartmentCodeAsc();
//
//        List<MajorScoreResponse.MajorDTO> majorScores = majors.stream()
//                .filter(Objects::nonNull)
//                .map(major -> {
//                    Set<String> majorCombinationCodes =
//                            major.getCombinations() == null
//                                    ? Set.of()
//                                    : major.getCombinations().stream()
//                                    .filter(Objects::nonNull)
//                                    .map(SubjectCombination::getCode)
//                                    .filter(Objects::nonNull)
//                                    .collect(Collectors.toSet());
//
//                    List<MajorScoreResponse.MethodScoreDTO> scores =
//                            new ArrayList<>();
//
//                    // hoc ba
//                    if (userScore.schoolRecordMethodScore() != null) {
//                        userScore.schoolRecordMethodScore().stream()
//                                .filter(score ->
//                                        score != null
//                                                && majorCombinationCodes.contains(
//                                                score.getCombination()
//                                        )
//                                )
//                                .max(Comparator.comparingDouble(
//                                        ViewScoreResponse.CombinationScoreDTO::getScore
//                                ))
//                                .ifPresent(score -> scores.add(
//                                        MajorScoreResponse.MethodScoreDTO.builder()
//                                                .type("SCHOOL_RECORD")
//                                                .combination(score.getCombination())
//                                                .rawScore(score.getScore())
//                                                .convertedScore(score.getConvertScore())
//                                                .build()
//                                ));
//                    }
//
//                    // thpt
//                    if (userScore.nationalMethodScore() != null) {
//                        userScore.nationalMethodScore().stream()
//                                .filter(score ->
//                                        score != null
//                                                && majorCombinationCodes.contains(
//                                                score.getCombination()
//                                        )
//                                )
//                                .max(Comparator.comparingDouble(
//                                        ViewScoreResponse.CombinationScoreDTO::getScore
//                                ))
//                                .ifPresent(score -> scores.add(
//                                        MajorScoreResponse.MethodScoreDTO.builder()
//                                                .type("NATIONAL")
//                                                .combination(score.getCombination())
//                                                .rawScore(score.getScore())
//                                                .convertedScore(score.getConvertScore())
//                                                .build()
//                                ));
//                    }
//
//                    // ket hop
//                    if (userScore.combineMethodScore() != null) {
//                        userScore.combineMethodScore().stream()
//                                .filter(score ->
//                                        score != null
//                                                && majorCombinationCodes.contains(
//                                                score.getCombination()
//                                        )
//                                )
//                                .max(Comparator.comparingDouble(
//                                        ViewScoreResponse.CombineMethodScoreDTO::getScore
//                                ))
//                                .ifPresent(score -> scores.add(
//                                        MajorScoreResponse.MethodScoreDTO.builder()
//                                                .type("COMBINE")
//                                                .combination(score.getCombination())
//                                                .rawScore(score.getScore())
//                                                .convertedScore(score.getConvertScore())
//                                                .build()
//                                ));
//                    }
//
//                    // dgnl
//                    if (userScore.competencyMethod() != null) {
//                        ViewScoreResponse.CompetencyScoreDTO competency = userScore.competencyMethod();
//                        scores.add(
//                                MajorScoreResponse.MethodScoreDTO.builder()
//                                        .type("COMPETENCY")
//                                        .rawScore(competency.getScore())

    /// ////////////////////////////////
    /// ////////////////////////////////
    /// ////////////////////////////////       .convertedScore(competency.getConvertScore())
    /// ////////////////////////////////
    /// ////////////////////////////////
//                                        .build()
//                        );
//                    }
//
//
//                    return MajorScoreResponse.MajorDTO.builder()
//                            .majorCode(major.getCode())
//                            .majorName(major.getName())
//                            .scores(scores)
//                            .build();
//                })
//                .collect(Collectors.toList());
//
//        return MajorScoreResponse.builder()
//                .majorScores(majorScores)
//                .build();
//    }
    public MajorScoreResponse getMajorScore(String token) {
        String userId = authService.getUserIdFromToken(token);

        AcademicScoreProfile profile = academicScoreProfileRepository
                .findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ điểm của người dùng"));

        Map<String, Double> schoolRecord = profile.getSchoolRecord().getAvgScore();

        NationalExamResult nationalExamResult = profile.getNationalExamResult();
        Map<String, Double> nationalScoreMap = nationalExamResult.getSubjectScores().stream()
                .filter(subjectScore -> subjectScore.getSubject() != null)
                .collect(Collectors.toMap(
                        subjectScore -> subjectScore.getSubject().getId(),
                        subjectScore -> subjectScore.getScore(),
                        (oldScore, newScore) -> newScore
                ));

        ViewScoreResponse.CompetencyScoreDTO competency = buildCompetencyScore(profile);

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
                            .map(combination -> {
                                double rawScore = scoreHelper.calculateTotalScore(
                                        combination,
                                        schoolRecord
                                );

                                double convertedScore = scoreHelper.convertMajorScore(
                                        combination,
                                        major.getCoreSubject(),
                                        schoolRecord
                                );

                                return MajorScoreResponse.MethodScoreDTO.builder()
                                        .type("SCHOOL_RECORD")
                                        .combination(combination.getCode())
                                        .rawScore(rawScore)
                                        .convertedScore(convertedScore)
                                        .build();
                            })
                            .max(Comparator.comparingDouble(
                                    MajorScoreResponse.MethodScoreDTO::getConvertedScore
                            ))
                            .ifPresent(scores::add);

                    // thpt
                    majorCombinations.stream()
                            .map(combination -> {
                                double rawScore = scoreHelper.calculateTotalScore(
                                        combination,
                                        nationalScoreMap
                                );

                                double convertedScore = scoreHelper.convertMajorScore(
                                        combination,
                                        major.getCoreSubject(),
                                        nationalScoreMap
                                );

                                return MajorScoreResponse.MethodScoreDTO.builder()
                                        .type("NATIONAL")
                                        .combination(combination.getCode())
                                        .rawScore(rawScore)
                                        .convertedScore(convertedScore)
                                        .build();
                            })
                            .max(Comparator.comparingDouble(
                                    MajorScoreResponse.MethodScoreDTO::getConvertedScore
                            ))
                            .ifPresent(scores::add);

                    // kết hợp
                    majorCombinations.stream()
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

                                return MajorScoreResponse.MethodScoreDTO.builder()
                                        .type("COMBINE")
                                        .combination(combination.getCode())
                                        .rawScore(rawScore)
                                        .convertedScore(convertedScore)
                                        .build();
                            })
                            .max(Comparator.comparingDouble(
                                    MajorScoreResponse.MethodScoreDTO::getConvertedScore
                            ))
                            .ifPresent(scores::add);

                    // dgnl
                    if (competency != null && competency.getConvertScore() != null) {
                        majorCombinations.stream()
                                .map(SubjectCombination::getCode)
                                .filter(Objects::nonNull)
                                .filter(competency.getConvertScore()::containsKey)
                                .map(combinationCode -> MajorScoreResponse.MethodScoreDTO.builder()
                                        .type("COMPETENCY")
                                        .combination(combinationCode)
                                        .rawScore(competency.getScore())
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
                            .scores(scores)
                            .build();
                })
                .collect(Collectors.toList());

        return MajorScoreResponse.builder()
                .majorScores(majorScores)
                .build();
    }
}
