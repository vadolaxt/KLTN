import { z } from "zod";

export const forgetPasswordValidation = z.object({
	email: z.string().email("Vui lòng nhập đúng định dạng email (vd: thisinh@email.com)"),
	password: z.string()
		.min(8, "Vui lòng nhập đúng định dạng mật khẩu (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt)")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, "Vui lòng nhập đúng định dạng mật khẩu (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt)"),
	confirmPassword: z.string().min(1, "Vui lòng nhập xác nhận mật khẩu")
}).refine((data) => data.password === data.confirmPassword, {
	message: "Mật khẩu xác nhận không khớp",
	path: ["confirmPassword"],
});

export type ForgetPasswordFormData = z.infer<typeof forgetPasswordValidation>;