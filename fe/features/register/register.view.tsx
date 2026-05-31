"use client"

import RegisterForm from "@/features/register/components/register-form";
import AuthShell from "@/features/auth/components/auth-shell";

export default function RegisterView() {
	return (
		<AuthShell mode="register">
			<RegisterForm/>
		</AuthShell>
	)
}
