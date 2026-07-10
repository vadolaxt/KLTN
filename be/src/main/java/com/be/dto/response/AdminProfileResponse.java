package com.be.dto.response;

import com.be.enums.Role;

public record AdminProfileResponse(
        String firstName,
        String lastName,
        String email,
        Role role
) {
}
