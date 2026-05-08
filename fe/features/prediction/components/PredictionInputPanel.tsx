'use client';

import { useState } from 'react';

export default function PredictionInputPanel() {
  const [method, setMethod] = useState<'hb'|'thpt'|'dgnl'|'en'>('hb');

  return (
    <div className="bg-white rounded-[14px] border-1.5 border-gray-mid overflow-hidden">
      <div className="bg-gradient-to-r from-green-dark to-green-main p-[20px_28px] flex items-center gap-3.5">
        <div className="w-10 h-10 bg-white/15 rounded-[10px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
        </div>
        <div>
          <h2 className="text-[16px] font-extrabold text-white">Thông tin xét tuyển</h2>
          <p className="text-[12px] text-white/75 mt-0.5">Điền đầy đủ để có kết quả chính xác nhất</p>
        </div>
      </div>

      <div className="p-[28px]">
        {/* Bước 1: Chọn ngành */}
        <div className="mb-7">
          <div className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-text-light mb-3.5 pb-2 border-b-2 border-green-pale flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-green-main"><path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
            Bước 1 — Chọn ngành đăng ký
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.6px] text-text-mid">Ngành xét tuyển <span className="text-[#e53935]">*</span></label>
              <select className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
                <option value="">-- Chọn ngành --</option>
                <optgroup label="Công nghệ – Kỹ thuật">
                  <option value="cntpham">Công nghệ thực phẩm</option>
                  <option value="cnsh">Công nghệ sinh học</option>
                </optgroup>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.6px] text-text-mid">Tổ hợp xét tuyển <span className="text-[#e53935]">*</span></label>
              <select className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
                <option value="A00">A00 — Toán, Lý, Hóa</option>
                <option value="B00">B00 — Toán, Hóa, Sinh</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold uppercase tracking-[0.6px] text-text-mid">Năm xét tuyển</label>
              <select className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bước 2: Nhập điểm */}
        <div className="mb-7">
          <div className="text-[11px] font-extrabold uppercase tracking-[1.5px] text-text-light mb-3.5 pb-2 border-b-2 border-green-pale flex items-center gap-2">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-green-main"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>
            Bước 2 — Nhập điểm theo phương thức
          </div>

          <div className="grid grid-cols-4 gap-2 mb-5">
            <button onClick={()=>setMethod('hb')} className={`p-[10px_8px] border-2 rounded-lg text-[11px] font-bold text-center leading-[1.4] transition-all ${method === 'hb' ? 'border-green-main bg-green-main text-white' : 'border-gray-mid bg-white text-text-mid hover:border-green-main hover:text-green-main hover:bg-green-pale'}`}>📚 Học Bạ<br/>THPT</button>
            <button onClick={()=>setMethod('thpt')} className={`p-[10px_8px] border-2 rounded-lg text-[11px] font-bold text-center leading-[1.4] transition-all ${method === 'thpt' ? 'border-green-main bg-green-main text-white' : 'border-gray-mid bg-white text-text-mid hover:border-green-main hover:text-green-main hover:bg-green-pale'}`}>📝 Thi THPT<br/>Quốc Gia</button>
            <button onClick={()=>setMethod('dgnl')} className={`p-[10px_8px] border-2 rounded-lg text-[11px] font-bold text-center leading-[1.4] transition-all ${method === 'dgnl' ? 'border-green-main bg-green-main text-white' : 'border-gray-mid bg-white text-text-mid hover:border-green-main hover:text-green-main hover:bg-green-pale'}`}>🎯 Đánh Giá<br/>Năng Lực</button>
            <button onClick={()=>setMethod('en')} className={`p-[10px_8px] border-2 rounded-lg text-[11px] font-bold text-center leading-[1.4] transition-all ${method === 'en' ? 'border-green-main bg-green-main text-white' : 'border-gray-mid bg-white text-text-mid hover:border-green-main hover:text-green-main hover:bg-green-pale'}`}>🌐 CC Tiếng<br/>Anh QĐổi</button>
          </div>

          <div className="bg-gray-light border-1.5 border-gray-mid rounded-[10px] p-[16px_20px]">
            <div className="text-[11px] font-extrabold uppercase tracking-[1px] text-text-light mb-3">Điểm của bạn</div>
            <div className="grid grid-cols-3 gap-0 border-x border-t border-gray-mid rounded-lg overflow-hidden bg-white">
              <div className="p-[10px_6px] text-center border-b border-gray-mid flex flex-col justify-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-light mb-1">Môn 1</div>
                <input type="number" className="w-full text-center text-[18px] font-extrabold text-green-main outline-none" placeholder="0.0" />
              </div>
              <div className="p-[10px_6px] text-center border-b border-l border-gray-mid flex flex-col justify-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-light mb-1">Môn 2</div>
                <input type="number" className="w-full text-center text-[18px] font-extrabold text-green-main outline-none" placeholder="0.0" />
              </div>
              <div className="p-[10px_6px] text-center border-b border-l border-gray-mid flex flex-col justify-center">
                <div className="text-[10px] font-bold uppercase tracking-[0.5px] text-text-light mb-1">Môn 3</div>
                <input type="number" className="w-full text-center text-[18px] font-extrabold text-green-main outline-none" placeholder="0.0" />
              </div>
            </div>
            <div className="mt-3 text-center bg-green-pale text-green-main font-bold text-[12px] p-[4px_10px] rounded-md border border-green-light/30">
              Tổng điểm xét tuyển: <span className="text-[16px] font-black">24.50</span>
            </div>
          </div>
        </div>

        {/* Action */}
        <button className="w-full p-4 bg-gradient-to-br from-green-dark to-green-main text-white rounded-[10px] text-[16px] font-extrabold flex items-center justify-center gap-2.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(45,122,45,0.4)] mt-6">
          <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          Phân Tích Dự Đoán
        </button>

      </div>
    </div>
  );
}
