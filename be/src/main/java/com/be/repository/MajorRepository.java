package com.be.repository;

import com.be.entity.Major;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface MajorRepository extends MongoRepository<Major,String> {

    Optional<Major> findByCode(String majorCode);
}
