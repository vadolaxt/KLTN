package com.be.sgu.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "sgu_admission_infos")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SguAdmissionInfo {
    @Id
    String id;
    int year;
    String majorCode;
    String majorName;
    int admissionQuota;
    double cutoffScore;
    List<String> combinationCodes;
    String programType;
    String note;
}
