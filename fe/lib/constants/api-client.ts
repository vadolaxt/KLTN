// import axios from "axios";
// import {ENV_CONFIG as config, isClientSide, isServerSide} from "@/core";
//
// export const apiClient = axios.create({
// 	baseURL: config.serverUrl,
// 	withCredentials: true,
// 	headers: {
// 		"Content-Type": "application/json",
// 		Accept: "application/json",
// 	},
// });
//
// apiClient.interceptors.request.use(async (axiosConfig) => {
// 	if (isServerSide()) {
// 		try {
// 			// CHỈ import next/headers khi đang ở server
// 			const {cookies} = await import("next/headers");
// 			const cookieStore = await cookies();
// 			const allCookies = cookieStore.toString();
// 			if (allCookies) {
// 				axiosConfig.headers.Cookie = allCookies;
// 			}
// 		} catch (error) {
// 			console.error("Error setting server-side cookies:", error);
// 		}
// 	}
// 	return axiosConfig;
// });
//
// apiClient.interceptors.response.use(
// 	(response) => response,
// 	async (error) => {
// 		const originalRequest = error.config;
//
// 		// 1. Kiểm tra nếu lỗi 401 và không phải là request đang đi refresh chính nó
// 		if (
// 			error.response?.status === 401 &&
// 			!originalRequest._retry &&
// 			!originalRequest.url?.includes("/auth/refresh") &&
// 			!originalRequest.url?.includes("/auth/login") &&
// 			!originalRequest.url?.includes("/auth/register")
//
// 		) {
// 			originalRequest._retry = true;
//
// 			try {
// 				// 2. Gọi refresh token
// 				// Trình duyệt sẽ tự gửi refreshToken cookie (vì path /v1/auth/refresh khớp)
// 				await apiClient.post("/auth/refresh");
//
// 				// 3. Thực hiện lại request ban đầu với cookie mới đã được cập nhật
// 				return apiClient(originalRequest);
// 			} catch (refreshError) {
// 				// 4. Nếu refresh thất bại (ví dụ Refresh Token cũng hết hạn)
// 				if (typeof window !== "undefined") {
// 					window.location.href = "/login";
// 				}
// 				return Promise.reject(refreshError);
// 			}
// 		}
//
// 		return Promise.reject(error);
// 	}
// );

import axios, {AxiosInstance, InternalAxiosRequestConfig} from "axios";
import {ENV_CONFIG as config, isClientSide} from "@/core";


// 1. Hàm dùng chung để xử lý đính kèm Cookie cho Next.js Server-side (SSR)
const handleServerSideCookies = async (axiosConfig: InternalAxiosRequestConfig) => {
	if (typeof window === "undefined") {
		try {
			const {cookies} = await import("next/headers");
			const cookieStore = await cookies();
			const allCookies = cookieStore.toString();
			if (allCookies) {
				axiosConfig.headers.Cookie = allCookies;
			}
		} catch (e) {
			console.error("[SSR] Error getting cookies:", e);
		}
	}
	return axiosConfig;
};

// 2. Tạo Instance chính
export const apiClient: AxiosInstance = axios.create({
	baseURL: config.serverUrl,
	withCredentials: true, // Quan trọng: Để gửi/nhận Cookie ở Client-side
});

// 3. Tạo Instance sạch để Refresh
const refreshClient: AxiosInstance = axios.create({
	baseURL: config.serverUrl,
	withCredentials: true, // Quan trọng: Refresh phải mang theo refreshToken trong Cookie
});

// 4. Đăng ký Request Interceptor cho CẢ HAI instance
apiClient.interceptors.request.use(handleServerSideCookies);
refreshClient.interceptors.request.use(handleServerSideCookies);

// -------------------------------------------------------------------------
// LOGIC REFRESH TOKEN
// -------------------------------------------------------------------------

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve(token);
	});
	failedQueue = [];
};

apiClient.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Nếu lỗi 401 và request chưa từng retry
		if (error.response?.status === 401 && !originalRequest._retry) {

			// Nếu chính API refresh bị lỗi 401 (Refresh Token hết hạn) -> Logout
			if (originalRequest.url?.includes("/auth/refresh")) {
				if (isClientSide()) window.location.href = "/login";
				return Promise.reject(error);
			}

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({resolve, reject});
				})
					.then((token) => {
						originalRequest.headers["Authorization"] = `Bearer ${token}`;
						return apiClient(originalRequest);
					})
					.catch((err) => Promise.reject(err));
			}

			originalRequest._retry = true;
			isRefreshing = true;

			return new Promise((resolve, reject) => {
				refreshClient
					.post("/auth/refresh", {}, {
						// Xóa Authorization cũ để tránh Spring Security Filter chặn nhầm AccessToken die
						headers: {Authorization: ""}
					})
					.then(async (res) => {
						const newToken = res.data?.data?.accessToken;

						if (newToken) {
							// Lưu vào bộ nhớ instance để các request sau tự động lấy dùng
							apiClient.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

							// Gán cho request hiện tại đang bị lỗi
							originalRequest.headers["Authorization"] = `Bearer ${newToken}`;

							processQueue(null, newToken);

							// Delay 150ms để trình duyệt cập nhật kịp Set-Cookie (AccessToken mới)
							await new Promise((r) => setTimeout(r, 150));

							resolve(apiClient(originalRequest));
						} else {
							throw new Error("No token received");
						}
					})
					.catch((refreshError) => {
						processQueue(refreshError, null);
						if (isClientSide()) window.location.href = "/login";
						reject(refreshError);
					})
					.finally(() => {
						isRefreshing = false;
					});
			});
		}
		return Promise.reject(error);
	}
);