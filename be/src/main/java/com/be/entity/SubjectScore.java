package com.be.entity;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubjectScore {
    Subject subject;

    @Builder.Default
    double score = 0.0;

    int gradeLevel;
    int semester;
}