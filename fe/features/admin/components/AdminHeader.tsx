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
      <div className="flex items-center gap-6">
        {/*<div className="relative hidden md:block">*/}
        {/*  <input*/}
        {/*    type="text"*/}
        {/*    placeholder="Tìm nhanh..."*/}
        {/*    className="w-48 bg-gray-light text-xs text-text-dark px-3.5 py-2 pl-9 rounded-lg border border-gray-mid focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main transition-all font-medium"*/}
        {/*  />*/}
        {/*  <Search size={14} className="absolute left-3.5 top-2.5 text-text-light" />*/}
        {/*</div>*/}

        {/*<button className="relative p-2 text-text-light hover:text-green-main hover:bg-green-pale rounded-lg transition-all">*/}
        {/*  <Bell size={18} />*/}
        {/*  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e53935] rounded-full ring-2 ring-white" />*/}
        {/*</button>*/}

        {/*<div className="w-px h-8 bg-gray-mid" />*/}

        {/*<div className="flex items-center gap-3">*/}
        {/*  <div className="text-right hidden sm:block">*/}
        {/*    <h4 className="text-xs font-black text-text-dark leading-tight">{adminName}</h4>*/}
        {/*    <p className="text-[10px] text-text-light font-medium">{adminEmail}</p>*/}
        {/*  </div>*/}
        {/*  <div className="w-10 h-10 rounded-full bg-green-pale border border-green-main/20 flex items-center justify-center text-green-dark">*/}
        {/*    <User size={18} />*/}
        {/*  </div>*/}
        {/*</div>*/}
      </div>
    </header>
  );
}
