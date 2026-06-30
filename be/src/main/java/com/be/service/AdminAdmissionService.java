package com.be.service;

import com.be.dto.request.AdmissionInfoRequest;
import com.be.entity.AdmissionInfo;
import com.be.entity.SubjectCombination;
import com.be.repository.AdmissionInfoRepository;
import com.be.repository.SubjectCombinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class AdminAdmissionService {
    private final AdmissionInfoRepository admissionInfoRepository;
    private final SubjectCombinationRepository subjectCombinationRepository;

    public List<AdmissionInfo> findAll(
            Integer year,
            String departmentCode,
            String majorCode,
            String programType,
            String keyword
    ) {
        String normalizedKeyword = normalize(keyword);
        return admissionInfoRepository.findAll(Sort.by(
                        Sort.Order.desc("year"),
                        Sort.Order.asc("majorCode"),
                        Sort.Order.asc("programType")
                )).stream()
                .filter(item -> year == null || item.getYear() == year)
                .filter(item -> matches(item.getDepartmentCode(), departmentCode))
                .filter(item -> matches(item.getMajorCode(), majorCode))
                .filter(item -> matches(item.getProgramType(), programType))
                .filter(item -> normalizedKeyword.isEmpty()
                        || normalize(item.getMajorName()).contains(normalizedKeyword)
                        || normalize(item.getMajorCode()).contains(normalizedKeyword)
                        || normalize(item.getDepartmentCode()).contains(normalizedKeyword))
                .toList();
    }

    public List<Integer> findYears() {
        return admissionInfoRepository.findAll().stream()
                .map(AdmissionInfo::getYear)
                .distinct()
                .sorted(Comparator.reverseOrder())
                .toList();
    }

    public AdmissionInfo create(AdmissionInfoRequest request) {
        requireCreateFields(request);
        String schoolCode = request.schoolCode().trim().toUpperCase(Locale.ROOT);
        String majorCode = request.majorCode().trim();
        if (admissionInfoRepository.existsByYearAndSchoolCodeAndMajorCodeAndProgramType(
                request.year(), schoolCode, majorCode, request.programType().trim())) {
            throw new IllegalArgumentException("Thông tin tuyển sinh của ngành, năm và chương trình này đã tồn tại");
        }

        AdmissionInfo item = AdmissionInfo.builder()
                .schoolCode(schoolCode)
                .year(request.year())
                .departmentCode(request.departmentCode().trim().toUpperCase(Locale.ROOT))
                .majorName(request.majorName().trim())
                .majorCode(majorCode)
                .admissionQuota(request.admissionQuota())
                .cutoffScore(request.cutoffScore())
                .combinations(resolveCombinations(request.combinationCodes()))
                .programType(request.programType().trim())
                .note(trimToNull(request.note()))
                .build();
        return admissionInfoRepository.save(item);
    }

    public AdmissionInfo update(String id, AdmissionInfoRequest request) {
        AdmissionInfo item = getById(id);

        if (request.schoolCode() != null) item.setSchoolCode(required(request.schoolCode(), "Mã trường").toUpperCase(Locale.ROOT));
        if (request.year() != null) item.setYear(request.year());
        if (request.departmentCode() != null) item.setDepartmentCode(required(request.departmentCode(), "Mã khoa").toUpperCase(Locale.ROOT));
        if (request.majorName() != null) item.setMajorName(required(request.majorName(), "Tên ngành"));
        if (request.majorCode() != null) item.setMajorCode(required(request.majorCode(), "Mã ngành"));
        if (request.admissionQuota() != null) item.setAdmissionQuota(request.admissionQuota());
        if (request.cutoffScore() != null) item.setCutoffScore(request.cutoffScore());
        if (request.combinationCodes() != null) item.setCombinations(resolveCombinations(request.combinationCodes()));
        if (request.programType() != null) item.setProgramType(required(request.programType(), "Chương trình"));
        if (request.note() != null) item.setNote(trimToNull(request.note()));

        boolean duplicate = admissionInfoRepository
                .findByYearAndSchoolCodeAndMajorCodeAndProgramType(
                        item.getYear(), item.getSchoolCode(), item.getMajorCode(), item.getProgramType())
                .filter(existing -> !existing.getId().equals(id))
                .isPresent();
        if (duplicate) {
            throw new IllegalArgumentException("Thông tin tuyển sinh của ngành, năm và chương trình này đã tồn tại");
        }
        return admissionInfoRepository.save(item);
    }

    public void delete(String id) {
        admissionInfoRepository.delete(getById(id));
    }

    private AdmissionInfo getById(String id) {
        return admissionInfoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thông tin tuyển sinh"));
    }

    private List<SubjectCombination> resolveCombinations(List<String> codes) {
        if (codes == null || codes.isEmpty()) {
            throw new IllegalArgumentException("Phải chọn ít nhất một tổ hợp môn");
        }
        return codes.stream()
                .map(code -> required(code, "Mã tổ hợp").toUpperCase(Locale.ROOT))
                .distinct()
                .map(code -> subjectCombinationRepository.findByCode(code)
                        .orElseThrow(() -> new IllegalArgumentException("Tổ hợp môn không tồn tại: " + code)))
                .toList();
    }

    private void requireCreateFields(AdmissionInfoRequest request) {
        required(request.schoolCode(), "Mã trường");
        required(request.departmentCode(), "Mã khoa");
        required(request.majorName(), "Tên ngành");
        required(request.majorCode(), "Mã ngành");
        required(request.programType(), "Chương trình");
        if (request.year() == null || request.admissionQuota() == null || request.cutoffScore() == null) {
            throw new IllegalArgumentException("Năm, chỉ tiêu và điểm chuẩn là bắt buộc");
        }
        if (request.year() < 2000 || request.year() > 2100) throw new IllegalArgumentException("Năm tuyển sinh không hợp lệ");
        if (request.admissionQuota() < 1) throw new IllegalArgumentException("Chỉ tiêu phải lớn hơn 0");
        if (request.cutoffScore() < 0 || request.cutoffScore() > 30) throw new IllegalArgumentException("Điểm chuẩn phải từ 0 đến 30");
    }

    private static String required(String value, String field) {
        if (!StringUtils.hasText(value)) throw new IllegalArgumentException(field + " không được để trống");
        return value.trim();
    }

    private static boolean matches(String value, String expected) {
        return !StringUtils.hasText(expected) || normalize(value).equals(normalize(expected));
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private static String trimToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }
}
