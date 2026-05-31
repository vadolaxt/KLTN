package com.be.mapper;

import com.be.dto.response.UserProfileResponse;
import com.be.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserProfileResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserProfileResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .dob(user.getDOB())
                .identity(user.getIdentity())
                .email(user.getEmail())
                .build();
    }
}
