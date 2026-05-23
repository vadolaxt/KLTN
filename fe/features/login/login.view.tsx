"use client";

import { useLogin } from "@/hooks/use-login";
import LoginForm from "@/features/login/components/login-form";
import AuthShell from "@/features/auth/components/auth-shell";

export default function LoginView() {
	const loginProps = useLogin();

	return (
		<AuthShell mode="login">
			<LoginForm {...loginProps} onSubmit={loginProps.handleLogin} />
		</AuthShell>
	);
}
