'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiClient } from '@/lib/constants/api-client';
import type { AdmissionMethod, Major, PredictionResultState, SchoolCode } from '../types';

interface ApiResponse<T> {
  data: T;
  message: string;
  status: string;
}

interface PredictResponse {
  result: PredictionResultState['result'];
}

interface PredictionInputPanelProps {
  schoolCode: SchoolCode;
  onResult: (result: PredictionResultState) => void;
}

const TARGET_YEAR = 2026;

const SCHOOL_LABEL: Record<SchoolCode, string> = {
  NLU: 'Trường Đại học Nông Lâm TP.HCM',
  SGU: 'Trường Đại học Sài Gòn',
};

const NLU_METHODS: Array<{ value: AdmissionMethod; label: string; detail: string }> = [
  { value: 'hb', label: 'Học bạ THPT', detail: '3 môn tổ hợp' },
  { value: 'thpt', label: 'Thi THPT Quốc gia', detail: '3 môn tổ hợp' },
  { value: 'dgnl', label: 'Đánh giá năng lực', detail: 'Quy đổi thang 30' },
  { value: 'kh', label: 'Kết hợp THPT & Học bạ', detail: '2 môn THPT + 1 môn học bạ' },
];

const SGU_METHODS: Array<{ value: AdmissionMethod; label: string; detail: string }> = [
  { value: 'dgnl', label: 'ĐGNL ĐHQG TP.HCM', detail: 'Quy đổi thang 30' },
  { value: 'vsat', label: 'V-SAT', detail: 'Quy đổi từ thang 150' },
  { value: 'thpt', label: 'Thi THPT Quốc gia', detail: '3 môn tổ hợp' },
];

const METHOD_LABEL: Record<AdmissionMethod, string> = {
  hb: 'Học bạ THPT',
  thpt: 'Thi THPT Quốc gia',
  dgnl: 'Đánh giá năng lực',
  kh: 'Kết hợp THPT và Học bạ (2 THPT + 1 học bạ)',
  vsat: 'V-SAT',
};

const VSAT_CONVERSION_SEGMENTS = [
  { min: 132, max: 150, outMin: 8.5, outMax: 10 },
  { min: 128.5, max: 132, outMin: 8.1, outMax: 8.5 },
  { min: 122.5, max: 128.5, outMin: 7.75, outMax: 8.1 },
  { min: 114.5, max: 122.5, outMin: 7, outMax: 7.75 },
  { min: 108, max: 114.5, outMin: 6.6, outMax: 7 },
  { min: 102.5, max: 108, outMin: 6.25, outMax: 6.6 },
  { min: 97, max: 102.5, outMin: 6, outMax: 6.25 },
  { min: 91, max: 97, outMin: 5.6, outMax: 6 },
  { min: 85, max: 91, outMin: 5.25, outMax: 5.6 },
  { min: 77, max: 85, outMin: 5, outMax: 5.25 },
  { min: 68, max: 77, outMin: 4.5, outMax: 5 },
  { min: 6, max: 68, outMin: 1.5, outMax: 4.5 },
];

const PRIORITY_AREAS = [
  { value: 'KV1', label: 'KV1', score: 0.75 },
  { value: 'KV2', label: 'KV2', score: 0.25 },
  { value: 'KV2-NT', label: 'KV2-NT', score: 0.5 },
  { value: 'KV3', label: 'KV3', score: 0 },
];

const PRIORITY_GROUPS = [
  { value: 'NONE', label: 'Không thuộc đối tượng ưu tiên', score: 0 },
  { value: 'UT1', label: 'Nhóm 01', score: 2 },
  { value: 'UT2', label: 'Nhóm 02', score: 1 },
];

const convertVsatToThptScore = (rawScore: number) => {
  if (!Number.isFinite(rawScore) || rawScore <= 0) {
    return 0;
  }

  const score = Math.min(Math.max(rawScore, 6), 150);
  const segment = VSAT_CONVERSION_SEGMENTS.find((item) => score >= item.min && score <= item.max)
    ?? VSAT_CONVERSION_SEGMENTS[VSAT_CONVERSION_SEGMENTS.length - 1];
  const ratio = (score - segment.min) / (segment.max - segment.min);
  return Number((segment.outMin + ratio * (segment.outMax - segment.outMin)).toFixed(2));
};

const isSguTeacherMajor = (schoolCode: SchoolCode, major?: Major) => schoolCode === 'SGU' && major?.code?.startsWith('714');

const getAvailableMethods = (schoolCode: SchoolCode, major?: Major) => {
  if (schoolCode === 'NLU') {
    return NLU_METHODS;
  }

  return isSguTeacherMajor(schoolCode, major)
    ? SGU_METHODS.filter((item) => item.value === 'thpt')
    : SGU_METHODS;
};

const getDefaultMethod = (schoolCode: SchoolCode, major?: Major) => getAvailableMethods(schoolCode, major)[0]?.value ?? 'thpt';

const scoreInputClass =
  'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3 py-2.5 text-center text-[18px] font-extrabold text-green-main outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]';

const selectClass =
  'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3.5 py-2.5 text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]';

const labelClass = 'text-[12px] font-bold uppercase tracking-[0.6px] text-text-mid';

const formatCombinedThptLabel = (subjectName: string) => {
  const normalizedSubject = subjectName.trim().toLocaleLowerCase('vi-VN');

  if (normalizedSubject === 'toán') {
    return 'THPT + Toán';
  }

  if (normalizedSubject === 'ngữ văn' || normalizedSubject === 'văn') {
    return 'THPT + Văn';
  }

  return 'THPT';
};

const normalizeSubjectName = (subjectName: string) =>
  subjectName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('vi-VN')
    .trim();

const isRestrictedTranscriptSubject = (subjectName: string) => {
  const normalizedSubject = normalizeSubjectName(subjectName);
  return normalizedSubject === 'toan' || normalizedSubject === 'ngu van' || normalizedSubject === 'van';
};

const parseScore = (value: string) => Number(value.replace(',', '.'));

const calculatePriorityScore = (baseScore: number, rawPriorityScore: number) => {
  if (!Number.isFinite(baseScore) || !Number.isFinite(rawPriorityScore) || rawPriorityScore <= 0) {
    return 0;
  }

  const priorityScore = baseScore >= 22.5
    ? ((30 - Math.min(baseScore, 30)) / 7.5) * rawPriorityScore
    : rawPriorityScore;

  return Number(Math.max(0, priorityScore).toFixed(2));
};
const normalizeNumericInput = (value: string, max?: number) => {
  const cleaned = value.replace(',', '.').replace(/[^\d.]/g, '');
  if (cleaned === '') {
    return '';
  }

  const hasTrailingDot = cleaned.endsWith('.') && cleaned.indexOf('.') === cleaned.length - 1;
  const [rawInteger, rawFraction = ''] = cleaned.split('.');
  const integerPart = rawInteger.replace(/^0+(?=\d)/, '');
  const fractionPart = rawFraction.slice(0, 2);
  const normalized = hasTrailingDot ? `${integerPart}.` : fractionPart ? `${integerPart}.${fractionPart}` : integerPart;
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return '';
  }

  if (typeof max === 'number' && Number.isFinite(max) && parsed > max) {
    return max.toFixed(2);
  }

  return normalized;
};

const isScoreAboveTen = (score: string) => {
  const parsedScore = parseScore(score);
  return Number.isFinite(parsedScore) && parsedScore > 10;
};

export default function PredictionInputPanel({ schoolCode, onResult }: PredictionInputPanelProps) {
  const [method, setMethod] = useState<AdmissionMethod>('hb');
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajorCode, setSelectedMajorCode] = useState('');
  const [selectedCombinationCode, setSelectedCombinationCode] = useState('');
  const [selectedSubCombinationCode, setSelectedSubCombinationCode] = useState('');
  const [priorityArea, setPriorityArea] = useState('KV3');
  const [priorityGroup, setPriorityGroup] = useState('NONE');
  const [subjectScores, setSubjectScores] = useState<string[]>(['', '', '']);
  const [dgnlProvider, setDgnlProvider] = useState<'hcm' | 'hn'>('hcm');
  const [dgnlScore, setDgnlScore] = useState('');
  const [combinedThptScores, setCombinedThptScores] = useState<Record<string, string>>({});
  const [combinedTranscriptScores, setCombinedTranscriptScores] = useState<Record<string, string>>({});
  const [loadingMajors, setLoadingMajors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadMajors = async () => {
      try {
        setLoadingMajors(true);
        setError('');
        const majorsEndpoint = schoolCode === 'SGU' ? '/predict/sgu/majors' : '/predict/majors';
        const response = await apiClient.get<ApiResponse<Major[]>>(majorsEndpoint, {
          params: schoolCode === 'NLU' ? { schoolCode } : undefined,
          headers: { 'X-Skip-Auth': 'true' },
        });
        const loadedMajors = response.data.data ?? [];

        if (!active) {
          return;
        }

        setMajors(loadedMajors);
        const firstMajor = loadedMajors[0];
        setMethod(getDefaultMethod(schoolCode, firstMajor));
        setSelectedMajorCode(firstMajor?.code ?? '');
        const firstCombo = firstMajor?.combinations?.[0];
        setSelectedCombinationCode(firstCombo?.code ?? '');
        const firstSubCombo = firstCombo?.subCombinations?.[0];
        setSelectedSubCombinationCode(firstSubCombo?.code ?? firstCombo?.code ?? '');
        const subjectsCount = firstSubCombo?.subjects?.length ?? firstCombo?.subjects?.length ?? 3;
        setSubjectScores(Array(Math.max(subjectsCount, 3)).fill(''));
        setCombinedThptScores({});
        setCombinedTranscriptScores({});
      } catch (loadError) {
        if (!active) {
          return;
        }
        setError(loadError instanceof Error ? loadError.message : 'Không tải được danh sách ngành.');
      } finally {
        if (active) {
          setLoadingMajors(false);
        }
      }
    };

    loadMajors();

    return () => {
      active = false;
    };
  }, [schoolCode]);

  const selectedMajor = useMemo(
    () => majors.find((major) => major.code === selectedMajorCode),
    [majors, selectedMajorCode],
  );

  const availableMethods = useMemo(
    () => getAvailableMethods(schoolCode, selectedMajor),
    [schoolCode, selectedMajor],
  );

  const selectedCombination = useMemo(
    () => selectedMajor?.combinations?.find((combination) => combination.code === selectedCombinationCode),
    [selectedMajor, selectedCombinationCode],
  );

  const selectedSubCombination = useMemo(() => {
    // For SGU: search across all combination groups
    if (schoolCode === 'SGU') {
      for (const combo of (selectedMajor?.combinations ?? [])) {
        const found = combo.subCombinations?.find((sub) => sub.code === selectedSubCombinationCode);
        if (found) return found;
      }
      return null;
    }
    if (!selectedCombination?.subCombinations) return null;
    return selectedCombination.subCombinations.find((sub) => sub.code === selectedSubCombinationCode) ?? null;
  }, [schoolCode, selectedMajor, selectedCombination, selectedSubCombinationCode]);

  const subjectLabels = useMemo(() => {
    if (schoolCode === 'SGU' && selectedSubCombination) {
      return selectedSubCombination.subjects.map((subject) => subject.subjectName);
    }
    return selectedCombination?.subjects?.map((subject) => subject.subjectName) ?? [];
  }, [schoolCode, selectedCombination, selectedSubCombination]);

  /* const oldSubjectLabels = useMemo(
    () => selectedCombination?.subjects?.map((subject) => subject.subjectName) ?? [],
    [selectedCombination],
  ); */

  const transcriptSubjects = useMemo(
    () => subjectLabels.filter((subject) => !isRestrictedTranscriptSubject(subject)),
    [subjectLabels],
  );

  const hocBaSubject = useMemo(() => {
    const scoredTranscriptSubjects = transcriptSubjects
      .map((subject) => ({
        subject,
        score: parseScore(combinedTranscriptScores[subject] ?? ''),
      }))
      .filter((item) => Number.isFinite(item.score));

    if (!scoredTranscriptSubjects.length) {
      return transcriptSubjects[0] ?? '';
    }

    return scoredTranscriptSubjects.reduce((bestSubject, currentSubject) =>
      currentSubject.score > bestSubject.score ? currentSubject : bestSubject,
    ).subject;
  }, [combinedTranscriptScores, transcriptSubjects]);

  const hocBaScore = combinedTranscriptScores[hocBaSubject] ?? '';

  const thptSubjects = useMemo(() => {
    if (!hocBaSubject) {
      return [];
    }

    return subjectLabels.filter((subject) => subject !== hocBaSubject).slice(0, 2);
  }, [hocBaSubject, subjectLabels]);

  const resetEnteredScores = (nextSubjectCount = subjectLabels.length) => {
    setSubjectScores(Array(Math.max(nextSubjectCount, 3)).fill(''));
    setCombinedThptScores({});
    setCombinedTranscriptScores({});
  };

  const dgnlMaxScore = 1200;
  const parsedDgnlScore = parseScore(dgnlScore);
  const convertedDgnlScore = Number.isFinite(parsedDgnlScore)
    ? Math.min((parsedDgnlScore / dgnlMaxScore) * 30, 30)
    : 0;

  const parsedHocBaScore = parseScore(hocBaScore);
  const parsedThptScores = thptSubjects.map((subject) => parseScore(combinedThptScores[subject] ?? ''));
  const combinedScore = parsedThptScores.length === 2
    && parsedThptScores.every((score) => Number.isFinite(score))
    && Number.isFinite(parsedHocBaScore)
    ? parsedThptScores[0] + parsedThptScores[1] + parsedHocBaScore
    : 0;

  const subjectTotal = subjectScores
    .slice(0, subjectLabels.length || 3)
    .reduce((total, score) => {
      const parsedScore = parseScore(score);
      if (!Number.isFinite(parsedScore)) {
        return total;
      }

      return total + (method === 'vsat' ? convertVsatToThptScore(parsedScore) : parsedScore);
    }, 0);

  const displayScore = method === 'dgnl'
    ? convertedDgnlScore
    : method === 'kh'
      ? combinedScore
      : subjectTotal;

  const admissionBaseScore = displayScore;

  const rawPriorityScore = useMemo(() => {
    const areaScore = PRIORITY_AREAS.find((item) => item.value === priorityArea)?.score ?? 0;
    const groupScore = PRIORITY_GROUPS.find((item) => item.value === priorityGroup)?.score ?? 0;
    return areaScore + groupScore;
  }, [priorityArea, priorityGroup]);

  const priorityScore = useMemo(
    () => calculatePriorityScore(admissionBaseScore, rawPriorityScore),
    [admissionBaseScore, rawPriorityScore],
  );

  const scoreWithPriority = admissionBaseScore + priorityScore;
  const finalScore = Number((
    method === 'hb'
      ? scoreWithPriority / 1.125
      : Math.min(scoreWithPriority, 30)
  ).toFixed(2));

  const updateSubjectScore = (index: number, value: string) => {
    const normalized = normalizeNumericInput(value, method === 'vsat' ? 150 : undefined);
    setSubjectScores((current) => {
      const next = [...current];
      next[index] = normalized;
      return next;
    });
  };

  const updateCombinedThptScore = (subject: string, value: string) => {
    const normalized = normalizeNumericInput(value);
    setCombinedThptScores((current) => ({
      ...current,
      [subject]: normalized,
    }));
  };

  const updateCombinedTranscriptScore = (subject: string, value: string) => {
    const normalized = normalizeNumericInput(value);
    setCombinedTranscriptScores((current) => ({
      ...current,
      [subject]: normalized,
    }));
  };

  const handleMajorChange = (majorCode: string) => {
    const nextMajor = majors.find((major) => major.code === majorCode);
    const nextMethods = getAvailableMethods(schoolCode, nextMajor);
    setSelectedMajorCode(majorCode);
    const nextCombo = nextMajor?.combinations?.[0];
    setSelectedCombinationCode(nextCombo?.code ?? '');
    const nextSubCombo = nextCombo?.subCombinations?.[0];
    setSelectedSubCombinationCode(nextSubCombo?.code ?? nextCombo?.code ?? '');
    if (!nextMethods.some((item) => item.value === method)) {
      setMethod(nextMethods[0]?.value ?? 'thpt');
    }
    const subjectsCount = nextSubCombo?.subjects?.length ?? nextCombo?.subjects?.length ?? 3;
    resetEnteredScores(subjectsCount);
  };

  const handleCombinationChange = (combinationCode: string) => {
    const nextCombination = selectedMajor?.combinations?.find((combination) => combination.code === combinationCode);
    setSelectedCombinationCode(combinationCode);
    const nextSubCombo = nextCombination?.subCombinations?.[0];
    setSelectedSubCombinationCode(nextSubCombo?.code ?? nextCombination?.code ?? '');
    const subjectsCount = nextSubCombo?.subjects?.length ?? nextCombination?.subjects?.length ?? 3;
    resetEnteredScores(subjectsCount);
  };

  const handleSubCombinationChange = (subComboCode: string) => {
    setSelectedSubCombinationCode(subComboCode);
    // Find which combination group owns this sub-combination and update parent
    const ownerGroup = selectedMajor?.combinations?.find((combo) =>
      combo.subCombinations?.some((sub) => sub.code === subComboCode)
    );
    if (ownerGroup) {
      setSelectedCombinationCode(ownerGroup.code);
    }
    const nextSubCombo = ownerGroup?.subCombinations?.find((sub) => sub.code === subComboCode);
    resetEnteredScores(nextSubCombo?.subjects?.length ?? 3);
  };

  /* const oldHandleMajorChange = (majorCode: string) => {
    const nextMajor = majors.find((major) => major.code === majorCode);
    const nextMethods = getAvailableMethods(schoolCode, nextMajor);
    setSelectedMajorCode(majorCode);
    setSelectedCombinationCode(nextMajor?.combinations?.[0]?.code ?? '');
    if (!nextMethods.some((item) => item.value === method)) {
      setMethod(nextMethods[0]?.value ?? 'thpt');
    }
    resetEnteredScores(nextMajor?.combinations?.[0]?.subjects?.length ?? 3);
  };

  const handleCombinationChange = (combinationCode: string) => {
    const nextCombination = selectedMajor?.combinations?.find((combination) => combination.code === combinationCode);
    setSelectedCombinationCode(combinationCode);
    resetEnteredScores(nextCombination?.subjects?.length ?? 3);
  }; */

  const handleMethodChange = (nextMethod: AdmissionMethod) => {
    setMethod(nextMethod);
    resetEnteredScores();
  };

  const validateScores = () => {
    if (!selectedMajor || !selectedCombination) {
      return 'Vui lòng chọn ngành và tổ hợp xét tuyển.';
    }

    if (method === 'hb' || method === 'thpt') {
      const requiredScores = subjectScores.slice(0, subjectLabels.length || 3).map(parseScore);
      const invalidScore = requiredScores.some((score) => !Number.isFinite(score) || score < 0 || score > 10);
      return invalidScore ? 'Nhập sai, vui lòng nhập đúng điểm.' : '';
    }

    if (method === 'vsat') {
      const requiredScores = subjectScores.slice(0, subjectLabels.length || 3).map(parseScore);
      const invalidScore = requiredScores.some((score) => !Number.isFinite(score) || score < 0 || score > 150);
      return invalidScore ? 'Điểm V-SAT mỗi môn cần nằm trong thang 0 đến 150.' : '';
    }

    if (method === 'dgnl') {
      return !Number.isFinite(parsedDgnlScore) || parsedDgnlScore < 0 || parsedDgnlScore > dgnlMaxScore
        ? `Điểm ĐGNL cần nằm trong thang 0 đến ${dgnlMaxScore}.`
        : '';
    }

    if (!hocBaSubject) {
      return 'Tổ hợp xét tuyển chưa xác định được môn học bạ hợp lệ.';
    }

    const invalidCombinedScore = [...parsedThptScores, parsedHocBaScore].some(
      (score) => !Number.isFinite(score) || score < 0 || score > 10,
    );
    return invalidCombinedScore || parsedThptScores.length !== 2
      ? 'Nhập sai, vui lòng nhập đúng điểm.'
      : '';
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const validationMessage = validateScores();
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    if (!selectedMajor || !selectedCombination) {
      return;
    }

    const scores = method === 'hb' || method === 'thpt' || method === 'vsat'
      ? subjectLabels.map((subjectName, index) => ({
          subject: { subjectName },
          score: method === 'vsat'
            ? convertVsatToThptScore(parseScore(subjectScores[index] ?? '0'))
            : parseScore(subjectScores[index] ?? '0'),
        }))
      : [{
          subject: {
            subjectName: method === 'dgnl'
              ? `ĐGNL ${dgnlProvider === 'hcm' ? 'ĐHQG TP.HCM' : 'ĐHQG Hà Nội'}`
              : 'Kết hợp THPT và học bạ (2 THPT + 1 học bạ)',
          },
          score: Number(admissionBaseScore.toFixed(2)),
        }];

    try {
      setSubmitting(true);
      const predictEndpoint = schoolCode === 'SGU' ? '/predict/sgu' : '/predict';
      const result = (await apiClient.post<ApiResponse<PredictResponse>>(predictEndpoint, {
            schoolCode,
            admissionMethod: method,
            majorCode: selectedMajor.code,
            subjectCombination: schoolCode === 'SGU' ? selectedSubCombinationCode : selectedCombination.code,
            targetYear: TARGET_YEAR,
            priorityScore,
            scores,
          }, {
            headers: { 'X-Skip-Auth': 'true' },
          })).data.data.result;

      onResult({
        result,
        studentScore: Number((result.student_score ?? finalScore).toFixed(2)),
        baseScore: Number(admissionBaseScore.toFixed(2)),
        priorityScore,
        majorCode: selectedMajor.code,
        majorName: selectedMajor.name,
        schoolCode: result.school_code ?? selectedMajor.schoolCode ?? schoolCode,
        schoolName: result.school_name ?? SCHOOL_LABEL[schoolCode],
        combinationCode: schoolCode === 'SGU' ? selectedSubCombinationCode : selectedCombination.code,
        combinationName: schoolCode === 'SGU' ? selectedSubCombinationCode : selectedCombination.name,
        
        methodLabel: METHOD_LABEL[method],
        targetYear: TARGET_YEAR,
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Không thể gửi dự đoán lúc này.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-[14px] border-1.5 border-gray-mid bg-white">
      <div className="bg-green-dark px-7 py-5">
        <h2 className="text-[16px] font-extrabold text-white">Thông tin xét tuyển</h2>
        <p className="mt-1 text-[12px] text-white/75">{SCHOOL_LABEL[schoolCode]} - năm xét tuyển 2026</p>
      </div>

      <div className="p-7">
        <div className="mb-7">
          <div className="mb-3 border-b-2 border-green-pale pb-2 text-[11px] font-extrabold uppercase tracking-[1.5px] text-text-light">
            Bước 1 - Chọn thông tin xét tuyển
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Ngành xét tuyển <span className="text-[#e53935]">*</span></label>
              <select
                value={selectedMajorCode}
                onChange={(event) => handleMajorChange(event.target.value)}
                disabled={loadingMajors}
                className={selectClass}
              >
                <option value="">{loadingMajors ? 'Đang tải danh sách ngành...' : '-- Chọn ngành --'}</option>
                {majors.map((major) => (
                  <option key={major.id ?? `${major.schoolCode ?? schoolCode}-${major.code}-${major.programType ?? ''}`} value={major.code}>
                    {major.code} - {major.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Tổ hợp xét tuyển <span className="text-[#e53935]">*</span></label>
                <select
                  value={schoolCode === 'SGU' ? selectedSubCombinationCode : selectedCombinationCode}
                  onChange={(event) => {
                    if (schoolCode === 'SGU') {
                      handleSubCombinationChange(event.target.value);
                    } else {
                      handleCombinationChange(event.target.value);
                    }
                  }}
                  className={selectClass}
                >
                  {schoolCode === 'SGU'
                    ? (selectedMajor?.combinations ?? []).flatMap((combo) =>
                        (combo.subCombinations ?? []).map((sub) => (
                          <option key={sub.code} value={sub.code}>
                            {sub.code} - {sub.subjects.map((subject) => subject.subjectName).join(', ')}
                          </option>
                        ))
                      )
                    : (selectedMajor?.combinations ?? []).map((combination) => (
                        <option key={combination.code} value={combination.code}>
                          {combination.code} - {combination.subjects.map((subject) => subject.subjectName).join(', ')}
                        </option>
                      ))
                  }
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Khu vực ưu tiên</label>
                <select value={priorityArea} onChange={(event) => setPriorityArea(event.target.value)} className={selectClass}>
                  {PRIORITY_AREAS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Đối tượng ưu tiên</label>
                <select value={priorityGroup} onChange={(event) => setPriorityGroup(event.target.value)} className={selectClass}>
                  {PRIORITY_GROUPS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-7">
          <div className="mb-3 border-b-2 border-green-pale pb-2 text-[11px] font-extrabold uppercase tracking-[1.5px] text-text-light">
            Bước 2 - Nhập điểm theo phương thức
          </div>

          <div className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {availableMethods.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => handleMethodChange(item.value)}
                className={`rounded-lg border-2 px-3 py-3 text-left transition-all ${
                  method === item.value
                    ? 'border-green-main bg-green-main text-white'
                    : 'border-gray-mid bg-white text-text-mid hover:border-green-main hover:bg-green-pale hover:text-green-main'
                }`}
              >
                <span className="block text-[12px] font-extrabold">{item.label}</span>
                <span className="mt-0.5 block text-[11px] opacity-80">{item.detail}</span>
              </button>
            ))}
          </div>

          <div className="rounded-[10px] border-1.5 border-gray-mid bg-gray-light p-5">
            <div className="mb-3 text-[11px] font-extrabold uppercase tracking-[1px] text-text-light">Điểm của thí sinh</div>

            {(method === 'hb' || method === 'thpt' || method === 'vsat') && (
              <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-gray-mid bg-white sm:grid-cols-3">
                {(subjectLabels.length ? subjectLabels : ['Môn 1', 'Môn 2', 'Môn 3']).map((subjectName, index) => {
                  const inputValue = subjectScores[index] ?? '';
                  const showScoreError = method !== 'vsat' && isScoreAboveTen(inputValue);

                  return (
                    <div key={`${subjectName}-${index}`} className="border-b border-gray-mid p-3 text-center sm:border-l sm:first:border-l-0">
                      <label className="mb-1 block text-[10px] font-bold uppercase tracking-[0.5px] text-text-light">
                        {subjectName}
                      </label>
                      <input
                        type="text"
                        inputMode="decimal"
                        pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                        min="0"
                        max={method === 'vsat' ? '150' : '10'}
                        step="0.01"
                        value={inputValue}
                        onChange={(event) => updateSubjectScore(index, event.target.value)}
                        className={scoreInputClass}
                        placeholder="0.00"
                      />
                      {showScoreError && (
                        <p className="mt-1.5 text-left text-[11px] font-bold text-[#b71c1c]">
                          Nhập sai, vui lòng nhập đúng điểm.
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {method === 'dgnl' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Kỳ thi</label>
                  <select
                    value={dgnlProvider}
                    onChange={(event) => setDgnlProvider(event.target.value as 'hcm' | 'hn')}
                    className={selectClass}
                  >
                    <option value="hcm">ĐHQG TP.HCM - thang 1200</option>
                    <option value="hn">ĐHQG Hà Nội - thang 1200</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={labelClass}>Tổng điểm thi</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                    min="0"
                    max={dgnlMaxScore}
                    step="0.01"
                    value={dgnlScore}
                    onChange={(event) => setDgnlScore(normalizeNumericInput(event.target.value, dgnlMaxScore))}
                    className={scoreInputClass}
                    placeholder="0"
                  />
                </div>
              </div>
            )}

            {method === 'kh' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {transcriptSubjects.map((subject) => {
                    const isSelectedTranscriptSubject = subject === hocBaSubject;
                    const inputValue = combinedTranscriptScores[subject] ?? '';
                    const showScoreError = isScoreAboveTen(inputValue);

                    return (
                      <div key={`hoc-ba-${subject}`} className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                          Học bạ - {subject}{isSelectedTranscriptSubject ? ' (cao nhất)' : ''}
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                          min="0"
                          max="10"
                          step="0.01"
                          value={inputValue}
                          onChange={(event) => updateCombinedTranscriptScore(subject, event.target.value)}
                          className={scoreInputClass}
                          placeholder="0.00"
                        />
                        {showScoreError && (
                          <p className="text-[11px] font-bold text-[#b71c1c]">
                            Nhập sai, vui lòng nhập đúng điểm.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {thptSubjects.map((subject) => {
                    const label = formatCombinedThptLabel(subject);
                    const inputValue = combinedThptScores[subject] ?? '';
                    const showScoreError = isScoreAboveTen(inputValue);

                    return (
                      <div key={`thpt-${subject}`} className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                          {label === 'THPT' ? `THPT - ${subject}` : label}
                        </label>
                        <input
                          type="text"
                          inputMode="decimal"
                          pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                          min="0"
                          max="10"
                          step="0.01"
                          value={inputValue}
                          onChange={(event) => updateCombinedThptScore(subject, event.target.value)}
                          className={scoreInputClass}
                          placeholder="0.00"
                        />
                        {showScoreError && (
                          <p className="text-[11px] font-bold text-[#b71c1c]">
                            Nhập sai, vui lòng nhập đúng điểm.
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-3 rounded-md border border-green-light/30 bg-green-pale px-3 py-2 text-center text-[12px] font-bold text-green-main">
              Điểm quy đổi xét tuyển: <span className="text-[16px] font-black">{finalScore.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-[#ffcdd2] bg-[#ffebee] px-4 py-3 text-[13px] font-semibold text-[#b71c1c]">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || loadingMajors}
          className="w-full rounded-[10px] bg-green-main p-4 text-[16px] font-extrabold text-white transition-all hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Đang phân tích...' : 'Phân tích dự đoán'}
        </button>
      </div>
    </form>
  );
}
