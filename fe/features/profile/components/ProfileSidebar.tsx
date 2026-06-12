'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    href: '/ho-so/thong-tin',
    match: 'thong-tin',
    label: 'Thông tin thí sinh',
    iconPath:
      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  },
  {
    href: '/ho-so/diem-so',
    match: 'diem-so',
    label: 'Hồ sơ bảng điểm',
    iconPath:
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
  },
  {
    href: '/ho-so/chung-chi',
    match: 'chung-chi',
    label: 'Chứng chỉ tiếng Anh',
    iconPath:
      'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 2.5L17.5 8H14V4.5zM8 13h8v2H8v-2zm0 4h8v2H8v-2zm0-8h4v2H8V9z',
  },
];

const navItemsScore = [
  {
    href: '/ho-so/phuong-thuc-xet-tuyen',
    match: 'phuong-thuc-xet-tuyen',
    label: 'Phương thức xét tuyển',
    iconPath:
      'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  },
  {
    href: '/ho-so/nganh-hoc',
    match: 'nganh-hoc',
    label: 'Ngành học',
    iconPath:
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z',
  },
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="mb-4 border-b border-gray-mid px-6 pb-7 text-center">
        <div className="relative mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full border-4 border-gold bg-gradient-to-br from-green-main to-green-dark text-[28px] font-black text-white">
          NVA
          <div className="absolute bottom-0 right-0 flex h-[22px] w-[22px] items-center justify-center rounded-full border-2 border-white bg-green-light">
            <svg viewBox="0 0 24 24" className="h-3 w-3 fill-white">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </div>
        <div className="mb-0.5 text-[15px] font-extrabold text-text-dark">Nguyễn Văn An</div>
        <div className="mb-2 inline-block rounded-full bg-green-pale px-2.5 py-0.5 text-[12px] font-semibold text-text-light">
          15/03/2008
        </div>
      </div>

      <div className="px-6 pb-1.5 pt-4 text-[10px] font-extrabold uppercase tracking-[1.5px] text-text-light">
        Quản lý hồ sơ
      </div>
      <ul className="list-none">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.match);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex items-center gap-3 border-l-3 px-6 py-[13px] text-[14px] font-medium transition-all ${
                  isActive
                    ? 'border-green-main bg-green-pale font-bold text-green-dark'
                    : 'border-transparent text-text-mid hover:border-green-light hover:bg-green-pale hover:text-green-dark'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${isActive ? 'fill-green-main' : 'fill-text-light'}`}
                >
                  <path d={item.iconPath} />
                </svg>
                {item.label}
                {isActive && (
                  <span className="ml-auto min-w-[20px] flex-shrink-0 rounded-[20px] bg-green-main px-[7px] py-[1px] text-center text-[10px] font-bold text-white">
                    ✓
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="px-6 pb-1.5 pt-4 text-[10px] font-extrabold uppercase tracking-[1.5px] text-text-light">
        Hỗ trợ xem điểm theo
      </div>
      <ul className="list-none">
        {navItemsScore.map((item) => {
          const isActive = pathname.includes(item.match);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex items-center gap-3 border-l-3 px-6 py-[13px] text-[14px] font-medium transition-all ${
                  isActive
                    ? 'border-green-main bg-green-pale font-bold text-green-dark'
                    : 'border-transparent text-text-mid hover:border-green-light hover:bg-green-pale hover:text-green-dark'
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${isActive ? 'fill-green-main' : 'fill-text-light'}`}
                >
                  <path d={item.iconPath} />
                </svg>
                {item.label}
                {isActive && (
                  <span className="ml-auto min-w-[20px] flex-shrink-0 rounded-[20px] bg-green-main px-[7px] py-[1px] text-center text-[10px] font-bold text-white">
                    ✓
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
