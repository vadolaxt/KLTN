import {ApiResponse, ChatMessage, ChatRequest} from "@/types";
import {apiClient} from "@/lib/constants/api-client";

export const ChatService = {
	sendMessage: async (request: ChatRequest): Promise<ApiResponse<ChatMessage>> => {
		const response = await apiClient.post<ApiResponse<ChatMessage>>("/chat/send", request);
		return response.data;
	},

	getHistory: async (): Promise<ApiResponse<ChatMessage[]>> => {
		const response = await apiClient.get<ApiResponse<ChatMessage[]>>(`/chat/history`);
		return response.data;
	},
};