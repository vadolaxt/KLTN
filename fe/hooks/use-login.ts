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
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
	const isEmailValid = emailPattern.test(email);
	const isPasswordValid = passwordPattern.test(password);
	const emailError = email.length > 0 && !isEmailValid
		? "Vui lòng nhập đúng định dạng email (vd: thisinh@email.com)"
		: "";
	const passwordError = password.length > 0 && !isPasswordValid
		? "Vui lòng nhập đúng định dạng mật khẩu (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt)"
		: "";
	const isFormValid = isEmailValid && isPasswordValid;

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
		emailError,
		passwordError,
		isFormValid,
		handleLogin,
	};
};