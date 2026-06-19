package com.be.service;

import com.be.dto.request.AcademicScoreProfileRequest;
import com.be.dto.response.AcademicScoreProfileResponse;
import com.be.entity.AcademicScoreProfile;
import com.be.entity.CompetencyTestResult;
import com.be.entity.NationalExamResult;
import com.be.entity.SchoolRecord;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.mapper.AcademicScoreProfileMapper;
import com.be.mapper.ProfileMapper;
import com.be.repository.AcademicScoreProfileRepository;
import com.be.repository.SchoolRecordRepository;
import com.be.repository.SubjectRepository;
import com.be.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AcademicScoreProfileService {
    AuthService authService;
    UserRepository userRepository;
    ProfileMapper profileMapper;
    AcademicScoreProfileRepository academicScoreProfileRepository;
    SchoolRecordRepository schoolRecordRepository;
    SubjectRepository subjectRepository;
    AcademicScoreProfileMapper academicScoreProfileMapper;

    public AcademicScoreProfileResponse getAcademicScoreProfile(String accessToken) {
        String userId = authService.getUserIdFromToken(accessToken);
        AcademicScoreProfile profile = academicScoreProfileRepository.findByUserId(userId).orElse(null);
        log.info("Academic score profile retrieved: {}", profile);
        log.info("AT: {}", accessToken);
        log.info("User: {}", userId);
        return academicScoreProfileMapper.toAcademicScoreProfileResponse(profile);
    }


    public void editAcademicScoreProfile(String accessToken, AcademicScoreProfileRequest request) {
        String userId = authService.getUserIdFromToken(accessToken);
        AcademicScoreProfile profile = academicScoreProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.ACADEMIC_SCORE_PROFILE_NOT_FOUND));

        if (request.schoolRecord() != null) {
            if (profile.getSchoolRecord() == null) {
                profile.setSchoolRecord(new SchoolRecord());
            }
            profile.getSchoolRecord().setSubjectScoreRecords(request.schoolRecord().getSubjectScoreRecords());
        }

        if (request.nationalExamResult() != null) {
            if (profile.getNationalExamResult() == null) {
                profile.setNationalExamResult(new NationalExamResult());
            }
            profile.getNationalExamResult().setSubjectScores(request.nationalExamResult().getSubjectScores());
        }

        if (request.competencyTestResult() != null) {
            if (profile.getCompetencyTestResult() == null) {
                profile.setCompetencyTestResult(new CompetencyTestResult());
            }
            profile.getCompetencyTestResult().setScore(request.competencyTestResult().getScore());
        }

        academicScoreProfileRepository.save(profile);
    }
}
