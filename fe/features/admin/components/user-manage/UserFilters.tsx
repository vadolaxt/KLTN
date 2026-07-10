import React from 'react';
import { Search, Filter, UserPlus } from 'lucide-react';

interface UserFiltersProps {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	roleFilter: string;
	setRoleFilter: (value: string) => void;
	statusFilter: string;
	setStatusFilter: (value: string) => void;
	onOpenAddModal: () => void;
}

export default function UserFilters({
													searchTerm,
													setSearchTerm,
													roleFilter,
													setRoleFilter,
													statusFilter,
													setStatusFilter,
													onOpenAddModal,
												}: UserFiltersProps) {
	return (
		<div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-6">
			{/* Search */}
			<div className="relative flex-1 max-w-md">
				<input
					type="text"
					placeholder="Tìm theo tên, email, số CCCD..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full bg-gray-light text-xs text-text-dark px-3.5 py-2.5 pl-9 rounded-xl border border-gray-mid focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main font-medium"
				/>
				<Search size={15} className="absolute left-3 top-3 text-text-light" />
			</div>

			{/* Filters and Actions */}
			<div className="flex flex-wrap items-center gap-3">
				<div className="flex items-center gap-1.5 bg-gray-light border border-gray-mid px-3 py-1.5 rounded-xl">
					<Filter size={12} className="text-green-main" />
					<select
						value={roleFilter}
						onChange={(e) => setRoleFilter(e.target.value)}
						className="bg-transparent text-xs font-bold text-text-mid outline-none border-none cursor-pointer"
					>
						<option value="ALL">Tất cả vai trò</option>
						<option value="ROLE_ADMIN">Quản trị viên</option>
						<option value="ROLE_USER">Người dùng</option>
					</select>
				</div>

				<div className="flex items-center gap-1.5 bg-gray-light border border-gray-mid px-3 py-1.5 rounded-xl">
					<select
						value={statusFilter}
						onChange={(e) => setStatusFilter(e.target.value)}
						className="bg-transparent text-xs font-bold text-text-mid outline-none border-none cursor-pointer"
					>
						<option value="ALL">Tất cả trạng thái</option>
						<option value="ACTIVE">Đang hoạt động</option>
						<option value="INACTIVE">Chưa kích hoạt</option>
						<option value="BANNED">Bị khóa</option>
					</select>
				</div>

				<button
					onClick={onOpenAddModal}
					className="flex items-center gap-2 px-4 py-2.5 bg-green-main hover:bg-green-dark text-white font-extrabold text-xs rounded-xl shadow-sm transition-all duration-200"
				>
					<UserPlus size={15} />
					Thêm tài khoản
				</button>
			</div>
		</div>
	);
}