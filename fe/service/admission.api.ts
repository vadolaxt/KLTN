import {
  admissionMethodResultsSchema,
  majorAdmissionPageSchema,
  majorAdmissionResultSchema,
  parseApiData,
} from '@/hooks/admission.schemas';
import type { AdmissionMethodResult, MajorAdmissionPage, MajorAdmissionResult } from '@/hooks/admission.types';
import { apiClient } from '@/lib/constants/api-client';

const unwrapApiData = <T>(responseData: T | { data?: T }) => {
  if (responseData && typeof responseData === 'object' && 'data' in responseData) {
    return responseData.data;
  }

  return responseData;
};

export async function getAdmissionMethodResults(year: number): Promise<AdmissionMethodResult[]> {
  const response = await apiClient.get('/admission/method-results', { params: { year } });
  return parseApiData(
    admissionMethodResultsSchema,
    unwrapApiData(response.data),
    'Dữ liệu phương thức xét tuyển từ API không hợp lệ.',
  );
}

export async function getMajorAdmissionResults(params: {
  year: number;
  keyword?: string;
  page?: number;
  size?: number;
}): Promise<MajorAdmissionPage> {
  const response = await apiClient.get('/admission/major-results', { params });
  return parseApiData(
    majorAdmissionPageSchema,
    unwrapApiData(response.data),
    'Dữ liệu danh sách ngành từ API không hợp lệ.',
  );
}

export async function getMajorAdmissionDetail(majorCode: string, year: number): Promise<MajorAdmissionResult> {
  const response = await apiClient.get(`/admission/major-results/${majorCode}`, { params: { year } });
  return parseApiData(
    majorAdmissionResultSchema,
    unwrapApiData(response.data),
    'Dữ liệu chi tiết ngành từ API không hợp lệ.',
  );
}

export async function getMajorAdmissionEvaluationFlow(majorCode: string, year: number): Promise<MajorAdmissionResult> {
  const response = await apiClient.get(`/admission/major-results/${majorCode}/evaluation-flow`, { params: { year } });
  return parseApiData(
    majorAdmissionResultSchema,
    unwrapApiData(response.data),
    'Dữ liệu luồng tính điểm ngành từ API không hợp lệ.',
  );
}
