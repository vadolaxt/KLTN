import {ApiResponse} from "@/types";
import {apiClient} from "@/lib/constants/api-client";
import {FQA} from "@/types/fqa";

export const FQAService = {
	getAllFQA: async (): Promise<ApiResponse<FQA>> => {
		const response = await apiClient.get<ApiResponse<FQA>>(
			"/fqa"
		);
		return response.data;
	},

	addFQA: async (fqaData: FQA): Promise<ApiResponse<null>> => {
		const response = await apiClient.post<ApiResponse<null>>(
			"/fqa/add", fqaData);
		return response.data;
	},

	editFQA: async (fqaData: FQA): Promise<ApiResponse<null>> => {
		const response = await apiClient.post<ApiResponse<null>>(
			"/fqa/edit", fqaData);
		return response.data;
	},

	deleteFQA: async (id: string): Promise<ApiResponse<null>> => {
		const response = await apiClient.post<ApiResponse<null>>(
			"/fqa/delete",
			id,
			{headers: {'Content-Type': 'text/plain'}}
		);
		return response.data;
	}
}