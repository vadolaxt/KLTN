import {ApiResponse} from "@/types";
import {apiClient} from "@/lib/constants/api-client";
import {AcademicScoreProfileRequest, AcademicScoreProfileResponse} from "@/types/academicScoreProfile";

export const AcademicScoreProfileService = {
	getAcademicScoreProfile: async (): Promise<ApiResponse<AcademicScoreProfileResponse>> => {
		const response = await apiClient.get<ApiResponse<AcademicScoreProfileResponse>>(
			"/academic-profile",
		);
		return response.data;
	},
	editAcademicScoreProfile: async (request: AcademicScoreProfileRequest): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>(
			"/academic-profile/edit",
			request
		);
		return response.data;
	},

}