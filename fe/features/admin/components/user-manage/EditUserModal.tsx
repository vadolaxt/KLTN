import React, { useEffect, useState } from "react";
import { X, User, Mail, CreditCard } from "lucide-react";
import { UserResponse, UserUpdateRequest } from "@/types/admin";

interface EditUserModalProps {
	user: UserResponse | null;
	isOpen: boolean;
	onClose: () => void;
	onUpdateUser: (request: UserUpdateRequest) => Promise<void>;
	isSubmitting?: boolean;
}

const toUiRole = (role?: string) => (role === "ROLE_ADMIN" || role === "ADMIN" ? "ROLE_ADMIN" : "ROLE_USER");

export default function EditUserModal({
													  user,
													  isOpen,
													  onClose,
													  onUpdateUser,
													  isSubmitting = false,
												  }: EditUserModalProps) {
	const [firstName, setFirstName] = useState(user?.firstName || "");
	const [lastName, setLastName] = useState(user?.lastName || "");
	const [email, setEmail] = useState(user?.email || "");
	const [identity, setIdentity] = useState(user?.identity || "");
	const [role, setRole] = useState(toUiRole(user?.role));
	const [formError, setFormError] = useState("");

	useEffect(() => {
		if (isOpen && user) {
			setFirstName(user.firstName || "");
			setLastName(user.lastName || "");
			setEmail(user.email || "");
			setIdentity(user.identity || "");
			setRole(toUiRole(user.role));
			setFormError("");
		}
	}, [user, isOpen]);

	if (!isOpen || !user) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError("");

		if (!firstName.trim() || !lastName.trim() || !email.trim()) {
			setFormError("Vui lòng nhập đầy đủ các trường bắt buộc");
			return;
		}

		try {
			await onUpdateUser({
				id: user.id,
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim(),
				role,
			});
			onClose();
		} catch {
			setFormError("Đã xảy ra lỗi khi cập nhật tài khoản");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
			<div className="bg-white border border-gray-mid rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
				<div className="flex justify-between items-center pb-4 border-b border-gray-light mb-5">
					<h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">Cập nhật tài khoản</h3>
					<button type="button" onClick={onClose} className="text-text-light hover:text-text-dark" disabled={isSubmitting}>
						<X size={18} />
					</button>
				</div>

				{formError && (
					<div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-semibold">
						{formError}
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
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-medium"
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
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-medium"
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
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-medium"
								disabled={isSubmitting}
								required
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-[10px] font-black uppercase text-text-mid">CCCD/CMND (không cho phép chỉnh sửa)</label>
						<div className="relative">
							<CreditCard className="absolute left-3 top-3 text-gray-400" size={13} />
							<input
								type="text"
								value={identity || "Chưa cập nhật"}
								disabled
								className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-mid outline-none bg-gray-100 font-mono cursor-not-allowed"
							/>
						</div>
					</div>

					<div className="flex flex-col gap-1">
						<label className="text-[10px] font-black uppercase text-text-mid">Vai trò</label>
						<select
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="h-10 w-full rounded-xl border border-gray-mid px-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-bold"
							disabled={isSubmitting}
						>
							<option value="ROLE_USER">Người dùng</option>
							<option value="ROLE_ADMIN">Quản trị viên</option>
						</select>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-gray-light mt-5">
						<button
							type="button"
							onClick={onClose}
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
							{isSubmitting ? "Đang lưu..." : "Xác nhận lưu"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
