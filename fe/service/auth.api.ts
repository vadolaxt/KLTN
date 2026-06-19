import {apiClient} from "@/lib/constants/api-client";
import {ApiResponse, AuthRequest, AuthResponse, ForgetPasswordRequest, RegisterRequest} from "@/types";

export const AuthService = {
	login: async (request: AuthRequest): Promise<ApiResponse<AuthResponse>> => {
		const response = await apiClient.post<ApiResponse<AuthResponse>>(
			"/auth/login",
			request
		);
		return response.data;
	},

	register: async (request: RegisterRequest): Promise<ApiResponse<string>> => {
		const response = await apiClient.post<ApiResponse<string>>(`/auth/register`, request);
		return response.data;
	},

	checkUser: async (request: RegisterRequest): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>("/auth/check-user", request);
		return response.data;
	},

	sendOtp: async (email: string): Promise<ApiResponse<number>> => {
		const response = await apiClient.post<ApiResponse<number>>("/auth/send-otp", {email});
		return response.data;
	},

	logout: async () => {
		const response = await apiClient.post(`/auth/logout`);
		return response.status;
	},

	forgetPassword: async (request: ForgetPasswordRequest): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>(`auth/forget-password`, request)
		return response.data
	},
}