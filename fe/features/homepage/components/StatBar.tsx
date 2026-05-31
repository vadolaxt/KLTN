// ─────────────────────────────────────────────
// StatsBar — Thanh thống kê 4 cột
// ─────────────────────────────────────────────

import StatCard from './StatCard';
import type { StatItem } from '@/features/homepage/bloc/homepage.state';

interface StatsBarProps {
  stats: StatItem[];
}

export default function StatsBar({ stats }: StatsBarProps) {
  const getGridCols = (length: number) => {
    switch (length) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      default: return 'grid-cols-4';
    }
  };

  return (
    <div
      className={`grid ${getGridCols(stats.length)} bg-white border-b-[3px] border-green-pale shadow-[0_4px_20px_rgba(0,0,0,0.08)]`}
    >
      {stats.map((item, idx) => (
        <StatCard
          key={item.id}
          {...item}
          isLast={idx === stats.length - 1}
        />
      ))}
    </div>
  );
}