import type { AdmissionMethodCode } from '@/hooks/admission.types';

export type ScoreMethod = 'thpt' | 'hb' | 'dgnl' | 'kh';
export type ScoreSupportMode = 'method' | 'major';

export const SCORE_METHOD_TO_ADMISSION_METHOD: Record<ScoreMethod, AdmissionMethodCode> = {
  thpt: 'THPT',
  hb: 'TRANSCRIPT',
  dgnl: 'APTITUDE',
  kh: 'COMBINED',
};

export interface CombinationInfo {
  code: string;
  subjects: string[];
}

export interface MajorScoreRow {
  id: string;
  majorCode: string;
  majorName: string;
  bestCombination?: CombinationInfo;
}
