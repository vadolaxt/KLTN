package com.be.entity;

import com.be.supportClass.SubjectScore;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "academic_transcripts")
@Getter
@Setter
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AcademicTranscript {
    @Id
    String id;

    List<SubjectScore> subjectScores;

    String userId;
}
