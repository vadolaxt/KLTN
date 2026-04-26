// ─────────────────────────────────────────────
// TopBar — Thanh thông tin trên cùng
// ─────────────────────────────────────────────

import { ICONS } from '@/lib/constants/icons';
import Link from 'next/link';

const topLinks = [
  { label: 'Cựu sinh viên', href: '#' },
  { label: 'Đối tác', href: '#' },
  { label: 'Sơ đồ trang', href: '#' },
];

export default function TopBar() {
  return (
    <div className="w-full text-[13px] px-10 py-1.5 flex justify-between items-center bg-topbar-bg text-topbar-text">
      {/* Left: address + phone */}
      <div className="flex gap-6 items-center">
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0 fill-topbar-icon">
            <path d={ICONS.LOCATION.path} />
          </svg>
          Địa chỉ: KP 6, P. Linh Trung, TP. Thủ Đức, TP. HCM
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 flex-shrink-0 fill-topbar-icon">
            <path d={ICONS.PHONE.path} />
          </svg>
          Số điện thoại: 028 3896 6780
        </span>
      </div>

      {/* Right: quick links */}
      <div className="flex gap-5">
        {topLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="transition-colors duration-200 text-topbar-text hover:text-gold-light"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}