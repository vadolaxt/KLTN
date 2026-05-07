'use client';

export default function PredictionResultPanel() {
  return (
    <div className="flex flex-col gap-5">
      {/* Gauge Chart */}
      <div className="bg-white rounded-[14px] border-1.5 border-gray-mid overflow-hidden">
        <div className="bg-gradient-to-r from-green-dark to-green-main p-[16px_24px]">
          <h3 className="text-[14px] font-extrabold text-white">Xác Suất Trúng Tuyển</h3>
          <p className="text-[11px] text-white/75 mt-0.5">Dựa trên phổ điểm và độ lệch chuẩn các năm</p>
        </div>
        <div className="p-[28px_24px] text-center">
          <div className="relative w-[240px] mx-auto mb-5">
            <svg viewBox="0 0 100 50" className="w-full overflow-visible">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e0e0e0" strokeWidth="12" strokeLinecap="round" />
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#2e7d32" strokeWidth="12" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset="31.4" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute top-[54%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <div className="font-serif text-[48px] font-extrabold leading-none text-[#2e7d32]">
                75<span className="text-[24px]">%</span>
              </div>
              <div className="text-[12px] font-bold uppercase tracking-[1px] mt-1 text-[#2e7d32]">Khả quan</div>
            </div>
          </div>
          
          <div className="bg-[#e8f5e9] border-2 border-[#66bb6a] rounded-[10px] p-[16px_20px] flex gap-3.5 items-center text-left">
            <div className="text-[32px]">🎉</div>
            <div>
              <h4 className="text-[14px] font-extrabold text-[#2e7d32] mb-1">Mức độ Cạnh Tranh Trung Bình</h4>
              <p className="text-[12px] text-text-mid leading-[1.6]">Điểm của bạn cao hơn điểm chuẩn trung bình các năm trước. Cơ hội trúng tuyển ở mức an toàn.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Benchmark Table */}
      <div className="bg-white rounded-[14px] border-1.5 border-gray-mid overflow-hidden">
        <div className="bg-gradient-to-r from-[#1a3a6a] to-[#2d5a9a] p-[16px_24px]">
          <h3 className="text-[14px] font-extrabold text-white">Thống Kê Điểm Chuẩn</h3>
          <p className="text-[11px] text-white/75 mt-0.5">Dữ liệu tham khảo ngành Công nghệ thực phẩm</p>
        </div>
        <div className="p-0">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-light p-[10px_16px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-text-mid text-left border-b-2 border-gray-mid">Năm</th>
                <th className="bg-gray-light p-[10px_16px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-text-mid text-left border-b-2 border-gray-mid">Điểm Chuẩn</th>
                <th className="bg-gray-light p-[10px_16px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-text-mid text-left border-b-2 border-gray-mid">Chỉ tiêu</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-mid hover:bg-green-pale transition-colors">
                <td className="p-[10px_16px] text-[13px] font-bold text-text-dark">2024</td>
                <td className="p-[10px_16px] text-[15px] font-extrabold text-green-main">23.50</td>
                <td className="p-[10px_16px] text-[13px] text-text-light">120</td>
              </tr>
              <tr className="border-b border-gray-mid hover:bg-green-pale transition-colors">
                <td className="p-[10px_16px] text-[13px] font-bold text-text-dark">2023</td>
                <td className="p-[10px_16px] text-[15px] font-extrabold text-green-main">22.80</td>
                <td className="p-[10px_16px] text-[13px] text-text-light">120</td>
              </tr>
              <tr className="hover:bg-green-pale transition-colors">
                <td className="p-[10px_16px] text-[13px] font-bold text-text-dark">2022</td>
                <td className="p-[10px_16px] text-[15px] font-extrabold text-green-main">22.00</td>
                <td className="p-[10px_16px] text-[13px] text-text-light">100</td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-between items-center p-[12px_16px] bg-green-pale border-t-2 border-green-main">
            <div className="text-[12px] font-extrabold uppercase tracking-[0.5px] text-green-dark">Điểm của bạn</div>
            <div className="font-serif text-[22px] font-extrabold text-green-main">24.50</div>
          </div>
        </div>
      </div>
    </div>
  );
}
