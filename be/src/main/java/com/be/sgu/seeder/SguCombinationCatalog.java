package com.be.sgu.seeder;

import java.util.List;
import java.util.Map;

final class SguCombinationCatalog {
    private SguCombinationCatalog() {
    }

    private static final Map<String, List<String>> SUBJECTS = Map.ofEntries(
            Map.entry("A00", List.of("Toán", "Vật lý", "Hóa học")),
            Map.entry("A01", List.of("Toán", "Vật lý", "Tiếng Anh")),
            Map.entry("A02", List.of("Toán", "Vật lý", "Sinh học")),
            Map.entry("A03", List.of("Toán", "Vật lý", "Lịch sử")),
            Map.entry("A04", List.of("Toán", "Vật lý", "Địa lý")),
            Map.entry("A05", List.of("Toán", "Hóa học", "Lịch sử")),
            Map.entry("A06", List.of("Toán", "Hóa học", "Địa lý")),
            Map.entry("A07", List.of("Toán", "Lịch sử", "Địa lý")),
            Map.entry("B00", List.of("Toán", "Hóa học", "Sinh học")),
            Map.entry("B01", List.of("Toán", "Sinh học", "Lịch sử")),
            Map.entry("B02", List.of("Toán", "Sinh học", "Địa lý")),
            Map.entry("B03", List.of("Toán", "Sinh học", "Ngữ văn")),
            Map.entry("B08", List.of("Toán", "Sinh học", "Tiếng Anh")),
            Map.entry("C00", List.of("Ngữ văn", "Lịch sử", "Địa lý")),
            Map.entry("C01", List.of("Ngữ văn", "Toán", "Vật lý")),
            Map.entry("C02", List.of("Ngữ văn", "Toán", "Hóa học")),
            Map.entry("C03", List.of("Ngữ văn", "Toán", "Lịch sử")),
            Map.entry("C04", List.of("Ngữ văn", "Toán", "Địa lý")),
            Map.entry("C05", List.of("Ngữ văn", "Vật lý", "Hóa học")),
            Map.entry("C06", List.of("Ngữ văn", "Vật lý", "Sinh học")),
            Map.entry("C07", List.of("Ngữ văn", "Vật lý", "Lịch sử")),
            Map.entry("C08", List.of("Ngữ văn", "Hóa học", "Sinh học")),
            Map.entry("C09", List.of("Ngữ văn", "Vật lý", "Địa lý")),
            Map.entry("C10", List.of("Ngữ văn", "Hóa học", "Lịch sử")),
            Map.entry("C11", List.of("Ngữ văn", "Hóa học", "Địa lý")),
            Map.entry("C12", List.of("Ngữ văn", "Sinh học", "Lịch sử")),
            Map.entry("C13", List.of("Ngữ văn", "Sinh học", "Địa lý")),
            Map.entry("D01", List.of("Toán", "Ngữ văn", "Tiếng Anh")),
            Map.entry("D07", List.of("Toán", "Hóa học", "Tiếng Anh")),
            Map.entry("D09", List.of("Toán", "Lịch sử", "Tiếng Anh")),
            Map.entry("D10", List.of("Toán", "Địa lý", "Tiếng Anh")),
            Map.entry("D11", List.of("Ngữ văn", "Vật lý", "Tiếng Anh")),
            Map.entry("D12", List.of("Ngữ văn", "Hóa học", "Tiếng Anh")),
            Map.entry("D13", List.of("Ngữ văn", "Sinh học", "Tiếng Anh")),
            Map.entry("D14", List.of("Ngữ văn", "Lịch sử", "Tiếng Anh")),
            Map.entry("D15", List.of("Ngữ văn", "Địa lý", "Tiếng Anh")),
            Map.entry("X01", List.of("Toán", "Ngữ văn", "Giáo dục KT&PL")),
            Map.entry("X02", List.of("Toán", "Ngữ văn", "Tin học")),
            Map.entry("X03", List.of("Toán", "Ngữ văn", "Công nghệ công nghiệp")),
            Map.entry("X04", List.of("Toán", "Ngữ văn", "Công nghệ nông nghiệp")),
            Map.entry("X05", List.of("Toán", "Vật lý", "Giáo dục KT&PL")),
            Map.entry("X06", List.of("Toán", "Vật lý", "Tin học")),
            Map.entry("X07", List.of("Toán", "Vật lý", "Công nghệ công nghiệp")),
            Map.entry("X08", List.of("Toán", "Vật lý", "Công nghệ nông nghiệp")),
            Map.entry("X09", List.of("Toán", "Hóa học", "Giáo dục KT&PL")),
            Map.entry("X10", List.of("Toán", "Hóa học", "Tin học")),
            Map.entry("X11", List.of("Toán", "Hóa học", "Công nghệ công nghiệp")),
            Map.entry("X12", List.of("Toán", "Hóa học", "Công nghệ nông nghiệp")),
            Map.entry("X13", List.of("Toán", "Sinh học", "Giáo dục KT&PL")),
            Map.entry("X14", List.of("Toán", "Sinh học", "Tin học")),
            Map.entry("X15", List.of("Toán", "Sinh học", "Công nghệ công nghiệp")),
            Map.entry("X16", List.of("Toán", "Sinh học", "Công nghệ nông nghiệp")),
            Map.entry("X17", List.of("Toán", "Địa lý", "Giáo dục KT&PL")),
            Map.entry("X18", List.of("Toán", "Địa lý", "Tin học")),
            Map.entry("X19", List.of("Toán", "Địa lý", "Công nghệ công nghiệp")),
            Map.entry("X20", List.of("Toán", "Địa lý", "Công nghệ nông nghiệp")),
            Map.entry("X21", List.of("Toán", "Lịch sử", "Giáo dục KT&PL")),
            Map.entry("X22", List.of("Toán", "Lịch sử", "Tin học")),
            Map.entry("X23", List.of("Toán", "Lịch sử", "Công nghệ công nghiệp")),
            Map.entry("X24", List.of("Toán", "Lịch sử", "Công nghệ nông nghiệp")),
            Map.entry("X25", List.of("Toán", "Giáo dục KT&PL", "Tiếng Anh")),
            Map.entry("X26", List.of("Toán", "Tin học", "Tiếng Anh")),
            Map.entry("X27", List.of("Toán", "Công nghệ công nghiệp", "Tiếng Anh")),
                Map.entry("X28", List.of("Toán", "Công nghệ nông nghiệp", "Tiếng Anh")),
                Map.entry("X53", List.of("Toán", "Giáo dục KT&PL", "Tin học")),
                Map.entry("X54", List.of("Toán", "Giáo dục KT&PL", "Công nghệ công nghiệp")),
                Map.entry("X55", List.of("Toán", "Giáo dục KT&PL", "Công nghệ nông nghiệp")),
                Map.entry("X56", List.of("Toán", "Tin học", "Công nghệ công nghiệp")),
                Map.entry("X57", List.of("Toán", "Tin học", "Công nghệ nông nghiệp")),
                Map.entry("X78", List.of("Ngữ văn", "Giáo dục KT&PL", "Tiếng Anh")),
                Map.entry("X79", List.of("Ngữ văn", "Tiếng Anh", "Tin học")),
                Map.entry("X80", List.of("Ngữ văn", "Tiếng Anh", "Công nghệ công nghiệp")),
                Map.entry("X81", List.of("Ngữ văn", "Tiếng Anh", "Công nghệ nông nghiệp"))
    );

    static List<String> subjectsFor(String combinationCode) {
        return SUBJECTS.getOrDefault(
                combinationCode,
                List.of("Điểm thành phần 1", "Điểm thành phần 2", "Điểm thành phần 3")
        );
    }
}
