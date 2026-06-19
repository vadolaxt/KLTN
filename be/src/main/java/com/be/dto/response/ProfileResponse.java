package com.be.dto.response;

import com.be.entity.CertificateResult;
import com.be.entity.IdentityCard;
import lombok.Builder;
import java.time.Instant;

@Builder
public record ProfileResponse(
        String firstName,
        String lastName,
        Instant dob,
        IdentityCard identityCard,
        String sex,
        String ethnic,
        int graduateYear,
        String birthPlace,
        String address,
        String email,
        CertificateResult certificateResult
) {
}
