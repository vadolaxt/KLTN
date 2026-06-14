import {ApiResponse, CandidateProfileRequest, CandidateProfileResponse, CertificateResultRequest} from "@/types";
import {apiClient} from "@/lib/constants/api-client";

export const CandidateProfileService = {
	getProfile: async (): Promise<ApiResponse<CandidateProfileResponse>> => {
		const response = await apiClient.get<ApiResponse<CandidateProfileResponse>>(
			"/profile",
		);
		return response.data;
	},
	editProfile: async (request: CandidateProfileRequest): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>(
			"profile/edit",
			request
		);
		return response.data;
	},
	editCertificate: async (request: CertificateResultRequest): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>(
			"profile/edit-certificate",
			request
		);
		return response.data;
	}
}