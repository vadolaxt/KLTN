package com.be.dto.request;

public record CertificateResultRequest(
        String certificateType,
        String organization,
        String issuedDate,
        double score,
        String imageUrl
) {
}
