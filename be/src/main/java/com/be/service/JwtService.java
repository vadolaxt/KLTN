package com.be.service;

import com.be.entity.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.stream.Collectors;

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

    public String generateToken(User user, boolean isRefresh) {
        Instant now = Instant.now();
        long expired = isRefresh ? refreshTokenExpiration : accessTokenExpiration;
        JwsHeader jwsHeader = JwsHeader.with(JWT_ALGORITHM).build();

        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
                .issuedAt(now)
                .expiresAt(now.plus(expired, ChronoUnit.SECONDS))
                .subject(user.getFirstName()+" "+ user.getLastName())
                .claim("role", user.getRole())
                .claim("scope", isRefresh ? "REFRESH_TOKEN" : "ACCESS_TOKEN")
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claimsSet)).getTokenValue();
    }
}