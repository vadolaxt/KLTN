"use client";

import {useState} from "react";
import {AuthService} from "@/service/auth.api";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function LoginView() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		try {
			const result = await AuthService.login({email, password});

			if (result.status === "OK" || result.data?.authenticated) {
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
		}
	};

	return (
		<form onSubmit={handleLogin} className="flex flex-col gap-4 w-96 p-8">
			<h1>Đăng nhập</h1>
			{error && <p className="text-red-500">{error}</p>}

			<input
				type="email"
				placeholder="Email"
				onChange={(e) => setEmail(e.target.value)}
				className="border p-2"
				required
			/>
			<input
				type="password"
				placeholder="Password"
				onChange={(e) => setPassword(e.target.value)}
				className="border p-2"
				required
			/>

			<button type="submit" className="bg-blue-500 text-white p-2">
				Đăng nhập
			</button>
		</form>
	);
}