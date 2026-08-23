package com.be.service;

import com.be.dto.request.PredictScoreRequest;
import com.be.dto.response.PredictScoreResponse;
import com.be.dto.response.PredictedCutoffResponse;
import com.be.entity.AdmissionInfo;
import com.be.entity.Major;
import com.be.entity.Subject;
import com.be.entity.SubjectCombination;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.repository.AdmissionInfoRepository;
import com.be.repository.MajorRepository;
import com.be.entity.SubjectScore;
import com.be.ultis.ScoreHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PredictScoreService {
    static final int DEFAULT_TARGET_YEAR = 2026;
    static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    @Autowired
    MajorRepository majorRepository;

    @Autowired
    AdmissionInfoRepository admissionInfoRepository;

    @Autowired
    ScoreHelper scoreHelper;

    @Value("${FASTAPI_BASE_URL:http://127.0.0.1:8000}")
    String fastapiBaseUrl;

    public PredictScoreResponse predictScore(PredictScoreRequest request) {

        String schoolCode = normalizeSchoolCode(request.schoolCode());
        String majorCode = request.majorCode();
        String combination = request.subjectCombination();

        Major major = majorRepository.findBySchoolCodeAndCode(schoolCode, majorCode)
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));

        SubjectCombination selectedCombination = major.getCombinations() == null
                ? null
                : major.getCombinations()
                .stream()
                .filter(c -> c.getCode().equalsIgnoreCase(combination))
                .findFirst()
                .orElse(null);

        if (selectedCombination == null) {
            throw new AppException(ErrorCode.SUBJECT_COMBINATION_NOT_SUPPORTED);
        }

        List<SubjectScore> scores = request.scores();

        if (scores == null || scores.isEmpty()) {
            throw new AppException(ErrorCode.SCORE_LIST_EMPTY);
        }

        double totalScore = scores.stream()
                .mapToDouble(SubjectScore::getScore)
                .sum();

        double predictionBaseScore = totalScore;
        double predictionPriorityScore = request.priorityScore() == null ? 0.0 : request.priorityScore();
        double rawPriorityScore = predictionPriorityScore;
        if (isCompetencyMethod(request.admissionMethod())) {
            Double convertedScore = scoreHelper.convertCompetencyScore(totalScore)
                    .get(combination.trim().toUpperCase());
            if (convertedScore == null || convertedScore <= 0) {
                throw new AppException(ErrorCode.SUBJECT_COMBINATION_NOT_SUPPORTED);
            }
            predictionBaseScore = convertedScore;
            double priorityLevel = scoreHelper.resolveCompetencyPriorityLevel(
                    request.priorityArea(), request.priorityGroup());
            rawPriorityScore = scoreHelper.calculateCompetencyPriorityScore(totalScore, priorityLevel);
            Double convertedScoreWithPriority = scoreHelper.convertCompetencyScore(
                    Math.min(totalScore + rawPriorityScore, 1200.0)
            ).get(combination.trim().toUpperCase());
            predictionPriorityScore = convertedScoreWithPriority == null
                    ? 0.0
                    : scoreHelper.roundToTwoDecimals(Math.max(convertedScoreWithPriority - predictionBaseScore, 0.0));
        } else if (isSchoolRecordMethod(request.admissionMethod())) {
            predictionBaseScore = scoreHelper.convertSchoolRecordScore(totalScore);
            predictionPriorityScore = scoreHelper.calculatePriorityScore(
                    predictionBaseScore,
                    predictionPriorityScore
            );
        }

        int targetYear = request.targetYear() > 0 ? request.targetYear() : DEFAULT_TARGET_YEAR;

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("school_code", schoolCode);
        requestBody.put("major_code", majorCode);
        requestBody.put("student_score", predictionBaseScore);
        requestBody.put("subject_combination", combination);
        requestBody.put("target_year", targetYear);
        requestBody.put("top_k", normalizeTopK(request.topK()));
        if (predictionPriorityScore > 0) {
            requestBody.put("priority_score", predictionPriorityScore);
        }
        if (request.admissionMethod() != null && !request.admissionMethod().isBlank()) {
            requestBody.put("admission_method", request.admissionMethod().trim().toLowerCase());
        }

        Map<String, Double> subjectScores = buildSubjectScores(scores, selectedCombination);
        if (!subjectScores.isEmpty()) {
            requestBody.put("subject_scores", subjectScores);
        }

        PredictScoreResponse response = callFastApi(requestBody);
        return enrichWithAdmissionHistory(response, major, targetYear, schoolCode, rawPriorityScore);
    }

    private String normalizeSchoolCode(String schoolCode) {
        if (schoolCode == null || schoolCode.isBlank()) {
            return "NLU";
        }
        return schoolCode.trim().toUpperCase();
    }

    private Map<String, Double> buildSubjectScores(List<SubjectScore> scores, SubjectCombination selectedCombination) {
        List<Subject> combinationSubjects = selectedCombination.getSubjects();
        if (combinationSubjects == null || combinationSubjects.isEmpty() || scores.size() < combinationSubjects.size()) {
            return Map.of();
        }

        Map<String, Double> scoreBySubject = new LinkedHashMap<>();
        for (SubjectScore score : scores) {
            if (score == null || score.getSubject() == null) {
                continue;
            }

            String subjectKey = toPredictSubjectKey(score.getSubject());
            if (subjectKey != null) {
                scoreBySubject.put(subjectKey, score.getScore());
            }
        }

        boolean hasAllCombinationSubjects = combinationSubjects.stream()
                .filter(Objects::nonNull)
                .map(this::toPredictSubjectKey)
                .filter(Objects::nonNull)
                .allMatch(scoreBySubject::containsKey);

        return hasAllCombinationSubjects ? scoreBySubject : Map.of();
    }

    private String toPredictSubjectKey(Subject subject) {
        if (subject == null) {
            return null;
        }

        String code = firstNonBlank(subject.getCode());
        if (code != null) {
            return switch (code.trim().toUpperCase()) {
                case "TOAN" -> "Toan";
                case "VAN" -> "Ngu_van";
                case "VAT_LI" -> "Vat_li";
                case "HOA_HOC" -> "Hoa_hoc";
                case "SINH_HOC" -> "Sinh_hoc";
                case "LICH_SU" -> "Lich_su";
                case "DIA_LI" -> "Dia_li";
                case "NGOAI_NGU" -> "Tieng_Anh";
                case "GDKT_PL" -> "GDKT_PL";
                case "TIN_HOC" -> "TIN_HOC";
                case "CN_CONG_NGHIEP" -> "CN_CONG_NGHIEP";
                case "CN_NONG_NGHIEP" -> "CN_NONG_NGHIEP";
                default -> null;
            };
        }

        String subjectName = firstNonBlank(subject.getSubjectName());
        if (subjectName == null) {
            return null;
        }

        return switch (normalizeVietnameseSubject(subjectName)) {
            case "toan" -> "Toan";
            case "ngu van", "van" -> "Ngu_van";
            case "vat ly", "vat li", "ly" -> "Vat_li";
            case "hoa hoc", "hoa" -> "Hoa_hoc";
            case "sinh hoc", "sinh" -> "Sinh_hoc";
            case "lich su", "su" -> "Lich_su";
            case "dia ly", "dia li", "dia" -> "Dia_li";
            case "tieng anh", "anh" -> "Tieng_Anh";
            case "giao duc kt&pl", "giao duc kinh te va phap luat", "kinh te va phap luat" -> "GDKT_PL";
            case "tin hoc" -> "TIN_HOC";
            case "cong nghe cong nghiep" -> "CN_CONG_NGHIEP";
            case "cong nghe nong nghiep" -> "CN_NONG_NGHIEP";
            default -> null;
        };
    }

    private String normalizeVietnameseSubject(String value) {
        String normalized = java.text.Normalizer.normalize(value, java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase()
                .trim();
        return normalized.replaceAll("\\s+", " ");
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return null;
    }

    private PredictScoreResponse enrichWithAdmissionHistory(PredictScoreResponse response, Major major, int targetYear, String schoolCode, double rawPriorityScore) {
        PredictScoreResponse.PredictResult result = response.result();
        int previousYear = targetYear - 1;
        int twoYearsAgo = targetYear - 2;

        Double previousYearCutoffScore = findCutoffScore(previousYear, major, schoolCode);
        Double twoYearsAgoCutoffScore = findCutoffScore(twoYearsAgo, major, schoolCode);

        return PredictScoreResponse.builder()
                .result(PredictScoreResponse.PredictResult.builder()
                        .majorCode(result.majorCode())
                        .majorName(result.majorName())
                        .targetYear(result.targetYear())
                        .studentScore(result.studentScore())
                        .priorityScore(result.priorityScore())
                        .rawPriorityScore(rawPriorityScore)
                        .subjectCombination(result.subjectCombination())
                        .schoolCode(schoolCode)
                        .schoolName(resolveSchoolName(schoolCode))
                        .combinationMatched(result.combinationMatched())
                        .predictCutOff(result.predictCutOff())
                        .margin(result.margin())
                        .admissionProbability(result.admissionProbability())
                        .previousYear(previousYear)
                        .previousYearCutoffScore(previousYearCutoffScore)
                        .twoYearsAgo(twoYearsAgo)
                        .twoYearsAgoCutoffScore(twoYearsAgoCutoffScore)
                        .topKMajors(result.topKMajors())
                        .model(result.model())
                        .pipeline(result.pipeline())
                        .build())
                .build();
    }

    public PredictedCutoffResponse getPredictedCutoffs(String schoolCode, int targetYear) {
        int normalizedTargetYear = targetYear > 0 ? targetYear : DEFAULT_TARGET_YEAR;
        String url = normalizeFastApiBaseUrl()
                + "/predicted-cutoffs?school_code=" + normalizeSchoolCode(schoolCode)
                + "&target_year=" + normalizedTargetYear;

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .version(HttpClient.Version.HTTP_1_1)
                    .timeout(Duration.ofSeconds(30))
                    .header("Accept", "application/json")
                    .GET()
                    .build();
            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 404) {
                throw new AppException(ErrorCode.FASTAPI_CONNECTION_FAILED);
            }
            if (response.statusCode() >= 400) {
                throw new AppException(ErrorCode.AI_PROCESSING_ERROR);
            }

            return OBJECT_MAPPER.readValue(response.body(), PredictedCutoffResponse.class);
        } catch (JsonProcessingException e) {
            throw new AppException(ErrorCode.AI_PROCESSING_ERROR);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FASTAPI_CONNECTION_FAILED);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AppException(ErrorCode.AI_SERVICE_TIMEOUT);
        }
    }

    private int normalizeTopK(Integer topK) {
        if (topK == null) {
            return 5;
        }
        return Math.max(1, Math.min(topK, 500));
    }

    private boolean isCompetencyMethod(String admissionMethod) {
        return admissionMethod != null && admissionMethod.trim().equalsIgnoreCase("dgnl");
    }

    private boolean isSchoolRecordMethod(String admissionMethod) {
        return admissionMethod != null && admissionMethod.trim().equalsIgnoreCase("hb");
    }

    private Double findCutoffScore(int year, Major major, String schoolCode) {
        return admissionInfoRepository.findByYearAndSchoolCodeAndMajorCode(year, schoolCode, major.getCode())
                .stream()
                .filter(info -> sameText(info.getMajorName(), major.getName()))
                .filter(info -> sameText(info.getProgramType(), major.getProgramType()))
                .findFirst()
                .or(() -> admissionInfoRepository.findByYearAndSchoolCodeAndMajorCode(year, schoolCode, major.getCode()).stream().findFirst())
                .map(AdmissionInfo::getCutoffScore)
                .orElse(null);
    }

    private String resolveSchoolName(String schoolCode) {
        return switch (schoolCode) {
            case "SGU" -> "Trường Đại học Sài Gòn";
            case "NLU" -> "Trường Đại học Nông Lâm TP.HCM";
            default -> schoolCode;
        };
    }

    private boolean sameText(String left, String right) {
        if (left == null || right == null) {
            return left == right;
        }
        return left.trim().equalsIgnoreCase(right.trim());
    }

    private PredictScoreResponse callFastApi(Map<String, Object> requestBody) {
        try {
            String body = OBJECT_MAPPER.writeValueAsString(requestBody);
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(normalizeFastApiBaseUrl() + "/predict-admission"))
                    .version(HttpClient.Version.HTTP_1_1)
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 404) {
                throw new AppException(ErrorCode.FASTAPI_CONNECTION_FAILED);
            }

            if (response.statusCode() >= 400) {
                System.out.printf("--- FastAPI error %d: %s ---%n", response.statusCode(), response.body());
                throw new AppException(ErrorCode.AI_PROCESSING_ERROR);
            }

            return OBJECT_MAPPER.readValue(response.body(), PredictScoreResponse.class);
        } catch (JsonProcessingException e) {
            System.out.printf("--- Cannot parse FastAPI response: %s ---%n", e.getMessage());
            throw new AppException(ErrorCode.AI_PROCESSING_ERROR);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FASTAPI_CONNECTION_FAILED);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new AppException(ErrorCode.AI_SERVICE_TIMEOUT);
        }
    }

    private String normalizeFastApiBaseUrl() {
        return fastapiBaseUrl.endsWith("/")
                ? fastapiBaseUrl.substring(0, fastapiBaseUrl.length() - 1)
                : fastapiBaseUrl;
    }
}
