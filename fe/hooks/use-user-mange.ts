// import { useCallback, useEffect, useMemo, useState } from "react";
// import { UserCreateRequest, UserResponse, UserUpdateRequest } from "@/types/admin";
// import { UserMangeService } from "@/service/admin-user-mange.api";
// import {toast} from "sonner";
//
// const getApiData = <T,>(response: unknown, fallback: T): T => {
// 	if (Array.isArray(response)) return response as T;
//
// 	const apiResponse = response as {
// 		data?: T;
// 		result?: T;
// 		payload?: T;
// 	};
//
// 	return apiResponse?.data ?? apiResponse?.result ?? apiResponse?.payload ?? fallback;
// };
//
// const isAdminRole = (role?: string) => role === "ROLE_ADMIN" || role === "ADMIN";
//
// const toApiRole = (role: string) => (isAdminRole(role) ? "ADMIN" : "USER");
//
// const normalizeText = (value?: string | null) => value?.toLowerCase().trim() ?? "";
//
// export function useUserManagement() {
// 	const [users, setUsers] = useState<UserResponse[]>([]);
// 	const [isLoading, setIsLoading] = useState<boolean>(true);
// 	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
// 	const [error, setError] = useState<string>("");
//
// 	const [searchTerm, setSearchTerm] = useState("");
// 	const [roleFilter, setRoleFilter] = useState<string>("ALL");
// 	const [statusFilter, setStatusFilter] = useState<string>("ALL");
//
// 	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
// 	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
// 	const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
//
// 	const fetchUsers = useCallback(async () => {
// 		setIsLoading(true);
// 		setError("");
//
// 		try {
// 			const response = await UserMangeService.getAllUser();
// 			const userList = getApiData<UserResponse[]>(response, []);
// 			setUsers(Array.isArray(userList) ? userList : []);
// 		} catch (err) {
// 			console.error("Lỗi khi lấy danh sách người dùng:", err);
// 			setError("Không thể tải danh sách người dùng");
// 		} finally {
// 			setIsLoading(false);
// 		}
// 	}, []);
//
// 	useEffect(() => {
// 		fetchUsers();
// 	}, [fetchUsers]);
//
// 	const filteredUsers = useMemo(() => {
// 		const keyword = normalizeText(searchTerm);
//
// 		return users.filter((user) => {
// 			const fullName = normalizeText(`${user.lastName ?? ""} ${user.firstName ?? ""}`);
// 			const email = normalizeText(user.email);
// 			const identity = normalizeText(user.identity);
//
// 			const searchMatch =
// 				!keyword ||
// 				fullName.includes(keyword) ||
// 				email.includes(keyword) ||
// 				identity.includes(keyword);
//
// 			const roleMatch =
// 				roleFilter === "ALL" ||
// 				(roleFilter === "ROLE_ADMIN" && isAdminRole(user.role)) ||
// 				(roleFilter === "ROLE_USER" && !isAdminRole(user.role));
//
// 			const statusMatch = statusFilter === "ALL" || user.status === statusFilter;
//
// 			return searchMatch && roleMatch && statusMatch;
// 		});
// 	}, [roleFilter, searchTerm, statusFilter, users]);
//
// 	const createUser = async (request: UserCreateRequest) => {
// 		setIsSubmitting(true);
// 		setError("");
//
// 		try {
// 			await UserMangeService.createUser({
// 				...request,
// 				role: toApiRole(request.role),
// 			});
// 			await fetchUsers();
// 			setIsAddModalOpen(false);
// 		} catch (err) {
// 			console.error("Lỗi khi tạo người dùng:", err);
// 			setError("Không thể tạo tài khoản người dùng");
// 			throw err;
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};
//
// 	const updateUser = async (request: UserUpdateRequest) => {
// 		setIsSubmitting(true);
// 		setError("");
//
// 		try {
// 			await UserMangeService.updateUser({
// 				...request,
// 				role: toApiRole(request.role),
// 			});
// 			await fetchUsers();
// 			toast.success("Cập nhập tài khoản thành công")
// 			setEditingUser(null);
// 		} catch (err) {
// 			console.error("Lỗi khi cập nhật người dùng:", err);
// 			setError("Không thể cập nhật tài khoản người dùng");
// 			throw err;
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};
//
// 	const updateUserRole = async (id: string, newRole: string) => {
// 		const currentUser = users.find((user) => user.id === id);
// 		if (!currentUser) return;
//
// 		await updateUser({
// 			id: currentUser.id,
// 			firstName: currentUser.firstName,
// 			lastName: currentUser.lastName,
// 			email: currentUser.email,
// 			role: newRole,
// 		});
// 	};
//
// 	const toggleUserStatus = async (id: string) => {
// 		setIsSubmitting(true);
// 		setError("");
//
// 		try {
// 			await UserMangeService.banUser(id);
// 			await fetchUsers();
// 		} catch (err) {
// 			console.error("Lỗi khi thay đổi trạng thái người dùng:", err);
// 			setError("Không thể thay đổi trạng thái tài khoản");
// 			throw err;
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};
//
// 	const deleteUser = async (id: string) => {
// 		setIsSubmitting(true);
// 		setError("");
//
// 		try {
// 			await UserMangeService.deleteUser(id);
// 			setDeleteConfirmId(null);
// 			toast.success("Xóa tài khoản thành công")
// 			await fetchUsers();
// 		} catch (err) {
// 			console.error("Lỗi khi xóa người dùng:", err);
// 			setError("Không thể xóa tài khoản người dùng");
// 			throw err;
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};
//
// 	return {
// 		users,
// 		isLoading,
// 		isSubmitting,
// 		error,
// 		filteredUsers,
// 		searchTerm,
// 		setSearchTerm,
// 		roleFilter,
// 		setRoleFilter,
// 		statusFilter,
// 		setStatusFilter,
// 		isAddModalOpen,
// 		setIsAddModalOpen,
// 		deleteConfirmId,
// 		setDeleteConfirmId,
// 		editingUser,
// 		setEditingUser,
// 		refreshUsers: fetchUsers,
// 		createUser,
// 		updateUser,
// 		updateUserRole,
// 		toggleUserStatus,
// 		deleteUser,
// 	};
// }

import { useCallback, useEffect, useMemo, useState } from "react";
import { UserCreateRequest, UserResponse, UserUpdateRequest } from "@/types/admin";
import { UserMangeService } from "@/service/admin-user-mange.api";

const getApiData = <T,>(response: unknown, fallback: T): T => {
	if (Array.isArray(response)) return response as T;

	const apiResponse = response as {
		data?: T;
		result?: T;
		payload?: T;
	};

	return apiResponse?.data ?? apiResponse?.result ?? apiResponse?.payload ?? fallback;
};

const isAdminRole = (role?: string) => role === "ROLE_ADMIN" || role === "ADMIN";
const toApiRole = (role: string) => (isAdminRole(role) ? "ADMIN" : "USER");
const normalizeText = (value?: string | null) => value?.toLowerCase().trim() ?? "";

export function useUserManagement() {
	const [users, setUsers] = useState<UserResponse[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string>("");

	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("ALL");
	const [statusFilter, setStatusFilter] = useState<string>("ALL");

	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
	const [editingUser, setEditingUser] = useState<UserResponse | null>(null);

	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		setError("");

		try {
			const response = await UserMangeService.getAllUser();
			const userList = getApiData<UserResponse[]>(response, []);
			setUsers(Array.isArray(userList) ? userList : []);
		} catch (err) {
			console.error("Lỗi khi lấy danh sách người dùng:", err);
			setError("Không thể tải danh sách người dùng");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchUsers();
	}, [fetchUsers]);

	const filteredUsers = useMemo(() => {
		const keyword = normalizeText(searchTerm);

		return users.filter((user) => {
			const fullName = normalizeText(`${user.lastName ?? ""} ${user.firstName ?? ""}`);
			const email = normalizeText(user.email);
			const identity = normalizeText(user.identity);

			const searchMatch =
				!keyword ||
				fullName.includes(keyword) ||
				email.includes(keyword) ||
				identity.includes(keyword);

			const roleMatch =
				roleFilter === "ALL" ||
				(roleFilter === "ROLE_ADMIN" && isAdminRole(user.role)) ||
				(roleFilter === "ROLE_USER" && !isAdminRole(user.role));

			const statusMatch = statusFilter === "ALL" || user.status === statusFilter;

			return searchMatch && roleMatch && statusMatch;
		});
	}, [roleFilter, searchTerm, statusFilter, users]);

	const addUser = async (request: UserCreateRequest) => {
		setIsSubmitting(true);
		setError("");

		try {
			await UserMangeService.addUser({
				...request,
				role: toApiRole(request.role),
			});

			await fetchUsers();
			setIsAddModalOpen(false);
		} catch (err) {
			console.error("Lỗi khi thêm người dùng:", err);
			setError("Không thể thêm tài khoản người dùng");
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	const createUser = addUser;

	const updateUser = async (request: UserUpdateRequest) => {
		setIsSubmitting(true);
		setError("");

		try {
			await UserMangeService.updateUser({
				...request,
				role: toApiRole(request.role),
			});
			await fetchUsers();
			setEditingUser(null);
		} catch (err) {
			console.error("Lỗi khi cập nhật người dùng:", err);
			setError("Không thể cập nhật tài khoản người dùng");
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateUserRole = async (id: string, newRole: string) => {
		const currentUser = users.find((user) => user.id === id);
		if (!currentUser) return;

		await updateUser({
			id: currentUser.id,
			firstName: currentUser.firstName,
			lastName: currentUser.lastName,
			email: currentUser.email,
			role: newRole,
		});
	};

	const toggleUserStatus = async (id: string) => {
		setIsSubmitting(true);
		setError("");

		try {
			await UserMangeService.banUser(id);
			await fetchUsers();
		} catch (err) {
			console.error("Lỗi khi thay đổi trạng thái người dùng:", err);
			setError("Không thể thay đổi trạng thái tài khoản");
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	const deleteUser = async (id: string) => {
		setIsSubmitting(true);
		setError("");

		try {
			await UserMangeService.deleteUser(id);
			setDeleteConfirmId(null);
			await fetchUsers();
		} catch (err) {
			console.error("Lỗi khi xóa người dùng:", err);
			setError("Không thể xóa tài khoản người dùng");
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		users,
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
		refreshUsers: fetchUsers,
		addUser,
		createUser,
		updateUser,
		updateUserRole,
		toggleUserStatus,
		deleteUser,
	};
}
