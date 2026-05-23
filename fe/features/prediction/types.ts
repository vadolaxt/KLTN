export type AdmissionMethod = 'hb' | 'thpt' | 'dgnl' | 'kh';

export interface Subject {
  id?: string;
  subjectName: string;
}

export interface SubjectCombination {
  id?: string;
  code: string;
  name: string;
  subjects: Subject[];
}

export interface Major {
  id?: string;
  code: string;
  name: string;
  schoolCode?: string;
  departmentCode?: string;
  programType?: string;
  admissionQuota?: number;
  cutoffScore?: number;
  combinations: SubjectCombination[];
}

export interface PredictApiResult {
  target_year: string;
  combination_matched: boolean;
  predicted_cutoff: number;
  margin: number;
  admission_probability: number;
}

export interface PredictionResultState {
  result: PredictApiResult;
  studentScore: number;
  majorCode: string;
  majorName: string;
  combinationCode: string;
  combinationName: string;
  methodLabel: string;
  targetYear: number;
}
