import { z } from "zod";

export const forgetPasswordValidation = z.object({
	email: z.string().email("Email không hợp lệ"),
	password: z.string()
		.min(8, "Mật khẩu phải từ 8 ký tự")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Mật khẩu phải bao gồm chữ hoa, chữ thường và số"),
	confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
	message: "Mật khẩu xác nhận không khớp",
	path: ["confirmPassword"],
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordValidation>;