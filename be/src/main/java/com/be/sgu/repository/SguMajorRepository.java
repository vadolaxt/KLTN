package com.be.sgu.repository;

import com.be.sgu.entity.SguMajor;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SguMajorRepository extends MongoRepository<SguMajor, String> {
    Optional<SguMajor> findByCode(String code);
}
