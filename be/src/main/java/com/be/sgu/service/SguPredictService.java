package com.be.sgu.service;

import com.be.dto.request.PredictScoreRequest;
import com.be.dto.response.PredictScoreResponse;
import com.be.entity.SubjectScore;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.sgu.entity.SguAdmissionInfo;
import com.be.sgu.entity.SguMajor;
import com.be.sgu.entity.SguSubjectCombination;
import com.be.sgu.repository.SguAdmissionInfoRepository;
import com.be.sgu.repository.SguMajorRepository;
import com.be.score.AdmissionScorePolicy.ScoreBreakdown;
import com.be.ultis.ScoreHelper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.text.Normalizer;
import java.time.Duration;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class SguPredictService {
    private static final int DEFAULT_TARGET_YEAR = 2026;
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
            .version(HttpClient.Version.HTTP_1_1)
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    private final SguMajorRepository majorRepository;
    private final SguAdmissionInfoRepository admissionInfoRepository;
    private final ScoreHelper scoreHelper;

    @Value("${FASTAPI_BASE_URL:http://127.0.0.1:8000}")
    String fastapiBaseUrl;

    public SguPredictService(
            SguMajorRepository majorRepository,
            SguAdmissionInfoRepository admissionInfoRepository,
            ScoreHelper scoreHelper
    ) {
        this.majorRepository = majorRepository;
        this.admissionInfoRepository = admissionInfoRepository;
        this.scoreHelper = scoreHelper;
    }

    public PredictScoreResponse predict(PredictScoreRequest request) {
        SguMajor major = majorRepository.findByCode(request.majorCode())
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));

        SguSubjectCombination combinationGroup = major.getCombinations().stream()
                .filter(group -> group.getCode().equalsIgnoreCase(request.subjectCombination()) ||
                        (group.getSubCombinations() != null && group.getSubCombinations().stream()
                                .anyMatch(sub -> sub.getCode().equalsIgnoreCase(request.subjectCombination()))))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.SUBJECT_COMBINATION_NOT_SUPPORTED));

        List<SubjectScore> scores = request.scores();
        if (scores == null || scores.isEmpty()) {
            throw new AppException(ErrorCode.SCORE_LIST_EMPTY);
        }

        int targetYear = request.targetYear() > 0 ? request.targetYear() : DEFAULT_TARGET_YEAR;
        double totalScore = scores.stream().mapToDouble(SubjectScore::getScore).sum();
        double predictionBaseScore = totalScore;
        double requestedPriorityLevel = request.priorityScore() == null ? 0.0 : request.priorityScore();
        double predictionPriorityScore = 0.0;
        double rawPriorityScore = predictionPriorityScore;
        if (isCompetencyMethod(request.admissionMethod())) {
            Double convertedScore = scoreHelper.convertCompetencyScore(totalScore)
                    .get(request.subjectCombination().trim().toUpperCase());
            if (convertedScore == null || convertedScore <= 0) {
                throw new AppException(ErrorCode.SUBJECT_COMBINATION_NOT_SUPPORTED);
            }
            predictionBaseScore = convertedScore;
            double priorityLevel = scoreHelper.resolveCompetencyPriorityLevel(
                    request.priorityArea(), request.priorityGroup());
            rawPriorityScore = scoreHelper.calculateCompetencyPriorityScore(totalScore, priorityLevel);
            Double convertedScoreWithPriority = scoreHelper.convertCompetencyScore(
                    Math.min(totalScore + rawPriorityScore, 1200.0)
            ).get(request.subjectCombination().trim().toUpperCase());
            predictionPriorityScore = convertedScoreWithPriority == null
                    ? 0.0
                    : scoreHelper.roundToTwoDecimals(Math.max(convertedScoreWithPriority - predictionBaseScore, 0.0));
        } else {
            double sourceScore = predictionBaseScore;
            if (isSchoolRecordMethod(request.admissionMethod())) {
                predictionBaseScore = scoreHelper.convertSchoolRecordScore(totalScore);
            }
            double resolvedPriorityLevel = scoreHelper.resolvePriorityLevel(
                    request.priorityArea(), request.priorityGroup());
            if (request.priorityArea() == null && request.priorityGroup() == null) {
                resolvedPriorityLevel = requestedPriorityLevel;
            }
            if (isSchoolRecordMethod(request.admissionMethod())) {
                ScoreBreakdown calculation = scoreHelper.calculateSchoolRecordAdmissionScore(
                        sourceScore, resolvedPriorityLevel);
                rawPriorityScore = calculation.sourcePriority();
                predictionPriorityScore = calculation.convertedPriority();
            } else {
                rawPriorityScore = sourceScore > 0
                        ? scoreHelper.calculatePriorityScore(sourceScore, resolvedPriorityLevel) : 0.0;
                predictionPriorityScore = rawPriorityScore;
            }
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("school_code", "SGU");
        body.put("major_code", major.getCode());
        body.put("student_score", predictionBaseScore);
        body.put("subject_combination", request.subjectCombination());
        body.put("target_year", targetYear);
        body.put("top_k", normalizeTopK(request.topK()));
        if (predictionPriorityScore > 0) {
            body.put("priority_score", predictionPriorityScore);
        }
        if (request.admissionMethod() != null && !request.admissionMethod().isBlank()) {
            body.put("admission_method", request.admissionMethod().trim().toLowerCase());
        }

        Map<String, Double> subjectScores = buildSubjectScores(scores);
        if (!subjectScores.isEmpty()) {
            body.put("subject_scores", subjectScores);
        }

        return enrichHistory(callFastApi(body), major, request.subjectCombination(), targetYear, rawPriorityScore);
    }

    private Map<String, Double> buildSubjectScores(List<SubjectScore> scores) {
        Map<String, Double> result = new LinkedHashMap<>();
        for (SubjectScore score : scores) {
            if (score == null || score.getSubject() == null) {
                continue;
            }
            String key = toSubjectKey(score.getSubject().getSubjectName());
            if (key != null) {
                result.put(key, score.getScore());
            }
        }
        return result;
    }

    private String toSubjectKey(String subjectName) {
        if (subjectName == null || subjectName.isBlank()) {
            return null;
        }
        String normalized = Normalizer.normalize(subjectName, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .replace('đ', 'd')
                .replace('Đ', 'D')
                .toLowerCase()
                .trim();
        return switch (normalized) {
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

    private PredictScoreResponse enrichHistory(
            PredictScoreResponse response,
            SguMajor major,
            String combinationCode,
            int targetYear,
            double rawPriorityScore
    ) {
        PredictScoreResponse.PredictResult result = response.result();
        int previousYear = targetYear - 1;
        int twoYearsAgo = targetYear - 2;
        return PredictScoreResponse.builder()
                .result(PredictScoreResponse.PredictResult.builder()
                        .majorCode(major.getCode())
                        .majorName(major.getName())
                        .targetYear(result.targetYear())
                        .studentScore(result.studentScore())
                        .priorityScore(result.priorityScore())
                        .rawPriorityScore(rawPriorityScore)
                        .subjectCombination(combinationCode)
                        .schoolCode("SGU")
                        .schoolName("Trường Đại học Sài Gòn")
                        .combinationMatched(result.combinationMatched())
                        .predictCutOff(result.predictCutOff())
                        .margin(result.margin())
                        .admissionProbability(result.admissionProbability())
                        .previousYear(previousYear)
                        .previousYearCutoffScore(findCutoff(previousYear, major, combinationCode))
                        .twoYearsAgo(twoYearsAgo)
                        .twoYearsAgoCutoffScore(findCutoff(twoYearsAgo, major, combinationCode))
                        .topKMajors(result.topKMajors())
                        .model(result.model())
                        .pipeline(result.pipeline())
                        .build())
                .build();
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

    private Double findCutoff(int year, SguMajor major, String combinationCode) {
        return admissionInfoRepository.findByYearAndMajorCode(year, major.getCode()).stream()
                .filter(info -> info.getCutoffScore() > 0)
                .filter(info -> sameText(info.getProgramType(), major.getProgramType()))
                .filter(info -> info.getCombinationCodes().stream()
                        .anyMatch(code -> code.equalsIgnoreCase(combinationCode)))
                .sorted((info1, info2) -> {
                    boolean exact1 = info1.getCombinationCodes().size() == 1 &&
                            info1.getCombinationCodes().get(0).equalsIgnoreCase(combinationCode);
                    boolean exact2 = info2.getCombinationCodes().size() == 1 &&
                            info2.getCombinationCodes().get(0).equalsIgnoreCase(combinationCode);
                    if (exact1 && !exact2) return -1;
                    if (!exact1 && exact2) return 1;
                    return Integer.compare(info1.getCombinationCodes().size(), info2.getCombinationCodes().size());
                })
                .map(SguAdmissionInfo::getCutoffScore)
                .findFirst()
                .orElse(null);
    }

    private boolean sameText(String left, String right) {
        if (left == null || right == null) {
            return left == right;
        }
        return left.trim().equalsIgnoreCase(right.trim());
    }

    private PredictScoreResponse callFastApi(Map<String, Object> body) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(normalizeFastApiBaseUrl() + "/predict-admission"))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(OBJECT_MAPPER.writeValueAsString(body)))
                    .build();
            HttpResponse<String> response = HTTP_CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 400) {
                throw new AppException(ErrorCode.AI_PROCESSING_ERROR);
            }
            return OBJECT_MAPPER.readValue(response.body(), PredictScoreResponse.class);
        } catch (JsonProcessingException exception) {
            throw new AppException(ErrorCode.AI_PROCESSING_ERROR);
        } catch (IOException exception) {
            throw new AppException(ErrorCode.FASTAPI_CONNECTION_FAILED);
        } catch (InterruptedException exception) {
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
