'use client';

import { useState } from 'react';

type ScoreType = 'hb' | 'thpt' | 'dgnl' | 'en';

export default function AcademicScoresView() {
  const [activeTab, setActiveTab] = useState<ScoreType>('hb');

  return (
    <div className="animate-fade-in">
      <div className="text-[13px] font-bold text-green-main uppercase tracking-[2px] mb-1.5">Hồ sơ thí sinh</div>
      <div className="text-[22px] font-extrabold text-green-dark mb-1.5 border-l-5 border-gold pl-3.5">Quản Lý Điểm</div>
      <div className="text-[13px] text-text-light mb-8 pl-[19px]">Nhập và cập nhật các loại điểm theo từng phương thức xét tuyển. Điểm sẽ được kiểm tra và xác nhận bởi hội đồng tuyển sinh.</div>

      {/* Score Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-7">
        <button 
          onClick={() => setActiveTab('hb')}
          className={`px-[18px] py-[8px] rounded-full border-2 text-[13px] font-bold flex items-center gap-1.5 transition-all
            ${activeTab === 'hb' ? 'bg-[#1565c0] border-[#1565c0] text-white' : 'bg-white border-gray-mid text-text-mid hover:border-[#1565c0] hover:text-[#1565c0] hover:bg-green-pale'}`}
        >
          <span className={`w-2 h-2 rounded-full ${activeTab === 'hb' ? 'bg-white/70' : 'bg-current'}`}></span>
          📚 Điểm Học Bạ THPT
        </button>
        <button 
          onClick={() => setActiveTab('thpt')}
          className={`px-[18px] py-[8px] rounded-full border-2 text-[13px] font-bold flex items-center gap-1.5 transition-all
            ${activeTab === 'thpt' ? 'bg-[#2e7d32] border-[#2e7d32] text-white' : 'bg-white border-gray-mid text-text-mid hover:border-[#2e7d32] hover:text-[#2e7d32] hover:bg-green-pale'}`}
        >
          <span className={`w-2 h-2 rounded-full ${activeTab === 'thpt' ? 'bg-white/70' : 'bg-current'}`}></span>
          📝 Điểm THPT Quốc Gia
        </button>
        <button 
          onClick={() => setActiveTab('dgnl')}
          className={`px-[18px] py-[8px] rounded-full border-2 text-[13px] font-bold flex items-center gap-1.5 transition-all
            ${activeTab === 'dgnl' ? 'bg-[#6a1b9a] border-[#6a1b9a] text-white' : 'bg-white border-gray-mid text-text-mid hover:border-[#6a1b9a] hover:text-[#6a1b9a] hover:bg-green-pale'}`}
        >
          <span className={`w-2 h-2 rounded-full ${activeTab === 'dgnl' ? 'bg-white/70' : 'bg-current'}`}></span>
          🎯 Điểm ĐGNL
        </button>
        <button 
          onClick={() => setActiveTab('en')}
          className={`px-[18px] py-[8px] rounded-full border-2 text-[13px] font-bold flex items-center gap-1.5 transition-all
            ${activeTab === 'en' ? 'bg-[#e65100] border-[#e65100] text-white' : 'bg-white border-gray-mid text-text-mid hover:border-[#e65100] hover:text-[#e65100] hover:bg-green-pale'}`}
        >
          <span className={`w-2 h-2 rounded-full ${activeTab === 'en' ? 'bg-white/70' : 'bg-current'}`}></span>
          🌐 Điểm Quy Đổi Tiếng Anh
        </button>
      </div>

      {/* Học Bạ */}
      {activeTab === 'hb' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-[14px] p-[20px_24px] rounded-t-[10px] bg-gradient-to-br from-[#1565c0] to-[#1976d2] mb-0">
            <div className="w-[44px] h-[44px] bg-white/20 rounded-[10px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] fill-white"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>
            </div>
            <div className="text-white">
              <h3 className="text-[16px] font-extrabold">Điểm Học Bạ THPT</h3>
              <p className="text-[12px] opacity-85 mt-[2px]">Trung bình điểm các môn theo từng học kỳ (lớp 10, 11, 12)</p>
            </div>
            <span className="ml-auto bg-white/20 text-white text-[11px] font-bold px-[12px] py-[4px] rounded-full border border-white/30">Phương thức 1</span>
          </div>
          <div className="border-1.5 border-t-0 border-gray-mid rounded-b-[10px] p-[28px] bg-white mb-[20px]">
            
            <div className="bg-green-pale border-1.5 border-green-light rounded-lg p-[14px_18px] flex gap-[10px] items-start mb-[20px]">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-green-main flex-shrink-0 mt-[1px]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <p className="text-[12.5px] text-text-mid leading-[1.6]">Nhập <strong className="text-green-dark">điểm trung bình từng môn</strong> theo từng năm học. Điểm nhập theo thang 10, làm tròn 2 chữ số thập phân. Mỗi môn tính trung bình cộng của 3 học kỳ (HK1 lớp 11, HK2 lớp 11, HK1 lớp 12).</p>
            </div>
            
            <div className="text-[12px] font-extrabold uppercase tracking-[1px] text-text-light mb-[12px]">Lớp 10 – Học kỳ 1 & 2</div>
            <div className="grid grid-cols-3 gap-[16px] mb-[24px]">
              {[
                { name: 'Toán', val: '8.5' },
                { name: 'Ngữ Văn', val: '7.8' },
                { name: 'Tiếng Anh', val: '8.0' },
                { name: 'Vật Lý', val: '' },
                { name: 'Hóa Học', val: '' },
                { name: 'Sinh Học', val: '9.2' }
              ].map(sub => (
                <div key={sub.name} className="flex flex-col gap-[5px]">
                  <div className="text-[11px] font-bold uppercase tracking-[0.7px] text-text-mid">{sub.name}</div>
                  <input type="number" className="p-[10px_14px] border-1.5 border-gray-mid rounded-lg text-[16px] font-bold text-text-dark bg-[#fafafa] text-center outline-none transition-all focus:border-[#1565c0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.12)] hover:border-green-light hover:bg-white" placeholder="0.0" min="0" max="10" step="0.1" defaultValue={sub.val} />
                </div>
              ))}
            </div>

            <div className="text-[12px] font-extrabold uppercase tracking-[1px] text-text-light mb-[12px] mt-[20px]">Lớp 11 – Học kỳ 1 & 2</div>
            <div className="grid grid-cols-3 gap-[16px] mb-[24px]">
              {[
                { name: 'Toán', val: '8.8' },
                { name: 'Ngữ Văn', val: '7.5' },
                { name: 'Tiếng Anh', val: '8.3' },
                { name: 'Vật Lý', val: '7.0' },
                { name: 'Hóa Học', val: '8.6' },
                { name: 'Sinh Học', val: '9.5' }
              ].map(sub => (
                <div key={sub.name} className="flex flex-col gap-[5px]">
                  <div className="text-[11px] font-bold uppercase tracking-[0.7px] text-text-mid">{sub.name}</div>
                  <input type="number" className="p-[10px_14px] border-1.5 border-gray-mid rounded-lg text-[16px] font-bold text-text-dark bg-[#fafafa] text-center outline-none transition-all focus:border-[#1565c0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.12)] hover:border-green-light hover:bg-white" placeholder="0.0" min="0" max="10" step="0.1" defaultValue={sub.val} />
                </div>
              ))}
            </div>

            <div className="text-[12px] font-extrabold uppercase tracking-[1px] text-text-light mb-[12px] mt-[20px]">Lớp 12 – Học kỳ 1</div>
            <div className="grid grid-cols-3 gap-[16px] mb-[24px]">
              {[
                { name: 'Toán', val: '9.0' },
                { name: 'Ngữ Văn', val: '7.8' },
                { name: 'Tiếng Anh', val: '8.5' },
                { name: 'Hóa Học', val: '9.0' },
                { name: 'Sinh Học', val: '9.3' },
                { name: 'Địa Lý / GDCD', val: '' }
              ].map(sub => (
                <div key={sub.name} className="flex flex-col gap-[5px]">
                  <div className="text-[11px] font-bold uppercase tracking-[0.7px] text-text-mid">{sub.name}</div>
                  <input type="number" className="p-[10px_14px] border-1.5 border-gray-mid rounded-lg text-[16px] font-bold text-text-dark bg-[#fafafa] text-center outline-none transition-all focus:border-[#1565c0] focus:bg-white focus:shadow-[0_0_0_3px_rgba(21,101,192,0.12)] hover:border-green-light hover:bg-white" placeholder="0.0" min="0" max="10" step="0.1" defaultValue={sub.val} />
                </div>
              ))}
            </div>

            <div className="text-[12px] font-extrabold uppercase tracking-[1px] text-text-light mb-[12px] mt-[28px]">Điểm tổng kết (tự động tính)</div>
            <div className="grid grid-cols-4 gap-[16px] mt-[8px]">
              <div className="bg-[#e3f2fd] rounded-[10px] p-[16px] text-center transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
                <div className="font-serif text-[32px] font-extrabold leading-none mb-[4px] text-[#1565c0]">8.67</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">Tổ hợp B00</div>
                <div className="text-[10px] text-text-light mt-[2px]">Toán + Hóa + Sinh</div>
              </div>
              <div className="bg-[#e3f2fd] rounded-[10px] p-[16px] text-center transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
                <div className="font-serif text-[32px] font-extrabold leading-none mb-[4px] text-[#1565c0]">8.43</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">Tổ hợp A00</div>
                <div className="text-[10px] text-text-light mt-[2px]">Toán + Lý + Hóa</div>
              </div>
              <div className="bg-[#fce4ec] rounded-[10px] p-[16px] text-center transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
                <div className="font-serif text-[32px] font-extrabold leading-none mb-[4px] text-[#c62828]">–</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">Tổ hợp D01</div>
                <div className="text-[10px] text-text-light mt-[2px]">Toán + Văn + Anh</div>
              </div>
              <div className="bg-[#e3f2fd] rounded-[10px] p-[16px] text-center transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
                <div className="font-serif text-[32px] font-extrabold leading-none mb-[4px] text-[#1565c0]">8.87</div>
                <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">Tổ hợp B08</div>
                <div className="text-[10px] text-text-light mt-[2px]">Toán + Sinh + Anh</div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-[12px]">
            <button className="px-[26px] py-[11px] border-2 border-gray-mid text-text-mid bg-white rounded-lg text-[14px] font-semibold transition-all hover:bg-gray-light hover:border-[#bbb] hover:text-text-dark">Hủy</button>
            <button className="px-[28px] py-[11px] bg-[#1565c0] text-white border-2 border-[#1565c0] rounded-lg text-[14px] font-bold flex items-center gap-[8px] transition-all hover:bg-[#0d47a1] hover:border-[#0d47a1] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(21,101,192,0.3)]">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-white"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
              Lưu điểm học bạ
            </button>
          </div>
        </div>
      )}

      {/* THPT Quốc Gia */}
      {activeTab === 'thpt' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-[14px] p-[20px_24px] rounded-t-[10px] bg-gradient-to-br from-[#2e7d32] to-[#388e3c] mb-0">
            <div className="w-[44px] h-[44px] bg-white/20 rounded-[10px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] fill-white"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/></svg>
            </div>
            <div className="text-white">
              <h3 className="text-[16px] font-extrabold">Điểm Thi THPT Quốc Gia 2025</h3>
              <p className="text-[12px] opacity-85 mt-[2px]">Kết quả kỳ thi tốt nghiệp THPT do Bộ GD&ĐT tổ chức</p>
            </div>
            <span className="ml-auto bg-white/20 text-white text-[11px] font-bold px-[12px] py-[4px] rounded-full border border-white/30">Phương thức 2</span>
          </div>
          <div className="border-1.5 border-t-0 border-gray-mid rounded-b-[10px] p-[28px] bg-white mb-[20px]">
            <div className="bg-green-pale border-1.5 border-green-light rounded-lg p-[14px_18px] flex gap-[10px] items-start mb-[20px]">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-green-main flex-shrink-0 mt-[1px]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <p className="text-[12.5px] text-text-mid leading-[1.6]">Điểm thi THPT sẽ được <strong className="text-green-dark">tự động đồng bộ</strong> từ hệ thống Bộ GD&ĐT sau khi có kết quả chính thức. Thí sinh có thể nhập trước điểm dự kiến để tham khảo.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-[16px]">
              {[
                'Toán', 'Ngữ Văn', 'Tiếng Anh', 
                'Vật Lý', 'Hóa Học', 'Sinh Học', 
                'Lịch Sử', 'Địa Lý', 'GDCD'
              ].map(subject => (
                <div key={subject} className="flex flex-col gap-[5px]">
                  <div className="text-[11px] font-bold uppercase tracking-[0.7px] text-text-mid">{subject} <span className="text-[#e53935]">*</span></div>
                  <input type="number" className="p-[10px_14px] border-1.5 border-gray-mid rounded-lg text-[16px] font-bold text-text-dark bg-[#fafafa] text-center outline-none transition-all focus:border-[#2e7d32] focus:bg-white focus:shadow-[0_0_0_3px_rgba(46,125,50,0.12)] hover:border-green-light hover:bg-white" placeholder="0.00" min="0" max="10" step="0.25" />
                </div>
              ))}
            </div>

            <div className="text-[12px] font-extrabold uppercase tracking-[1px] text-text-light mb-[12px] mt-[24px]">Điểm tổ hợp xét tuyển</div>
            <div className="grid grid-cols-4 gap-[16px] mt-[8px]">
              {[
                { name: 'Tổ hợp B00', desc: 'Toán + Hóa + Sinh' },
                { name: 'Tổ hợp A00', desc: 'Toán + Lý + Hóa' },
                { name: 'Tổ hợp D01', desc: 'Toán + Văn + Anh' },
                { name: 'Tổ hợp B08', desc: 'Toán + Sinh + Anh' }
              ].map(combo => (
                <div key={combo.name} className="bg-[#e8f5e9] rounded-[10px] p-[16px] text-center transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
                  <div className="font-serif text-[32px] font-extrabold leading-none mb-[4px] text-[#2e7d32]">–</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">{combo.name}</div>
                  <div className="text-[10px] text-text-light mt-[2px]">{combo.desc}</div>
                </div>
              ))}
            </div>

          </div>
          <div className="flex justify-end gap-[12px]">
            <button className="px-[26px] py-[11px] border-2 border-gray-mid text-text-mid bg-white rounded-lg text-[14px] font-semibold transition-all hover:bg-gray-light hover:border-[#bbb] hover:text-text-dark">Hủy</button>
            <button className="px-[28px] py-[11px] bg-[#2e7d32] text-white border-2 border-[#2e7d32] rounded-lg text-[14px] font-bold flex items-center gap-[8px] transition-all hover:bg-[#1b5e20] hover:border-[#1b5e20] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(46,125,50,0.3)]">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-white"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
              Lưu điểm THPT
            </button>
          </div>
        </div>
      )}

      {/* ĐGNL */}
      {activeTab === 'dgnl' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-[14px] p-[20px_24px] rounded-t-[10px] bg-gradient-to-br from-[#6a1b9a] to-[#7b1fa2] mb-0">
            <div className="w-[44px] h-[44px] bg-white/20 rounded-[10px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] fill-white"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z"/></svg>
            </div>
            <div className="text-white">
              <h3 className="text-[16px] font-extrabold">Điểm Đánh Giá Năng Lực (ĐGNL)</h3>
              <p className="text-[12px] opacity-85 mt-[2px]">Kỳ thi ĐGNL của ĐHQG TP.HCM hoặc ĐHQG Hà Nội</p>
            </div>
            <span className="ml-auto bg-white/20 text-white text-[11px] font-bold px-[12px] py-[4px] rounded-full border border-white/30">Phương thức 3</span>
          </div>
          
          <div className="border-1.5 border-t-0 border-gray-mid rounded-b-[10px] p-[28px] bg-white mb-[20px]">
            <div className="bg-green-pale border-1.5 border-green-light rounded-lg p-[14px_18px] flex gap-[10px] items-start mb-[20px]">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-green-main flex-shrink-0 mt-[1px]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <p className="text-[12.5px] text-text-mid leading-[1.6]">Điểm ĐGNL tính trên thang <strong>1000 điểm</strong> (ĐHQG TP.HCM) hoặc <strong>150 điểm</strong> (ĐHQG HN). Nhập điểm theo đúng thang điểm của kỳ thi bạn tham dự.</p>
            </div>

            <div className="grid grid-cols-2 gap-[20px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Đơn vị tổ chức <span className="text-[#e53935]">*</span></label>
                <select defaultValue="ĐHQG TP. Hồ Chí Minh (thang 1000)" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
                  <option value="ĐHQG TP. Hồ Chí Minh (thang 1000)">ĐHQG TP. Hồ Chí Minh (thang 1000)</option>
                  <option value="ĐHQG Hà Nội (thang 150)">ĐHQG Hà Nội (thang 150)</option>
                </select>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Năm thi <span className="text-[#e53935]">*</span></label>
                <select defaultValue="2025" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Mã số thí sinh kỳ thi ĐGNL</label>
                <input type="text" className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-[#6a1b9a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(106,27,154,0.12)]" placeholder="VD: ĐGNL2025XXXXX" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Tổng điểm ĐGNL <span className="text-[#e53935]">*</span></label>
                <input type="number" className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[22px] font-bold text-text-dark bg-[#fafafa] text-center outline-none transition-all hover:border-green-light hover:bg-white focus:border-[#6a1b9a] focus:bg-white focus:shadow-[0_0_0_3px_rgba(106,27,154,0.12)]" placeholder="0" min="0" max="1000" />
              </div>
            </div>

            <div className="mt-[24px]">
              <div className="grid grid-cols-3 gap-[16px]">
                <div className="bg-[#f3e5f5] rounded-[10px] p-[16px] text-center transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
                  <div className="font-serif text-[32px] font-extrabold leading-none mb-[4px] text-[#6a1b9a]">–</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">Điểm ĐGNL</div>
                  <div className="text-[10px] text-text-light mt-[2px]">Thang 1000</div>
                </div>
                <div className="bg-[#f3e5f5] rounded-[10px] p-[16px] text-center transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
                  <div className="font-serif text-[32px] font-extrabold leading-none mb-[4px] text-[#6a1b9a]">–</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">Điểm quy đổi</div>
                  <div className="text-[10px] text-text-light mt-[2px]">Thang 30 (×3/100)</div>
                </div>
                <div className="bg-[#f3e5f5] rounded-[10px] p-[16px] text-center transition-all hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
                  <div className="font-serif text-[32px] font-extrabold leading-none mb-[4px] text-[#6a1b9a]">–</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">Điểm ưu tiên</div>
                  <div className="text-[10px] text-text-light mt-[2px]">Đối tượng + Khu vực</div>
                </div>
              </div>
            </div>

            <div className="mt-[24px]">
              <div className="text-[11px] font-extrabold uppercase tracking-[1px] text-text-light mb-[12px]">Tải lên giấy chứng nhận điểm</div>
              <div className="border-2 border-dashed border-gray-mid rounded-[10px] p-[28px] text-center bg-[#fafafa] cursor-pointer transition-all hover:border-green-main hover:bg-green-pale group">
                <svg viewBox="0 0 24 24" className="w-[36px] h-[36px] fill-text-light mx-auto mb-[10px] transition-all group-hover:fill-green-main"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                <h4 className="text-[14px] font-bold text-text-dark mb-[4px]">Kéo thả tệp vào đây</h4>
                <p className="text-[12px] text-text-light">Tải lên ảnh/PDF giấy chứng nhận điểm ĐGNL có dấu xác nhận</p>
                <div className="inline-block mt-[12px] p-[8px_20px] bg-white text-green-main border-2 border-green-main rounded-md text-[13px] font-bold transition-all group-hover:bg-green-main group-hover:text-white">Chọn tệp từ máy tính</div>
              </div>
            </div>

          </div>
          <div className="flex justify-end gap-[12px]">
            <button className="px-[26px] py-[11px] border-2 border-gray-mid text-text-mid bg-white rounded-lg text-[14px] font-semibold transition-all hover:bg-gray-light hover:border-[#bbb] hover:text-text-dark">Hủy</button>
            <button className="px-[28px] py-[11px] bg-[#6a1b9a] text-white border-2 border-[#6a1b9a] rounded-lg text-[14px] font-bold flex items-center gap-[8px] transition-all hover:bg-[#4a148c] hover:border-[#4a148c] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(106,27,154,0.3)]">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-white"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
              Lưu điểm ĐGNL
            </button>
          </div>
        </div>
      )}

      {/* Tiếng Anh */}
      {activeTab === 'en' && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-[14px] p-[20px_24px] rounded-t-[10px] bg-gradient-to-br from-[#e65100] to-[#f57c00] mb-0">
            <div className="w-[44px] h-[44px] bg-white/20 rounded-[10px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-[24px] h-[24px] fill-white"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>
            </div>
            <div className="text-white">
              <h3 className="text-[16px] font-extrabold">Điểm Quy Đổi Chứng Chỉ Tiếng Anh</h3>
              <p className="text-[12px] opacity-85 mt-[2px]">IELTS, TOEFL iBT, TOEIC, B1/B2 và các chứng chỉ quốc tế khác</p>
            </div>
            <span className="ml-auto bg-white/20 text-white text-[11px] font-bold px-[12px] py-[4px] rounded-full border border-white/30">Điểm cộng / Miễn môn</span>
          </div>

          <div className="border-1.5 border-t-0 border-gray-mid rounded-b-[10px] p-[28px] bg-white mb-[20px]">
            <div className="bg-green-pale border-1.5 border-green-light rounded-lg p-[14px_18px] flex gap-[10px] items-start mb-[20px]">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-green-main flex-shrink-0 mt-[1px]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              <p className="text-[12.5px] text-text-mid leading-[1.6]">Chứng chỉ tiếng Anh quốc tế còn hiệu lực (không quá 2 năm) có thể được quy đổi sang thang 10 để <strong className="text-green-dark">thay thế điểm môn Tiếng Anh</strong> trong tổ hợp xét tuyển hoặc cộng điểm ưu tiên.</p>
            </div>

            <div className="text-[12px] font-extrabold uppercase tracking-[1px] text-text-light mb-[10px]">Chứng chỉ đã khai báo</div>
            <table className="w-full border-collapse mb-[8px]">
              <thead>
                <tr>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">Loại chứng chỉ</th>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">Band / Score</th>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">Điểm quy đổi (thang 10)</th>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">Hiệu lực đến</th>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-green-pale transition-colors group">
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid font-bold text-text-dark">IELTS Academic</td>
                  <td className="p-[10px_14px] text-[15px] border-b border-gray-mid font-extrabold text-[#e65100]">6.5</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid font-bold text-[#e65100]">8.5 điểm</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid">03/2026</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid"><span className="inline-block p-[2px_10px] rounded-[20px] text-[11px] font-bold bg-[#e8f5e9] text-green-main">Đã xác nhận</span></td>
                </tr>
                <tr className="hover:bg-green-pale transition-colors group">
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid font-bold text-text-dark">TOEIC Listening & Reading</td>
                  <td className="p-[10px_14px] text-[15px] border-b border-gray-mid font-extrabold text-[#e65100]">785</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid font-bold text-[#e65100]">8.0 điểm</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid">11/2025</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid"><span className="inline-block p-[2px_10px] rounded-[20px] text-[11px] font-bold bg-[#fff3e0] text-[#e65100]">Chờ xét duyệt</span></td>
                </tr>
              </tbody>
            </table>

            <div className="mt-[24px] text-[12px] font-extrabold uppercase tracking-[1px] text-text-light mb-[12px]">Thêm chứng chỉ mới</div>
            <div className="grid grid-cols-3 gap-[16px]">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Loại chứng chỉ <span className="text-[#e53935]">*</span></label>
                <select defaultValue="" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-[#e65100] focus:bg-white focus:shadow-[0_0_0_3px_rgba(230,81,0,0.12)]">
                  <option value="">-- Chọn loại --</option>
                  <option value="IELTS Academic">IELTS Academic</option>
                  <option value="IELTS General">IELTS General</option>
                  <option value="TOEFL iBT">TOEFL iBT</option>
                  <option value="TOEIC (L&R)">TOEIC (L&R)</option>
                  <option value="Cambridge B2 First">Cambridge B2 First</option>
                  <option value="Cambridge C1 Advanced">Cambridge C1 Advanced</option>
                  <option value="PTE Academic">PTE Academic</option>
                  <option value="VSTEP B1">VSTEP B1</option>
                  <option value="VSTEP B2">VSTEP B2</option>
                </select>
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Điểm / Band <span className="text-[#e53935]">*</span></label>
                <input type="text" className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-[#e65100] focus:bg-white focus:shadow-[0_0_0_3px_rgba(230,81,0,0.12)]" placeholder="VD: 6.5 / 785 / 90" />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Ngày hết hạn <span className="text-[#e53935]">*</span></label>
                <input type="date" className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-[#e65100] focus:bg-white focus:shadow-[0_0_0_3px_rgba(230,81,0,0.12)]" />
              </div>
            </div>

            <div className="mt-[16px]">
              <div className="border-2 border-dashed border-gray-mid rounded-[10px] p-[20px] text-center bg-[#fafafa] cursor-pointer transition-all hover:border-green-main hover:bg-green-pale group">
                <svg viewBox="0 0 24 24" className="w-[36px] h-[36px] fill-text-light mx-auto mb-[10px] transition-all group-hover:fill-green-main"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
                <h4 className="text-[14px] font-bold text-text-dark mb-[4px]">Tải lên bản sao chứng chỉ</h4>
                <p className="text-[12px] text-text-light">PDF hoặc ảnh rõ nét, có đầy đủ thông tin, con dấu (nếu có)</p>
                <div className="inline-block mt-[12px] p-[8px_20px] bg-white text-green-main border-2 border-green-main rounded-md text-[13px] font-bold transition-all group-hover:bg-green-main group-hover:text-white">Chọn tệp</div>
              </div>
            </div>

            <div className="mt-[24px] text-[12px] font-extrabold uppercase tracking-[1px] text-text-light mb-[10px]">Bảng quy đổi tham khảo</div>
            <table className="w-full border-collapse mb-[8px]">
              <thead>
                <tr>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">IELTS</th>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">TOEFL iBT</th>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">TOEIC (L&R)</th>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">VSTEP</th>
                  <th className="bg-green-pale p-[10px_14px] text-[11px] font-extrabold uppercase tracking-[0.6px] text-green-dark text-left border-b-2 border-green-light">Điểm quy đổi (thang 10)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-green-pale transition-colors">
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">7.5 – 9.0</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">110 – 120</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">905 – 990</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">B2+ / C1</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid font-bold text-[#e65100]">10.0</td>
                </tr>
                <tr className="hover:bg-green-pale transition-colors">
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">6.5 – 7.0</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">92 – 109</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">785 – 900</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">B2</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid font-bold text-[#e65100]">8.5 – 9.5</td>
                </tr>
                <tr className="hover:bg-green-pale transition-colors">
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">5.5 – 6.0</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">72 – 91</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">605 – 780</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">B1</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid font-bold text-[#e65100]">7.0 – 8.0</td>
                </tr>
                <tr className="hover:bg-green-pale transition-colors">
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">4.5 – 5.0</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">45 – 71</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">405 – 600</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid text-text-dark">A2</td>
                  <td className="p-[10px_14px] text-[13.5px] border-b border-gray-mid font-bold text-[#e65100]">5.0 – 6.5</td>
                </tr>
              </tbody>
            </table>

          </div>
          <div className="flex justify-end gap-[12px]">
            <button className="px-[26px] py-[11px] border-2 border-gray-mid text-text-mid bg-white rounded-lg text-[14px] font-semibold transition-all hover:bg-gray-light hover:border-[#bbb] hover:text-text-dark">Hủy</button>
            <button className="px-[28px] py-[11px] bg-[#e65100] text-white border-2 border-[#e65100] rounded-lg text-[14px] font-bold flex items-center gap-[8px] transition-all hover:bg-[#ef6c00] hover:border-[#ef6c00] hover:-translate-y-[1px] hover:shadow-[0_4px_16px_rgba(230,81,0,0.3)]">
              <svg viewBox="0 0 24 24" className="w-[16px] h-[16px] fill-white"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
              Thêm chứng chỉ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
