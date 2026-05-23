"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";
import OTPModal from "@/features/register/components/otp-modal";
import {useForgetPassword} from "@/hooks/use-forget-password";
import SlidingActionButton from "@/features/auth/components/sliding-action-button";

const inputBase =
	"h-12 w-full rounded-lg border-1.5 bg-[#fafafa] px-4 text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]";
const inputWithIcon = `${inputBase} pl-11`;
const labelBase = "text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid";
const errorBase = "mt-1.5 text-[12px] font-semibold text-red-500";

export default function ForgetPasswordForm() {
	const { form, onSubmit, errors, isSubmitting, showOTP, setShowOTP, userEmail, handleVerifyOTP } = useForgetPassword();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { register, formState } = form;
	const { isValid } = formState;

	return (
		<>
			<form
				onSubmit={onSubmit}
				className="w-full max-w-[460px] rounded-lg border border-green-main/15 bg-white p-6 shadow-[0_20px_55px_rgba(26,74,26,0.16)] sm:p-7"
			>
				<div className="mb-7">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-pale text-green-dark shadow-[0_8px_24px_rgba(45,122,45,0.14)]">
						<ShieldCheck size={24} />
					</div>
					<p className="text-[12px] font-extrabold uppercase tracking-[2px] text-green-main">
						Quên mật khẩu
					</p>
					<h1 className="mt-1 text-[28px] font-black leading-tight text-green-dark">
						Đặt lại mật khẩu
					</h1>
					<p className="mt-2 text-[14px] leading-6 text-text-mid">
						Hệ thống sẽ gửi mã OTP đến email đã đăng ký để xác minh và cập nhật mật khẩu mới.
					</p>
				</div>

				<div className="space-y-4">
					<div className="flex flex-col gap-1.5">
						<label className={labelBase}>
							Email khôi phục
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<div className="relative">
							<Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
							<input
								{...register("email")}
								type="email"
								placeholder="thisinh@email.com"
								className={`${inputWithIcon} ${errors.email ? "border-red-400" : "border-gray-mid"}`}
								autoComplete="email"
							/>
						</div>
						{errors.email && <p className={errorBase}>{errors.email.message}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className={labelBase}>
							Mật khẩu mới
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<div className="relative">
							<KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
							<input
								{...register("password")}
								type={showPassword ? "text" : "password"}
								placeholder="Tối thiểu 8 ký tự"
								className={`${inputWithIcon} pr-12 ${errors.password ? "border-red-400" : "border-gray-mid"}`}
								autoComplete="new-password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-light transition-colors hover:bg-green-pale hover:text-green-dark"
								aria-label={showPassword ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"}
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.password && <p className={errorBase}>{errors.password.message}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className={labelBase}>
							Xác nhận mật khẩu mới
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<div className="relative">
							<ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
							<input
								{...register("confirmPassword")}
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Nhập lại mật khẩu mới"
								className={`${inputWithIcon} pr-12 ${errors.confirmPassword ? "border-red-400" : "border-gray-mid"}`}
								autoComplete="new-password"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-light transition-colors hover:bg-green-pale hover:text-green-dark"
								aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
							>
								{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>
						{errors.confirmPassword && <p className={errorBase}>{errors.confirmPassword.message}</p>}
					</div>
				</div>

				<SlidingActionButton
					type="submit"
					isLoading={isSubmitting}
					disabled={!isValid}
					loadingText="Đang gửi OTP..."
					icon={<ArrowRight size={18} />}
					className="mt-6"
				>
					Gửi OTP đặt lại mật khẩu
				</SlidingActionButton>

				<Link
					href="/login"
					className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-mid bg-white px-4 py-3 text-[14px] font-extrabold text-text-mid transition-all hover:border-green-light hover:bg-green-pale hover:text-green-dark"
				>
					<ArrowLeft size={17} />
					Quay lại đăng nhập
				</Link>
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
