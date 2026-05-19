package com.be.service;

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
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PredictScoreService {

    final String targetYear = "2026";

    @Autowired
    MajorRepository majorRepository;

    public PredictScoreResponse predictScore(PredictScoreRequest request) {

        String majorCode = request.majorCode();
        String combination = request.subjectCombination();

        Major major = majorRepository.findByCode(majorCode)
                .orElseThrow(() -> new AppException(ErrorCode.MAJOR_NOT_FOUND));

        // ktra ma to hop co nam trong nganh duoc chon ko
        boolean isValidCombination = major.getCombinations()
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

        // request gui qua AI can duoc tong hop lai tu PredictScoreRequest
//        PredictAIRequest req =
//                major_code="lay o tren",
//                student_score=totalScore,
//                subject_combination="lay o tren",
//                target_year=bien final,

        return null;
    }
}
