"use client";

import React from "react";
import UserFilters from "./UserFilters";
import UserTable from "./UserTable";
import AddUserModal from "./AddUserModal";
import EditUserModal from "./EditUserModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import {useUserManagement} from "@/hooks/use-user-mange";

export default function UserManagement() {
	const {
		isLoading,
		isSubmitting,
		error,
		filteredUsers,
		searchTerm,
		setSearchTerm,
		roleFilter,
		setRoleFilter,
		statusFilter,
		setStatusFilter,
		isAddModalOpen,
		setIsAddModalOpen,
		deleteConfirmId,
		setDeleteConfirmId,
		editingUser,
		setEditingUser,
		addUser,
		updateUser,
		updateUserRole,
		toggleUserStatus,
		deleteUser,
	} = useUserManagement();

	return (
		<div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm">
			<UserFilters
				searchTerm={searchTerm}
				setSearchTerm={setSearchTerm}
				roleFilter={roleFilter}
				setRoleFilter={setRoleFilter}
				statusFilter={statusFilter}
				setStatusFilter={setStatusFilter}
				onOpenAddModal={() => setIsAddModalOpen(true)}
			/>

			{error && (
				<div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-600">
					{error}
				</div>
			)}

			<UserTable
				users={filteredUsers}
				isLoading={isLoading}
				onEdit={(user) => setEditingUser(user)}
				onUpdateRole={updateUserRole}
				onToggleStatus={toggleUserStatus}
				onConfirmDelete={(id) => setDeleteConfirmId(id)}
			/>

			<AddUserModal
				isOpen={isAddModalOpen}
				onClose={() => setIsAddModalOpen(false)}
				onAddUser={addUser}
				isSubmitting={isSubmitting}
			/>

			<EditUserModal
				key={editingUser?.id || "empty-edit-modal"}
				user={editingUser}
				isOpen={editingUser !== null}
				onClose={() => setEditingUser(null)}
				onUpdateUser={updateUser}
				isSubmitting={isSubmitting}
			/>

			<DeleteConfirmModal
				userId={deleteConfirmId}
				onClose={() => setDeleteConfirmId(null)}
				onConfirm={deleteUser}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
}