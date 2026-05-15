import {string} from "zod";

export interface ApiResponse<T> {
	status: string;
	message: string;
	data: T;
}

export interface AuthRequest {
	email: string;
	password: string;
}

export interface AuthResponse {
	accessToken: string;
	refreshToken: string;
	authenticated: boolean;
}

export interface RegisterRequest {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	otp?: string;
}

export interface ForgetPasswordRequest {
	email: string;
	newPassword: string;
	otp?: string;
}

export interface ChatMessage {
	role: "USER" | "CHATBOT";
	content: string;
	timestamp?: string;
}

export interface ChatRequest {
	// sessionId: string;
	content: string;
}

export default interface UserProfileResponse {
	firstName: string;
	lastName: string;
	dob: string;
	identity: string;
	email: string;
}