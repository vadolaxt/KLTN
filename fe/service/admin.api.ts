import { apiClient } from "@/lib/constants/api-client";
import { ApiResponse, AuthRequest, AuthResponse } from "@/types";

export type AdminRole = "ADMIN" | "STAFF" | "USER";
export type AccountStatus = "ACTIVE" | "BLOCKED";

export interface AdminProfile {
  firstName: string;
  lastName: string;
  email: string;
  role?: AdminRole;
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  identity: string;
  role: AdminRole;
  status: AccountStatus;
  createdAt: string;
}

export interface Subject {
  id?: string;
  subjectName: string;
}

export interface SubjectCombination {
  id?: string;
  code: string;
  name: string;
  subjects?: Subject[];
}

export interface AdmissionInfo {
  id: string;
  schoolCode: string;
  year: number;
  departmentCode: string;
  majorName: string;
  majorCode: string;
  admissionQuota: number;
  cutoffScore: number;
  combinations: SubjectCombination[];
  programType: string;
  note?: string;
}

export type AdmissionMajor = AdmissionInfo;
export type CutoffScore = AdmissionInfo;

export interface AdmissionQueryParams {
  year?: number;
  departmentCode?: string;
  majorCode?: string;
  programType?: string;
  keyword?: string;
}

export interface AdmissionUpdateRequest {
  schoolCode?: string;
  year?: number;
  departmentCode?: string;
  majorName?: string;
  majorCode?: string;
  admissionQuota?: number;
  cutoffScore?: number;
  combinationCodes?: string[];
  programType?: string;
  note?: string;
}

export interface AdminNews {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: "ANNOUNCEMENT" | "GUIDE" | "EVENT";
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string;
  emoji: string;
  views: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalAdmissions: number;
  totalNews: number;
  activeUsers: number;
  approvedApplicationsRate: number;
  applicationsByMethod: { method: string; count: number }[];
  registrationsByMonth: { month: string; count: number }[];
}

const compactParams = (params?: AdmissionQueryParams) => {
  if (!params) return undefined;

  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "" && value !== "ALL")
  );
};

export const AdminApiService = {
  login: async (email: string, password: string): Promise<ApiResponse<{ token: string; profile: AdminProfile }>> => {
    const loginResponse = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", {
      email,
      password,
    } satisfies AuthRequest);

    const token = loginResponse.data.data.accessToken;
    if (token) {
      apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    }

    const profileResponse = await apiClient.get<ApiResponse<AdminProfile>>("/auth/me");

    return {
      status: loginResponse.data.status,
      message: loginResponse.data.message,
      data: {
        token,
        profile: profileResponse.data.data,
      },
    };
  },

  register: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    identity: string;
    password?: string;
  }): Promise<ApiResponse<string>> => {
    const response = await apiClient.post<ApiResponse<string>>("/admin/users/admins", data);
    return response.data;
  },

  logout: async (): Promise<number> => {
    const response = await apiClient.post("/auth/logout");
    return response.status;
  },

  getUsers: async (): Promise<ApiResponse<AdminUser[]>> => {
    const response = await apiClient.get<ApiResponse<AdminUser[]>>("/admin/users");
    return response.data;
  },

  createUser: async (user: Omit<AdminUser, "id" | "createdAt">): Promise<ApiResponse<AdminUser>> => {
    const response = await apiClient.post<ApiResponse<AdminUser>>("/admin/users", user);
    return response.data;
  },

  updateUser: async (id: string, updatedFields: Partial<AdminUser>): Promise<ApiResponse<AdminUser>> => {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(`/admin/users/${id}`, updatedFields);
    return response.data;
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/admin/users/${id}`);
    return response.data;
  },

  getAdmissionYears: async (): Promise<ApiResponse<number[]>> => {
    const response = await apiClient.get<ApiResponse<number[]>>("/admin/admissions/years");
    return response.data;
  },

  getAdmissions: async (params?: AdmissionQueryParams): Promise<ApiResponse<AdmissionInfo[]>> => {
    const response = await apiClient.get<ApiResponse<AdmissionInfo[]>>("/admin/admissions", {
      params: compactParams(params),
    });
    return response.data;
  },

  updateAdmission: async (
    id: string,
    updatedFields: AdmissionUpdateRequest
  ): Promise<ApiResponse<AdmissionInfo>> => {
    const response = await apiClient.patch<ApiResponse<AdmissionInfo>>(
      `/admin/admissions/${id}`,
      updatedFields
    );
    return response.data;
  },

  getScores: async (year: number): Promise<ApiResponse<AdmissionInfo[]>> => {
    return AdminApiService.getAdmissions({ year });
  },

  updateScore: async (
    id: string,
    cutoffScore: number,
    combinationCodes?: string[]
  ): Promise<ApiResponse<AdmissionInfo>> => {
    return AdminApiService.updateAdmission(id, { cutoffScore, combinationCodes });
  },

  getNews: async (): Promise<ApiResponse<AdminNews[]>> => {
    const response = await apiClient.get<ApiResponse<AdminNews[]>>("/admin/news");
    return response.data;
  },

  createNews: async (news: Omit<AdminNews, "id" | "views" | "publishedAt">): Promise<ApiResponse<AdminNews>> => {
    const response = await apiClient.post<ApiResponse<AdminNews>>("/admin/news", news);
    return response.data;
  },

  updateNews: async (id: string, updatedFields: Partial<AdminNews>): Promise<ApiResponse<AdminNews>> => {
    const response = await apiClient.patch<ApiResponse<AdminNews>>(`/admin/news/${id}`, updatedFields);
    return response.data;
  },

  deleteNews: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/admin/news/${id}`);
    return response.data;
  },

  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const response = await apiClient.get<ApiResponse<DashboardStats>>("/admin/dashboard");
    return response.data;
  },
};
