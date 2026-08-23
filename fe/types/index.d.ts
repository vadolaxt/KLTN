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
	role: string;
	userName: string;
}

export interface RegisterRequest {
	firstName: string;
	lastName: string;
	dateOfBirth: string;
	identity: string;
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

export interface IdentityCard {
	number: string;
	issuedDate: string;
	issuedPlace: string;
}

export interface CertificateResult {
	certificateType: string;
	organization: string;
	issuedDate: string;
	score: number;
}

export interface CandidateProfileRequest {
	firstName: string;
	lastName: string;
	dob: string;
	email: string;
	identityCard: IdentityCard;
	sex: string;
	ethnic: string;
	graduateYear: string;
	birthPlace: string;
	address: string;
	priorityArea: string;
	priorityGroup: string;
}

export interface CandidateProfileResponse {
	firstName: string;
	lastName: string;
	dob: string;
	email: string;
	identityCard: IdentityCard;
	sex: string;
	ethnic: string;
	graduateYear: string;
	birthPlace: string;
	address: string;
	priorityArea: string;
	priorityGroup: string;
	certificateResult: CertificateResult;
}

export interface CertificateResultRequest {
	certificateType: string;
	organization: string;
	issuedDate: string;
	score: number;
	imageUrl: string;
}
