package com.be.sgu.repository;

import com.be.sgu.entity.SguAdmissionInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SguAdmissionInfoRepository extends MongoRepository<SguAdmissionInfo, String> {
    List<SguAdmissionInfo> findByYearAndMajorCode(int year, String majorCode);
}
