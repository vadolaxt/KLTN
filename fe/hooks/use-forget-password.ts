import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/service/auth.api";
import {forgetPasswordValidation} from "@/features/forget-password/forget-password-validation";
import {ForgetPasswordFormData} from "@/features/forget-password/forget-password-validation";
import axios from "axios";

export const useForgetPassword = () => {
	const router = useRouter();
	const [showOTP, setShowOTP] = useState(false);
	const [formData, setFormData] = useState<ForgetPasswordFormData | null>(null);

	const form = useForm<ForgetPasswordFormData>({
		resolver: zodResolver(forgetPasswordValidation),
		mode: "onChange",
		reValidateMode: "onChange",
		defaultValues: { email: "", password: "", confirmPassword: "" }
	});

	const onSubmit = async (data: ForgetPasswordFormData) => {
		try {
			// Gửi OTP để xác nhận đây chính là chủ sở hữu email
			await AuthService.sendOtp(data.email);
			setFormData(data);
			setShowOTP(true);
			toast.success(`Mã xác thực đã được gửi đến ${data.email}`);
		} catch (error: unknown) {
			const message = axios.isAxiosError(error)
				? error.response?.data?.message || "Không thể gửi OTP"
				: "Không thể gửi OTP";
			toast.error(message);
		}
	};

	const handleVerifyOTP = async (otp: string) => {
		if (!formData) return;
		try {
			// Gọi API forgetPassword với payload gồm email, mật khẩu mới và otp
			await AuthService.forgetPassword({
				email: formData.email,
				newPassword: formData.password,
				otp: otp
			});

			toast.success("Đổi mật khẩu thành công!");
			setShowOTP(false);
			setTimeout(() => router.push("/login"), 1500);
		} catch (error: unknown) {
			const message = axios.isAxiosError(error)
				? error.response?.data?.message || "Mã OTP không hợp lệ"
				: "Mã OTP không hợp lệ";
			toast.error(message);
			throw error;
		}
	};

	return {
		form,
		onSubmit: form.handleSubmit(onSubmit),
		isSubmitting: form.formState.isSubmitting,
		errors: form.formState.errors,
		showOTP,
		setShowOTP,
		userEmail: formData?.email || "",
		handleVerifyOTP,
	};
};
