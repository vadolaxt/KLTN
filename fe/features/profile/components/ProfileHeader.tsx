'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ProfileHeader() {
  const pathname = usePathname();

  return (
    <>
      {/* Completion progress */}
      <div className="bg-green-pale rounded-[10px] p-[18px_22px] mb-7 border-1.5 border-green-light">
        <div className="flex justify-between text-[12px] font-bold mb-2 text-green-dark">
          <span>Mức độ hoàn thiện hồ sơ</span>
          <span className="text-green-main">65% hoàn thành</span>
        </div>
        <div className="h-[8px] bg-[#c8e6c9] rounded-[4px] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-main to-green-light rounded-[4px] transition-all duration-600" style={{ width: '65%' }}></div>
        </div>
      </div>

      {/* Overview mini-cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-gray-light border-1.5 border-gray-mid rounded-[10px] p-[14px_16px] transition-all duration-200 hover:border-green-main hover:bg-green-pale hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(45,122,45,0.1)] cursor-default">
          <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-light mb-1">Mã thí sinh</div>
          <div className="text-[15px] font-extrabold text-text-dark">NLU2025-00421</div>
        </div>
        <div className="bg-gray-light border-1.5 border-gray-mid rounded-[10px] p-[14px_16px] transition-all duration-200 hover:border-green-main hover:bg-green-pale hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(45,122,45,0.1)] cursor-default">
          <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-light mb-1">Ngành đăng ký</div>
          <div className="text-[15px] font-extrabold text-green-main">Công nghệ thực phẩm</div>
        </div>
        <div className="bg-gray-light border-1.5 border-gray-mid rounded-[10px] p-[14px_16px] transition-all duration-200 hover:border-green-main hover:bg-green-pale hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(45,122,45,0.1)] cursor-default">
          <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-light mb-1">Phương thức xét tuyển</div>
          <div className="text-[15px] font-extrabold text-text-dark">Học bạ THPT</div>
        </div>
        <div className="bg-gray-light border-1.5 border-gray-mid rounded-[10px] p-[14px_16px] transition-all duration-200 hover:border-green-main hover:bg-green-pale hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(45,122,45,0.1)] cursor-default">
          <div className="text-[10px] font-bold uppercase tracking-[0.8px] text-text-light mb-1">Trạng thái hồ sơ</div>
          <div className="text-[15px] font-extrabold text-text-dark">
            <span className="inline-flex items-center gap-1 bg-[#fff8e1] text-[#f57f17] px-2.5 py-[3px] rounded-full text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>Đang xử lý
            </span>
          </div>
        </div>
      </div>

      {/* TAB HEADER */}
      <div className="flex bg-white rounded-t-xl border-1.5 border-b-0 border-gray-mid overflow-hidden">
        <Link 
          href="/ho-so/thong-tin" 
          className={`flex-1 p-[18px_24px] flex items-center justify-center gap-2.5 text-[14px] transition-all relative
            ${pathname.includes('thong-tin') ? 'bg-white text-green-dark font-extrabold border-b-[3px] border-green-main' : 'bg-transparent text-text-light font-semibold border-b-[3px] border-transparent hover:bg-green-pale hover:text-green-dark'}`}
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          Quản lý thông tin cá nhân
        </Link>
        <div className="w-[1px] bg-gray-mid"></div>
        <Link 
          href="/ho-so/diem-so" 
          className={`flex-1 p-[18px_24px] flex items-center justify-center gap-2.5 text-[14px] transition-all relative
            ${pathname.includes('diem-so') ? 'bg-white text-green-dark font-extrabold border-b-[3px] border-green-main' : 'bg-transparent text-text-light font-semibold border-b-[3px] border-transparent hover:bg-green-pale hover:text-green-dark'}`}
        >
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-current"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>
          Quản lý điểm
        </Link>
      </div>
    </>
  );
}
