package com.be.dto.request;

import lombok.Builder;

@Builder
public record UserUpdateRequest(
        String id,
        String firstName,
        String lastName,
        String email,
        String role
) {
}
