import { apiClient } from '@/lib/constants/api-client';
import type { ApiResponse } from '@/types';

export type NewsCategory = 'ADMISSION_INFO' | 'CAREER_GUIDANCE' | 'PRESS_NEWS';
export type NewsStatus = 'DRAFT' | 'PUBLISHED';

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: NewsCategory;
  status: NewsStatus;
  imageUrl?: string | null;
  sourceUrl?: string | null;
  sourceName?: string | null;
  publishedAt: string;
  views: number;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface NewsQueryParams {
  category?: NewsCategory | 'ALL';
  keyword?: string;
  limit?: number;
}

export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  ADMISSION_INFO: 'Thông tin tuyển sinh',
  CAREER_GUIDANCE: 'Hướng nghiệp chuyên sâu',
  PRESS_NEWS: 'Điểm tin từ các báo',
};

const compactParams = (params?: NewsQueryParams) => {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== 'ALL')
  );
};

export const NewsApiService = {
  getPublished: async (params?: NewsQueryParams): Promise<ApiResponse<NewsArticle[]>> => {
    const response = await apiClient.get<ApiResponse<NewsArticle[]>>('/news', {
      params: compactParams(params),
      headers: { 'X-Skip-Auth': 'true' },
    });
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<NewsArticle>> => {
    const response = await apiClient.get<ApiResponse<NewsArticle>>(`/news/${id}`, {
      headers: { 'X-Skip-Auth': 'true' },
    });
    return response.data;
  },
};
