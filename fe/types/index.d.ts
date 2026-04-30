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