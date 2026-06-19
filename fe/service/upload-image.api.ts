import {ApiResponse} from "@/types";
import {apiClient} from "@/lib/constants/api-client";

export const UploadImageService = {
	upload: async (formData: FormData): Promise<ApiResponse<string>> => {
		const response = await apiClient.post<ApiResponse<string>>(
			"/cloudinary/upload",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	},
}