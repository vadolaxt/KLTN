package com.be.repository;

import com.be.entity.AdmissionInfo;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AdmissionInfoRepository extends MongoRepository<AdmissionInfo, String> {
    List<AdmissionInfo> findByYear(int year);

    List<AdmissionInfo> findByMajorCode(String majorCode);

    List<AdmissionInfo> findByYearAndMajorCode(int year, String majorCode);

    List<AdmissionInfo> findByYearAndSchoolCodeAndMajorCode(int year, String schoolCode, String majorCode);

    boolean existsByYearAndSchoolCodeAndMajorCodeAndProgramType(
            int year, String schoolCode, String majorCode, String programType);

    Optional<AdmissionInfo> findByYearAndSchoolCodeAndMajorCodeAndProgramType(
            int year, String schoolCode, String majorCode, String programType);
}
