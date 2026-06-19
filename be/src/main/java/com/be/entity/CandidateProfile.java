package com.be.entity;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.Year;

@Document(collection = "candidate_profiles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CandidateProfile {
    @Id
    String id;
    String userId;

    String address;

    @Builder.Default
    String sex = "Nam";

    @Builder.Default
    String ethnic = "Kinh";

    @Builder.Default
    int graduateYear = Year.now().getValue();

    String birthPlace;
    IdentityCard identityCard;
    Instant DOB;
    CertificateResult certificateResult;
}
