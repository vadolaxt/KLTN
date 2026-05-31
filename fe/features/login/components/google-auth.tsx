"use client";

import {GoogleLogin, CredentialResponse} from '@react-oauth/google';
import {useRouter} from 'next/navigation';
import axios from 'axios';
import {useState} from 'react';
import {ENV_CONFIG} from "@/core";
import {toast} from "sonner";
import {Loader2} from "lucide-react";

export default function GoogleAuthButton() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleSuccess = async (credentialResponse: CredentialResponse) => {
		setIsLoading(true);
		try {
			// credentialResponse.credential chính là ID TOKEN (eyJ...)
			const res = await axios.post(
				`${ENV_CONFIG.serverUrl}/auth/login-google`,
				{idToken: credentialResponse.credential},
				{withCredentials: true}
			);

			if (res.status === 200) {
				localStorage.setItem("isLogin", "true");
				toast.success("Đăng nhập thành công!");
				router.push("/homepage");
				router.refresh();
			}
		} catch (error: unknown) {
			let message = "Đã xảy ra lỗi";
			if (axios.isAxiosError(error)) {
				message = error.response?.data?.message || error.message;
			} else if (error instanceof Error) {
				message = error.message;
			}
			toast.error("Lỗi xác thực: " + message);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="relative w-full">
			{/* Overlay loading nếu cần */}
			{isLoading && (
				<div
					className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
					<Loader2 className="h-4 w-4 animate-spin"/>
				</div>
			)}

			<GoogleLogin
				onSuccess={handleSuccess}
				onError={() => toast.error("Login Failed")}
				useOneTap={false}
				theme="outline"
				size="large"
				text="signin_with"
				shape="rectangular"
			/>
		</div>
	);
}
