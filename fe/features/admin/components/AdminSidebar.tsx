'use client';

import React from 'react';
import {
	Users,
	BookOpen,
	Newspaper,
	LogOut,
	ShieldCheck,
	History,
} from 'lucide-react';
import { AdminTab } from '@/hooks/use-admin';

interface AdminSidebarProps {
	activeTab: AdminTab;
	setActiveTab: (tab: AdminTab) => void;
	logout: () => void | Promise<void>;
	adminName?: string;
}

export default function AdminSidebar({
	activeTab,
	setActiveTab,
	logout,
}: AdminSidebarProps) {
	const menuItems = [
		{ id: 'dashboard' as AdminTab, label: 'Thống kê báo cáo', icon: History },
		{ id: 'users' as AdminTab, label: 'Quản lý người dùng', icon: Users },
		{ id: 'admissions' as AdminTab, label: 'Thông tin tuyển sinh', icon: BookOpen },
		{ id: 'news' as AdminTab, label: 'Quản lý tin tức', icon: Newspaper },
	];

	return (
		<div className="w-full h-full flex flex-col justify-between bg-green-dark text-white shadow-xl">
			<div>
				<div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-green-dark font-black text-lg shadow-md">
						AD
					</div>
					<div>
						<h2 className="text-sm font-black tracking-wider text-green-light uppercase">Admin HCMUAF</h2>
						<p className="text-[10px] text-white/50 font-medium">Quản trị viên</p>
					</div>
				</div>

				<div className="px-3 pt-6">
					<p className="text-[10px] font-extrabold uppercase tracking-[2px] text-white/40 px-3 pb-3">
						Quản trị hệ thống
					</p>
					<nav className="space-y-1">
						{menuItems.map((item) => {
							const Icon = item.icon;
							const isActive = activeTab === item.id;

							return (
								<button
									key={item.id}
									onClick={() => setActiveTab(item.id)}
									className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-lg text-left text-sm font-semibold transition-all duration-200 ${
										isActive
											? 'bg-white/10 text-white shadow-inner'
											: 'text-white/70 hover:bg-white/5 hover:text-white'
									}`}
								>
									<Icon size={18} className={isActive ? 'text-green-light' : 'text-white/60'} />
									{item.label}
								</button>
							);
						})}
					</nav>
				</div>
			</div>

			<div className="p-4 border-t border-white/10">
				<button
					onClick={logout}
					className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/15 bg-transparent hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 text-sm font-bold text-white/80 transition-all duration-200"
				>
					<LogOut size={16} />
					Đăng xuất
				</button>
			</div>
		</div>
	);
}
