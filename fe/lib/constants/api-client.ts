import axios, {AxiosInstance, InternalAxiosRequestConfig} from "axios";
import {ENV_CONFIG as config, isClientSide} from "@/core";


// 1. Hàm dùng chung để xử lý đính kèm Cookie cho Next.js Server-side (SSR)
const handleServerSideCookies = async (axiosConfig: InternalAxiosRequestConfig) => {
	if (axiosConfig.headers?.["X-Skip-Auth"] === "true") {
		delete axiosConfig.headers["X-Skip-Auth"];
		delete axiosConfig.headers.Authorization;
		return axiosConfig;
	}

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
	} else {
		const accessToken = localStorage.getItem("accessToken");
		if (accessToken && !axiosConfig.headers.Authorization) {
			axiosConfig.headers.Authorization = `Bearer ${accessToken}`;
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

type FailedRequest = {
	resolve: (token: string | null) => void;
	reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
	failedQueue.forEach((prom) => {
		if (error) prom.reject(error);
		else prom.resolve(token);
	});
	failedQueue = [];
};

apiClient.interceptors.response.use(
	(response) => {
		const apiStatus = response.data?.status;
		if (typeof apiStatus === "string" && /^\d{3}\s/.test(apiStatus)) {
			response.data.status = apiStatus.replace(/^\d{3}\s+/, "");
		}
		return response;
	},
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
							if (isClientSide()) localStorage.setItem("accessToken", newToken);
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
						if (isClientSide()) {
							localStorage.removeItem("accessToken");
							localStorage.removeItem("isLogin");
							localStorage.removeItem("userName");
							localStorage.removeItem("role");
							localStorage.removeItem("isAdminLogin");
							localStorage.removeItem("adminProfile");
							window.location.href = "/login";
						}
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
