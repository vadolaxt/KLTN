package com.be.repository;

import com.be.entity.FQA;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FQARepository extends MongoRepository<FQA,String> {
}
