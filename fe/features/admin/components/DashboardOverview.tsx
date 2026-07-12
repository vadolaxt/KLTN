'use client';

import React from 'react';
import { DashboardStats } from '@/service/admin.api';

interface DashboardOverviewProps {
  stats: DashboardStats | null;
  isLoading: boolean;
  selectedYear?: number;
  setSelectedYear?: (year: number) => void;
  availableYears?: number[];
}

const PIE_COLORS = ['#2d7a2d', '#4caf50', '#c9a227', '#1a4a1a', '#8bc34a', '#f0c040'];

const formatNumber = (value?: number | null) =>
  value === null || value === undefined ? '-' : value.toLocaleString('vi-VN');

const formatScore = (value?: number | null) =>
  value === null || value === undefined ? '-' : value.toFixed(2);

export default function DashboardOverview({
  stats,
  isLoading,
  selectedYear,
  setSelectedYear,
  availableYears,
}: DashboardOverviewProps) {
  const renderYearFilter = () => (
    availableYears && setSelectedYear && selectedYear !== undefined ? (
      <div className="mb-6 flex justify-end">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-text-mid">Năm tuyển sinh:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="cursor-pointer rounded-lg border border-gray-mid bg-white px-3 py-1.5 text-xs font-black text-green-dark shadow-sm outline-none focus:border-green-main focus:ring-1 focus:ring-green-main"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    ) : null
  );

  if (isLoading || !stats) {
    return (
      <div className="space-y-6 font-vietnam animate-pulse">
        {renderYearFilter()}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-28 rounded-2xl border border-gray-mid bg-white" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6">
            <div className="h-80 rounded-2xl border border-gray-mid bg-white" />
            <div className="h-80 rounded-2xl border border-gray-mid bg-white" />
          </div>
          <div className="space-y-6">
            <div className="h-80 rounded-2xl border border-gray-mid bg-white" />
            <div className="h-80 rounded-2xl border border-gray-mid bg-white" />
          </div>
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Tổng số ngành',
      value: formatNumber(stats.totalMajors),
      sub: `Năm tuyển sinh ${stats.latestYear ?? '-'}`,
    },
    {
      title: 'Tổng số khoa',
      value: formatNumber(stats.totalDepartments),
      sub: 'Các khoa & bộ môn quản lý',
    },
    {
      title: 'Tổng chỉ tiêu',
      value: formatNumber(stats.totalQuota),
      sub: 'Chỉ tiêu tuyển sinh năm nay',
    },
    {
      title: 'Điểm chuẩn TB',
      value: formatScore(stats.averageCutoffScore),
      sub: 'Điểm sàn xét tuyển trung bình',
    },
  ];

  return (
    <div className="space-y-6 font-vietnam">
      {renderYearFilter()}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-gray-mid/60 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-white to-green-pale/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-green-pale/20 transition-transform duration-500 group-hover:scale-125" />

            <p className="text-[10px] font-extrabold uppercase tracking-wider text-text-light">
              {card.title}
            </p>
            <h3 className="mt-2 text-3xl font-black tracking-tight text-green-dark transition-colors duration-300 group-hover:text-green-main">
              {card.value}
            </h3>
            <p className="mt-1 text-[11px] font-semibold text-text-mid">
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <QuotaTrendCard
            title="Xu hướng chỉ tiêu tuyển sinh qua các năm"
            subtitle="Biểu đồ cột kết hợp đường xu hướng để so sánh chỉ tiêu tuyển sinh"
            items={stats.quotaByYear}
          />

          <DepartmentAnalyticsCard quotaItems={stats.quotaByDepartment} />
        </div>

        <div className="space-y-6">
          <ProgramTypeDonutCard
            title="Cơ cấu ngành theo chương trình"
            subtitle="Phân bổ danh mục ngành đào tạo theo từng hệ học"
            items={stats.majorsByProgramType}
          />

          <CutoffAnalyticsCard
            title="Phân tích điểm chuẩn tuyển sinh"
            subtitle="Khoảng điểm xét tuyển từ thấp nhất đến cao nhất"
            average={stats.averageCutoffScore}
            highest={stats.highestCutoffScore}
            lowest={stats.lowestCutoffScore}
          />
        </div>
      </div>
    </div>
  );
}

function DepartmentAnalyticsCard({
  quotaItems,
}: {
  quotaItems: { label: string; count: number }[];
}) {
  const visibleItems = quotaItems.slice(0, 7);
  const max = Math.max(...visibleItems.map((item) => item.count), 1);

  return (
    <div className="rounded-2xl border border-gray-mid/60 bg-white p-6 shadow-sm">
      <SectionHeader
        title="Phân tích theo khoa tuyển sinh"
        subtitle="Xếp hạng các khoa có chỉ tiêu tuyển sinh nhiều nhất"
      />

      <div className="space-y-4">
        {visibleItems.map((item, index) => {
          const percent = (item.count / max) * 100;
          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between gap-4 text-xs font-bold">
                <span className="flex items-center gap-2 truncate text-text-mid">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-pale text-[10px] font-black text-green-dark">
                    {index + 1}
                  </span>
                  {item.label}
                </span>
                <span className="shrink-0 text-text-dark">{formatNumber(item.count)}</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-gray-mid/30 bg-gray-light">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-dark to-green-main transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
        {visibleItems.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}

function ProgramTypeDonutCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: { label: string; count: number }[];
}) {
  const total = items.reduce((sum, item) => sum + item.count, 0);
  let accumulated = 0;
  const slices = items.map((item, index) => {
    const start = total ? (accumulated / total) * 100 : 0;
    accumulated += item.count;
    const end = total ? (accumulated / total) * 100 : 0;
    return `${PIE_COLORS[index % PIE_COLORS.length]} ${start}% ${end}%`;
  });

  return (
    <div className="rounded-2xl border border-gray-mid/60 bg-white p-6 shadow-sm">
      <SectionHeader title={title} subtitle={subtitle} />

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-40 w-40 shrink-0">
          <div
            className="h-full w-full rounded-full shadow-inner"
            style={{ background: `conic-gradient(${slices.length ? slices.join(', ') : '#e0e0e0 0% 100%'})` }}
          />
          <div className="absolute inset-10 flex flex-col items-center justify-center rounded-full bg-white shadow-sm">
            <span className="text-[10px] font-bold uppercase text-text-light">Tổng</span>
            <span className="text-2xl font-black text-green-dark">{formatNumber(total)}</span>
          </div>
        </div>

        <div className="w-full space-y-3">
          {items.map((item, index) => {
            const percent = total ? Math.round((item.count / total) * 100) : 0;
            return (
              <div key={item.label} className="flex items-center justify-between gap-3 text-xs font-bold">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-3 w-3 shrink-0 rounded-sm"
                    style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                  />
                  <span className="truncate text-text-mid">{item.label}</span>
                </div>
                <span className="shrink-0 text-text-dark">
                  {formatNumber(item.count)} ({percent}%)
                </span>
              </div>
            );
          })}
          {items.length === 0 && <EmptyState />}
        </div>
      </div>
    </div>
  );
}

function CutoffAnalyticsCard({
  title,
  subtitle,
  average,
  highest,
  lowest,
}: {
  title: string;
  subtitle: string;
  average: number | null;
  highest: number | null;
  lowest: number | null;
}) {
  const avg = average ?? 0;
  const high = highest ?? 0;
  const low = lowest ?? 0;
  const span = high - low;
  const avgPos = span > 0 ? ((avg - low) / span) * 100 : 50;

  return (
    <div className="rounded-2xl border border-gray-mid/60 bg-white p-6 shadow-sm">
      <SectionHeader title={title} subtitle={subtitle} />

      <div className="mt-6 space-y-6">
        <div className="relative px-1 pt-7">
          <div
            className="absolute top-0 flex -translate-x-1/2 flex-col items-center transition-all duration-500 ease-out"
            style={{ left: `${Math.min(Math.max(avgPos, 0), 100)}%` }}
          >
            <span className="rounded-md bg-green-dark px-2 py-1 text-[10px] font-black text-white shadow-sm">
              TB {formatScore(average)}
            </span>
            <span className="h-2 w-px bg-green-dark" />
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-gradient-to-r from-green-light via-gold to-green-dark shadow-inner" />
          <div className="mt-2 flex justify-between text-[10px] font-bold text-text-light">
            <span>Thấp: {formatScore(lowest)}</span>
            <span>Cao: {formatScore(highest)}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Thấp nhất" value={formatScore(lowest)} />
          <MiniStat label="Trung bình" value={formatScore(average)} highlight />
          <MiniStat label="Cao nhất" value={formatScore(highest)} />
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-3 text-center ${highlight ? 'border-green-main/20 bg-green-pale/50' : 'border-gray-mid bg-gray-light/30'}`}>
      <div className="text-[10px] font-bold uppercase text-text-light">{label}</div>
      <div className={`mt-1 text-lg font-black ${highlight ? 'text-green-main' : 'text-text-dark'}`}>{value}</div>
    </div>
  );
}

function QuotaTrendCard({
  title,
  subtitle,
  items,
}: {
  title: string;
  subtitle: string;
  items: { label: string; count: number }[];
}) {
  const sortedItems = [...items].sort((a, b) => Number(a.label) - Number(b.label));
  const max = Math.max(...sortedItems.map((item) => item.count), 1);
  const width = 760;
  const height = 280;
  const paddingX = 54;
  const paddingTop = 34;
  const paddingBottom = 50;
  const chartHeight = height - paddingTop - paddingBottom;
  const step = sortedItems.length > 1 ? (width - paddingX * 2) / (sortedItems.length - 1) : 0;

  const points = sortedItems.map((item, index) => {
    const x = sortedItems.length > 1 ? paddingX + step * index : width / 2;
    const y = paddingTop + chartHeight - (item.count / max) * chartHeight;
    return { ...item, x, y };
  });
  const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`
    : '';

  return (
    <div className="rounded-2xl border border-gray-mid/60 bg-white p-6 shadow-sm">
      <SectionHeader title={title} subtitle={subtitle} />

      {sortedItems.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="mt-2 overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="min-w-[640px] w-full">
            <defs>
              <linearGradient id="trendArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2d7a2d" stopOpacity="0.16" />
                <stop offset="100%" stopColor="#2d7a2d" stopOpacity="0" />
              </linearGradient>
            </defs>

            {[0, 0.5, 1].map((ratio) => {
              const y = paddingTop + chartHeight * ratio;
              return (
                <line
                  key={ratio}
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="#e0e0e0"
                  strokeDasharray="4 4"
                />
              );
            })}

            {points.map((point, index) => {
              const barWidth = Math.min(46, Math.max(26, step * 0.38 || 46));
              const barHeight = paddingTop + chartHeight - point.y;
              return (
                <g key={point.label}>
                  <rect
                    x={point.x - barWidth / 2}
                    y={point.y}
                    width={barWidth}
                    height={barHeight}
                    rx={8}
                    fill={index % 2 === 0 ? '#2d7a2d' : '#4caf50'}
                    opacity={0.9}
                  />
                  <text x={point.x} y={point.y - 10} textAnchor="middle" className="fill-text-dark text-[11px] font-black">
                    {formatNumber(point.count)}
                  </text>
                  <text x={point.x} y={height - 18} textAnchor="middle" className="fill-text-mid text-[11px] font-bold">
                    {point.label}
                  </text>
                </g>
              );
            })}

            {points.length > 1 && areaPath && <path d={areaPath} fill="url(#trendArea)" />}

            {points.length > 1 && (
              <path
                d={linePath}
                fill="none"
                stroke="#c9a227"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {points.map((point) => (
              <circle key={`dot-${point.label}`} cx={point.x} cy={point.y} r={5} fill="#ffffff" stroke="#c9a227" strokeWidth={3} />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-black uppercase tracking-[0.5px] text-text-dark">
        {title}
      </h3>
      <p className="mt-1 text-xs font-medium text-text-light">{subtitle}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-gray-mid p-6 text-center text-sm font-medium text-text-light">
      Chưa có dữ liệu.
    </div>
  );
}
