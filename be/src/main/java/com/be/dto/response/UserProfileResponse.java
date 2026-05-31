package com.be.dto.response;

import lombok.Builder;
import java.time.Instant;

@Builder

public record UserProfileResponse (
        String firstName,
        String lastName,
        Instant dob,
        String identity,
        String email
) {
}
