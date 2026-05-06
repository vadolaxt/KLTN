"use client";

import { useLogin } from "@/hooks/use-login";
import LoginForm from "@/features/login/components/login-form";

export default function LoginView() {
	const loginProps = useLogin();

	return (
		<div className="flex justify-center items-center min-h-screen">
			<LoginForm {...loginProps} onSubmit={loginProps.handleLogin} />
		</div>
	);
}