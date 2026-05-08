'use client';

export default function PredictionHero() {
  return (
    <div className="bg-gradient-to-br from-[#0d2b0d] via-[#1e5c1e] to-[#1a4a1a] px-[60px] py-[52px] relative overflow-hidden flex items-center gap-[60px]">
      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      ></div>

      <div className="relative z-10 w-[120px] h-[120px] shrink-0 bg-white/10 rounded-[28px] border-2 border-white/15 flex items-center justify-center text-[56px] shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
        🎯
      </div>

      <div className="relative z-10 flex-1">
        <div className="text-[12px] font-extrabold uppercase tracking-[2.5px] text-gold-light mb-2.5">Công cụ hỗ trợ thí sinh 2025</div>
        <div className="text-[42px] font-black text-white leading-[1.1] tracking-[-0.5px] mb-3">
          Dự Đoán Khả Năng<br/><span className="text-gold-light">Trúng Tuyển</span>
        </div>
        <div className="text-[15px] text-white/80 leading-[1.7] max-w-[560px]">
          Nhập điểm theo từng phương thức xét tuyển, hệ thống tự động quy đổi về thang 30 và tính xác suất trúng tuyển dựa trên dữ liệu điểm chuẩn các năm trước của Trường ĐH Nông Lâm TP.HCM.
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-3.5 shrink-0">
        <div className="bg-white/10 border border-white/20 rounded-full px-5 py-2.5 flex items-center gap-3 backdrop-blur-sm transition-all hover:bg-white/20 hover:translate-x-1">
          <div className="font-serif text-[22px] font-extrabold text-gold-light">50+</div>
          <div className="text-[12px] text-white/80 font-semibold">Ngành dự đoán</div>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-full px-5 py-2.5 flex items-center gap-3 backdrop-blur-sm transition-all hover:bg-white/20 hover:translate-x-1">
          <div className="font-serif text-[22px] font-extrabold text-gold-light">4</div>
          <div className="text-[12px] text-white/80 font-semibold">Phương thức xét tuyển</div>
        </div>
        <div className="bg-white/10 border border-white/20 rounded-full px-5 py-2.5 flex items-center gap-3 backdrop-blur-sm transition-all hover:bg-white/20 hover:translate-x-1">
          <div className="font-serif text-[22px] font-extrabold text-gold-light">5</div>
          <div className="text-[12px] text-white/80 font-semibold">Năm dữ liệu lịch sử</div>
        </div>
      </div>
    </div>
  );
}
