// ─────────────────────────────────────────────
// Header — Logo + action buttons
// ─────────────────────────────────────────────

export default function Header() {
  return (
    <header className="w-full px-10 flex items-center justify-between h-[80px] sticky top-0 z-50 bg-white border-b border-gray-mid shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
      {/* Logo */}
      <div className="flex items-center gap-3.5">
        <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-[18px] font-black text-white tracking-[1px] flex-shrink-0 bg-green-main border-[3px] border-gold">
          NLU
        </div>
        <div>
          <div className="text-[16px] font-extrabold uppercase tracking-[0.3px] leading-[1.2] text-green-dark">
            Trường Đại Học Nông Lâm TP. HCM
          </div>
          <div className="text-[10.5px] uppercase tracking-[0.5px] font-medium text-text-light">
            University of Agriculture &amp; Forestry Ho Chi Minh City
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button className="px-[22px] py-[9px] text-[14px] font-semibold rounded-md transition-all duration-200 text-green-main border-2 border-green-main bg-transparent hover:bg-green-main hover:text-white">
          Đăng nhập
        </button>
        <button className="px-[22px] py-[9px] text-[14px] font-semibold rounded-md transition-all duration-200 text-white bg-green-main border-2 border-green-main hover:bg-green-dark hover:border-green-dark">
          Đăng ký xét tuyển
        </button>
      </div>
    </header>
  );
}