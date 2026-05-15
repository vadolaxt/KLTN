import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthService } from "@/service/auth.api";

export const useLogin = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		try {
			const result = await AuthService.login({ email, password });

			if (result.status === "OK" || result.data?.authenticated) {
				localStorage.setItem("isLogin", "true");

				router.push("/homepage");
				router.refresh();
			} else {
				setError(result.message || "Đăng nhập thất bại");
			}
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const serverMessage = err.response?.data?.message;
				setError(serverMessage || "Đăng nhập thất bại");
			} else {
				setError("Đã xảy ra lỗi hệ thống");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return {
		email,
		setEmail,
		password,
		setPassword,
		error,
		isLoading,
		handleLogin,
	};
};