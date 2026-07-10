package com.be.service;

import com.be.dto.response.AdminDashboardResponse;
import com.be.entity.AdmissionInfo;
import com.be.repository.AdmissionInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService {
    private static final String DEFAULT_SCHOOL_CODE = "NLU";

    private final AdmissionInfoRepository admissionInfoRepository;

    public AdminDashboardResponse getDashboard(String schoolCode, Integer year) {
        String normalizedSchoolCode = schoolCode == null || schoolCode.isBlank()
                ? DEFAULT_SCHOOL_CODE
                : schoolCode.trim().toUpperCase();

        List<AdmissionInfo> allItems = admissionInfoRepository.findAll().stream()
                .filter(item -> normalizedSchoolCode.equalsIgnoreCase(item.getSchoolCode()))
                .toList();
        Integer latestYear = allItems.stream()
                .map(AdmissionInfo::getYear)
                .max(Integer::compareTo)
                .orElse(null);
        int selectedYear = year != null && year > 0 ? year : latestYear == null ? 0 : latestYear;
        List<AdmissionInfo> items = selectedYear > 0
                ? allItems.stream().filter(item -> item.getYear() == selectedYear).toList()
                : allItems;

        List<Double> cutoffScores = items.stream()
                .map(AdmissionInfo::getCutoffScore)
                .filter(score -> score > 0)
                .toList();

        return AdminDashboardResponse.builder()
                .totalMajors(items.stream().map(AdmissionInfo::getMajorCode).filter(Objects::nonNull).distinct().count())
                .totalDepartments(items.stream().map(this::safeDepartment).distinct().count())
                .totalQuota(items.stream().mapToLong(AdmissionInfo::getAdmissionQuota).sum())
                .totalAdmissionRecords(items.size())
                .averageCutoffScore(cutoffScores.isEmpty() ? null : round(cutoffScores.stream().mapToDouble(Double::doubleValue).average().orElse(0)))
                .highestCutoffScore(cutoffScores.isEmpty() ? null : round(cutoffScores.stream().mapToDouble(Double::doubleValue).max().orElse(0)))
                .lowestCutoffScore(cutoffScores.isEmpty() ? null : round(cutoffScores.stream().mapToDouble(Double::doubleValue).min().orElse(0)))
                .latestYear(selectedYear > 0 ? selectedYear : latestYear)
                .quotaByDepartment(sumBy(items, this::safeDepartment, AdmissionInfo::getAdmissionQuota))
                .majorsByDepartment(countDistinctMajorBy(items, this::safeDepartment))
                .majorsByProgramType(countDistinctMajorBy(items, item -> blankToDefault(item.getProgramType(), "Chưa phân loại")))
                .quotaByYear(sumBy(allItems, item -> String.valueOf(item.getYear()), AdmissionInfo::getAdmissionQuota))
                .build();
    }

    private List<AdminDashboardResponse.ChartPoint> sumBy(
            List<AdmissionInfo> items,
            Function<AdmissionInfo, String> classifier,
            Function<AdmissionInfo, Integer> valueExtractor) {
        Map<String, Long> values = items.stream()
                .collect(Collectors.groupingBy(classifier, LinkedHashMap::new,
                        Collectors.summingLong(item -> Math.max(valueExtractor.apply(item), 0))));
        return toSortedChartPoints(values);
    }

    private List<AdminDashboardResponse.ChartPoint> countDistinctMajorBy(
            List<AdmissionInfo> items,
            Function<AdmissionInfo, String> classifier) {
        Map<String, Long> values = items.stream()
                .collect(Collectors.groupingBy(classifier, LinkedHashMap::new,
                        Collectors.mapping(AdmissionInfo::getMajorCode,
                                Collectors.collectingAndThen(Collectors.toSet(), set -> (long) set.size()))));
        return toSortedChartPoints(values);
    }

    private List<AdminDashboardResponse.ChartPoint> toSortedChartPoints(Map<String, Long> values) {
        return values.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()))
                .map(entry -> new AdminDashboardResponse.ChartPoint(entry.getKey(), entry.getValue()))
                .toList();
    }

    private String safeDepartment(AdmissionInfo item) {
        return blankToDefault(item.getDepartmentCode(), "Chưa có khoa");
    }

    private String blankToDefault(String value, String defaultValue) {
        return value == null || value.isBlank() ? defaultValue : value.trim();
    }

    private Double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
