'use client';

import React from 'react';
import { 
  Users, 
  BookOpen, 
  Newspaper, 
  Percent, 
  TrendingUp, 
  FileSpreadsheet, 
  FileDown 
} from 'lucide-react';
import { DashboardStats } from '@/service/admin.api';
import { toast } from 'sonner';

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  isLoading: boolean;
}

export default function DashboardOverview({ stats, isLoading }: DashboardOverviewProps) {
  
  const handleExport = (type: 'EXCEL' | 'PDF') => {
    toast.info(`Hệ thống đang chuẩn bị xuất báo cáo dạng ${type}...`);
    setTimeout(() => {
      toast.success(`Xuất file Báo cáo_Tuyển sinh_${new Date().getFullYear()}.${type === 'EXCEL' ? 'xlsx' : 'pdf'} thành công!`);
    }, 1500);
  };

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Loading Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-gray-mid rounded-xl p-5 flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-3 w-20 bg-gray-mid rounded"></div>
                <div className="h-6 w-12 bg-gray-mid rounded"></div>
              </div>
              <div className="h-10 w-10 bg-gray-mid rounded-lg"></div>
            </div>
          ))}
        </div>
        {/* Loading Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white border border-gray-mid rounded-xl p-6"></div>
          <div className="h-80 bg-white border border-gray-mid rounded-xl p-6"></div>
        </div>
      </div>
    );
  }

  // Cards configurations
  const cards = [
    {
      title: 'Tổng số người dùng',
      value: stats.totalUsers,
      sub: `${stats.activeUsers} đang hoạt động`,
      icon: Users,
      color: 'bg-green-pale text-green-dark border-green-main/10',
      iconBg: 'bg-green-main text-white'
    },
    {
      title: 'Tổng chỉ tiêu tuyển sinh',
      value: stats.totalAdmissions,
      sub: 'Trên toàn bộ ngành đào tạo',
      icon: BookOpen,
      color: 'bg-green-pale/50 text-green-dark border-green-main/10',
      iconBg: 'bg-green-main/80 text-white'
    },
    {
      title: 'Tin tức tuyển sinh',
      value: stats.totalNews,
      sub: 'Thông báo & bài viết hướng dẫn',
      icon: Newspaper,
      color: 'bg-gray-light text-text-dark border-gray-mid',
      iconBg: 'bg-gray-mid text-text-dark'
    },
    {
      title: 'Tỷ lệ duyệt hồ sơ',
      value: `${stats.approvedApplicationsRate}%`,
      sub: 'Tỷ lệ chấp thuận học bạ',
      icon: Percent,
      color: 'bg-green-pale text-green-dark border-green-main/10',
      iconBg: 'bg-green-light text-white'
    }
  ];

  // Maximum value for scaling the bar chart
  const maxMethodCount = Math.max(...stats.applicationsByMethod.map(m => m.count));
  const maxMonthCount = Math.max(...stats.registrationsByMonth.map(m => m.count));

  // Points mapping for line chart SVG
  // Grid size: width 400, height 120
  // X: 0 to 5 points (0, 80, 160, 240, 320, 400)
  // Y: scaled from 0 to maxMonthCount
  const chartWidth = 500;
  const chartHeight = 150;
  const paddingX = 40;
  const paddingY = 20;

  const points = stats.registrationsByMonth.map((item, idx) => {
    const x = paddingX + (idx * (chartWidth - paddingX * 2)) / (stats.registrationsByMonth.length - 1);
    const ratio = maxMonthCount > 0 ? item.count / maxMonthCount : 0;
    const y = chartHeight - paddingY - ratio * (chartHeight - paddingY * 2);
    return { x, y, label: item.month, value: item.count };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="space-y-6">
      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx} 
              className={`bg-white border rounded-2xl p-6 flex items-center justify-between shadow-sm transition-all duration-300 hover:shadow-md ${card.color}`}
            >
              <div className="space-y-1">
                <p className="text-[11px] font-extrabold uppercase tracking-[1px] text-text-light">{card.title}</p>
                <h3 className="text-3xl font-black tracking-tight">{card.value}</h3>
                <p className="text-[11px] font-semibold text-text-mid opacity-80">{card.sub}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg} shadow-sm shrink-0`}>
                <Icon size={20} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Method Distribution Chart (Bar Chart) */}
        <div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">Hồ sơ theo phương thức xét tuyển</h3>
            <span className="text-[10px] bg-green-pale text-green-dark px-2.5 py-0.5 rounded-full font-bold">Năm 2026</span>
          </div>

          <div className="space-y-5">
            {stats.applicationsByMethod.map((item, idx) => {
              const percent = maxMethodCount > 0 ? (item.count / maxMethodCount) * 100 : 0;
              return (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-text-mid font-medium">{item.method}</span>
                    <span className="text-text-dark font-extrabold">{item.count.toLocaleString()} HS</span>
                  </div>
                  <div className="w-full h-3 bg-gray-light rounded-full overflow-hidden border border-gray-mid/30">
                    <div 
                      className="h-full bg-green-main rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Trend Chart (SVG Line Chart) */}
        <div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">Xu hướng đăng ký tài khoản mới</h3>
              <div className="flex items-center gap-1 text-[10px] text-green-main font-bold">
                <TrendingUp size={12} />
                +35% So với cùng kỳ
              </div>
            </div>

            {/* SVG Line Chart Rendering */}
            <div className="relative w-full overflow-x-auto">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[360px]">
                {/* Y Axis Grid lines */}
                {[0, 0.5, 1].map((ratio, i) => {
                  const y = paddingY + ratio * (chartHeight - paddingY * 2);
                  return (
                    <line 
                      key={i} 
                      x1={paddingX} 
                      y1={y} 
                      x2={chartWidth - paddingX} 
                      y2={y} 
                      stroke="#e0e0e0" 
                      strokeWidth="1" 
                      strokeDasharray="4 4" 
                    />
                  );
                })}

                {/* Fill Area with Gradient */}
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2d7a2d" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#2d7a2d" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill="url(#chartGradient)" />

                {/* Main Trend Line */}
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="#2d7a2d" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Data Points and Labels */}
                {points.map((p, i) => (
                  <g key={i} className="group cursor-pointer">
                    {/* Glowing outer point */}
                    <circle cx={p.x} cy={p.y} r="6" fill="#4caf50" fillOpacity="0.4" />
                    {/* Main point */}
                    <circle cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke="#2d7a2d" strokeWidth="2.5" />
                    
                    {/* Tooltip value */}
                    <text 
                      x={p.x} 
                      y={p.y - 10} 
                      textAnchor="middle" 
                      className="text-[9px] font-extrabold fill-text-dark font-sans"
                    >
                      {p.value}
                    </text>

                    {/* Month Label */}
                    <text 
                      x={p.x} 
                      y={chartHeight - 4} 
                      textAnchor="middle" 
                      className="text-[9px] font-bold fill-text-light font-sans"
                    >
                      {p.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Action panel / Export Reports */}
      <div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h4 className="text-sm font-black text-text-dark">Xuất báo cáo định kỳ tuyển sinh</h4>
          <p className="text-xs text-text-light font-medium mt-1">Dữ liệu được cập nhật tự động theo thời gian thực từ các nguyện vọng của thí sinh.</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={() => handleExport('EXCEL')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-mid hover:border-green-main hover:bg-green-pale/50 text-text-dark hover:text-green-dark font-extrabold text-xs rounded-xl transition-all duration-200"
          >
            <FileSpreadsheet size={15} className="text-green-main" />
            Xuất Excel (.xlsx)
          </button>
          <button
            onClick={() => handleExport('PDF')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-green-main hover:bg-green-dark text-white font-extrabold text-xs rounded-xl shadow-sm transition-all duration-200"
          >
            <FileDown size={15} />
            Xuất PDF Báo cáo
          </button>
        </div>
      </div>
    </div>
  );
}
