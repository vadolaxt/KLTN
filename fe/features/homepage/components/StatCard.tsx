// ─────────────────────────────────────────────
// StatCard — Một ô thống kê trong stats bar
// ─────────────────────────────────────────────

import type { StatItem } from '@/features/homepage/bloc/homepage.state';

interface StatCardProps extends StatItem {
  isLast?: boolean;
}

export default function StatCard({ value, label, isLast }: StatCardProps) {
  return (
    <div
      className={`py-[30px] px-5 text-center transition-colors duration-200 group cursor-default hover:bg-green-pale ${
        isLast ? '' : 'border-r border-gray-mid'
      }`}
    >
      <div className="text-[44px] font-black leading-none text-green-main font-serif group-hover:scale-105 transition-transform duration-200">
        {value}
      </div>
      <div className="text-[14px] font-medium mt-1.5 text-text-mid">
        {label}
      </div>
    </div>
  );
}