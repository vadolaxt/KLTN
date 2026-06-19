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
  school_code?: string;
  school_name?: string;
  combination_matched: boolean;
  predicted_cutoff: number;
  margin: number;
  admission_probability: number;
  previous_year?: number;
  previous_year_cutoff_score?: number | null;
  two_years_ago?: number;
  two_years_ago_cutoff_score?: number | null;
}

export interface PredictionResultState {
  result: PredictApiResult;
  studentScore: number;
  majorCode: string;
  majorName: string;
  schoolCode?: string;
  schoolName?: string;
  combinationCode: string;
  combinationName: string;
  methodLabel: string;
  targetYear: number;
}
