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

import java.util.List;

@Document(collection = "admission_infos")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdmissionInfo {
    @Id
    String id;

    String schoolCode;
    int year;
    String departmentCode;
    String majorName;
    String majorCode;
    int admissionQuota;
    double cutoffScore;
    List<SubjectCombination> combinations;
    String programType;
    String note;
}
