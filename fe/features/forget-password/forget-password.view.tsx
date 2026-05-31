"use client";

import ForgetPasswordForm from "@/features/forget-password/components/forget-password-form";
import AuthShell from "@/features/auth/components/auth-shell";

export default function ForgetPasswordView(){

	return (
		<AuthShell mode="forgot">
			<ForgetPasswordForm />
		</AuthShell>
	)
}
