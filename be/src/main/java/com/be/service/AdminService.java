package com.be.service;

import com.be.dto.request.UserAddRequest;
import com.be.dto.request.UserUpdateRequest;
import com.be.dto.response.UserResponse;
import com.be.entity.CandidateProfile;
import com.be.entity.IdentityCard;
import com.be.entity.User;
import com.be.enums.AccountStatus;
import com.be.enums.Role;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.repository.CandidateProfileRepository;
import com.be.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AdminService {
    UserRepository userRepository;
    CandidateProfileRepository candidateProfileRepository;
    AuthService authService;
    PasswordEncoder passwordEncoder;

    public List<UserResponse> getAllUser(String token) {
        String currentUserId = authService.getUserIdFromToken(token);
        List<User> users = userRepository.findByIdNotAndStatusNot(currentUserId, AccountStatus.INACTIVE);

        return users.stream().map(u -> {
            String identity = candidateProfileRepository.findByUserId(u.getId())
                    .map(CandidateProfile::getIdentityCard)
                    .map(IdentityCard::getNumber)
                    .orElse(null);

            return UserResponse.builder()
                    .id(u.getId())
                    .email(u.getEmail())
                    .lastName(u.getLastName())
                    .firstName(u.getFirstName())
                    .identity(identity)
                    .role(u.getRole().toString())
                    .status(u.getStatus().toString())
                    .build();
        }).collect(Collectors.toList());
    }

    public void deleteUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setStatus(AccountStatus.INACTIVE);
        userRepository.save(user);
    }

    public void banUser(String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (user.getStatus() == AccountStatus.BANNED) {
            user.setStatus(AccountStatus.ACTIVE);
        } else if ((user.getStatus() == AccountStatus.ACTIVE)) {
            user.setStatus(AccountStatus.BANNED);
        }
        userRepository.save(user);
    }

    public void updateUser(UserUpdateRequest request) {
        User user = userRepository.findById(request.id()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (request.firstName() != null) {
            user.setFirstName(request.firstName());
        }
        if (request.lastName() != null) {
            user.setLastName(request.lastName());
        }
        if (request.email() != null) {
            user.setEmail(request.email());
        }
        if (request.role() != null) {
            switch (request.role()) {
                case "ADMIN":
                    user.setRole(Role.ROLE_ADMIN);
                    break;
                case "USER":
                    user.setRole(Role.ROLE_USER);
                    break;
            }
        }
        userRepository.save(user);
    }

    public void addUser(UserAddRequest request) {
        User user = User.builder()
                .firstName(request.firstName())
                .lastName(request.lastName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .build();

        switch (request.role()) {
            case "ADMIN":
                user.setRole(Role.ROLE_ADMIN);
                break;
            case "USER":
                user.setRole(Role.ROLE_USER);
                break;
        }

        CandidateProfile profile = CandidateProfile.builder()
                .userId(user.getId())
                .identityCard(IdentityCard.builder().number("0").build())
                .build();
        candidateProfileRepository.save(profile);
        authService.initAcademicScoreProfile(user.getId());

        userRepository.save(user);
    }
}
