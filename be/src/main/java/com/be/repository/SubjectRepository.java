package com.be.repository;

import com.be.entity.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    Optional<Subject> findBySubjectName(String subjectName);
}
