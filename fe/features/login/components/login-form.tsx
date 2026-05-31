import GoogleAuthButton from "@/features/login/components/google-auth";
import SlidingActionButton from "@/features/auth/components/sliding-action-button";
import Link from "next/link";
import {
	AlertCircle,
	ArrowRight,
	KeyRound,
	LockKeyhole,
	Mail,
	Sparkles,
} from "lucide-react";

interface LoginFormProps {
	email: string;
	setEmail: (val: string) => void;
	password: string;
	setPassword: (val: string) => void;
	error: string;
	isLoading: boolean;
	emailError: string;
	passwordError: string;
	isFormValid: boolean;
	onSubmit: (e: React.FormEvent) => void;
}

export default function LoginForm({
												 email,
												 setEmail,
												 password,
												 setPassword,
												 error,
												 isLoading,
												 emailError,
												 passwordError,
												 isFormValid,
												 onSubmit,
											 }: LoginFormProps) {
				const errorBase = "mt-1.5 text-[12px] font-semibold text-red-500";
	return (
		<form
			onSubmit={onSubmit}
			className="w-full max-w-[460px] rounded-lg border border-green-main/15 bg-white p-6 shadow-[0_20px_55px_rgba(26,74,26,0.16)] sm:p-7"
		>
			<div className="mb-7">
				<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-pale text-green-dark shadow-[0_8px_24px_rgba(45,122,45,0.14)]">
					<LockKeyhole size={24} />
				</div>
				<p className="text-[12px] font-extrabold uppercase tracking-[2px] text-green-main">
					Đăng nhập
				</p>
				<h1 className="mt-1 text-[28px] font-black leading-tight text-green-dark">
					Hệ thống hỗ trợ tuyển sinh
				</h1>
				<p className="mt-2 text-[14px] leading-6 text-text-mid">
					Vui lòng đăng nhập để tiếp tục sử dụng các chức năng dành cho thí sinh.
				</p>
			</div>

			{error && (
				<div className="mb-5 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-[13px] font-medium text-red-600">
					<AlertCircle size={17} className="mt-0.5 shrink-0" />
					<span>{error}</span>
				</div>
			)}

			<div className="space-y-4">
				<div className="flex flex-col gap-1.5">
					<label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">
						Email
						<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
					</label>
					<div className="relative">
						<Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
						<input
							type="email"
							placeholder="thisinh@email.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="h-12 w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] pl-11 pr-4 text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]"
							autoComplete="email"
							required
						/>
					</div>
					{emailError && <p className={errorBase}>{emailError}</p>}
				</div>

				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between gap-3">
						<label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">
							Mật khẩu
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<Link
							href="/forget-password"
							className="text-[12px] font-bold text-green-main transition-colors hover:text-green-dark hover:underline"
						>
							Quên mật khẩu?
						</Link>
					</div>
					<div className="relative">
						<KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
						<input
							type="password"
							placeholder="Nhập mật khẩu"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="h-12 w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] pl-11 pr-4 text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]"
							autoComplete="current-password"
							required
						/>
					</div>
					{passwordError && <p className={errorBase}>{passwordError}</p>}
				</div>
			</div>

			<SlidingActionButton
				type="submit"
				isLoading={isLoading}
				disabled={!isFormValid}
				loadingText="Đang đăng nhập..."
				icon={<ArrowRight size={18} />}
				className="mt-6"
			>
				Đăng nhập
			</SlidingActionButton>

			<div className="my-5 flex items-center gap-3">
				<div className="h-px flex-1 bg-gray-mid" />
				<span className="text-[12px] font-bold uppercase tracking-[1px] text-text-light">
					Hoặc
				</span>
				<div className="h-px flex-1 bg-gray-mid" />
			</div>

			<div className="google-login-button h-12 w-full overflow-hidden rounded-lg">
				<GoogleAuthButton />
			</div>

			<div className="mt-6 rounded-lg bg-green-pale px-4 py-3 text-center text-[14px] text-text-mid">
				<span>Chưa có tài khoản? </span>
				<Link
					href="/register"
					className="font-extrabold text-green-main transition-colors hover:text-green-dark hover:underline"
				>
					Đăng ký ngay
				</Link>
			</div>
		</form>
	);
}
