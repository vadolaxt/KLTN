import {ApiResponse, AuthRequest, AuthResponse} from "@/types";
import {apiClient} from "@/lib/constants/api-client";

export const AcademicScoreProfileService = {
	// getAcademicScoreProfile: async (request: String)""
	login: async (request: AuthRequest): Promise<ApiResponse<AuthResponse>> => {
		const response = await apiClient.post<ApiResponse<AuthResponse>>(
			"/academic-profile",
			request
		);
		return response.data;
	},
}