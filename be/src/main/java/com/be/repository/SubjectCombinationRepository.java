package com.be.repository;

import com.be.entity.SubjectCombination;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SubjectCombinationRepository extends MongoRepository<SubjectCombination, String> {
    Optional<SubjectCombination> findByCode(String code);
}
