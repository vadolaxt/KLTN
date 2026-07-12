'use client';

import React from 'react';
import { AdminTab } from '@/hooks/use-admin';

interface AdminHeaderProps {
	activeTab: AdminTab;
	adminName?: string;
	adminEmail?: string;
}

const TITLE_BY_TAB: Record<AdminTab, string> = {
	dashboard: 'Thống kê báo cáo',
	users: 'Quản lý người dùng',
	admissions: 'Thông tin tuyển sinh',
	news: 'Quản lý tin tức',
	fqa: 'Quản lý bộ câu hỏi chatbot'
};

export default function AdminHeader({
  activeTab,
  // adminName = 'Hệ thống Admin',
  // adminEmail = 'admin@nlu.edu.vn',
  adminName = '',
  adminEmail = '',
}: AdminHeaderProps) {
	return (
		<header className="flex items-center justify-between border-b border-gray-mid bg-white px-8 py-5 shadow-sm">
			<div>
				<h1 className="text-2xl font-black text-green-dark">{TITLE_BY_TAB[activeTab]}</h1>
				<p className="mt-1 text-xs font-semibold text-text-light">
					Quản trị dữ liệu tuyển sinh và nội dung hệ thống
				</p>
			</div>

			<div className="text-right">
				<p className="text-sm font-extrabold text-text-dark">{adminName}</p>
				{adminEmail && <p className="text-xs font-semibold text-text-light">{adminEmail}</p>}
			</div>
		</header>
	);
}
