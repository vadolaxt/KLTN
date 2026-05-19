package com.be.service;

import com.be.dto.request.PredictModelRequest;
import com.be.dto.request.PredictScoreRequest;
import com.be.dto.response.PredictScoreResponse;
import com.be.entity.Major;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.repository.MajorRepository;
import com.be.supportClass.SubjectScore;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PredictScoreService {
    String targetYear = "2026";

    @Autowired
    MajorRepository majorRepository;

    @Autowired
    RestClient fastapiClient;

    public PredictScoreResponse predictScore(PredictScoreRequest request) {

        String majorCode = request.majorCode();
        String combination = request.subjectCombination();

        Major major = majorRepository.findByCode(majorCode)
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));

        // ktra ma to hop co nam trong nganh duoc chon ko
//        boolean isValidCombination = major.getCombinations()
//                .stream()
//                .anyMatch(c -> c.getCode().equalsIgnoreCase(combination));
        boolean isValidCombination = true;

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

        PredictModelRequest predictRequest = PredictModelRequest.builder()
                .majorCode(majorCode)
                .studentScore(totalScore)
                .subjectCombination(combination)
                .target_year(targetYear)
                .build();

        PredictScoreResponse response = fastapiClient.post()
                .uri("/predict-admission")
                .body(predictRequest)
                .retrieve()
                .onStatus(HttpStatusCode::is5xxServerError, (req, res) -> {
                    throw new AppException(ErrorCode.AI_PROCESSING_ERROR);
                })
                .onStatus(status -> status.value() == 404, (req, res) -> {
                    throw new AppException(ErrorCode.FASTAPI_CONNECTION_FAILED);
                })
                .body(PredictScoreResponse.class);

        return response;
    }
}
