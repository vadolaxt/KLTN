package com.be.seeder;

import com.be.entity.AdmissionInfo;
import com.be.entity.Major;
import com.be.entity.NewsArticle;
import com.be.entity.Subject;
import com.be.entity.SubjectCombination;
import com.be.entity.User;
import com.be.enums.NewsCategory;
import com.be.enums.NewsStatus;
import com.be.enums.Role;
import com.be.repository.AdmissionInfoRepository;
import com.be.repository.MajorRepository;
import com.be.repository.NewsArticleRepository;
import com.be.repository.SubjectCombinationRepository;
import com.be.repository.SubjectRepository;
import com.be.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class DataInit {
    private static final int DEFAULT_TARGET_YEAR = 2026;
    private static final int SOURCE_YEAR_FOR_2026 = 2025;

    @Value("${app.seed.reset-admission:false}")
    private boolean resetAdmissionSeed;

    private static final Map<String, List<String>> BLOCK_MAP = Map.ofEntries(
            Map.entry("A00", List.of("Toán", "Vật lý", "Hóa học")),
            Map.entry("A01", List.of("Toán", "Vật lý", "Tiếng Anh")),
            Map.entry("A02", List.of("Toán", "Vật lý", "Sinh học")),
            Map.entry("A04", List.of("Toán", "Vật lý", "Địa lý")),
            Map.entry("B00", List.of("Toán", "Hóa học", "Sinh học")),
            Map.entry("B02", List.of("Toán", "Sinh học", "Địa lý")),
            Map.entry("B03", List.of("Toán", "Sinh học", "Ngữ văn")),
            Map.entry("C01", List.of("Ngữ văn", "Toán", "Vật lý")),
            Map.entry("C02", List.of("Ngữ văn", "Toán", "Hóa học")),
            Map.entry("C04", List.of("Ngữ văn", "Toán", "Địa lý")),
            Map.entry("D01", List.of("Ngữ văn", "Toán", "Tiếng Anh")),
            Map.entry("D07", List.of("Toán", "Hóa học", "Tiếng Anh")),
            Map.entry("D08", List.of("Toán", "Sinh học", "Tiếng Anh")),
            Map.entry("D09", List.of("Toán", "Lịch sử", "Tiếng Anh")),
            Map.entry("D10", List.of("Toán", "Địa lý", "Tiếng Anh")),
            Map.entry("D14", List.of("Ngữ văn", "Lịch sử", "Tiếng Anh")),
            Map.entry("D15", List.of("Ngữ văn", "Địa lý", "Tiếng Anh")),
            Map.entry("D90", List.of("Toán", "Khoa học tự nhiên", "Tiếng Anh")),
            Map.entry("X01", List.of("Toán", "Ngữ văn", "Giáo dục Kinh tế và Pháp luật")),
            Map.entry("X02", List.of("Toán", "Ngữ văn", "Tin học")),
            Map.entry("X04", List.of("Toán", "Ngữ văn", "Công nghệ nông nghiệp")),
            Map.entry("X06", List.of("Toán", "Vật lý", "Tin học")),
            Map.entry("X07", List.of("Toán", "Vật lý", "Công nghệ công nghiệp")),
            Map.entry("X08", List.of("Toán", "Vật lý", "Công nghệ nông nghiệp")),
            Map.entry("X09", List.of("Toán", "Hóa học", "Giáo dục Kinh tế và Pháp luật")),
            Map.entry("X10", List.of("Toán", "Hóa học", "Tin học")),
            Map.entry("X11", List.of("Toán", "Hóa học", "Công nghệ công nghiệp")),
            Map.entry("X12", List.of("Toán", "Hóa học", "Công nghệ nông nghiệp")),
            Map.entry("X13", List.of("Toán", "Sinh học", "Giáo dục Kinh tế và Pháp luật")),
            Map.entry("X14", List.of("Toán", "Sinh học", "Tin học")),
            Map.entry("X16", List.of("Toán", "Sinh học", "Công nghệ nông nghiệp")),
            Map.entry("X25", List.of("Toán", "Giáo dục Kinh tế và Pháp luật", "Tiếng Anh")),
            Map.entry("X26", List.of("Toán", "Tin học", "Tiếng Anh")),
            Map.entry("X28", List.of("Toán", "Công nghệ nông nghiệp", "Tiếng Anh"))
    );

    private static final Map<String, String> SUBJECT = Map.ofEntries(
            Map.entry("TOAN", "Toán"),
            Map.entry("VAN", "Ngữ văn"),
            Map.entry("VAT_LI", "Vật lý"),
            Map.entry("HOA_HOC", "Hóa học"),
            Map.entry("SINH_HOC", "Sinh học"),
            Map.entry("LICH_SU", "Lịch sử"),
            Map.entry("DIA_LI", "Địa lý"),
            Map.entry("KHTN", "Khoa học tự nhiên"),
            Map.entry("GDKT_PL", "Giáo dục Kinh tế và Pháp luật"),
            Map.entry("TIN_HOC", "Tin học"),
            Map.entry("CN_CONG_NGHIEP", "Công nghệ công nghiệp"),
            Map.entry("CN_NONG_NGHIEP", "Công nghệ nông nghiệp"),
            Map.entry("NGOAI_NGU", "Tiếng Anh")
    );

    private static final List<String> SUBJECT_ORDER = List.of(
            "TOAN", "VAN", "VAT_LI", "HOA_HOC", "SINH_HOC", "LICH_SU", "DIA_LI", "KHTN",
            "GDKT_PL", "TIN_HOC", "CN_CONG_NGHIEP", "CN_NONG_NGHIEP", "NGOAI_NGU"
    );

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            MajorRepository majorRepository,
            SubjectRepository subjectRepository,
            SubjectCombinationRepository subjectCombinationRepository,
            AdmissionInfoRepository admissionInfoRepository,
            NewsArticleRepository newsArticleRepository,
            MongoTemplate mongoTemplate
    ) {
        return args -> {
            System.out.println("--- Bắt đầu kiểm tra và khởi tạo dữ liệu mẫu ---");

            migrateLegacyUserRoles(mongoTemplate);

            if (userRepository.count() == 0) {
                initSampleUsers(userRepository);
            } else {
                System.out.println("--- Dữ liệu Users đã tồn tại, bỏ qua ---");
            }

            ensureRequestedAdmin(userRepository);

            if (subjectRepository.count() == 0) {
                initSubject(subjectRepository);
            } else {
                System.out.println("--- Dữ liệu Subject đã tồn tại, bỏ qua ---");
            }

            initAdmissionDataset(
                    majorRepository,
                    subjectRepository,
                    subjectCombinationRepository,
                    admissionInfoRepository
            );

            initNewsArticles(newsArticleRepository);

            addCoreSubjectToMajor(majorRepository);
        };
    }

    private void migrateLegacyUserRoles(MongoTemplate mongoTemplate) {
        mongoTemplate.updateMulti(
                Query.query(Criteria.where("role").is("ADMIN")),
                Update.update("role", Role.ROLE_ADMIN.name()),
                "users"
        );
        mongoTemplate.updateMulti(
                Query.query(Criteria.where("role").is("USER")),
                Update.update("role", Role.ROLE_USER.name()),
                "users"
        );
    }

    private void initSampleUsers(UserRepository userRepository) {
        System.out.println("--- Đang khởi tạo dữ liệu mẫu cho Users ---");
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        User user1 = new User();
        user1.setLastName("Nguyen Van A");
        user1.setEmail("a@gmail.com");
        user1.setPassword(encoder.encode("Abcd1234@"));
        user1.setRole(Role.ROLE_USER);

        User user2 = new User();
        user2.setLastName("Admin Hệ Thống");
        user2.setEmail("admin@gamil.com");
        user2.setPassword(encoder.encode("Abcd1234@"));
        user2.setRole(Role.ROLE_ADMIN);

        userRepository.save(user1);
        userRepository.save(user2);
        System.out.println("--- Đã thêm các User mẫu thành công! ---");
    }

    private void ensureRequestedAdmin(UserRepository userRepository) {
        final String email = "admin@hcmuaf.edu.vn";
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        User existing = userRepository.findByEmail(email).orElse(null);
        if (existing != null) {
            boolean changed = false;
            if (existing.getRole() != Role.ROLE_ADMIN) {
                existing.setRole(Role.ROLE_ADMIN);
                changed = true;
            }
            if (!encoder.matches("Admin@1234", existing.getPassword())) {
                existing.setPassword(encoder.encode("Admin@1234"));
                changed = true;
            }
            if (changed) userRepository.save(existing);
            System.out.println("--- Đã đồng bộ tài khoản admin HCMUAF ---");
            return;
        }

        User admin = User.builder()
                .firstName("HCMUAF")
                .lastName("Admin")
                .email(email)
                .password(encoder.encode("Admin@1234"))
                .role(Role.ROLE_ADMIN)
                .build();
        userRepository.save(admin);
        System.out.println("--- Đã tạo tài khoản admin HCMUAF ---");
    }

    private void initSubject(SubjectRepository subjectRepository) {
        if (subjectRepository.count() > 0) {
            System.out.println("--- Dữ liệu Subject đã tồn tại, bỏ qua ---");
            return;
        }

        List<Subject> subjects = new ArrayList<>();
        long index = 1; // Khởi tạo index từ 1

        for (String code : SUBJECT_ORDER) {
            Subject subject = Subject.builder()
                    .code(code)
                    .subjectName(SUBJECT.get(code))
                    .index(index++) // Gán index hiện tại rồi mới tăng lên 1
                    .build();

            subjects.add(subject);
        }

        subjectRepository.saveAll(subjects);
        System.out.printf("--- Đã seed %d môn học ---%n", subjects.size());
    }

    private void initAdmissionDataset(
            MajorRepository majorRepository,
            SubjectRepository subjectRepository,
            SubjectCombinationRepository subjectCombinationRepository,
            AdmissionInfoRepository admissionInfoRepository
    ) throws IOException {
        System.out.println("--- Đang gieo dữ liệu tuyển sinh từ dataset.csv ---");

        List<AdmissionCsvRow> sourceRows = loadDatasetRows();
        boolean hasTargetYearRows = sourceRows.stream()
                .anyMatch(row -> row.year() == DEFAULT_TARGET_YEAR);
        List<AdmissionCsvRow> rowsFor2026 = hasTargetYearRows
                ? sourceRows.stream()
                .filter(row -> row.year() == DEFAULT_TARGET_YEAR)
                .toList()
                : sourceRows.stream()
                .filter(row -> row.year() == SOURCE_YEAR_FOR_2026)
                .map(row -> row.withYear(DEFAULT_TARGET_YEAR))
                .toList();

        List<AdmissionCsvRow> allRows = new ArrayList<>(sourceRows);
        if (!hasTargetYearRows) {
            allRows.addAll(rowsFor2026);
        }

        long expectedMajorCount = rowsFor2026.stream()
                .map(row -> row.schoolCode() + "|" + row.majorCode() + "|" + row.programType())
                .distinct()
                .count();

        long majorCount = majorRepository.count();
        List<Subject> existingSubjects = subjectRepository.findAll();
        long combinationCount = subjectCombinationRepository.count();
        long admissionInfoCount = admissionInfoRepository.count();
        boolean hasLegacyPlaceholderSubjects = existingSubjects.stream()
                .anyMatch(subject -> isLegacyPlaceholderSubject(subject.getSubjectName()));
        boolean admissionSeedExists = majorCount == expectedMajorCount
                && !existingSubjects.isEmpty()
                && !hasLegacyPlaceholderSubjects
                && combinationCount == BLOCK_MAP.size()
                && admissionInfoCount == allRows.size();

        if (admissionSeedExists && !resetAdmissionSeed) {
            System.out.println("--- Dữ liệu tuyển sinh đã tồn tại, bỏ qua seed CSV ---");
            return;
        }

        if (resetAdmissionSeed) {
            System.out.println("--- app.seed.reset-admission=true, reset dữ liệu tuyển sinh trước khi seed ---");
        } else {
            System.out.println("--- Dữ liệu tuyển sinh chưa đầy đủ, reset các collection seed trước khi nạp CSV ---");
        }

        majorRepository.deleteAll();
//        subjectRepository.deleteAll();
        subjectCombinationRepository.deleteAll();
        admissionInfoRepository.deleteAll();

        subjectRepository.deleteAll(subjectRepository.findAll().stream()
                .filter(subject -> isLegacyPlaceholderSubject(subject.getSubjectName()))
                .toList());

//        Map<String, Subject> subjectCache = new LinkedHashMap<>();
        Map<String, Subject> subjectCache = subjectRepository.findAll().stream()
                .collect(java.util.stream.Collectors.toMap(
                        Subject::getSubjectName,
                        subject -> subject,
                        (existing, replacement) -> existing,
                        LinkedHashMap::new
                ));
        Map<String, SubjectCombination> combinationCache = new LinkedHashMap<>();
        List<AdmissionInfo> admissionInfos = new ArrayList<>();

        // Seed đúng 34 tổ hợp được backend hỗ trợ, không phụ thuộc tổ hợp có xuất hiện
        // trong từng phiên bản dataset hay không.
        for (String combinationCode : BLOCK_MAP.keySet()) {
            resolveCombinations(
                    combinationCode,
                    subjectCache,
                    combinationCache,
                    subjectRepository,
                    subjectCombinationRepository
            );
        }

        for (AdmissionCsvRow row : allRows) {
            List<SubjectCombination> combinations = resolveCombinations(
                    row.subjectCombinations(),
                    subjectCache,
                    combinationCache,
                    subjectRepository,
                    subjectCombinationRepository
            );

            admissionInfos.add(AdmissionInfo.builder()
                    .schoolCode(row.schoolCode())
                    .year(row.year())
                    .departmentCode(row.departmentCode())
                    .majorName(row.majorName())
                    .majorCode(row.majorCode())
                    .admissionQuota(row.admissionQuota())
                    .cutoffScore(row.cutoffScore())
                    .combinations(combinations)
                    .programType(row.programType())
                    .note(row.note())
                    .build());
        }

        admissionInfoRepository.saveAll(admissionInfos);

        Map<String, Major> majors = new LinkedHashMap<>();
        for (AdmissionCsvRow row : rowsFor2026) {
            List<SubjectCombination> combinations = resolveCombinations(
                    row.subjectCombinations(),
                    subjectCache,
                    combinationCache,
                    subjectRepository,
                    subjectCombinationRepository
            );

            String majorKey = row.schoolCode() + "|" + row.majorCode() + "|" + row.programType();
            Major existingMajor = majors.get(majorKey);
            if (existingMajor == null) {
                majors.put(majorKey, Major.builder()
                        .schoolCode(row.schoolCode())
                        .departmentCode(row.departmentCode())
                        .code(row.majorCode())
                        .name(row.majorName())
                        .programType(row.programType())
                        .admissionQuota(row.admissionQuota())
                        .cutoffScore(row.cutoffScore())
                        .combinations(new ArrayList<>(combinations))
                        .build());
            } else {
                List<SubjectCombination> mergedCombinations = new ArrayList<>(existingMajor.getCombinations());
                for (SubjectCombination combination : combinations) {
                    boolean exists = mergedCombinations.stream()
                            .anyMatch(item -> item.getCode().equalsIgnoreCase(combination.getCode()));
                    if (!exists) {
                        mergedCombinations.add(combination);
                    }
                }
                existingMajor.setCombinations(mergedCombinations);
            }
        }

        majorRepository.saveAll(majors.values());
        int minYear = sourceRows.stream().mapToInt(AdmissionCsvRow::year).min().orElse(SOURCE_YEAR_FOR_2026);
        int maxYear = sourceRows.stream().mapToInt(AdmissionCsvRow::year).max().orElse(SOURCE_YEAR_FOR_2026);
        if (hasTargetYearRows) {
            System.out.printf(
                    "--- Đã gieo %d ngành năm %d và %d dòng thông tin tuyển sinh (%d-%d, dữ liệu %d có sẵn trong CSV) ---%n",
                    majors.size(), DEFAULT_TARGET_YEAR, admissionInfos.size(), minYear, maxYear, DEFAULT_TARGET_YEAR
            );
        } else {
            System.out.printf(
                    "--- Đã gieo %d ngành năm %d và %d dòng thông tin tuyển sinh (%d-%d, năm %d dùng dữ liệu %d) ---%n",
                    majors.size(), DEFAULT_TARGET_YEAR, admissionInfos.size(), minYear, maxYear,
                    DEFAULT_TARGET_YEAR, SOURCE_YEAR_FOR_2026
            );
        }
    }

    private List<SubjectCombination> resolveCombinations(
            String rawCombinations,
            Map<String, Subject> subjectCache,
            Map<String, SubjectCombination> combinationCache,
            SubjectRepository subjectRepository,
            SubjectCombinationRepository subjectCombinationRepository
    ) {
        List<SubjectCombination> combinations = new ArrayList<>();

        List<String> distinctCodes = java.util.Arrays.stream(rawCombinations.split(","))
                .map(String::trim)
                .filter(code -> !code.isEmpty())
                .distinct()
                .toList();

        for (String code : distinctCodes) {
            List<String> subjectNames = BLOCK_MAP.get(code);
            if (subjectNames == null) {
                System.out.printf("--- Cảnh báo: bỏ qua tổ hợp chưa có ánh xạ môn: %s ---%n", code);
                continue;
            }
            List<String> combinationSubjectNames = subjectNames;

//            List<Subject> subjects = combinationSubjectNames.stream()
//                    .map(subjectName -> subjectCache.computeIfAbsent(
//                            subjectName,
//                            name -> subjectRepository.save(Subject.builder().subjectName(name).build())
//                    ))
//                    .toList();
            List<Subject> subjects = combinationSubjectNames.stream()
                    .map(subjectName -> {
                        Subject existingSubject = subjectCache.get(subjectName);
                        if (existingSubject == null) {
                            System.out.printf("--- Cảnh báo: Khởi tạo môn học không có trong initSubject: %s ---%n", subjectName);
                            existingSubject = subjectRepository.save(Subject.builder().subjectName(subjectName).build());
                            subjectCache.put(subjectName, existingSubject);
                        }
                        return existingSubject;
                    })
                    .toList();

            SubjectCombination combination = combinationCache.computeIfAbsent(code, combinationCode ->
                    subjectCombinationRepository.save(SubjectCombination.builder()
                            .code(combinationCode)
                            .name(combinationCode + " - " + String.join(", ", combinationSubjectNames))
                            .subjects(subjects)
                            .build())
            );

            combinations.add(combination);
        }

        return combinations;
    }

    private List<AdmissionCsvRow> loadDatasetRows() throws IOException {
        List<String> lines = readDatasetRecords("dataset.csv");
        if (lines.size() <= 1) {
            return List.of();
        }

        List<AdmissionCsvRow> rows = new ArrayList<>();
        for (int i = 1; i < lines.size(); i++) {
            String line = lines.get(i);
            if (line == null || line.isBlank()) {
                continue;
            }

            List<String> fields = parseCsvLine(line);
            if (fields.size() < 9) {
                System.out.printf("--- Bỏ qua dòng dataset không hợp lệ: %s ---%n", line);
                continue;
            }

            if (fields.size() >= 10) {
                rows.add(new AdmissionCsvRow(
                        fields.get(0),
                        parseInt(fields.get(1)),
                        fields.get(2),
                        fields.get(3),
                        fields.get(4),
                        parseInt(fields.get(5)),
                        parseDouble(fields.get(6)),
                        fields.get(7),
                        fields.get(8),
                        fields.get(9)
                ));
            } else {
                rows.add(new AdmissionCsvRow(
                        fields.get(0),
                        parseInt(fields.get(1)),
                        "Unknown",
                        fields.get(3),
                        fields.get(2),
                        parseInt(fields.get(4)),
                        parseDouble(fields.get(5)),
                        fields.get(6),
                        fields.get(7),
                        fields.get(8)
                ));
            }
        }

        return rows;
    }

    private boolean isLegacyPlaceholderSubject(String subjectName) {
        if (subjectName == null) {
            return false;
        }
        String normalized = subjectName.trim().toLowerCase(java.util.Locale.ROOT);
        return normalized.equals("môn 1")
                || normalized.equals("môn 2")
                || normalized.equals("môn 3");
    }

    private List<String> readDatasetLines(String resourceName) throws IOException {
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream(resourceName)) {
            if (stream != null) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
                    return reader.lines().toList();
                }
            }
        }

        for (Path candidate : List.of(
                Path.of(resourceName),
                Path.of("../" + resourceName),
                Path.of("../../" + resourceName)
        )) {
            if (Files.exists(candidate)) {
                return Files.readAllLines(candidate, StandardCharsets.UTF_8);
            }
        }

        throw new IOException("Không tìm thấy dataset.csv ở classpath hoặc thư mục chạy ứng dụng");
    }

    private List<String> readDatasetRecords(String resourceName) throws IOException {
        List<String> lines = readDatasetLines(resourceName);
        List<String> records = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (String line : lines) {
            if (current.length() > 0) {
                current.append('\n');
            }
            current.append(line);
            inQuotes = updateQuoteState(line, inQuotes);

            if (!inQuotes) {
                records.add(current.toString());
                current.setLength(0);
            }
        }

        if (current.length() > 0) {
            records.add(current.toString());
        }

        return records;
    }

    private boolean updateQuoteState(String line, boolean inQuotes) {
        boolean state = inQuotes;
        for (int i = 0; i < line.length(); i++) {
            if (line.charAt(i) != '"') {
                continue;
            }

            boolean escapedQuote = state && i + 1 < line.length() && line.charAt(i + 1) == '"';
            if (escapedQuote) {
                i++;
            } else {
                state = !state;
            }
        }
        return state;
    }

    private List<String> parseCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char ch = line.charAt(i);

            if (ch == '"') {
                boolean escapedQuote = inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"';
                if (escapedQuote) {
                    current.append(ch);
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
                continue;
            }

            if (ch == ',' && !inQuotes) {
                fields.add(current.toString().trim());
                current.setLength(0);
                continue;
            }

            current.append(ch);
        }

        fields.add(current.toString().trim());
        return fields;
    }

    private int parseInt(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        return Integer.parseInt(value.trim());
    }

    private double parseDouble(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        return Double.parseDouble(value.trim().replace(",", "."));
    }

    private record AdmissionCsvRow(
            String schoolCode,
            int year,
            String departmentCode,
            String majorName,
            String majorCode,
            int admissionQuota,
            double cutoffScore,
            String subjectCombinations,
            String programType,
            String note
    ) {
        private AdmissionCsvRow withYear(int targetYear) {
            return new AdmissionCsvRow(
                    schoolCode,
                    targetYear,
                    departmentCode,
                    majorName,
                    majorCode,
                    admissionQuota,
                    cutoffScore,
                    subjectCombinations,
                    programType,
                    note
            );
        }
    }

    private void addCoreSubjectToMajor(MajorRepository majorRepository) {
        List<String> coreSubjects = List.of("TOAN", "NGOAI_NGU", "SINH_HOC", "VAT_LI");

        // nganh co mon chung la Toan
        List<String> math = List.of(
                "7140215",
                "7310101",
                "7310101C",
                "7340101",
                "7340101C",
                "7340116",
                "7340301",
                "7440301",
                "7340301",
                "7440301",
                "7480104",
                "7480201",
                "7480201C",
                "7520320",
                "7540101",
                "7540101C",
                "7540101T",
                "7540106",
                "7540105",
                "7549001",
                "7620105",
                "7620105C",
                "7620109",
                "7620112",
                "7620114",
                "7620116",
                "7620201",
                "7620202",
                "7620211",
                "7620301",
                "7640101",
                "7640101T",
                "7850101",
                "7850103",
                "7850103C",
                "7859002",
                "7859007"
        );

        // nganh co mon chung la Anh van
        List<String> english = List.of(
                "7220201"
        );

        // nganh co mon chung la toan va sinh
        List<String> mathBio = List.of(
                "7420201",
                "7420201C"
        );

        // nganh co mon chung la toan va ly
        List<String> mathPhysic = List.of(
                "7510201",
                "7510201C",
                "7510203",
                "7510205",
                "7510206",
                "7510401",
                "7510401C",
                "7519007",
                "7520216"
        );

        Map<String, List<String>> coreSubjectByMajorCode = new LinkedHashMap<>();

        math.forEach(code ->
                coreSubjectByMajorCode.put(code, List.of("TOAN"))
        );

        english.forEach(code ->
                coreSubjectByMajorCode.put(code, List.of("NGOAI_NGU"))
        );

        mathBio.forEach(code ->
                coreSubjectByMajorCode.put(code, List.of("TOAN", "SINH_HOC"))
        );

        mathPhysic.forEach(code ->
                coreSubjectByMajorCode.put(code, List.of("TOAN", "VAT_LI"))
        );

        List<Major> majors = majorRepository.findAll();
        List<Major> majorsToUpdate = new ArrayList<>();
        List<String> majorCodesInDb = new ArrayList<>();

        for (Major major : majors) {
            String majorCode = major.getCode();
            majorCodesInDb.add(majorCode);

            List<String> coreSubject = coreSubjectByMajorCode.get(majorCode);

            if (coreSubject == null) {
                continue;
            }

            major.setCoreSubject(coreSubject);
            majorsToUpdate.add(major);
        }

        if (!majorsToUpdate.isEmpty()) {
            majorRepository.saveAll(majorsToUpdate);
        }

        List<String> configuredMajorCodes = new ArrayList<>(coreSubjectByMajorCode.keySet());

        List<String> missingInConfig = new ArrayList<>(majorCodesInDb);
        missingInConfig.removeAll(configuredMajorCodes);

        List<String> notExistInDb = new ArrayList<>(configuredMajorCodes);
        notExistInDb.removeAll(majorCodesInDb);

        System.out.printf(
                "--- Đã cập nhật coreSubject cho %d/%d ngành trong collection Major ---%n",
                majorsToUpdate.size(),
                majors.size()
        );

        if (missingInConfig.isEmpty()) {
            System.out.println("--- OK: Tất cả ngành trong Major đều đã có cấu hình coreSubject ---");
        } else {
            System.out.println("--- Các ngành có trong Major nhưng chưa có cấu hình coreSubject ---");
            missingInConfig.forEach(code -> System.out.println("Missing in config: " + code));
        }

        if (notExistInDb.isEmpty()) {
            System.out.println("--- OK: Không có mã ngành dư trong list cấu hình ---");
        } else {
            System.out.println("--- Các mã ngành có trong list nhưng không tồn tại trong collection Major ---");
            notExistInDb.forEach(code -> System.out.println("Not exist in DB: " + code));
        }
    }

    private void initNewsArticles(NewsArticleRepository newsArticleRepository) {
        List<NewsArticle> seedArticles = List.of(
                seedNews(
                        "Thông tin Tuyển sinh đại học chính quy và cao đẳng ngành Giáo dục mầm non năm 2026",
                        "Trường Đại học Nông Lâm TP.HCM công bố thông tin tuyển sinh đại học chính quy và cao đẳng ngành Giáo dục mầm non năm 2026.",
                        "Bài viết tổng hợp các thông tin tuyển sinh năm 2026, phục vụ phụ huynh và thí sinh theo dõi đề án, phương thức xét tuyển, ngưỡng đầu vào và các mốc hồ sơ quan trọng. Nội dung hiển thị trong hệ thống là bản tóm tắt, thí sinh cần đối chiếu link nguồn chính thức trước khi nộp hồ sơ.",
                        NewsCategory.ADMISSION_INFO,
                        "https://ts.nlu.edu.vn/ts-44307-1/vn/span-stylecolor-redthong-tin-tuyen-sinh-dai-hoc-chinh-quy-va-cao-dang-nganh-giao-duc-mam-non-nam-2026.html",
                        "https://ts.nlu.edu.vn/imgs/hinh1.jpg",
                        LocalDate.of(2026, 7, 1),
                        1
                ),
                seedNews(
                        "Kết quả trúng tuyển diện tuyển thẳng vào trình độ đại học hệ chính quy năm 2026",
                        "Cập nhật kết quả trúng tuyển diện tuyển thẳng vào trình độ đại học hệ chính quy năm 2026.",
                        "Thông tin dành cho thí sinh thuộc diện tuyển thẳng, ưu tiên xét tuyển và các đối tượng cần theo dõi kết quả trúng tuyển sớm. Hệ thống lưu link nguồn để thí sinh truy cập văn bản chính thức và các phụ lục nếu có.",
                        NewsCategory.ADMISSION_INFO,
                        "https://ts.nlu.edu.vn/ts-44302-1/vn/span-stylecolor-redket-qua-trung-tuyen-dien-tuyen-thang-vao-trinh-do-dai-hoc-he-chinh-quy-nam-2026.html",
                        "https://ts.nlu.edu.vn/imgs/hinh1.jpg",
                        LocalDate.of(2026, 6, 28),
                        2
                ),
                seedNews(
                        "Ngưỡng đảm bảo chất lượng đầu vào năm 2026",
                        "Thông tin điểm sàn các chương trình tuyển sinh đại học và cao đẳng ngành Giáo dục Mầm non năm 2026.",
                        "Ngưỡng đảm bảo chất lượng đầu vào là căn cứ quan trọng để thí sinh điều chỉnh chiến lược đăng ký nguyện vọng. Bài viết trong cẩm nang giúp thí sinh nhanh chóng tiếp cận thông tin, đồng thời dẫn về nguồn chính thức để xem chi tiết từng chương trình.",
                        NewsCategory.ADMISSION_INFO,
                        "https://ts.nlu.edu.vn/ts-44298-1/vn/span-stylecolor-rednguong-dam-bao-chat-luong-dau-vao-diem-san-cac-chuong-trinh-tuyen-sinh-dai-hoc-tuyen-sinh-cao-dang-nganh-giao-duc-mam-non-nam-2026-chinh-quy.html",
                        "https://ts.nlu.edu.vn/imgs/hinh1.jpg",
                        LocalDate.of(2026, 6, 25),
                        3
                ),
                seedNews(
                        "Thông tin Tuyển sinh và hướng nghiệp 2026",
                        "Thông tin Tuyển sinh và Hướng nghiệp Trường Đại học Nông Lâm TP.HCM cho phụ huynh và thí sinh.",
                        "Bài viết giới thiệu nguồn thông tin hướng nghiệp 2026, giúp thí sinh tìm hiểu các ngành đào tạo từ bậc Đại học, Cao đẳng đến Sau đại học. Đây là điểm vào phù hợp cho nhóm thí sinh đang cần tổng quan trước khi chọn ngành.",
                        NewsCategory.CAREER_GUIDANCE,
                        "https://ts.nlu.edu.vn/ts-44093-1/vn/thong-tin-tuyen-sinh-va-huong-nghiep-2026.html",
                        "https://ts.nlu.edu.vn/data/image/hinh%20anh/tuvanhuongnghiep.png",
                        LocalDate.of(2026, 3, 20),
                        10
                ),
                seedNews(
                        "Trắc nghiệm định hướng nghề nghiệp",
                        "Công cụ gợi ý giúp thí sinh khám phá bản thân và định hướng nghề nghiệp phù hợp.",
                        "Nội dung hướng dẫn thí sinh nhận diện sở thích nghề nghiệp, điều kiện cá nhân và khả năng phù hợp với nhóm ngành. Bài viết phù hợp để đặt trong cẩm nang hướng nghiệp chuyên sâu.",
                        NewsCategory.CAREER_GUIDANCE,
                        "https://ts.nlu.edu.vn/ts-31960-1/vn/trac-nghiem-dinh-huong-nghe-nghiep.html",
                        "https://ts.nlu.edu.vn/data/image/hinh%20anh/tuvanhuongnghiep.png",
                        LocalDate.of(2026, 3, 20),
                        11
                ),
                seedNews(
                        "Tuân thủ thứ tự trong hướng nghiệp: Nghề - Ngành - Trường",
                        "Gợi ý cách tiếp cận quá trình hướng nghiệp theo thứ tự nghề, ngành, trường.",
                        "Bài viết nhấn mạnh việc lựa chọn nghề nghiệp nên đi từ hiểu mình và hiểu nghề, sau đó mới chọn ngành đào tạo và môi trường học phù hợp. Đây là nội dung cần thiết cho thí sinh đang phân vân giữa nhiều lựa chọn.",
                        NewsCategory.CAREER_GUIDANCE,
                        "https://ts.nlu.edu.vn/ts-24991-1/vn/tuan-thu-thu-tu-trong-huong-nghiep-nghe-nganh-truong.html",
                        "https://ts.nlu.edu.vn/data/image/hinh%20anh/tuvanhuongnghiep.png",
                        LocalDate.of(2016, 8, 7),
                        12
                ),
                seedNews(
                        "Mùa thi, ăn uống thế nào để học mau, nhớ lâu?",
                        "Điểm tin về chăm sóc sức khỏe mùa thi, giúp thí sinh giữ sức và học tập hiệu quả.",
                        "Bài viết thuộc nhóm điểm tin từ các báo, cung cấp góc nhìn hỗ trợ thí sinh trong giai đoạn ôn thi. Nội dung trong hệ thống là bản tóm tắt có dẫn nguồn chính thức từ trang tuyển sinh.",
                        NewsCategory.PRESS_NEWS,
                        "https://ts.nlu.edu.vn/ts-36641-1/vn/mua-thi-an-uong-the-nao-de-hoc-mau-nho-lau.html",
                        "https://ts.nlu.edu.vn/data/file/TS%202026/z7965480417564_63a9358827303f789382e8fc2e61decc.jpg",
                        LocalDate.of(2026, 1, 15),
                        20
                ),
                seedNews(
                        "ĐH Nông Lâm xét điểm thi năng lực ĐH Quốc gia TP.HCM",
                        "Điểm tin về phương thức xét tuyển bằng điểm thi đánh giá năng lực.",
                        "Bài viết được xếp vào nhóm điểm tin từ các báo, giúp thí sinh theo dõi các kênh xét tuyển ngoài điểm thi tốt nghiệp THPT. Thí sinh nên đọc nguồn chính thức để nắm năm áp dụng và điều kiện cụ thể.",
                        NewsCategory.PRESS_NEWS,
                        "https://ts.nlu.edu.vn/ts-31955-1/vn/dh-nong-lam-xet-diem-thi-nang-luc-dh-quoc-gia-tphcm.html",
                        "https://ts.nlu.edu.vn/data/file/TS%202026/z7965480417564_63a9358827303f789382e8fc2e61decc.jpg",
                        LocalDate.of(2018, 3, 20),
                        21
                )
        );

        List<NewsArticle> articlesToSave = seedArticles.stream()
                .map(seedArticle -> newsArticleRepository.findBySourceUrl(seedArticle.getSourceUrl())
                        .map(existing -> mergeSeedNews(existing, seedArticle))
                        .orElse(seedArticle))
                .toList();

        newsArticleRepository.saveAll(articlesToSave);
        System.out.printf("--- Đã đồng bộ %d bài viết cẩm nang từ nguồn tuyển sinh NLU ---%n", articlesToSave.size());
    }

    private NewsArticle mergeSeedNews(NewsArticle existing, NewsArticle seedArticle) {
        existing.setTitle(seedArticle.getTitle());
        existing.setSummary(seedArticle.getSummary());
        existing.setContent(seedArticle.getContent());
        existing.setCategory(seedArticle.getCategory());
        existing.setStatus(seedArticle.getStatus());
        existing.setImageUrl(seedArticle.getImageUrl());
        existing.setSourceName(seedArticle.getSourceName());
        existing.setPublishedAt(seedArticle.getPublishedAt());
        existing.setDisplayOrder(seedArticle.getDisplayOrder());
        existing.setUpdatedAt(LocalDateTime.now());
        return existing;
    }

    private NewsArticle seedNews(
            String title,
            String summary,
            String content,
            NewsCategory category,
            String sourceUrl,
            String imageUrl,
            LocalDate publishedAt,
            int displayOrder
    ) {
        LocalDateTime now = LocalDateTime.now();
        return NewsArticle.builder()
                .title(title)
                .summary(summary)
                .content(content)
                .category(category)
                .status(NewsStatus.PUBLISHED)
                .imageUrl(imageUrl)
                .sourceUrl(sourceUrl)
                .sourceName("Trang tuyển sinh NLU")
                .publishedAt(publishedAt)
                .views(0)
                .displayOrder(displayOrder)
                .createdAt(now)
                .updatedAt(now)
                .build();
    }
}
