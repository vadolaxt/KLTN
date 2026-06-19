'use client';

import React from 'react';
import { 
  Bell, 
  Calendar, 
  Menu, 
  Search, 
  User 
} from 'lucide-react';
import { AdminTab } from '@/hooks/use-admin';

interface AdminHeaderProps {
  activeTab: AdminTab;
  adminName?: string;
  adminEmail?: string;
}

const TAB_TITLES: Record<AdminTab, string> = {
  dashboard: 'Thống kê & Báo cáo tuyển sinh',
  users: 'Quản lý tài khoản & Người dùng',
  admissions: 'Đề án & Chỉ tiêu tuyển sinh',
  scores: 'Điểm chuẩn xét tuyển các năm',
  news: 'Bản tin tuyển sinh & Sự kiện NLU'
};

export default function AdminHeader({ 
  activeTab, 
  adminName = 'Hệ thống Admin',
  adminEmail = 'admin@nlu.edu.vn'
}: AdminHeaderProps) {
  
  // Format current date: Thứ Sáu, Ngày 05/06/2026
  const getFormattedDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    };
    return new Date().toLocaleDateString('vi-VN', options);
  };

  return (
    <header className="h-20 bg-white border-b border-gray-mid px-8 flex items-center justify-between shadow-sm">
      {/* Title / Left */}
      <div className="flex items-center gap-3">
        <div className="h-6 w-1 bg-green-main rounded-full"></div>
        <div>
          <h1 className="text-lg font-black text-text-dark leading-none">
            {TAB_TITLES[activeTab]}
          </h1>
          <p className="text-[11px] text-text-light mt-1 flex items-center gap-1.5 font-medium">
            <Calendar size={12} className="text-green-main" />
            {getFormattedDate()}
          </p>
        </div>
      </div>

      {/* Profile & Notifications / Right */}
      <div className="flex items-center gap-6">
        {/* Mock Search Bar */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Tìm nhanh..."
            className="w-48 bg-gray-light text-xs text-text-dark px-3.5 py-2 pl-9 rounded-lg border border-gray-mid focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main transition-all font-medium"
          />
          <Search size={14} className="absolute left-3.5 top-2.5 text-text-light" />
        </div>

        {/* Notifications Icon */}
        <button className="relative p-2 text-text-light hover:text-green-main hover:bg-green-pale rounded-lg transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#e53935] rounded-full ring-2 ring-white"></span>
        </button>

        {/* Simple vertical divider */}
        <div className="w-px h-8 bg-gray-mid"></div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <h4 className="text-xs font-black text-text-dark leading-tight">{adminName}</h4>
            <p className="text-[10px] text-text-light font-medium">{adminEmail}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-green-pale border border-green-main/20 flex items-center justify-center text-green-dark">
            <User size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}
