"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import OTPModal from "@/features/register/components/otp-modal";
import {useForgetPassword} from "@/hooks/use-forget-password";

export default function ForgetPasswordForm() {
	const { form, onSubmit, errors, isSubmitting, showOTP, setShowOTP, userEmail, handleVerifyOTP } = useForgetPassword();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { register } = form;

	return (
		<>
			<form onSubmit={onSubmit} className="flex flex-col gap-4 w-[450px] p-8 border rounded-lg shadow-sm bg-white">
				<div className="mb-4">
					<h1 className="text-2xl font-bold">Quên mật khẩu</h1>
					<p className="text-sm text-gray-500">Nhập email và mật khẩu mới của bạn</p>
				</div>

				<div>
					<input
						{...register("email")}
						type="email"
						placeholder="Email khôi phục"
						className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
					/>
					{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
				</div>

				<div className="relative">
					<input
						{...register("password")}
						type={showPassword ? "text" : "password"}
						placeholder="Mật khẩu mới"
						className={`border p-2 rounded w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
					>
						{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
					{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
				</div>

				<div className={"relative"}>
					<input
						{...register("confirmPassword")}
						type={showConfirmPassword ? "text" : "password"}
						placeholder="Xác nhận mật khẩu mới"
						className={`border p-2 rounded w-full pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
					>
						{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
					</button>
					{errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors font-bold mt-2"
				>
					{isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
				</button>

				<div className="text-center mt-2 text-sm">
					<Link href="/login" className="text-blue-500 hover:underline">
						Quay lại đăng nhập
					</Link>
				</div>
			</form>

			<OTPModal
				isOpen={showOTP}
				onClose={() => setShowOTP(false)}
				email={userEmail}
				onVerify={handleVerifyOTP}
			/>
		</>
	);
}