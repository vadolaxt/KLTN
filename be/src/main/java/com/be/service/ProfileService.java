package com.be.service;

import com.be.dto.request.CertificateResultRequest;
import com.be.dto.request.ProfileRequest;
import com.be.dto.response.ProfileResponse;
import com.be.entity.CandidateProfile;
import com.be.entity.CertificateResult;
import com.be.entity.User;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.mapper.ProfileMapper;
import com.be.repository.CandidateProfileRepository;
import com.be.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ProfileService {
    AuthService authService;
    ProfileMapper profileMapper;
    UserRepository userRepository;
    CandidateProfileRepository candidateProfileRepository;

    public ProfileResponse getUserProfile(String accessToken) {
        String userId = authService.getUserIdFromToken(accessToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_PROFILE_NOT_FOUND));


        ProfileResponse response = profileMapper.toProfileResponse(user, profile);

        if (response == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        return response;
    }

    public void editUserProfile(String token, ProfileRequest request) {
        String userId = authService.getUserIdFromToken(token);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_PROFILE_NOT_FOUND));

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());

        profile.setSex(request.sex());
        profile.setEthnic(request.ethnic());
        profile.setGraduateYear(request.graduateYear());
        profile.setBirthPlace(request.birthPlace());
        profile.setAddress(request.address());
        profile.setPriorityArea(request.priorityArea() == null ? "KV3" : request.priorityArea());
        profile.setPriorityGroup(request.priorityGroup() == null ? "NONE" : request.priorityGroup());
        profile.setIdentityCard(request.identityCard());
        profile.setDOB(request.dob());

        userRepository.save(user);
        candidateProfileRepository.save(profile);

    }

    public void editCertificateResult(String token, CertificateResultRequest request) {
        String userId = authService.getUserIdFromToken(token);
        CandidateProfile profile = candidateProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.CANDIDATE_PROFILE_NOT_FOUND));

        CertificateResult certificateResult = CertificateResult.builder()
                .certificateType(request.certificateType())
                .organization(request.organization())
                .issuedDate(Instant.parse(request.issuedDate()))
                .score(request.score())
                .imageUrl(request.imageUrl())
                .build();

        profile.setCertificateResult(certificateResult);
        candidateProfileRepository.save(profile);
    }
}
