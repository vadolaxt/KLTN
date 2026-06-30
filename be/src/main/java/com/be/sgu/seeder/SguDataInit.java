package com.be.sgu.seeder;

import com.be.sgu.entity.SguAdmissionInfo;
import com.be.sgu.entity.SguMajor;
import com.be.sgu.entity.SguSubject;
import com.be.sgu.entity.SguSubjectCombination;
import com.be.sgu.entity.SguSubCombination;
import com.be.sgu.repository.SguAdmissionInfoRepository;
import com.be.sgu.repository.SguMajorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Configuration
public class SguDataInit {
    private static final int TARGET_YEAR = 2026;

    @Value("${app.seed.reset-sgu:false}")
    boolean resetSguSeed;

    @Bean
    CommandLineRunner initSguDatabase(
            SguMajorRepository majorRepository,
            SguAdmissionInfoRepository admissionInfoRepository
    ) {
        return args -> seedSguData(majorRepository, admissionInfoRepository);
    }

    private void seedSguData(
            SguMajorRepository majorRepository,
            SguAdmissionInfoRepository admissionInfoRepository
    ) throws IOException {
        List<SguCsvRow> rows = loadRows();
        long expectedMajorCount = rows.stream()
                .filter(row -> row.year() == TARGET_YEAR)
                .map(SguCsvRow::majorCode)
                .distinct()
                .count();

        boolean seedIsCurrent = majorRepository.count() == expectedMajorCount
                && admissionInfoRepository.count() == rows.size();
        if (seedIsCurrent && !resetSguSeed) {
            System.out.println("--- Dữ liệu SGU đã tồn tại, bỏ qua seed ---");
            return;
        }

        majorRepository.deleteAll();
        admissionInfoRepository.deleteAll();

        List<SguAdmissionInfo> admissionInfos = rows.stream()
                .map(row -> SguAdmissionInfo.builder()
                        .year(row.year())
                        .majorCode(row.majorCode())
                        .majorName(row.majorName())
                        .admissionQuota(row.admissionQuota())
                        .cutoffScore(row.cutoffScore())
                        .combinationCodes(splitCombinations(row.subjectCombinations()))
                        .programType(row.programType())
                        .note(row.note())
                        .build())
                .toList();
        admissionInfoRepository.saveAll(admissionInfos);

        Map<String, SguMajor> majors = new LinkedHashMap<>();
        for (SguCsvRow row : rows) {
            if (row.year() != TARGET_YEAR) {
                continue;
            }

            SguMajor major = majors.computeIfAbsent(row.majorCode(), code -> SguMajor.builder()
                    .code(code)
                    .name(row.majorName())
                    .schoolCode("SGU")
                    .programType(row.programType())
                    .admissionQuota(row.admissionQuota())
                    .cutoffScore(row.cutoffScore())
                    .combinations(new ArrayList<>())
                    .build());

            String rawCombinations = row.subjectCombinations().trim();
            boolean alreadyExists = major.getCombinations().stream()
                    .anyMatch(item -> item.getCode().equalsIgnoreCase(rawCombinations));
            if (!alreadyExists) {
                major.getCombinations().add(toGroupCombination(rawCombinations));
            }
        }

        majorRepository.saveAll(majors.values());
        System.out.printf(
                "--- Đã seed SGU: %d ngành và %d dòng lịch sử tuyển sinh ---%n",
                majors.size(), admissionInfos.size()
        );
    }

    private SguSubjectCombination toGroupCombination(String rawCombinations) {
        List<String> codes = splitCombinations(rawCombinations);
        List<SguSubCombination> subCombinations = new ArrayList<>();
        for (String code : codes) {
            List<String> subjectNames = SguCombinationCatalog.subjectsFor(code);
            List<SguSubject> subjects = subjectNames.stream()
                    .map(name -> SguSubject.builder().subjectName(name).build())
                    .toList();
            subCombinations.add(SguSubCombination.builder()
                    .code(code)
                    .subjects(subjects)
                    .build());
        }

        List<SguSubject> groupSubjects = subCombinations.isEmpty() ? List.of() : subCombinations.get(0).getSubjects();

        return SguSubjectCombination.builder()
                .code(rawCombinations)
                .name(rawCombinations)
                .subjects(groupSubjects)
                .subCombinations(subCombinations)
                .build();
    }

    private List<String> splitCombinations(String rawValue) {
        if (rawValue == null || rawValue.isBlank()) {
            return List.of();
        }
        return java.util.Arrays.stream(rawValue.split(","))
                .map(String::trim)
                .map(String::toUpperCase)
                .filter(value -> !value.isBlank())
                .distinct()
                .toList();
    }

    private List<SguCsvRow> loadRows() throws IOException {
        List<String> records = readRecords();
        List<SguCsvRow> rows = new ArrayList<>();
        for (int index = 1; index < records.size(); index++) {
            List<String> fields = parseCsvRecord(records.get(index));
            if (fields.size() < 9) {
                continue;
            }
            rows.add(new SguCsvRow(
                    parseInt(fields.get(1)),
                    fields.get(2).trim(),
                    fields.get(3).trim(),
                    parseInt(fields.get(4)),
                    parseDouble(fields.get(5)),
                    fields.get(6),
                    fields.get(7).trim(),
                    fields.get(8).trim()
            ));
        }
        return rows;
    }

    private List<String> readRecords() throws IOException {
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream("dataset_sgu.csv")) {
            if (stream == null) {
                throw new IOException("Không tìm thấy dataset_sgu.csv trong classpath");
            }
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8))) {
                List<String> records = new ArrayList<>();
                StringBuilder current = new StringBuilder();
                boolean quoted = false;
                String line;
                while ((line = reader.readLine()) != null) {
                    if (!current.isEmpty()) {
                        current.append('\n');
                    }
                    current.append(line);
                    quoted = updateQuoteState(line, quoted);
                    if (!quoted) {
                        records.add(current.toString());
                        current.setLength(0);
                    }
                }
                if (!current.isEmpty()) {
                    records.add(current.toString());
                }
                return records;
            }
        }
    }

    private boolean updateQuoteState(String line, boolean quoted) {
        boolean state = quoted;
        for (int index = 0; index < line.length(); index++) {
            if (line.charAt(index) != '"') {
                continue;
            }
            if (state && index + 1 < line.length() && line.charAt(index + 1) == '"') {
                index++;
            } else {
                state = !state;
            }
        }
        return state;
    }

    private List<String> parseCsvRecord(String record) {
        List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean quoted = false;
        for (int index = 0; index < record.length(); index++) {
            char character = record.charAt(index);
            if (character == '"') {
                if (quoted && index + 1 < record.length() && record.charAt(index + 1) == '"') {
                    current.append('"');
                    index++;
                } else {
                    quoted = !quoted;
                }
            } else if (character == ',' && !quoted) {
                fields.add(current.toString());
                current.setLength(0);
            } else {
                current.append(character);
            }
        }
        fields.add(current.toString());
        return fields;
    }

    private int parseInt(String value) {
        try {
            return Integer.parseInt(value.trim());
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }

    private double parseDouble(String value) {
        if (value == null || value.isBlank()) {
            return 0;
        }
        try {
            return Double.parseDouble(value.trim().replace(',', '.'));
        } catch (NumberFormatException ignored) {
            return 0;
        }
    }

    private record SguCsvRow(
            int year,
            String majorCode,
            String majorName,
            int admissionQuota,
            double cutoffScore,
            String subjectCombinations,
            String programType,
            String note
    ) {
    }
}
