package com.be.repository;

import com.be.entity.SchoolRecord;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SchoolRecordRepository extends MongoRepository<SchoolRecord,String> {

}
