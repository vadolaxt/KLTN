package com.be.repository;

import com.be.entity.Subject;
import com.be.entity.SubjectScore;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    Optional<Subject> findBySubjectName(String subjectName);

    List<Subject> findAllByOrderByIndexAsc();;
}
