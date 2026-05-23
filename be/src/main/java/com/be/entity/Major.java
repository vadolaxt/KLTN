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

@Document(collection = "major")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Major {
    @Id
    String id;
    String code;
    String name;
    String schoolCode;
    String departmentCode;
    String programType;
    int admissionQuota;
    double cutoffScore;
    List<SubjectCombination> combinations; // nhung to hop nganh xet
}
