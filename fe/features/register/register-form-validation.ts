// xử lý lỗi nếu form nhập sai định dạng (Validation)

import * as z from "zod";

export const registerFormValidation = z.object({
	firstName: z.string().min(1, "Họ không được để trống"),
	lastName: z.string().min(1, "Tên không được để trống"),
	dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
	identity: z.string().length(12, "CCCD phải đúng 12 số"),
	email: z.string().min(1, "Email không được để trống").email("Định dạng email không hợp lệ"),
	password: z.string()
		.min(8, "Mật khẩu phải từ 8 ký tự")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Mật khẩu phải bao gồm chữ hoa, chữ thường và số"),
	confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Mật khẩu xác nhận không khớp",
	path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerFormValidation>;