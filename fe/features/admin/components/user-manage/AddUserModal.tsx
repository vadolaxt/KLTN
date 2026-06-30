// import React, { useState } from "react";
// import {X, User, Mail, CreditCard, Key} from "lucide-react";
// import { UserCreateRequest } from "@/types/admin";
//
// interface AddUserModalProps {
// 	isOpen: boolean;
// 	onClose: () => void;
// 	onCreateUser: (request: UserCreateRequest) => Promise<void>;
// 	isSubmitting?: boolean;
// }
//
// export default function AddUserModal({
// 													 isOpen,
// 													 onClose,
// 													 onCreateUser,
// 													 isSubmitting = false,
// 												 }: AddUserModalProps) {
// 	const [newFirstName, setNewFirstName] = useState("");
// 	const [newLastName, setNewLastName] = useState("");
// 	const [newEmail, setNewEmail] = useState("");
// 	const [newPassword, setNewPassword] = useState("");
// 	const [newRole, setNewRole] = useState("ROLE_USER");
// 	const [formError, setFormError] = useState("");
//
// 	if (!isOpen) return null;
//
// 	const resetForm = () => {
// 		setNewFirstName("");
// 		setNewLastName("");
// 		setNewEmail("");
// 		setNewPassword("");
// 		setNewRole("ROLE_USER");
// 		setFormError("");
// 	};
//
// 	const handleClose = () => {
// 		if (isSubmitting) return;
// 		resetForm();
// 		onClose();
// 	};
//
// 	const handleSubmit = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setFormError("");
//
// 		if (!newFirstName.trim() || !newLastName.trim() || !newEmail.trim() || !newPassword.trim()) {
// 			setFormError("Vui lòng nhập đầy đủ các trường bắt buộc");
// 			return;
// 		}
//
// 		try {
// 			await onCreateUser({
// 				firstName: newFirstName.trim(),
// 				lastName: newLastName.trim(),
// 				email: newEmail.trim(),
// 				password: newPassword.trim(),
// 				role: newRole,
// 			});
//
// 			resetForm();
// 			onClose();
// 		} catch {
// 			setFormError("Đã xảy ra lỗi khi tạo tài khoản");
// 		}
// 	};
//
// 	return (
// 		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
// 			<div className="bg-white border border-gray-mid rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
// 				<div className="flex justify-between items-center pb-4 border-b border-gray-light mb-5">
// 					<h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">Tạo tài khoản mới</h3>
// 					<button type="button" onClick={handleClose} className="text-text-light hover:text-text-dark" disabled={isSubmitting}>
// 						<X size={18} />
// 					</button>
// 				</div>
//
// 				{formError && (
// 					<div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-semibold">
// 						⚠️ {formError}
// 					</div>
// 				)}
//
// 				<form onSubmit={handleSubmit} className="space-y-4">
// 					<div className="grid grid-cols-2 gap-3">
// 						<div className="flex flex-col gap-1">
// 							<label className="text-[10px] font-black uppercase text-text-mid">Họ *</label>
// 							<div className="relative">
// 								<User className="absolute left-3 top-3 text-green-main" size={13} />
// 								<input
// 									type="text"
// 									value={newLastName}
// 									onChange={(e) => setNewLastName(e.target.value)}
// 									className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
// 									disabled={isSubmitting}
// 									required
// 								/>
// 							</div>
// 						</div>
//
// 						<div className="flex flex-col gap-1">
// 							<label className="text-[10px] font-black uppercase text-text-mid">Tên *</label>
// 							<div className="relative">
// 								<User className="absolute left-3 top-3 text-green-main" size={13} />
// 								<input
// 									type="text"
// 									value={newFirstName}
// 									onChange={(e) => setNewFirstName(e.target.value)}
// 									className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
// 									disabled={isSubmitting}
// 									required
// 								/>
// 							</div>
// 						</div>
// 					</div>
//
// 					<div className="flex flex-col gap-1">
// 						<label className="text-[10px] font-black uppercase text-text-mid">Email *</label>
// 						<div className="relative">
// 							<Mail className="absolute left-3 top-3 text-green-main" size={13} />
// 							<input
// 								type="email"
// 								value={newEmail}
// 								onChange={(e) => setNewEmail(e.target.value)}
// 								className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
// 								disabled={isSubmitting}
// 								required
// 							/>
// 						</div>
// 					</div>
//
// 					<div className="flex flex-col gap-1">
// 						<label className="text-[10px] font-black uppercase text-text-mid">Mật khẩu *</label>
// 						<div className="relative">
// 							<Key className="absolute left-3 top-3 text-green-main" size={13} />
// 							<input
// 								type="text"
// 								value={newPassword}
// 								onChange={(e) => setNewPassword(e.target.value)}
// 								className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-mono"
// 								disabled={isSubmitting}
// 								required
// 							/>
// 						</div>
// 					</div>
//
// 					<div className="flex flex-col gap-1">
// 						<label className="text-[10px] font-black uppercase text-text-mid">Vai trò</label>
// 						<select
// 							value={newRole}
// 							onChange={(e) => setNewRole(e.target.value)}
// 							className="h-10 w-full rounded-xl border border-gray-mid px-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-bold"
// 							disabled={isSubmitting}
// 						>
// 							<option value="USER">Người dùng</option>
// 							<option value="ADMIN">Quản trị viên</option>
// 						</select>
// 					</div>
//
// 					<div className="flex justify-end gap-3 pt-4 border-t border-gray-light mt-5">
// 						<button
// 							type="button"
// 							onClick={handleClose}
// 							className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl disabled:opacity-60"
// 							disabled={isSubmitting}
// 						>
// 							Hủy bỏ
// 						</button>
// 						<button
// 							type="submit"
// 							className="px-4 py-2 bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-60"
// 							disabled={isSubmitting}
// 						>
// 							{isSubmitting ? "Đang thêm..." : "Xác nhận thêm"}
// 						</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// }

import React, { useState } from "react";
import { X, User, Mail, Key } from "lucide-react";
import { UserCreateRequest } from "@/types/admin";

interface AddUserModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAddUser: (request: UserCreateRequest) => Promise<void>;
	isSubmitting?: boolean;
}

export default function AddUserModal({
													 isOpen,
													 onClose,
													 onAddUser,
													 isSubmitting = false,
												 }: AddUserModalProps) {
	const [newFirstName, setNewFirstName] = useState("");
	const [newLastName, setNewLastName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [newRole, setNewRole] = useState("USER");
	const [formError, setFormError] = useState("");

	if (!isOpen) return null;

	const resetForm = () => {
		setNewFirstName("");
		setNewLastName("");
		setNewEmail("");
		setNewPassword("");
		setNewRole("USER");
		setFormError("");
	};

	const handleClose = () => {
		if (isSubmitting) return;
		resetForm();
		onClose();
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError("");

		if (!newFirstName.trim() || !newLastName.trim() || !newEmail.trim() || !newPassword.trim()) {
			setFormError("Vui lòng nhập đầy đủ các trường bắt buộc");
			return;
		}

		try {
			await onAddUser({
				firstName: newFirstName.trim(),
				lastName: newLastName.trim(),
				email: newEmail.trim(),
				password: newPassword.trim(),
				role: newRole,
			});

			resetForm();
			onClose();
		} catch {
			setFormError("Đã xảy ra lỗi khi tạo tài khoản");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
			<div className="bg-white border border-gray-mid rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
				<div className="flex justify-between items-center pb-4 border-b border-gray-light mb-5">
					<h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">Tạo tài khoản mới</h3>
					<button type="button" onClick={handleClose} className="text-text-light hover:text-text-dark" disabled={isSubmitting}>
						<X size={18} />
					</button>
				</div>

				{formError && (
					<div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-semibold">
						⚠️ {formError}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1">
							<label className="text-[10px] font-black uppercase text-text-mid">Họ *</label>
							<div className="relative">
								<User className="absolute left-3 top-3 text-green-main" size={13} />
								<input
									type="text"
									value={newLastName}
									onChange={(e) => setNewLastName(e.target.value)}
									className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
									disabled={isSubmitting}
									required
								/>
							</div>
						</div>

						<div className="flex flex-col gap-1">
							<label className="text-[10px] font-black uppercase text-text-mid">Tên *</label>
							<div className="relative">
								<User className="absolute left-3 top-3 text-green-main" size={13} />
								<input
									type="text"
									value={newFirstName}
									onChange={(e) => setNewFirstName(e.target.value)}
									className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
									disabled={isSubmitting}
									required
								/>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-[10px] font-black uppercase text-text-mid">Email *</label>
						<div className="relative">
							<Mail className="absolute left-3 top-3 text-green-main" size={13} />
							<input
								type="email"
								value={newEmail}
								onChange={(e) => setNewEmail(e.target.value)}
								className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
								disabled={isSubmitting}
								required
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-[10px] font-black uppercase text-text-mid">Mật khẩu *</label>
						<div className="relative">
							<Key className="absolute left-3 top-3 text-green-main" size={13} />
							<input
								type="text"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-mono"
								disabled={isSubmitting}
								required
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-[10px] font-black uppercase text-text-mid">Vai trò</label>
						<select
							value={newRole}
							onChange={(e) => setNewRole(e.target.value)}
							className="h-10 w-full rounded-xl border border-gray-mid px-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-bold"
							disabled={isSubmitting}
						>
							<option value="USER">Người dùng</option>
							<option value="ADMIN">Quản trị viên</option>
						</select>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-gray-light mt-5">
						<button
							type="button"
							onClick={handleClose}
							className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl disabled:opacity-60"
							disabled={isSubmitting}
						>
							Hủy bỏ
						</button>
						<button
							type="submit"
							className="px-4 py-2 bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-60"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Đang thêm..." : "Xác nhận thêm"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}