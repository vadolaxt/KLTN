package com.be.repository;

import com.be.entity.AcademicScoreProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AcademicScoreProfileRepository extends MongoRepository<AcademicScoreProfile, String> {
    Optional<AcademicScoreProfile> findByUserId(String userId);
}
