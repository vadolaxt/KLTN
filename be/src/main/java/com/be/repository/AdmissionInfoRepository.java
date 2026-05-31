package com.be.repository;

import com.be.entity.AdmissionInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface AdmissionInfoRepository extends MongoRepository<AdmissionInfo, String> {
    List<AdmissionInfo> findByYear(int year);

    List<AdmissionInfo> findByMajorCode(String majorCode);

    List<AdmissionInfo> findByYearAndMajorCode(int year, String majorCode);
}
