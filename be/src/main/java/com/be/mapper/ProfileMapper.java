package com.be.mapper;

import com.be.dto.response.ProfileResponse;
import com.be.entity.CandidateProfile;
import com.be.entity.User;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {
    public ProfileResponse toProfileResponse(User user, CandidateProfile profile) {
        if (user == null) {
            return null;
        }
        return ProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .address(profile.getAddress())
                .sex(profile.getSex())
                .ethnic(profile.getEthnic())
                .graduateYear(profile.getGraduateYear())
                .birthPlace(profile.getBirthPlace())
                .identityCard(profile.getIdentityCard())
                .dob(profile.getDOB())
                .certificateResult(profile.getCertificateResult())
                .build();
    }
}
