package com.be.repository;

import com.be.entity.AcademicScoreProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AcademicScoreProfileRepository extends MongoRepository<AcademicScoreProfile, String> {
    AcademicScoreProfile findByUserId(String userId);
}
