'use client';

export default function PredictionHero() {
  return (
    <section className="bg-gradient-to-r from-[#0b3213] via-[#165b20] to-[#267c2c]">
      <div className="mx-auto w-full max-w-[800px] px-4 py-8 sm:px-6 sm:py-10 lg:px-0 lg:py-12">
        <div>
          <div className="mb-4 inline-flex rounded-lg border border-gold-light/80 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[2.4px] text-gold-light sm:text-[11px]">
            Công cụ hỗ trợ thí sinh 2026
          </div>
          <h1 className="mb-4 max-w-[720px] text-[29px] font-black leading-[1.08] text-white sm:text-[38px] lg:text-[42px]">
            Tính điểm xét tuyển và<br className="hidden sm:block" /> Dự Đoán Khả Năng <span className="text-gold-light">Trúng Tuyển</span>
          </h1>
          <p className="max-w-[760px] text-[12px] leading-[1.75] text-white/75 sm:text-[13px]">
            Công cụ hỗ trợ tính điểm xét tuyển nhanh chóng, chính xác theo các phương thức xét tuyển phổ biến hiện nay và tính xác suất trúng tuyển dựa trên dữ liệu điểm chuẩn các năm trước của Trường ĐH Nông Lâm TP.HCM.
          </p>
        </div>
      </div>
    </section>
  );
}
