package com.be.service;

import com.be.dto.request.AuthRequest;
import com.be.dto.request.ForgetPasswordRequest;
import com.be.dto.request.RegisterRequest;
import com.be.dto.response.AuthResponse;
import com.be.dto.response.UserProfileResponse;
import com.be.entity.AcademicScoreProfile;
import com.be.entity.CompetencyTestResult;
import com.be.entity.NationalExamResult;
import com.be.entity.SchoolRecord;
import com.be.entity.SubjectScore;
import com.be.entity.User;
import com.be.exception.AppException;
import com.be.exception.ErrorCode;
import com.be.mapper.UserMapper;
import com.be.repository.AcademicScoreProfileRepository;
import com.be.repository.SubjectRepository;
import com.be.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.stereotype.Service;

import java.time.Year;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthService {
    UserRepository userRepository;
    JwtService jwtService;
    PasswordEncoder passwordEncoder;
    JwtDecoder jwtDecoder;
    StringRedisTemplate redisTemplate;
    SubjectRepository subjectRepository;

    AcademicScoreProfileRepository academicScoreProfileRepository;

    @Autowired
    UserMapper userMapper;

    @NonFinal
    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    String googleClientId;

    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public void saveOtp(String email, String otp) {
        String key = "otp:" + email;
        redisTemplate.opsForValue().set(key, otp, 5, TimeUnit.MINUTES);
        log.info("Saving OTP value (" + otp + ") for email: " + email);
    }

    public long getTTL(String email) {
        String key = "otp:" + email;
        return redisTemplate.getExpire(key, TimeUnit.SECONDS);
    }

    public void checkUser(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new AppException(ErrorCode.ACCOUNT_EXISTED);
        }
    }


    public SchoolRecord initSchoolRecord() {
        SchoolRecord result = SchoolRecord.builder().build();
        List<SubjectScore> scores = buildDefaultScores(1);
        result.setSubjectScoreRecords(scores);
        return result;
    }

    public NationalExamResult initNationalExamResult() {
        NationalExamResult result = NationalExamResult.builder().build();
        List<SubjectScore> scores = buildDefaultScores(2);
        result.setSubjectScores(scores);
        return result;
    }

    public CompetencyTestResult initCompetencyTestResult() {
        CompetencyTestResult result = CompetencyTestResult.builder().build();

        return result;
    }

    public void initAcademicScoreProfile(String userId) {
        if (userRepository.findById(userId).isPresent()) {
            return;
        }
        AcademicScoreProfile result = AcademicScoreProfile.builder().build();
        result.setUserId(userId);
        result.setSchoolRecord(initSchoolRecord());
        result.setNationalExamResult(initNationalExamResult());
        result.setCompetencyTestResult(initCompetencyTestResult());
        academicScoreProfileRepository.save(result);
    }

    // type: 1 là học bạ, 2 là thpt
    private List<SubjectScore> buildDefaultScores(int type) {
        int currentYear = Year.now().getValue();
        return switch (type) {
            case 1 -> subjectRepository.findAll().stream()
                    .flatMap(subject ->
                            Stream.of(10, 11, 12)
                                    .flatMap(grade ->
                                            Stream.of(1, 2)
                                                    .map(semester ->
                                                            SubjectScore.builder()
                                                                    .subject(subject)
                                                                    .score(0.0)
                                                                    .gradeLevel(grade)
                                                                    .semester(semester)
                                                                    .build()
                                                    )
                                    )
                    )
                    .toList();
            case 2 -> subjectRepository.findAll().stream()
                    .map(subject ->
                            SubjectScore.builder()
                                    .subject(subject)
                                    .score(0.0)
                                    .build()
                    )
                    .toList();

            default -> Collections.emptyList();
        };
    }

    public String register(RegisterRequest request) {
        String redisKey = "otp:" + request.getEmail();
        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp == null) {
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }
        if (userRepository.findByEmail(request.getEmail()).isPresent() ||
                userRepository.findByIdentity(request.getIdentity()).isPresent()
        ) {
            throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
        }
        if (!request.getOtp().equals(storedOtp)) {
            throw new AppException(ErrorCode.OTP_MISMATCH);
        }

        redisTemplate.delete(redisKey);

        User user = userRepository.save(User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .DOB(request.getDateOfBirth().toInstant())
                .identity(request.getIdentity())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build());

        // mặc định tạo hồ sơ điểm khi đăng ký thành công
        initAcademicScoreProfile(user.getId());

        return "Tài khoản đăng ký thành công";
    }

    public String createAccessCookie(String accessToken) {
        ResponseCookie accessCookie = ResponseCookie.from(
                        "accessToken",
                        accessToken
                )
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(15 * 60)
                .sameSite("Lax")
                .build();

        return accessCookie.toString();
    }

    public String createRefreshCookie(String refreshToken) {
        ResponseCookie refreshCookie = ResponseCookie.from(
                        "refreshToken",
                        refreshToken
                )
                .httpOnly(true)
                .secure(false)
                .path("/api/auth/refresh")
                .maxAge(30 * 24 * 60 * 60)
                .sameSite("Lax")
                .build();

        return refreshCookie.toString();
    }

    private GoogleIdToken.Payload verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);

            if (idToken == null) {
                throw new AppException(ErrorCode.INVALID_TOKEN);
            }
            return idToken.getPayload();
        } catch (Exception e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    public AuthResponse loginGoogle(String idTokenString) {
        GoogleIdToken.Payload payload = verifyGoogleToken(idTokenString);

        String email = payload.getEmail();
        String firstName = (String) payload.get("given_name");
        String lastName = (String) payload.get("family_name");

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .build();
            return userRepository.save(newUser);
        });

        String accessToken = jwtService.generateToken(user, false);
        String refreshToken = jwtService.generateToken(user, true);

        initAcademicScoreProfile(user.getId());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .authenticated(true)
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return AuthResponse.builder().
                    authenticated(false)
                    .build();
        }

        return AuthResponse.builder()
                .accessToken(jwtService.generateToken(user, false))
                .refreshToken(jwtService.generateToken(user, true))
                .authenticated(true)
                .build();
    }

    public String refreshToken(String refreshToken) {
        try {
            Jwt jwt = jwtDecoder.decode(refreshToken);
            String userId = jwt.getSubject();

            if (!"REFRESH_TOKEN".equals(jwt.getClaim("scope"))) {
                throw new AppException(ErrorCode.WRONG_TOKEN_TYPE);
            }

            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

            return jwtService.generateToken(user, false);
        } catch (JwtException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }

    public String getUserIdFromToken(String accessToken) {
        return jwtDecoder.decode(accessToken).getSubject();
    }

    public UserProfileResponse getUserProfile(String accessToken) {
        String userId = getUserIdFromToken(accessToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        UserProfileResponse response = userMapper.toResponse(user);

        if (response == null) {
            throw new AppException(ErrorCode.USER_NOT_FOUND);
        }

        return response;
    }

    public void forgetPassword(ForgetPasswordRequest request) {
        String redisKey = "otp:" + request.email();
        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp == null) {
            throw new AppException(ErrorCode.OTP_EXPIRED);
        }
        if (!request.otp().equals(storedOtp)) {
            throw new AppException(ErrorCode.OTP_MISMATCH);
        }

        redisTemplate.delete(redisKey);


        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
