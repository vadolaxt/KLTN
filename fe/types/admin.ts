export interface UserResponse {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	identity: string;
	role: string;
	status: string;
}

export interface UserUpdateRequest {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	role: string;
}

export interface UserCreateRequest {
	email: string;
	firstName: string;
	lastName: string;
	password: string;
	role: string;
}