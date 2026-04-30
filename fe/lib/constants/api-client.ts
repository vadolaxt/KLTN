import axios from "axios";
import {ENV_CONFIG as config, isClientSide, isServerSide} from "@/core";

export const apiClient = axios.create({
	baseURL: config.serverUrl,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
});

apiClient.interceptors.request.use(async (axiosConfig) => {
	if (isServerSide()) {
		try {
			// CHỈ import next/headers khi đang ở server
			const {cookies} = await import("next/headers");
			const cookieStore = await cookies();
			const allCookies = cookieStore.toString();
			if (allCookies) {
				axiosConfig.headers.Cookie = allCookies;
			}
		} catch (error) {
			console.error("Error setting server-side cookies:", error);
		}
	}
	return axiosConfig;
});

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// 1. Kiểm tra nếu lỗi 401 và không phải là request đang đi refresh chính nó
		if (
			error.response?.status === 401 &&
			!originalRequest._retry &&
			!originalRequest.url?.includes("/v1/auth/refresh")
		) {
			originalRequest._retry = true;

			try {
				// 2. Gọi refresh token
				// Trình duyệt sẽ tự gửi refreshToken cookie (vì path /v1/auth/refresh khớp)
				await apiClient.post("/v1/auth/refresh");

				// 3. Thực hiện lại request ban đầu với cookie mới đã được cập nhật
				return apiClient(originalRequest);
			} catch (refreshError) {
				// 4. Nếu refresh thất bại (ví dụ Refresh Token cũng hết hạn)
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);