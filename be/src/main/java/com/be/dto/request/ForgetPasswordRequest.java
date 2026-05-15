package com.be.dto.request;

import lombok.Builder;

@Builder
public record ForgetPasswordRequest(
        String email,
        String newPassword,
        String otp
) {
}
