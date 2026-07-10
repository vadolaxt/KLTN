package com.be.dto.response;

import lombok.Builder;

import java.util.List;

@Builder
public record AdminDashboardResponse(
        long totalMajors,
        long totalDepartments,
        long totalQuota,
        long totalAdmissionRecords,
        Double averageCutoffScore,
        Double highestCutoffScore,
        Double lowestCutoffScore,
        Integer latestYear,
        List<ChartPoint> quotaByDepartment,
        List<ChartPoint> majorsByDepartment,
        List<ChartPoint> majorsByProgramType,
        List<ChartPoint> quotaByYear
) {
    public record ChartPoint(String label, long count) {
    }
}
