import {
  admissionMethodResultsSchema,
  majorAdmissionPageSchema,
  majorAdmissionResultSchema,
  parseApiData,
} from '@/hooks/admission.schemas';
import type {
  AdmissionMethodResult,
  AdmissionMethodCode,
  MajorAdmissionPage,
  MajorMethodEvaluation,
  MajorAdmissionResult,
} from '@/hooks/admission.types';

const delay = () => new Promise((resolve) => setTimeout(resolve, 300 + Math.floor(Math.random() * 301)));

export const normalizeSearchText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const combinations: Record<string, string[]> = {
  A00: ['Toán', 'Vật lý', 'Hóa học'],
  A01: ['Toán', 'Vật lý', 'Tiếng Anh'],
  B00: ['Toán', 'Hóa học', 'Sinh học'],
  D01: ['Ngữ văn', 'Toán', 'Tiếng Anh'],
  D07: ['Toán', 'Hóa học', 'Tiếng Anh'],
  D08: ['Toán', 'Sinh học', 'Tiếng Anh'],
  C02: ['Ngữ văn', 'Toán', 'Hóa học'],
  X26: ['Toán', 'Tin học', 'Tiếng Anh'],
};

export const admissionMethodResultsMock: AdmissionMethodResult[] = [
  {
    methodCode: 'THPT',
    methodName: 'THPT',
    description: 'Tổng điểm 3 môn theo từng tổ hợp xét tuyển.',
    status: 'AVAILABLE',
    scoreProfileId: 'profile-thpt-2026',
    year: 2026,
    combinations: [
      {
        combinationCode: 'A00',
        subjectNames: combinations.A00,
        rawScore: 25.5,
        convertedScore: 25.5,
        status: 'AVAILABLE',
        isBest: true,
      },
      {
        combinationCode: 'A01',
        subjectNames: combinations.A01,
        rawScore: 24.8,
        convertedScore: 24.8,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'B00',
        subjectNames: combinations.B00,
        rawScore: null,
        convertedScore: null,
        status: 'MISSING_SCORE',
        isBest: false,
        missingSubjects: ['Sinh học'],
        message: 'Thiếu điểm môn Sinh học.',
      },
      {
        combinationCode: 'D07',
        subjectNames: combinations.D07,
        rawScore: 24.2,
        convertedScore: 24.2,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'D08',
        subjectNames: combinations.D08,
        rawScore: 23.9,
        convertedScore: 23.9,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'X26',
        subjectNames: combinations.X26,
        rawScore: 25.1,
        convertedScore: 25.1,
        status: 'AVAILABLE',
        isBest: false,
      },
    ],
  },
  {
    methodCode: 'TRANSCRIPT',
    methodName: 'Học bạ',
    description: 'Tổng điểm 3 môn học bạ theo từng tổ hợp xét tuyển.',
    status: 'AVAILABLE',
    scoreProfileId: 'profile-transcript-2026',
    year: 2026,
    combinations: [
      {
        combinationCode: 'A00',
        subjectNames: combinations.A00,
        rawScore: 26.9,
        convertedScore: 26.1,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'A01',
        subjectNames: combinations.A01,
        rawScore: 27.2,
        convertedScore: 26.4,
        status: 'AVAILABLE',
        isBest: true,
      },
      {
        combinationCode: 'B00',
        subjectNames: combinations.B00,
        rawScore: 25.7,
        convertedScore: 24.9,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'D01',
        subjectNames: combinations.D01,
        rawScore: null,
        convertedScore: null,
        status: 'MISSING_SCORE',
        isBest: false,
        missingSubjects: ['Ngữ văn'],
        message: 'Thiếu điểm học bạ môn Ngữ văn.',
      },
      {
        combinationCode: 'D07',
        subjectNames: combinations.D07,
        rawScore: 26.1,
        convertedScore: 25.3,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'X26',
        subjectNames: combinations.X26,
        rawScore: 26.6,
        convertedScore: 25.8,
        status: 'AVAILABLE',
        isBest: false,
      },
    ],
  },
  {
    methodCode: 'APTITUDE',
    methodName: 'ĐGNL',
    description: 'Điểm đánh giá năng lực lấy theo đợt thi cao nhất.',
    status: 'AVAILABLE',
    year: 2026,
    combinations: [],
    representativeResult: {
      rawScore: 850,
      rawScale: 1200,
      convertedScore: 25.8,
      convertedScale: 30,
    },
  },
  {
    methodCode: 'COMBINED',
    methodName: 'Kết hợp',
    description: '02 môn thi tốt nghiệp THPT năm 2026 và 01 môn còn lại bằng điểm học bạ.',
    status: 'AVAILABLE',
    scoreProfileId: 'profile-combined-2026',
    year: 2026,
    combinations: [
      {
        combinationCode: 'A00',
        subjectNames: combinations.A00,
        transcriptSubject: 'Hóa học',
        rawScore: 26.0,
        convertedScore: 26.0,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'A01',
        subjectNames: combinations.A01,
        transcriptSubject: 'Tiếng Anh',
        rawScore: 26.6,
        convertedScore: 26.6,
        status: 'AVAILABLE',
        isBest: true,
      },
      {
        combinationCode: 'B00',
        subjectNames: combinations.B00,
        transcriptSubject: 'Sinh học',
        rawScore: null,
        convertedScore: null,
        status: 'MISSING_SCORE',
        isBest: false,
        missingSubjects: ['Sinh học'],
        message: 'Thiếu điểm học bạ môn Sinh học.',
      },
      {
        combinationCode: 'D07',
        subjectNames: combinations.D07,
        transcriptSubject: 'Tiếng Anh',
        rawScore: 25.9,
        convertedScore: 25.9,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'D08',
        subjectNames: combinations.D08,
        transcriptSubject: 'Tiếng Anh',
        rawScore: 25.4,
        convertedScore: 25.4,
        status: 'AVAILABLE',
        isBest: false,
      },
      {
        combinationCode: 'X26',
        subjectNames: combinations.X26,
        transcriptSubject: 'Tin học',
        rawScore: 26.2,
        convertedScore: 26.2,
        status: 'AVAILABLE',
        isBest: false,
      },
    ],
  },
];

const methodNames: Record<AdmissionMethodCode, string> = {
  THPT: 'THPT',
  TRANSCRIPT: 'Học bạ',
  APTITUDE: 'ĐGNL',
  COMBINED: 'Kết hợp',
};

const hasEnteredCombinationScore = (combination: AdmissionMethodResult['combinations'][number]) =>
  combination.rawScore !== null || combination.convertedScore !== null;

const hasEnteredMethodScore = (method: AdmissionMethodResult) => {
  if (method.methodCode === 'APTITUDE') {
    return method.representativeResult !== null && method.representativeResult !== undefined;
  }

  return method.combinations.some(hasEnteredCombinationScore);
};

const compareCombinationByConvertedScore = (
  current: AdmissionMethodResult['combinations'][number],
  next: AdmissionMethodResult['combinations'][number],
) => (next.convertedScore ?? Number.NEGATIVE_INFINITY) - (current.convertedScore ?? Number.NEGATIVE_INFINITY);

const filterEnteredAdmissionMethods = (methods: AdmissionMethodResult[]) =>
  methods
    .map((method) => ({
      ...method,
      combinations:
        method.methodCode === 'APTITUDE'
          ? method.combinations
          : method.combinations.filter(hasEnteredCombinationScore).sort(compareCombinationByConvertedScore),
    }))
    .filter(hasEnteredMethodScore);

const hasEnteredMajorScore = (major: MajorAdmissionResult) =>
  major.bestMethod !== null &&
  major.bestMethod !== undefined &&
  Number.isFinite(major.bestMethod.convertedScore);

const compareMajorByConvertedScore = (current: MajorAdmissionResult, next: MajorAdmissionResult) => {
  const scoreDiff = (next.bestMethod?.convertedScore ?? Number.NEGATIVE_INFINITY) -
    (current.bestMethod?.convertedScore ?? Number.NEGATIVE_INFINITY);

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return (next.probability ?? Number.NEGATIVE_INFINITY) - (current.probability ?? Number.NEGATIVE_INFINITY);
};

const methodEvaluation = (
  methodCode: AdmissionMethodCode,
  methodName: string,
  combinationCode: string | null,
  rawScore: number | null,
  rawScale: number,
  convertedScore: number | null,
  subjectNames?: string[],
  transcriptSubject?: string | null,
): MajorMethodEvaluation => ({
  methodCode,
  methodName,
  status: convertedScore === null ? 'MISSING_SCORE' : 'AVAILABLE',
  combinationCode,
  subjectNames,
  transcriptSubject,
  rawScore,
  rawScale,
  convertedScore,
  convertedScale: 30,
});

const buildMethodEvaluations = (
  bestMethodCode: AdmissionMethodCode,
  combinationCode: string | null,
  convertedScore: number,
): MajorMethodEvaluation[] => {
  const thptCombinationCode = combinationCode ?? 'A00';
  const transcriptCombinationCode = combinationCode ?? 'A01';
  const combinedCombinationCode = combinationCode ?? 'A01';
  const scores: Record<AdmissionMethodCode, number> = {
    THPT: Number((convertedScore - 0.9).toFixed(2)),
    TRANSCRIPT: Number((convertedScore - 0.5).toFixed(2)),
    APTITUDE: Number((convertedScore - 0.8).toFixed(2)),
    COMBINED: Number((convertedScore - 0.3).toFixed(2)),
  };
  scores[bestMethodCode] = convertedScore;

  return [
    methodEvaluation(
      'THPT',
      methodNames.THPT,
      thptCombinationCode,
      scores.THPT,
      30,
      scores.THPT,
      combinations[thptCombinationCode],
    ),
    methodEvaluation(
      'TRANSCRIPT',
      methodNames.TRANSCRIPT,
      transcriptCombinationCode,
      Number((scores.TRANSCRIPT + 0.8).toFixed(2)),
      30,
      scores.TRANSCRIPT,
      combinations[transcriptCombinationCode],
    ),
    methodEvaluation('APTITUDE', methodNames.APTITUDE, null, Math.round((scores.APTITUDE / 30) * 1200), 1200, scores.APTITUDE),
    methodEvaluation(
      'COMBINED',
      methodNames.COMBINED,
      combinedCombinationCode,
      scores.COMBINED,
      30,
      scores.COMBINED,
      combinations[combinedCombinationCode],
      combinations[combinedCombinationCode]?.find((subject) => !['Toán', 'Ngữ văn'].includes(subject)) ?? null,
    ),
  ];
};

const informationTechnologyEvaluations: MajorMethodEvaluation[] = [
  methodEvaluation('THPT', methodNames.THPT, 'A00', 25.5, 30, 25.5, combinations.A00),
  methodEvaluation('TRANSCRIPT', methodNames.TRANSCRIPT, 'A01', 27.2, 30, 26.4, combinations.A01),
  methodEvaluation('APTITUDE', methodNames.APTITUDE, null, 850, 1200, 25.8),
  methodEvaluation('COMBINED', methodNames.COMBINED, 'A01', 26.6, 30, 26.6, combinations.A01, 'Tiếng Anh'),
];

const major = (
  majorCode: string,
  majorName: string,
  methodCode: AdmissionMethodCode,
  combinationCode: string | null,
  convertedScore: number,
  predictedCutoff: number | null,
  probability: number | null,
  overrides: Partial<MajorAdmissionResult> = {},
): MajorAdmissionResult => ({
  majorCode,
  majorName,
  status: 'AVAILABLE',
  bestMethod: {
    methodCode,
    methodName: methodNames[methodCode],
    combinationCode,
    subjectNames: combinationCode ? combinations[combinationCode] : undefined,
    transcriptSubject: methodCode === 'COMBINED' && combinationCode ? 'Tiếng Anh' : null,
    convertedScore,
  },
  methodEvaluations: buildMethodEvaluations(methodCode, combinationCode, convertedScore),
  predictedCutoff,
  margin: predictedCutoff === null ? null : Number((convertedScore - predictedCutoff).toFixed(2)),
  probability,
  ...overrides,
});

export const majorAdmissionResultsMock: MajorAdmissionResult[] = [
  major('7480201', 'Công nghệ thông tin', 'COMBINED', 'A01', 26.6, 25.9, 0.78, {
    methodEvaluations: informationTechnologyEvaluations,
  }),
  major('7480104', 'Hệ thống thông tin', 'THPT', 'A00', 25.5, 24.9, 0.73),
  major('7510203', 'Công nghệ kỹ thuật cơ điện tử', 'THPT', 'A00', 25.1, 23.8, 0.86),
  major('7510201', 'Công nghệ kỹ thuật cơ khí', 'THPT', 'A00', 24.7, 23.4, 0.82),
  major('7510205', 'Công nghệ kỹ thuật ô tô', 'COMBINED', 'A01', 26.1, 25.1, 0.8),
  major('7510301', 'Công nghệ kỹ thuật điện, điện tử', 'THPT', 'A01', 24.9, 23.7, 0.79),
  major('7510406', 'Công nghệ kỹ thuật môi trường', 'TRANSCRIPT', 'B00', 24.9, 22.8, 0.91),
  major('7540101', 'Công nghệ thực phẩm', 'TRANSCRIPT', 'B00', 25.3, 24.1, 0.83),
  major('7540106', 'Đảm bảo chất lượng và an toàn thực phẩm', 'TRANSCRIPT', 'D07', 25.0, 23.0, 0.88),
  major('7420201', 'Công nghệ sinh học', 'APTITUDE', null, 25.8, 25.2, 0.71),
  major('7620105', 'Chăn nuôi', 'TRANSCRIPT', 'B00', 24.6, 21.4, 0.94),
  major('7620109', 'Nông học', 'TRANSCRIPT', 'B00', 24.3, 21.0, 0.95),
  major('7620112', 'Bảo vệ thực vật', 'THPT', 'B00', 23.9, 21.7, 0.89),
  major('7620114', 'Kinh doanh nông nghiệp', 'COMBINED', 'D01', 24.8, 23.5, 0.77),
  major('7620116', 'Phát triển nông thôn', 'TRANSCRIPT', 'D01', 24.1, 21.2, 0.92),
  major('7620201', 'Lâm học', 'THPT', 'B00', 23.5, 20.8, 0.9),
  major('7620205', 'Lâm nghiệp đô thị', 'COMBINED', 'D08', 24.2, 22.0, 0.87),
  major('7620211', 'Quản lý tài nguyên rừng', 'THPT', 'B00', 23.6, 21.2, 0.85),
  major('7620301', 'Nuôi trồng thủy sản', 'TRANSCRIPT', 'B00', 24.4, 22.1, 0.88),
  major('7620305', 'Quản lý thủy sản', 'THPT', 'B00', 23.8, 21.9, 0.76),
  major('7850103', 'Quản lý đất đai', 'COMBINED', 'D01', 25.0, 24.2, 0.68),
  major('7850101', 'Quản lý tài nguyên và môi trường', 'THPT', 'B00', 24.5, 22.7, 0.84),
  major('7850102', 'Kinh tế tài nguyên thiên nhiên', 'TRANSCRIPT', 'D01', 24.7, 23.1, 0.81),
  major('7310101', 'Kinh tế', 'COMBINED', 'A01', 25.7, 25.4, 0.58),
  major('7340101', 'Quản trị kinh doanh', 'COMBINED', 'A01', 25.9, 25.7, 0.54),
  major('7340301', 'Kế toán', 'THPT', 'A00', 24.8, 24.0, 0.69),
  major('7220201', 'Ngôn ngữ Anh', 'TRANSCRIPT', 'D01', 25.6, 25.0, 0.66),
  major('7140215', 'Sư phạm kỹ thuật nông nghiệp', 'THPT', 'A00', 24.0, 22.0, 0.86),
  major('7640101', 'Thú y', 'COMBINED', 'B00', 25.4, 25.1, 0.61, {
    bestMethod: {
      methodCode: 'COMBINED',
      methodName: 'Kết hợp',
      combinationCode: 'B00',
      subjectNames: combinations.B00,
      transcriptSubject: 'Sinh học',
      convertedScore: 25.4,
    },
  }),
  major('7580101', 'Kiến trúc cảnh quan', 'APTITUDE', null, 25.8, 24.6, 0.75),
  major('7580108', 'Cảnh quan và kỹ thuật hoa viên', 'COMBINED', 'X26', 26.2, 23.9, 0.9, {
    bestMethod: {
      methodCode: 'COMBINED',
      methodName: 'Kết hợp',
      combinationCode: 'X26',
      subjectNames: combinations.X26,
      transcriptSubject: 'Tin học',
      convertedScore: 26.2,
    },
  }),
  major('7520320', 'Kỹ thuật môi trường', 'TRANSCRIPT', 'B00', 24.2, 22.9, 0.79),
  major('7510401', 'Công nghệ kỹ thuật hóa học', 'THPT', 'D07', 24.2, 24.8, 0.35),
  major('7520114', 'Công nghệ kỹ thuật nhiệt', 'THPT', 'A00', 23.2, 23.6, 0.42),
  major('7519007', 'Công nghệ kỹ thuật năng lượng tái tạo', 'COMBINED', 'A01', 25.2, 24.4, null),
  major('7420102', 'Khoa học môi trường', 'THPT', 'B00', 0, 21.5, 0.2, {
    status: 'MISSING_SCORE',
    bestMethod: null,
    margin: null,
  }),
  major('7340116', 'Bất động sản', 'THPT', 'C02', 0, null, null, {
    status: 'NOT_APPLICABLE',
    bestMethod: null,
    margin: null,
  }),
];

export async function getAdmissionMethodResultsMock(year: number): Promise<AdmissionMethodResult[]> {
  await delay();
  const byYear = filterEnteredAdmissionMethods(admissionMethodResultsMock).map((method) => ({ ...method, year }));
  return parseApiData(admissionMethodResultsSchema, byYear, 'Dữ liệu phương thức xét tuyển không hợp lệ.');
}

export async function getMajorAdmissionResultsMock(params: {
  year: number;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<MajorAdmissionPage> {
  await delay();

  const page = params.page ?? 0;
  const size = params.size ?? 50;
  const keyword = normalizeSearchText(params.keyword ?? '');
  const scoredMajors = majorAdmissionResultsMock.filter(hasEnteredMajorScore).sort(compareMajorByConvertedScore);
  const filtered = keyword
    ? scoredMajors.filter((item) => {
        const bestMethod = item.bestMethod;
        const searchable = [
          item.majorCode,
          item.majorName,
          bestMethod?.methodName,
          bestMethod?.combinationCode,
          bestMethod?.subjectNames?.join(' '),
        ]
          .filter(Boolean)
          .join(' ');

        return normalizeSearchText(searchable).includes(keyword);
      })
    : scoredMajors;

  const start = page * size;
  const content = filtered.slice(start, start + size);
  const response: MajorAdmissionPage = {
    content,
    page,
    size,
    totalElements: filtered.length,
    totalPages: Math.max(1, Math.ceil(filtered.length / size)),
  };

  return parseApiData(majorAdmissionPageSchema, response, 'Dữ liệu danh sách ngành không hợp lệ.');
}

export async function getMajorAdmissionDetailMock(majorCode: string, year: number): Promise<MajorAdmissionResult> {
  await delay();

  const result = majorAdmissionResultsMock.filter(hasEnteredMajorScore).find((item) => item.majorCode === majorCode);

  if (!result) {
    throw new Error(`Không tìm thấy ngành ${majorCode} cho năm ${year}.`);
  }

  return parseApiData(majorAdmissionResultSchema, result, 'Dữ liệu chi tiết ngành không hợp lệ.');
}

export async function getMajorAdmissionEvaluationFlowMock(
  majorCode: string,
  year: number,
): Promise<MajorAdmissionResult> {
  return getMajorAdmissionDetailMock(majorCode, year);
}
