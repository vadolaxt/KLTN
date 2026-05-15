import GoogleAuthButton from "@/features/login/components/google-auth";
import Link from "next/link";

interface LoginFormProps {
	email: string;
	setEmail: (val: string) => void;
	password: string;
	setPassword: (val: string) => void;
	error: string;
	isLoading: boolean;
	onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
												 email,
												 setEmail,
												 password,
												 setPassword,
												 error,
												 isLoading,
												 onSubmit,
											 }: LoginFormProps) {
	return (
		<form onSubmit={onSubmit} className="flex flex-col gap-4 w-96 p-8">
			<h1 className="text-2xl font-bold">Đăng nhập</h1>

			{error && <p className="text-red-500 text-sm">{error}</p>}

			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className="border p-2 rounded"
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className="border p-2 rounded"
				required
			/>

			<button
				type="submit"
				className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
				disabled={isLoading}
			>
				{isLoading ? "Đang xử lý..." : "Đăng nhập"}
			</button>

			<GoogleAuthButton />

			<div className="text-center mt-2 text-sm">
				<span className="text-gray-600">Chưa có tài khoản? </span>
				<Link
					href="/register"
					className="text-blue-500 hover:underline font-medium">
					Đăng ký ngay
				</Link>
			</div>
			<div className="text-center mt-2 text-sm">
				<Link
					href="/forget-password"
					className="text-blue-500 hover:underline font-medium">
					Quên mật khẩu
				</Link>
			</div>
		</form>
	);
}