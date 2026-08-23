// ─────────────────────────────────────────────
// TopBar — Thanh thông tin trên cùng
// ─────────────────────────────────────────────

import { ICONS } from '@/lib/constants/icons';


export default function TopBar() {
  return (
    <div className="hidden w-full items-center justify-between bg-topbar-bg px-6 py-1.5 text-[11px] text-topbar-text sm:flex lg:px-10 lg:text-[13px]">
      {/* Left: address + phone */}
      <div className="flex items-center gap-4 lg:gap-6">
        <span className="hidden items-center gap-1.5 lg:flex">
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
