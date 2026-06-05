'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Newspaper, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { AdminTab } from '@/hooks/use-admin';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  logout: () => void;
  adminName?: string;
}

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  logout, 
  adminName = 'Admin' 
}: AdminSidebarProps) {
  
  const menuItems = [
    { id: 'dashboard' as AdminTab, label: 'Thống kê & Báo cáo', icon: LayoutDashboard },
    { id: 'users' as AdminTab, label: 'Quản lý người dùng', icon: Users },
    { id: 'admissions' as AdminTab, label: 'Thông tin tuyển sinh', icon: BookOpen },
    { id: 'scores' as AdminTab, label: 'Điểm chuẩn các năm', icon: GraduationCap },
    { id: 'news' as AdminTab, label: 'Quản lý tin tức', icon: Newspaper },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-between bg-green-dark text-white shadow-xl">
      {/* Top Section / Logo */}
      <div>
        <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-green-dark font-black text-lg shadow-md">
            NLU
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wider text-green-light">ADMIN PORTAL</h2>
            <p className="text-[10px] text-white/50 font-medium">Hệ thống tuyển sinh trực tuyến</p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="px-3 pt-6">
          <p className="text-[10px] font-extrabold uppercase tracking-[2px] text-white/40 px-3 pb-3">Quản trị hệ thống</p>
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
                      ? 'bg-white/10 text-white border-l-4 border-green-light shadow-inner' 
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

      {/* Bottom Section / Admin Info & Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-3 bg-white/5 rounded-lg mb-3">
          <div className="w-9 h-9 rounded-full bg-green-main border border-white/20 flex items-center justify-center text-sm font-extrabold text-white">
            {adminName.substring(0, 2).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-extrabold text-white truncate">{adminName}</h4>
            <div className="flex items-center gap-1 text-[10px] text-green-light font-bold">
              <ShieldCheck size={11} />
              Quản trị viên
            </div>
          </div>
        </div>

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
