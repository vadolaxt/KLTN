// ─────────────────────────────────────────────
// TopBar — Thanh thông tin trên cùng
// ─────────────────────────────────────────────

import { ICONS } from '@/lib/constants/icons';
import Link from 'next/link';


export default function TopBar() {
  return (
    <div className="w-full text-[13px] px-10 py-1.5 flex justify-between items-center bg-topbar-bg text-topbar-text">
      {/* Left: address + phone */}
      <div className="flex gap-6 items-center">
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0 fill-topbar-icon">
            <path d={ICONS.LOCATION.path} />
          </svg>
          Địa chỉ: Khu phố 33, phường Linh Xuân, TP. Hồ Chí Minh
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0 fill-topbar-icon">
            <path d={ICONS.PHONE.path} />
          </svg>
          Số điện thoại: 0773.284.806, 028.3896.6780
        </span>
      </div>
    </div>
  );
}
