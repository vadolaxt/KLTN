'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full">
      <div className="text-center px-6 pb-7 border-b border-gray-mid mb-4">
        <div className="w-20 h-20 bg-gradient-to-br from-green-main to-green-dark rounded-full flex items-center justify-center text-[28px] font-black text-white mx-auto mb-3 border-4 border-gold relative">
          NVA
          <div className="absolute bottom-0 right-0 w-[22px] h-[22px] bg-green-light rounded-full border-2 border-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
        </div>
        <div className="text-[15px] font-extrabold text-text-dark mb-0.5">Nguyễn Văn An</div>
        <div className="text-[12px] text-text-light font-semibold bg-green-pale px-2.5 py-0.5 rounded-full inline-block mb-2">NLU2025-00421</div>
        <div className="inline-flex items-center gap-1.5 text-[11px] text-green-main font-bold bg-green-pale px-2.5 py-1 rounded-full">
          <div className="w-1.5 h-1.5 bg-green-light rounded-full animate-pulse"></div>
          Hồ sơ đang xử lý
        </div>
      </div>

      <div className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-text-light px-6 pt-4 pb-1.5">Quản lý hồ sơ</div>
      <ul className="list-none">
        <li>
          <Link
            href="/ho-so/thong-tin"
            className={`flex items-center gap-3 px-6 py-[13px] text-[14px] font-medium transition-all border-l-3 relative ${pathname.includes('thong-tin') ? 'bg-green-pale text-green-dark font-bold border-green-main' : 'text-text-mid border-transparent hover:bg-green-pale hover:text-green-dark hover:border-green-light'}`}
          >
            <svg viewBox="0 0 24 24" className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${pathname.includes('thong-tin') ? 'fill-green-main' : 'fill-text-light'}`}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            Thông tin cá nhân
            {pathname.includes('thong-tin') && <span className="ml-auto flex-shrink-0 min-w-[20px] text-center text-[10px] font-bold bg-green-main text-white px-[7px] py-[1px] rounded-[20px]">✓</span>}
          </Link>
        </li>
        <li>
          <Link
            href="/ho-so/diem-so"
            className={`flex items-center gap-3 px-6 py-[13px] text-[14px] font-medium transition-all border-l-3 relative ${pathname.includes('diem-so') ? 'bg-green-pale text-green-dark font-bold border-green-main' : 'text-text-mid border-transparent hover:bg-green-pale hover:text-green-dark hover:border-green-light'}`}
          >
            <svg viewBox="0 0 24 24" className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${pathname.includes('diem-so') ? 'fill-green-main' : 'fill-text-light'}`}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/></svg>
            Quản lý điểm
            {pathname.includes('diem-so') && <span className="ml-auto flex-shrink-0 min-w-[20px] text-center text-[10px] font-bold bg-green-main text-white px-[7px] py-[1px] rounded-[20px]">✓</span>}
          </Link>
        </li>
      </ul>

      <div className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-text-light px-6 pt-4 pb-1.5 mt-2">Khác</div>
      <ul className="list-none">
        <li>
          <a href="#" className="flex items-center gap-3 px-6 py-[13px] text-text-mid text-[14px] font-medium transition-all border-l-3 border-transparent hover:bg-green-pale hover:text-green-dark hover:border-green-light">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-text-light flex-shrink-0"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></svg>
            Xem kết quả xét tuyển
          </a>
        </li>
        <li>
          <a href="#" className="flex items-center gap-3 px-6 py-[13px] text-text-mid text-[14px] font-medium transition-all border-l-3 border-transparent hover:bg-green-pale hover:text-green-dark hover:border-green-light">
            <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-text-light flex-shrink-0"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Thông báo & Tin nhắn
            <span className="ml-auto flex-shrink-0 min-w-[20px] text-center text-[10px] font-bold text-white bg-[#e53935] px-[7px] py-[1px] rounded-[20px]">3</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
