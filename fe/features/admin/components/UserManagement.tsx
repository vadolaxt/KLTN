'use client';

import React, { useState } from 'react';
import { 
  Search, 
  UserPlus, 
  UserX, 
  Unlock, 
  Lock,
  Trash2, 
  Shield, 
  Filter, 
  X,
  Mail,
  User,
  CreditCard
} from 'lucide-react';
import { AdminUser } from '@/service/admin.api';

interface UserManagementProps {
  users: AdminUser[];
  createUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => Promise<void>;
  updateUserRole: (id: string, role: AdminUser['role']) => Promise<void>;
  toggleUserStatus: (id: string, currentStatus: AdminUser['status']) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  isLoading: boolean;
}

export default function UserManagement({
  users,
  createUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  isLoading
}: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Add User Form Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newIdentity, setNewIdentity] = useState('');
  const [newRole, setNewRole] = useState<AdminUser['role']>('USER');

  // Delete User Confirmation modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form errors
  const [formError, setFormError] = useState('');

  // ─────────────────────────────────────────────
  // FILTERING LOGIC
  // ─────────────────────────────────────────────
  const filteredUsers = users.filter((u) => {
    const fullName = `${u.lastName} ${u.firstName}`.toLowerCase();
    const searchMatch = 
      fullName.includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.identity.includes(searchTerm);

    const roleMatch = roleFilter === 'ALL' || u.role === roleFilter;
    const statusMatch = statusFilter === 'ALL' || u.status === statusFilter;

    return searchMatch && roleMatch && statusMatch;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newFirstName.trim() || !newLastName.trim() || !newEmail.trim() || !newIdentity.trim()) {
      setFormError('Vui lòng nhập đầy đủ các trường bắt buộc');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(newEmail)) {
      setFormError('Email không đúng định dạng');
      return;
    }

    if (!/^\d{9,12}$/.test(newIdentity)) {
      setFormError('CCCD/CMND phải gồm 9-12 chữ số');
      return;
    }

    await createUser({
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      email: newEmail.trim(),
      identity: newIdentity.trim(),
      role: newRole,
      status: 'ACTIVE'
    });

    // Reset fields
    setNewFirstName('');
    setNewLastName('');
    setNewEmail('');
    setNewIdentity('');
    setNewRole('USER');
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm">
      {/* Controls: Search and Filters */}
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

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-gray-light border border-gray-mid px-3 py-1.5 rounded-xl">
            <Filter size={12} className="text-green-main" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-text-mid outline-none border-none cursor-pointer"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="STAFF">Cán bộ tuyển sinh</option>
              <option value="USER">Thí sinh</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-gray-light border border-gray-mid px-3 py-1.5 rounded-xl">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-text-mid outline-none border-none cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="BLOCKED">Bị khóa</option>
            </select>
          </div>

          {/* Add user button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-main hover:bg-green-dark text-white font-extrabold text-xs rounded-xl shadow-sm transition-all duration-200"
          >
            <UserPlus size={15} />
            Thêm tài khoản
          </button>
        </div>
      </div>

      {/* Users Table */}
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
                  Đang tải danh sách tài khoản...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-text-light font-medium">
                  🔍 Không tìm thấy người dùng nào phù hợp.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-green-pale/10 transition-colors">
                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap font-extrabold text-text-dark">
                    {user.lastName} {user.firstName}
                  </td>
                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap text-text-mid">
                    {user.email}
                  </td>
                  {/* CCCD */}
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-text-mid">
                    {user.identity}
                  </td>
                  {/* Role */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.role === 'ADMIN' && (
                      <span className="inline-flex items-center gap-1 bg-green-pale text-green-dark px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border border-green-main/10">
                        <Shield size={10} />
                        Admin
                      </span>
                    )}
                    {user.role === 'STAFF' && (
                      <span className="inline-flex items-center gap-1 bg-gray-light text-text-dark px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border border-gray-mid">
                        Cán bộ
                      </span>
                    )}
                    {user.role === 'USER' && (
                      <span className="inline-flex items-center gap-1 bg-green-pale/50 text-green-main px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        Thí sinh
                      </span>
                    )}
                  </td>
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1 bg-green-pale text-green-dark px-2.5 py-0.5 rounded-full font-extrabold text-[10px]">
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full font-extrabold text-[10px] border border-red-200">
                        Bị khóa
                      </span>
                    )}
                  </td>
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-center flex items-center justify-center gap-2">
                    {/* Role toggles */}
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as AdminUser['role'])}
                      className="bg-transparent border border-gray-mid text-[11px] font-bold text-text-mid rounded px-1.5 py-1 focus:outline-none"
                    >
                      <option value="USER">Thí sinh</option>
                      <option value="STAFF">Cán bộ</option>
                      <option value="ADMIN">Admin</option>
                    </select>

                    {/* Block/Unblock account */}
                    <button
                      onClick={() => toggleUserStatus(user.id, user.status)}
                      title={user.status === 'ACTIVE' ? 'Khóa tài khoản' : 'Kích hoạt tài khoản'}
                      className={`p-1.5 rounded-lg border transition-all ${
                        user.status === 'ACTIVE'
                          ? 'border-gray-mid text-text-mid hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                          : 'border-green-main/20 text-green-main bg-green-pale hover:bg-green-main hover:text-white'
                      }`}
                    >
                      {user.status === 'ACTIVE' ? <Lock size={13} /> : <Unlock size={13} />}
                    </button>

                    {/* Delete account */}
                    <button
                      onClick={() => setDeleteConfirmId(user.id)}
                      title="Xóa tài khoản"
                      className="p-1.5 rounded-lg border border-gray-mid text-text-mid hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ─────────────────────────────────────────────
      // MODAL: ADD USER
      // ───────────────────────────────────────────── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-mid rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-gray-light mb-5">
              <h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">Tạo tài khoản mới</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-light hover:text-text-dark">
                <X size={18} />
              </button>
            </div>

            {/* Form Error */}
            {formError && (
              <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-semibold">
                ⚠️ {formError}
              </div>
            )}

            {/* Modal Body */}
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black uppercase text-text-mid">Họ *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-green-main" size={13} />
                    <input
                      type="text"
                      placeholder="Nguyễn"
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                      className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
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
                      placeholder="Văn An"
                      value={newFirstName}
                      onChange={(e) => setNewFirstName(e.target.value)}
                      className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
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
                    placeholder="thisinh@email.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-text-mid">CCCD/CMND *</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 text-green-main" size={13} />
                  <input
                    type="text"
                    placeholder="Nhập 9 hoặc 12 chữ số"
                    value={newIdentity}
                    onChange={(e) => setNewIdentity(e.target.value)}
                    className="h-10 w-full rounded-xl border border-gray-mid pl-8 pr-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black uppercase text-text-mid">Vai trò</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as AdminUser['role'])}
                  className="h-10 w-full rounded-xl border border-gray-mid px-3 text-xs text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white font-bold"
                >
                  <option value="USER">Thí sinh</option>
                  <option value="STAFF">Cán bộ tuyển sinh</option>
                  <option value="ADMIN">Quản trị viên</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-light mt-5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Xác nhận thêm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
      // MODAL: DELETE CONFIRMATION
      // ───────────────────────────────────────────── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-mid rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-4">
              <div className="h-10 w-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                <UserX size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-[0.5px]">Xóa tài khoản</h3>
            </div>
            <p className="text-xs text-text-mid leading-relaxed mb-6">
              Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống? Hành động này không thể hoàn tác và tài khoản sẽ mất toàn bộ hồ sơ đăng ký.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteUser(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Đồng ý xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
