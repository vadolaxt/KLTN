import { apiClient } from '@/lib/constants/api-client';
import type { ApiResponse } from '@/types';

export interface LookupCombination {
  code: string;
  name?: string;
}

export interface LookupAdmission {
  id: string;
  schoolCode: string;
  year: number;
  departmentCode: string;
  majorName: string;
  majorCode: string;
  admissionQuota: number;
  cutoffScore: number;
  combinations: LookupCombination[];
  programType: string;
  note?: string;
}

export interface PredictedCutoff {
  major_code: string;
  predicted_cutoff: number;
}

interface PredictionOverviewResponse {
  predictions: PredictedCutoff[];
}

export const AdmissionLookupApi = {
  getYears: async (schoolCode = 'NLU'): Promise<number[]> => {
    const response = await apiClient.get<ApiResponse<number[]>>('/admissions/years', {
      params: { schoolCode },
    });
    return response.data.data;
  },

  getAdmissions: async (year: number, schoolCode = 'NLU'): Promise<LookupAdmission[]> => {
    const response = await apiClient.get<ApiResponse<LookupAdmission[]>>('/admissions', {
      params: { year, schoolCode },
    });
    return response.data.data;
  },

  getPredictedCutoffs: async (targetYear: number, schoolCode = 'NLU'): Promise<PredictedCutoff[]> => {
    const response = await apiClient.get<ApiResponse<PredictionOverviewResponse>>('/predict/overview', {
      params: { targetYear, schoolCode },
      headers: { 'X-Skip-Auth': 'true' },
    });
    return response.data.data.predictions;
  },
};
