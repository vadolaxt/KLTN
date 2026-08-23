export type AdmissionMethod = 'hb' | 'thpt' | 'dgnl' | 'kh' | 'vsat';
export type SchoolCode = 'NLU' | 'SGU';

export interface Subject {
  id?: string;
  code?: string;
  subjectName: string;
}

export interface SubCombination {
  code: string;
  subjects: Subject[];
}

export interface SubjectCombination {
  id?: string;
  code: string;
  name: string;
  subjects: Subject[];
  subCombinations?: SubCombination[];
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
  student_score?: number;
  priority_score?: number;
  raw_priority_score?: number;
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
  top_k_majors?: TopMajorPrediction[];
}

export interface TopMajorPrediction {
  major_code: string;
  major_name: string;
  admission_probability: number;
}

export interface PredictionResultState {
  result: PredictApiResult;
  studentScore: number;
  baseScore?: number;
  priorityScore?: number;
  majorCode: string;
  majorName: string;
  schoolCode?: string;
  schoolName?: string;
  combinationCode: string;
  combinationName: string;
  methodLabel: string;
  targetYear: number;
}
