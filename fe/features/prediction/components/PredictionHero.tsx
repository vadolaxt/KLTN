'use client';

export default function PredictionHero() {
  return (
    <section className="bg-gradient-to-br from-[#0d2b0d] via-[#1e5c1e] to-[#1a4a1a] px-[60px] py-[52px]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <div className="mb-2.5 text-[12px] font-extrabold uppercase tracking-[2.5px] text-gold-light">
            Công cụ hỗ trợ thí sinh 2026
          </div>
          <h1 className="mb-3 text-[42px] font-black leading-[1.1] text-white">
            Dự Đoán Khả Năng<br /><span className="text-gold-light">Trúng Tuyển</span>
          </h1>
          <p className="max-w-[640px] text-[15px] leading-[1.7] text-white/80">
            Nhập điểm theo từng phương thức xét tuyển, hệ thống tự động quy đổi về thang 30 và tính xác suất trúng tuyển dựa trên dữ liệu điểm chuẩn các năm trước của Trường ĐH Nông Lâm TP.HCM.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          <div className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
            <div className="text-[22px] font-extrabold text-gold-light">47</div>
            <div className="text-[12px] font-semibold text-white/80">Ngành dự đoán</div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
            <div className="text-[22px] font-extrabold text-gold-light">4</div>
            <div className="text-[12px] font-semibold text-white/80">Phương thức xét tuyển</div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/10 px-5 py-3 backdrop-blur-sm">
            <div className="text-[22px] font-extrabold text-gold-light">7</div>
            <div className="text-[12px] font-semibold text-white/80">Năm dữ liệu</div>
          </div>
        </div>
      </div>
    </section>
  );
}
