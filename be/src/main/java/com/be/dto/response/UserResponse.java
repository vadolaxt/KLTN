package com.be.dto.response;

import lombok.Builder;

@Builder
public record UserResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        String identity,
        String role,
        String status
) {
}
