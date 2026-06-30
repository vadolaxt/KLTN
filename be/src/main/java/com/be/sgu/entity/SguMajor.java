package com.be.sgu.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "sgu_majors")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SguMajor {
    @Id
    String id;
    String code;
    String name;
    String schoolCode;
    String programType;
    int admissionQuota;
    double cutoffScore;
    List<SguSubjectCombination> combinations;
}
