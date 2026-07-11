import React from "react";
import {Lock, Trash2, Pencil, Unlock} from "lucide-react";
import {UserResponse} from "@/types/admin";

interface UserTableProps {
	users: UserResponse[];
	isLoading: boolean;
	onEdit: (user: UserResponse) => void;
	onUpdateRole: (id: string, role: string) => Promise<void> | void;
	onToggleStatus: (id: string, currentStatus: string) => Promise<void> | void;
	onConfirmDelete: (id: string) => void;
}

const getStatusLabel = (status: string) => {
	if (status === "ACTIVE") return "Hoạt động";
	if (status === "BANNED") return "Bị khóa";
	if (status === "INACTIVE") return "Chưa kích hoạt";
	return status || "Không xác định";
};

const formatRole = (role?: string) => {
	if (!role) return '-';

	if (role === 'ROLE_USER' || role === 'USER') {
		return 'Người dùng';
	}

	if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
		return 'Quản trị viên';
	}

	return role;
};

export default function UserTable({
												 users,
												 isLoading,
												 onEdit,
												 onUpdateRole,
												 onToggleStatus,
												 onConfirmDelete,
											 }: UserTableProps) {
	const handleToggleStatus = (id: string, status: string) => {
		void Promise.resolve(onToggleStatus(id, status)).catch(() => undefined);
	};

	return (
		<div className="overflow-x-auto border border-gray-mid rounded-xl">
			<table className="min-w-full divide-y divide-gray-mid text-left">
				<thead className="bg-gray-light text-[10px] font-black uppercase tracking-[1.5px] text-text-light">
				<tr>
					<th className="px-6 py-4">Họ và tên</th>
					<th className="px-6 py-4">Liên hệ (Email)</th>
					<th className="px-6 py-4">Số CCCD</th>
					<th className="px-6 py-4">Vai trò</th>
					<th className="px-6 py-4">Trạng thái</th>
					<th className="px-6 py-4 text-center">Hành động</th>
				</tr>
				</thead>
				<tbody className="divide-y divide-gray-mid bg-white text-xs">
				{isLoading ? (
					<tr>
						<td colSpan={6} className="text-center py-10 text-text-light font-medium">
							<div className="flex flex-col items-center gap-2">
								<div className="w-5 h-5 border-2 border-green-main border-t-transparent rounded-full animate-spin"/>
								Đang tải danh sách tài khoản...
							</div>
						</td>
					</tr>
				) : users.length === 0 ? (
					<tr>
						<td colSpan={6} className="text-center py-10 text-text-light font-medium">
							Không tìm thấy người dùng nào.
						</td>
					</tr>
				) : (
					users.map((user) => (
						<tr key={user.id} className="hover:bg-green-pale/10 transition-colors">
							<td className="px-6 py-4 whitespace-nowrap font-extrabold text-text-dark">
								{user.lastName} {user.firstName}
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-text-mid">{user.email}</td>
							<td className="px-6 py-4 whitespace-nowrap font-mono text-text-mid">
								{user.identity || <span className="text-gray-400 italic">Chưa cập nhật</span>}
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<span className="inline-flex rounded-full bg-green-pale/40 px-3 py-1 text-[10px] font-extrabold text-green-dark">
									{formatRole(user.role)}
								</span>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
									<span
										className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border ${
											user.status === "ACTIVE"
												? "bg-green-pale text-green-dark border-green-main/10"
												: user.status === "BANNED"
													? "bg-red-50 text-red-600 border-red-200"
													: "bg-gray-100 text-gray-600 border-gray-200"
										}`}
									>
										{getStatusLabel(user.status)}
									</span>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-center">
								<div className="flex items-center justify-center gap-2">
									<button
										type="button"
										onClick={() => onEdit(user)}
										title="Chỉnh sửa thông tin"
										className="p-1.5 rounded-lg border border-gray-mid text-text-mid hover:bg-green-pale hover:text-green-main hover:border-green-main/30 transition-all"
									>
										<Pencil size={13}/>
									</button>

									<button
										type="button"
										onClick={() => handleToggleStatus(user.id, user.status)}
										title={user.status === "ACTIVE" ? "Khóa tài khoản" : "Kích hoạt tài khoản"}
										className={`p-1.5 rounded-lg border transition-all ${
											user.status === "ACTIVE"
												? "border-gray-mid text-text-mid hover:bg-red-50 hover:text-red-500 hover:border-red-200"
												: "border-green-main/20 text-green-main bg-green-pale hover:bg-green-main hover:text-white"
										}`}
									>
										{user.status === "ACTIVE" ? <Lock size={13}/> : <Unlock size={13}/>}
									</button>

									{/*<button*/}
									{/*	type="button"*/}
									{/*	onClick={() => onConfirmDelete(user.id)}*/}
									{/*	title="Xóa tài khoản"*/}
									{/*	className="p-1.5 rounded-lg border border-gray-mid text-text-mid hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"*/}
									{/*>*/}
									{/*	<Trash2 size={13}/>*/}
									{/*</button>*/}
								</div>
							</td>
						</tr>
					))
				)}
				</tbody>
			</table>
		</div>
	);
}
