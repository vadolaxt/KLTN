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

    @Value("${FASTAPI_BASE_URL:http://127.0.0.1:8000}")
    String fastapiBaseUrl;

    public SguPredictService(
            SguMajorRepository majorRepository,
            SguAdmissionInfoRepository admissionInfoRepository
    ) {
        this.majorRepository = majorRepository;
        this.admissionInfoRepository = admissionInfoRepository;
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

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("school_code", "SGU");
        body.put("major_code", major.getCode());
        body.put("student_score", totalScore);
        body.put("subject_combination", request.subjectCombination());
        body.put("target_year", targetYear);
        if (request.priorityScore() != null && request.priorityScore() > 0) {
            body.put("priority_score", request.priorityScore());
        }
        if (request.admissionMethod() != null && !request.admissionMethod().isBlank()) {
            body.put("admission_method", request.admissionMethod().trim().toLowerCase());
        }

        Map<String, Double> subjectScores = buildSubjectScores(scores);
        if (!subjectScores.isEmpty()) {
            body.put("subject_scores", subjectScores);
        }

        return enrichHistory(callFastApi(body), major, request.subjectCombination(), targetYear);
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
            int targetYear
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
                        .model(result.model())
                        .pipeline(result.pipeline())
                        .build())
                .build();
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
                    .uri(URI.create(normalizeFastApiBaseUrl() + "/api/predict-admission"))
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
