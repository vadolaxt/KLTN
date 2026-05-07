"use client";

import Link from "next/link";
import {useRegister} from "@/hooks/use-register";
import OTPModal from "@/features/register/components/otp-modal";
import {Eye, EyeOff} from "lucide-react";
import {useState} from "react";

export default function RegisterForm() {
	const {form, onSubmit, errors, isSubmitting, showOTP, setShowOTP, userEmail, handleVerifyOTP} = useRegister();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const {register} = form;

	return (
		<>
			<form onSubmit={onSubmit} className="flex flex-col gap-4 w-[450px] p-8 border rounded-lg shadow-sm bg-white">
				<h1 className="text-2xl font-bold mb-4">Đăng ký tài khoản</h1>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<input
							{...register("firstName")}
							placeholder="Họ"
							className={`border p-2 rounded w-full ${errors.firstName ? 'border-red-500' : ''}`}
						/>
						{errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
					</div>
					<div>
						<input
							{...register("lastName")}
							placeholder="Tên"
							className={`border p-2 rounded w-full ${errors.lastName ? 'border-red-500' : ''}`}
						/>
						{errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
					</div>
				</div>

				<div>
					<label className="text-sm text-gray-600 block mb-1">Ngày sinh</label>
					<input
						{...register("dateOfBirth")}
						type="date"
						className={`border p-2 rounded w-full ${errors.dateOfBirth ? 'border-red-500' : ''}`}
					/>
					{errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
				</div>

				<div>
					<input
						{...register("identity")}
						placeholder="Số CCCD (12 chữ số)"
						className={`border p-2 rounded w-full ${errors.identity ? 'border-red-500' : ''}`}
					/>
					{errors.identity && <p className="text-red-500 text-xs mt-1">{errors.identity.message}</p>}
				</div>

				<div>
					<input
						{...register("email")}
						type="email"
						placeholder="Email"
						className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : ''}`}
					/>
					{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
				</div>

				<div className="relative">
					<input
						{...register("password")}
						type={showPassword ? "text" : "password"}
						placeholder="Mật khẩu"
						className={`border p-2 rounded w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
					/>
					<button
						type="button"
						onClick={() => setShowPassword(!showPassword)}
						className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
					>
						{showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
					</button>
					{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
				</div>

				{/* Trường Xác nhận mật khẩu */}
				<div className="relative">
					<input
						{...register("confirmPassword")}
						type={showConfirmPassword ? "text" : "password"}
						placeholder="Xác nhận mật khẩu"
						className={`border p-2 rounded w-full pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
					/>
					<button
						type="button"
						onClick={() => setShowConfirmPassword(!showConfirmPassword)}
						className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
					>
						{showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
					</button>
					{errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
				</div>

				<button
					type="submit"
					disabled={isSubmitting}
					className="bg-green-600 text-white p-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors font-bold mt-2"
				>
					{isSubmitting ? "Đang xử lý..." : "Đăng ký ngay"}
				</button>

				<div className="text-center mt-2 text-sm">
					<span className="text-gray-600">Đã có tài khoản? </span>
					<Link href="/login" className="text-blue-500 hover:underline">
						Đăng nhập
					</Link>
				</div>
			</form>

			{/* otp modal pop up */}
			<OTPModal
				isOpen={showOTP}
				onClose={() => setShowOTP(false)}
				email={userEmail}
				onVerify={handleVerifyOTP}
			/>

		</>
	);
}