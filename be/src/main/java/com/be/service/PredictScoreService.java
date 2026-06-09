package com.be.service;

import com.be.dto.request.PredictScoreRequest;
import com.be.dto.response.PredictScoreResponse;
import com.be.entity.AdmissionInfo;
import com.be.entity.Major;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.repository.AdmissionInfoRepository;
import com.be.repository.MajorRepository;
import com.be.supportClass.SubjectScore;
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
import java.util.List;
import java.util.Map;

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

    @Value("${FASTAPI_BASE_URL}")
    String fastapiBaseUrl;

    public PredictScoreResponse predictScore(PredictScoreRequest request) {

        String majorCode = request.majorCode();
        String combination = request.subjectCombination();

        Major major = majorRepository.findByCode(majorCode)
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));

        boolean isValidCombination = major.getCombinations() != null
                && major.getCombinations()
                .stream()
                .anyMatch(c -> c.getCode().equalsIgnoreCase(combination));

        if (!isValidCombination) {
            throw new AppException(ErrorCode.SUBJECT_COMBINATION_NOT_SUPPORTED);
        }

        List<SubjectScore> scores = request.scores();

        if (scores == null || scores.isEmpty()) {
            throw new AppException(ErrorCode.SCORE_LIST_EMPTY);
        }


        double totalScore = scores.stream()
                .mapToDouble(SubjectScore::getScore)
                .sum();

        int targetYear = request.targetYear() > 0 ? request.targetYear() : DEFAULT_TARGET_YEAR;

        Map<String, Object> requestBody = Map.of(
                "major_code", majorCode,
                "student_score", totalScore,
                "subject_combination", combination,
                "target_year", targetYear
        );

        PredictScoreResponse response = callFastApi(requestBody);
        return enrichWithAdmissionHistory(response, major, targetYear);
    }

    private PredictScoreResponse enrichWithAdmissionHistory(PredictScoreResponse response, Major major, int targetYear) {
        PredictScoreResponse.PredictResult result = response.result();
        int previousYear = targetYear - 1;
        int twoYearsAgo = targetYear - 2;

        Double previousYearCutoffScore = findCutoffScore(previousYear, major);
        Double twoYearsAgoCutoffScore = findCutoffScore(twoYearsAgo, major);

        return PredictScoreResponse.builder()
                .result(PredictScoreResponse.PredictResult.builder()
                        .majorCode(result.majorCode())
                        .majorName(result.majorName())
                        .targetYear(result.targetYear())
                        .studentScore(result.studentScore())
                        .subjectCombination(result.subjectCombination())
                        .schoolCode(major.getSchoolCode())
                        .schoolName("Trường Đại học Nông Lâm TP.HCM")
                        .combinationMatched(result.combinationMatched())
                        .predictCutOff(result.predictCutOff())
                        .margin(result.margin())
                        .admissionProbability(result.admissionProbability())
                        .previousYear(previousYear)
                        .previousYearCutoffScore(previousYearCutoffScore)
                        .twoYearsAgo(twoYearsAgo)
                        .twoYearsAgoCutoffScore(twoYearsAgoCutoffScore)
                        .model(result.model())
                        .pipeline(result.pipeline())
                        .build())
                .build();
    }

    private Double findCutoffScore(int year, Major major) {
        return admissionInfoRepository.findByYearAndMajorCode(year, major.getCode())
                .stream()
                .filter(info -> sameText(info.getMajorName(), major.getName()))
                .filter(info -> sameText(info.getProgramType(), major.getProgramType()))
                .findFirst()
                .or(() -> admissionInfoRepository.findByYearAndMajorCode(year, major.getCode()).stream().findFirst())
                .map(AdmissionInfo::getCutoffScore)
                .orElse(null);
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
