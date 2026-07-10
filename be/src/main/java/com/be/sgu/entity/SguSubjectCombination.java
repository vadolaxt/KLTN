package com.be.sgu.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SguSubjectCombination {
    String code;
    String name;
    List<SguSubject> subjects;
    List<SguSubCombination> subCombinations;
}
