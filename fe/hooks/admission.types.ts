export type AdmissionMethodCode = 'THPT' | 'TRANSCRIPT' | 'APTITUDE' | 'COMBINED';

export type CalculationStatus =
  | 'AVAILABLE'
  | 'MISSING_SCORE'
  | 'NOT_APPLICABLE'
  | 'NOT_ELIGIBLE'
  | 'PENDING_CONVERSION';

export interface CombinationResult {
  combinationId?: string;
  combinationCode: string;
  combinationName?: string;
  subjectNames: string[];
  rawScore: number | null;
  convertedScore: number | null;
  status: CalculationStatus;
  isBest: boolean;
  transcriptSubject?: string | null;
  missingSubjects?: string[];
  message?: string | null;
}

export interface AdmissionMethodResult {
  methodCode: AdmissionMethodCode;
  methodName: string;
  description: string;
  status: CalculationStatus;
  scoreProfileId?: string;
  year?: number;
  combinations: CombinationResult[];
  representativeResult?: {
    combinationCode?: string | null;
    rawScore: number;
    rawScale: number;
    convertedScore: number;
    convertedScale: number;
  } | null;
}

export interface MajorMethodEvaluation {
  methodCode: AdmissionMethodCode;
  methodName: string;
  status: CalculationStatus;
  combinationCode?: string | null;
  subjectNames?: string[];
  transcriptSubject?: string | null;
  rawScore: number | null;
  rawScale: number;
  convertedScore: number | null;
  convertedScale: number;
  message?: string | null;
}

export interface MajorAdmissionResult {
  majorId?: string;
  majorCode: string;
  majorName: string;
  status: CalculationStatus;
  bestMethod?: {
    methodCode: AdmissionMethodCode;
    methodName: string;
    combinationCode?: string | null;
    subjectNames?: string[];
    transcriptSubject?: string | null;
    convertedScore: number;
  } | null;
  methodEvaluations?: MajorMethodEvaluation[];
  predictedCutoff?: number | null;
  margin?: number | null;
  probability?: number | null;
}

export interface PredictionHistoryResult {
  id: string;
  userId: string;
  majorCode: string;
  combinationCode: string;
  admissionMethod: AdmissionMethodCode;
  targetYear: number;
  inputScore: number;
  predictedCutoff: number;
  margin: number;
  admissionProbability: number;
  model: string;
  createdAt: string;
}

export interface MajorAdmissionPage {
  content: MajorAdmissionResult[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
