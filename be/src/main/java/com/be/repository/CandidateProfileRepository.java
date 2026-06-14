package com.be.repository;

import com.be.entity.CandidateProfile;
import com.fasterxml.jackson.databind.introspect.AnnotationCollector;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface CandidateProfileRepository extends MongoRepository<CandidateProfile, String> {

    Optional<CandidateProfile> findByUserId(String userId);
}
