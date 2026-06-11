'use client';

export default function PredictionHero() {
  return (
    <section className="bg-gradient-to-br from-[#0d2b0d] via-[#1e5c1e] to-[#1a4a1a] px-6 py-[52px] md:px-[60px]">
      <div className="max-w-[1180px]">
        <div className="mb-6 flex items-center gap-3.5">
          <div className="flex h-[58px] w-[58px] flex-shrink-0 items-center justify-center rounded-full border-[3px] border-yellow-500 bg-green-700 text-[18px] font-black tracking-[1px] text-white">
            NLU
          </div>
          <div>
            <div className="text-[16px] font-extrabold uppercase leading-[1.2] tracking-[0.3px] text-white">
              Trường Đại Học Nông Lâm TP. HCM
            </div>
            <div className="text-[10.5px] font-medium uppercase tracking-[0.5px] text-white/65">
              University of Agriculture &amp; Forestry Ho Chi Minh City
            </div>
          </div>
        </div>

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
      </div>
    </section>
  );
}
