import {ApiResponse} from "@/types";
import {apiClient} from "@/lib/constants/api-client";
import {MajorScoreResponse, ViewScoreResponse} from "@/types/scoreSupport";

export const ViewScoresService = {
	getUserScore: async (): Promise<ApiResponse<ViewScoreResponse>> => {
		const response = await apiClient.get<ApiResponse<ViewScoreResponse>>(
			"/score"
		);
		return response.data;
	},

	getMajorScore: async (): Promise<ApiResponse<MajorScoreResponse>> => {
		const response = await apiClient.get<ApiResponse<MajorScoreResponse>>(
			"/score/major"
		);
		return response.data;
	},

}