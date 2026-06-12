package com.be.service;

import com.be.dto.request.AcademicScoreProfileRequest;
import com.be.dto.response.AcademicScoreProfileResponse;
import com.be.entity.AcademicScoreProfile;
import com.be.mapper.AcademicScoreProfileMapper;
import com.be.mapper.UserMapper;
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
    UserMapper userMapper;
    AcademicScoreProfileRepository academicScoreProfileRepository;
    SchoolRecordRepository schoolRecordRepository;
    SubjectRepository subjectRepository;
    AcademicScoreProfileMapper academicScoreProfileMapper;





//    public UserProfileResponse getUserProfile(String accessToken) {
//        String userId = authService.getUserIdFromToken(accessToken);
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
//
//        UserProfileResponse response = userMapper.toResponse(user);
//
//        if (response == null) {
//            throw new AppException(ErrorCode.USER_NOT_FOUND);
//        }
//
//        return response;
//    }

    public AcademicScoreProfileResponse getAcademicScoreProfile(String accessToken) {
        String userId = authService.getUserIdFromToken(accessToken);
        AcademicScoreProfile profile = academicScoreProfileRepository.findByUserId(userId);
        log.info("Academic score profile retrieved: {}", profile);
        log.info("AT: {}", accessToken);
        log.info("User: {}", userId);
        return academicScoreProfileMapper.toAcademicScoreProfileResponse(profile);
    }


    public void editAcademicScoreProfile(String accessToken, AcademicScoreProfileRequest request) {
        String userId = authService.getUserIdFromToken(accessToken);

        AcademicScoreProfile scoreProfile = AcademicScoreProfile.builder()
                .userId(userId)
//                .admissionMethod(request.admissionMethod())
//                .year(request.year())
//                .source(request.source())
//                .subjectScores(request.records())
//                .competencyTestResult(request.competencyTestResult())
                .build();
        academicScoreProfileRepository.save(scoreProfile);
    }
}
