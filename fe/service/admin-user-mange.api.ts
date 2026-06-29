import {ApiResponse} from "@/types";
import {UserCreateRequest, UserResponse, UserUpdateRequest} from "@/types/admin";
import {apiClient} from "@/lib/constants/api-client";

export const UserMangeService = {
	getAllUser: async (): Promise<ApiResponse<UserResponse[]>> => {
		const response = await apiClient.get<ApiResponse<UserResponse[]>>("/admin/users");
		return response.data;
	},

	createUser: async (request: UserCreateRequest): Promise<ApiResponse<UserResponse>> => {
		const response = await apiClient.post<ApiResponse<UserResponse>>("/admin/users/create", request);
		return response.data;
	},

	deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>("/admin/users/delete", userId, {
			headers: {"Content-Type": "text/plain"},
		});
		return response.data;
	},

	banUser: async (userId: string): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>("/admin/users/ban", userId, {
			headers: {"Content-Type": "text/plain"},
		});
		return response.data;
	},

	updateUser: async (request: UserUpdateRequest): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>("/admin/users/update", request);
		return response.data;
	},

	addUser: async (request: UserCreateRequest): Promise<ApiResponse<void>> => {
		const response = await apiClient.post<ApiResponse<void>>("/admin/users/add", request);
		return response.data;
	},
};
