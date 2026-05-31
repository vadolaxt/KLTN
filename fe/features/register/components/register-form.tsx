"use client";

import Link from "next/link";
import {useRegister} from "@/hooks/use-register";
import OTPModal from "@/features/register/components/otp-modal";
import SlidingActionButton from "@/features/auth/components/sliding-action-button";
import {
	ArrowRight,
	CalendarDays,
	Eye,
	EyeOff,
	IdCard,
	KeyRound,
	Mail,
	ShieldCheck,
	UserRound,
} from "lucide-react";
import {useState} from "react";

const inputBase =
	"h-12 w-full rounded-lg border-1.5 bg-[#fafafa] px-4 text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]";
const inputWithIcon = `${inputBase} pl-11`;
const labelBase = "text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid";
const errorBase = "mt-1.5 text-[12px] font-semibold text-red-500";

export default function RegisterForm() {
	const {form, onSubmit, errors, isSubmitting, showOTP, setShowOTP, userEmail, handleVerifyOTP} = useRegister();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const {register, formState} = form;
	const {isValid} = formState;

	return (
		<>
			<form
				onSubmit={onSubmit}
				className="w-full max-w-[560px] rounded-lg border border-green-main/15 bg-white p-6 shadow-[0_20px_55px_rgba(26,74,26,0.16)] sm:p-7"
			>
				<div className="mb-7">
					<div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-green-pale text-green-dark shadow-[0_8px_24px_rgba(45,122,45,0.14)]">
						<UserRound size={24} />
					</div>
					<p className="text-[12px] font-extrabold uppercase tracking-[2px] text-green-main">
						Đăng ký
					</p>
					<h1 className="mt-1 text-[28px] font-black leading-tight text-green-dark">
						Tài khoản
					</h1>
					<p className="mt-2 text-[14px] leading-6 text-text-mid">
						Vui lòng nhập chính xác thông tin cá nhân. Mã OTP sẽ được gửi qua email để hoàn tất đăng ký.
					</p>
				</div>

				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-1.5">
						<label className={labelBase}>
							Họ
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<div className="relative">
							<UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
							<input
								{...register("firstName")}
								placeholder="Nguyễn Văn"
								className={`${inputWithIcon} ${errors.firstName ? "border-red-400" : "border-gray-mid"}`}
								autoComplete="given-name"
							/>
						</div>
						{errors.firstName && <p className={errorBase}>{errors.firstName.message}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className={labelBase}>
							Tên
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<input
							{...register("lastName")}
							placeholder="An"
							className={`${inputBase} ${errors.lastName ? "border-red-400" : "border-gray-mid"}`}
							autoComplete="family-name"
						/>
						{errors.lastName && <p className={errorBase}>{errors.lastName.message}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className={labelBase}>
							Ngày sinh
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<div className="relative">
							<CalendarDays className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
							<input
								{...register("dateOfBirth")}
								type="date"
								className={`${inputWithIcon} ${errors.dateOfBirth ? "border-red-400" : "border-gray-mid"}`}
								autoComplete="bday"
							/>
						</div>
						{errors.dateOfBirth && <p className={errorBase}>{errors.dateOfBirth.message}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className={labelBase}>
							Số CCCD
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<div className="relative">
							<IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
							<input
								{...register("identity")}
								placeholder="12 chữ số"
								className={`${inputWithIcon} ${errors.identity ? "border-red-400" : "border-gray-mid"}`}
								inputMode="numeric"
								maxLength={12}
							/>
						</div>
						{errors.identity && <p className={errorBase}>{errors.identity.message}</p>}
					</div>

					<div className="flex flex-col gap-1.5 sm:col-span-2">
						<label className={labelBase}>
							Email
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
							Mật khẩu
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
								aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
							>
								{showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
							</button>
						</div>
						{errors.password && <p className={errorBase}>{errors.password.message}</p>}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className={labelBase}>
							Xác nhận mật khẩu
							<span className="ml-1 align-super text-[10px] font-bold text-red-500">*</span>
						</label>
						<div className="relative">
							<ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={18} />
							<input
								{...register("confirmPassword")}
								type={showConfirmPassword ? "text" : "password"}
								placeholder="Nhập lại mật khẩu"
								className={`${inputWithIcon} pr-12 ${errors.confirmPassword ? "border-red-400" : "border-gray-mid"}`}
								autoComplete="new-password"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-text-light transition-colors hover:bg-green-pale hover:text-green-dark"
								aria-label={showConfirmPassword ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"}
							>
								{showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
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
					Gửi OTP đăng ký
				</SlidingActionButton>

				<div className="mt-5 rounded-lg bg-green-pale px-4 py-3 text-center text-[14px] text-text-mid">
					<span>Đã có tài khoản? </span>
					<Link href="/login" className="font-extrabold text-green-main transition-colors hover:text-green-dark hover:underline">
						Đăng nhập
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
