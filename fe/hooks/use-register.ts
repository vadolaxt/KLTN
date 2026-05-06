import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "@/service/auth.api";
import { RegisterFormData, registerFormValidation } from "@/features/register/register-form-validation";
import axios from "axios";

export const useRegister = () => {
	const router = useRouter();
	const [showOTP, setShowOTP] = useState(false);
	const [formData, setFormData] = useState<RegisterFormData | null>(null);

	const form = useForm<RegisterFormData>({
		resolver: zodResolver(registerFormValidation),
		defaultValues: {
			firstName: "", lastName: "", email: "", identity: "", password: "", confirmPassword: "",
		}
	});

	// Bước 1 & 2: Check User và Send OTP
	const onSubmit = async (data: RegisterFormData) => {
		try {
			// 1. Kiểm tra user tồn tại chưa
			await AuthService.checkUser(data);

			// 2. Nếu checkUser không ném lỗi (OK), tiến hành gửi OTP
			const otpResponse = await AuthService.sendOtp(data.email);

			if (otpResponse) {
				setFormData(data);
				setShowOTP(true);
				toast.success(`Mã OTP đã được gửi đến ${data.email}`);
			}

		} catch (error: any) {
			if (axios.isAxiosError(error)) {
				const message = error.response?.data?.message || "Kiểm tra tài khoản thất bại";
				toast.error(message);
			} else {
				toast.error("Đã xảy ra lỗi hệ thống");
			}
		}
	};

	// Bước 3: Xác thực OTP và Đăng ký chính thức
	const handleVerifyOTP = async (otp: string) => {
		if (!formData) return;

		try {
			const registerPayload = {
				...formData,
				otp: otp
			};

			const result = await AuthService.register(registerPayload);

			if (result) {
				toast.success("Đăng ký tài khoản thành công!");
				setShowOTP(false);

				setTimeout(() => {
					router.push("/login");
				}, 1500);
			}
		} catch (error: any) {
			// Nếu OTP sai, backend thường trả về lỗi 400/401
			const message = error.response?.data?.message || "Mã OTP không hợp lệ hoặc đã hết hạn";
			toast.error(message);
			throw error; // Ném lỗi để Modal xử lý reset OTP (nếu cần)
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