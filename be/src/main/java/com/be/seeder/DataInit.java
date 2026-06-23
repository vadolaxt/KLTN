package com.be.seeder;

import com.be.entity.AdmissionInfo;
import com.be.entity.Major;
import com.be.entity.Subject;
import com.be.entity.SubjectCombination;
import com.be.entity.User;
import com.be.enums.Role;
import com.be.repository.AdmissionInfoRepository;
import com.be.repository.MajorRepository;
import com.be.repository.SubjectCombinationRepository;
import com.be.repository.SubjectRepository;
import com.be.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
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
            AdmissionInfoRepository admissionInfoRepository
    ) {
        return args -> {
            System.out.println("--- Bắt đầu kiểm tra và khởi tạo dữ liệu mẫu ---");

            if (userRepository.count() == 0) {
                initSampleUsers(userRepository);
            } else {
                System.out.println("--- Dữ liệu Users đã tồn tại, bỏ qua ---");
            }

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

            addCoreSubjectToMajor(majorRepository);
        };
    }

    private void initSampleUsers(UserRepository userRepository) {
        System.out.println("--- Đang khởi tạo dữ liệu mẫu cho Users ---");
        PasswordEncoder encoder = new BCryptPasswordEncoder();

        User user1 = new User();
        user1.setLastName("Nguyen Van A");
        user1.setEmail("a@gmail.com");
        user1.setPassword(encoder.encode("123456"));
        user1.setRole(Role.USER);

        User user2 = new User();
        user2.setLastName("Admin Hệ Thống");
        user2.setEmail("admin@be.com");
        user2.setPassword(encoder.encode("123456"));
        user2.setRole(Role.ADMIN);

        userRepository.save(user1);
        userRepository.save(user2);
        System.out.println("--- Đã thêm các User mẫu thành công! ---");
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

        long majorCount = majorRepository.count();
        long subjectCount = subjectRepository.count();
        long combinationCount = subjectCombinationRepository.count();
        long admissionInfoCount = admissionInfoRepository.count();
        boolean admissionSeedExists = majorCount > 0
                && subjectCount > 0
                && combinationCount > 0
                && admissionInfoCount > 0;

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

        List<AdmissionCsvRow> sourceRows = loadDatasetRows();
        List<AdmissionCsvRow> rowsFor2026 = sourceRows.stream()
                .filter(row -> row.year() == SOURCE_YEAR_FOR_2026)
                .map(row -> row.withYear(DEFAULT_TARGET_YEAR))
                .toList();

        List<AdmissionCsvRow> allRows = new ArrayList<>(sourceRows);
        allRows.addAll(rowsFor2026);

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

            majors.put(row.majorCode(), Major.builder()
                    .schoolCode(row.schoolCode())
                    .departmentCode(row.departmentCode())
                    .code(row.majorCode())
                    .name(row.majorName())
                    .programType(row.programType())
                    .admissionQuota(row.admissionQuota())
                    .cutoffScore(row.cutoffScore())
                    .combinations(combinations)
                    .build());
        }

        majorRepository.saveAll(majors.values());
        System.out.printf(
                "--- Đã gieo %d ngành năm %d và %d dòng thông tin tuyển sinh (%d-%d, %d dùng dữ liệu %d) ---%n",
                majors.size(),
                DEFAULT_TARGET_YEAR,
                admissionInfos.size(),
                sourceRows.stream().mapToInt(AdmissionCsvRow::year).min().orElse(SOURCE_YEAR_FOR_2026),
                SOURCE_YEAR_FOR_2026,
                DEFAULT_TARGET_YEAR,
                SOURCE_YEAR_FOR_2026
        );
    }

    private List<SubjectCombination> resolveCombinations(
            String rawCombinations,
            Map<String, Subject> subjectCache,
            Map<String, SubjectCombination> combinationCache,
            SubjectRepository subjectRepository,
            SubjectCombinationRepository subjectCombinationRepository
    ) {
        List<SubjectCombination> combinations = new ArrayList<>();

        for (String rawCode : rawCombinations.split(",")) {
            String code = rawCode.trim();
            if (code.isEmpty()) {
                continue;
            }

            List<String> subjectNames = BLOCK_MAP.get(code);
            if (subjectNames == null) {
                subjectNames = List.of("Môn 1", "Môn 2", "Môn 3");
                System.out.printf("--- Cảnh báo: chưa có ánh xạ môn cho tổ hợp %s ---%n", code);
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
        List<String> lines = readDatasetLines();
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
            if (fields.size() < 10) {
                System.out.printf("--- Bỏ qua dòng dataset không hợp lệ: %s ---%n", line);
                continue;
            }

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
        }

        return rows;
    }

    private List<String> readDatasetLines() throws IOException {
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream("dataset.csv")) {
            if (stream != null) {
                try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
                    return reader.lines().toList();
                }
            }
        }

        for (Path candidate : List.of(
                Path.of("dataset.csv"),
                Path.of("../dataset.csv"),
                Path.of("../../dataset.csv")
        )) {
            if (Files.exists(candidate)) {
                return Files.readAllLines(candidate, StandardCharsets.UTF_8);
            }
        }

        throw new IOException("Không tìm thấy dataset.csv ở classpath hoặc thư mục chạy ứng dụng");
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
}
