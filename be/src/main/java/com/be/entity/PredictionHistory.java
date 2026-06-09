package com.be.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "prediction_histories")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PredictionHistory {
    @Id
    String id;

    String userId;
    String majorCode;
    String combinationCode;
    String admissionMethod;
    int targetYear;
    double inputScore;
    double predictedCutoff;
    double margin;
    double admissionProbability;
    String model;
    Instant createdAt;
}
