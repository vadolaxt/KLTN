import {apiClient} from "@/lib/constants/api-client";
import {ApiResponse, AuthRequest, AuthResponse} from "@/types";

export const AuthService = {
	login: async (payload: AuthRequest): Promise<ApiResponse<AuthResponse>> => {
		const response = await apiClient.post<ApiResponse<AuthResponse>>(
			"/auth/login",
			payload
		);
		return response.data;
	},

	logout: async (): Promise<void> => {
		await apiClient.post("/auth/logout");
		window.location.href = "/login";
	},

	/**
	 * Lấy thông tin người dùng hiện tại
	 * Vì JS không đọc được Cookie, đây là cách duy nhất để biết ai đang login
	 */
	getMe: async () => {
		const response = await apiClient.get("/v1/users/me");
		return response.data;
	}
}