// xử lý lỗi nếu form nhập sai định dạng (Validation)

import * as z from "zod";

export const registerFormValidation = z.object({
	firstName: z.string().min(1, "Họ không được để trống"),
	lastName: z.string().min(1, "Tên không được để trống"),
	dateOfBirth: z.string().min(1, "Ngày sinh không được để trống"),
	identity: z
		.string()
		.min(1, "CCCD không được để trống")
		.regex(/^\d{12}$/, "Vui lòng nhập đúng định dạng CCCD gồm 12 chữ số"),
	email: z
		.string()
		.min(1, "Email không được để trống")
		.email("Vui lòng nhập đúng định dạng email (vd: thisinh@email.com)"),
	password: z.string()
		.min(8, "Vui lòng nhập đúng định dạng mật khẩu (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt)")
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, "Vui lòng nhập đúng định dạng mật khẩu (tối thiểu 8 ký tự, gồm chữ hoa, chữ thường, số, ký tự đặc biệt)"),
	confirmPassword: z.string().min(1, "Vui lòng nhập xác nhận mật khẩu"),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Mật khẩu xác nhận không khớp",
	path: ["confirmPassword"],
});

export type RegisterFormData = z.infer<typeof registerFormValidation>;