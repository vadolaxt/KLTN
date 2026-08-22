package com.be.dto.request;

import com.be.entity.IdentityCard;
import lombok.Builder;

import java.time.Instant;

@Builder
public record ProfileRequest(
        String firstName,
        String lastName,
        Instant dob,
        IdentityCard identityCard,
        String sex,
        String ethnic,
        int graduateYear,
        String birthPlace,
        String address,
        String priorityArea,
        String priorityGroup,
        String email
) {
}
