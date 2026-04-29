package com.be.service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@Slf4j
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JwtService {

    public static MacAlgorithm JWT_ALGORITHM = MacAlgorithm.HS256; // de public static vi jwt config dung
    JwtEncoder jwtEncoder;

    @NonFinal
    @Value("${jwt.access-token-expire}")
    int accessTokenExpiration;

    @NonFinal
    @Value("${jwt.refresh-token-expire}")
    int refreshTokenExpiration;

    public String generateToken(String email, String role) {
        Instant now = Instant.now();
        Instant expired = now.plus(accessTokenExpiration, ChronoUnit.SECONDS);

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(expired)
                .subject(email)
                .claim("role", role) // khi nao lam phan quyen thi de y
                .build();

        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();

        return jwtEncoder
                .encode(JwtEncoderParameters.from(jwsHeader, claimsSet))
                .getTokenValue();
    }
}
