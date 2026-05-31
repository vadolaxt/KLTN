'use client';

import { useMemo, useState } from 'react';

type ScoreType = 'hb' | 'thpt' | 'dgnl' | 'kh';

const tabs: Array<{ value: ScoreType; label: string }> = [
  { value: 'hb', label: 'Điểm Học bạ THPT' },
  { value: 'thpt', label: 'Điểm THPT Quốc gia' },
  { value: 'dgnl', label: 'Điểm ĐGNL' },
  { value: 'kh', label: 'Kết hợp THPT và Học bạ' },
];

const subjects = ['Toán', 'Ngữ văn', 'Tiếng Anh', 'Vật lý', 'Hóa học', 'Sinh học', 'Lịch sử', 'Địa lý', 'GDKTPL', 'Tin học'];

const inputClass =
  'rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-[12px] py-[10px] text-center text-[15px] font-bold text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]';

const labelClass = 'text-[11px] font-bold uppercase tracking-[0.7px] text-text-mid';

const normalizeNumericInput = (value: string, max: number) => {
  const cleaned = value.replace(',', '.').replace(/[^\d.]/g, '');
  if (cleaned === '') {
    return '';
  }

  const hasTrailingDot = cleaned.endsWith('.') && cleaned.indexOf('.') === cleaned.length - 1;
  const [rawInteger, rawFraction = ''] = cleaned.split('.');
  const integerPart = rawInteger.replace(/^0+(?=\d)/, '');
  const fractionPart = rawFraction.slice(0, 2);
  const normalized = hasTrailingDot ? `${integerPart}.` : fractionPart ? `${integerPart}.${fractionPart}` : integerPart;
  const parsed = Number(normalized);

  if (!Number.isFinite(parsed)) {
    return '';
  }

  if (parsed > max) {
    return max.toFixed(2);
  }

  return normalized;
};

export default function AcademicScoresView() {
  const [activeTab, setActiveTab] = useState<ScoreType>('hb');
  const [dgnlProvider, setDgnlProvider] = useState<'hcm' | 'hn'>('hcm');
  const [dgnlScore, setDgnlScore] = useState('');
  const [thptSubjectA, setThptSubjectA] = useState(subjects[0]);
  const [thptSubjectB, setThptSubjectB] = useState(subjects[2]);
  const [hocBaSubject, setHocBaSubject] = useState('Tiếng Anh');
  const [thptScoreA, setThptScoreA] = useState('');
  const [thptScoreB, setThptScoreB] = useState('');
  const [hocBaScore, setHocBaScore] = useState('');

  const dgnlMaxScore = 1200;
  const dgnlConvertedScore = useMemo(() => {
    const parsedScore = Number(dgnlScore);
    return Number.isFinite(parsedScore) ? Math.min((parsedScore / dgnlMaxScore) * 30, 30) : 0;
  }, [dgnlMaxScore, dgnlScore]);

  const combinedScore = useMemo(() => {
    const thptA = Number(thptScoreA);
    const thptB = Number(thptScoreB);
    const hocBa = Number(hocBaScore);
    const total = thptA + thptB + hocBa;
    return Number.isFinite(total) ? total : 0;
  }, [hocBaScore, thptScoreA, thptScoreB]);

  return (
    <div className="animate-fade-in">
      <div className="mb-1.5 text-[13px] font-bold uppercase tracking-[2px] text-green-main">Hồ sơ thí sinh</div>
      <div className="mb-1.5 border-l-5 border-gold pl-3.5 text-[22px] font-extrabold text-green-dark">Quản Lý Điểm</div>
      <div className="mb-8 pl-[19px] text-[13px] text-text-light">
        Nhập và cập nhật điểm theo các phương thức xét tuyển đang áp dụng cho năm tuyển sinh 2026.
      </div>

      <div className="mb-7 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full border-2 px-[18px] py-[8px] text-[13px] font-bold transition-all ${
              activeTab === tab.value
                ? 'border-green-main bg-green-main text-white'
                : 'border-gray-mid bg-white text-text-mid hover:border-green-main hover:bg-green-pale hover:text-green-main'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {(activeTab === 'hb' || activeTab === 'thpt') && (
        <section className="animate-fade-in">
          <div className="rounded-t-[10px] bg-green-dark px-[24px] py-[18px] text-white">
            <h3 className="text-[16px] font-extrabold">
              {activeTab === 'hb' ? 'Điểm Học bạ THPT' : 'Điểm Thi THPT Quốc gia'}
            </h3>
            <p className="mt-[2px] text-[12px] opacity-85">
              Nhập điểm từng môn theo thang 10. Hệ thống sử dụng điểm theo tổ hợp xét tuyển khi dự đoán.
            </p>
          </div>

          <div className="mb-[20px] rounded-b-[10px] border-1.5 border-t-0 border-gray-mid bg-white p-[28px]">
            <div className="grid grid-cols-2 gap-[16px] lg:grid-cols-5">
              {subjects.map((subject) => (
                <label key={subject} className="flex flex-col gap-[5px]">
                  <span className={labelClass}>{subject}</span>
                  <input
                    type="text"
                    inputMode="decimal"
                    pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                    min="0"
                    max="9.99"
                    step="0.01"
                    className={inputClass}
                    placeholder="0.00"
                    onChange={(event) => {
                      event.currentTarget.value = normalizeNumericInput(event.currentTarget.value, 9.99);
                    }}
                  />
                </label>
              ))}
            </div>

            <div className="mt-[24px] grid grid-cols-1 gap-[16px] md:grid-cols-3">
              {['A00 - Toán, Vật lý, Hóa học', 'B00 - Toán, Hóa học, Sinh học', 'D01 - Toán, Ngữ văn, Tiếng Anh'].map((combo) => (
                <div key={combo} className="rounded-[10px] bg-green-pale p-[16px] text-center">
                  <div className="text-[28px] font-extrabold leading-none text-green-main">-</div>
                  <div className="mt-[6px] text-[11px] font-bold uppercase tracking-[0.5px] text-text-mid">{combo}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-[12px]">
            <button className="rounded-lg border-2 border-gray-mid bg-white px-[26px] py-[11px] text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light hover:text-text-dark">Hủy</button>
            <button className="rounded-lg border-2 border-green-main bg-green-main px-[28px] py-[11px] text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark">
              {activeTab === 'hb' ? 'Lưu điểm học bạ' : 'Lưu điểm THPT'}
            </button>
          </div>
        </section>
      )}

      {activeTab === 'dgnl' && (
        <section className="animate-fade-in">
          <div className="rounded-t-[10px] bg-green-dark px-[24px] py-[18px] text-white">
            <h3 className="text-[16px] font-extrabold">Điểm Đánh Giá Năng Lực</h3>
            <p className="mt-[2px] text-[12px] opacity-85">Điểm được quy đổi tự động về thang 30 để phục vụ xét tuyển.</p>
          </div>

          <div className="mb-[20px] rounded-b-[10px] border-1.5 border-t-0 border-gray-mid bg-white p-[28px]">
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
              <label className="flex flex-col gap-[6px]">
                <span className={labelClass}>Đơn vị tổ chức</span>
                <select
                  value={dgnlProvider}
                  onChange={(event) => setDgnlProvider(event.target.value as 'hcm' | 'hn')}
                  className="rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-[14px] py-[11px] text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white"
                >
                  <option value="hcm">ĐHQG TP.HCM - thang 1200</option>
                  <option value="hn">ĐHQG Hà Nội - thang 1200</option>
                </select>
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className={labelClass}>Tổng điểm ĐGNL</span>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                  min="0"
                  max={dgnlMaxScore}
                  step="0.01"
                  value={dgnlScore}
                  onChange={(event) => setDgnlScore(normalizeNumericInput(event.target.value, dgnlMaxScore))}
                  className={inputClass}
                  placeholder="0"
                />
              </label>
            </div>

            <div className="mt-[24px] rounded-[10px] bg-green-pale p-[18px] text-center">
              <div className="text-[30px] font-extrabold text-green-main">{dgnlConvertedScore.toFixed(2)}</div>
              <div className="mt-[4px] text-[12px] font-bold uppercase tracking-[0.6px] text-text-mid">Điểm quy đổi thang 30</div>
            </div>
          </div>

          <div className="flex justify-end gap-[12px]">
            <button className="rounded-lg border-2 border-gray-mid bg-white px-[26px] py-[11px] text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light hover:text-text-dark">Hủy</button>
            <button className="rounded-lg border-2 border-green-main bg-green-main px-[28px] py-[11px] text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark">Lưu điểm ĐGNL</button>
          </div>
        </section>
      )}

      {activeTab === 'kh' && (
        <section className="animate-fade-in">
          <div className="rounded-t-[10px] bg-green-dark px-[24px] py-[18px] text-white">
            <h3 className="text-[16px] font-extrabold">Kết hợp THPT và Học bạ</h3>
            <p className="mt-[2px] text-[12px] opacity-85">
              Xét 02 môn thi tốt nghiệp THPT 2026 trong tổ hợp và 01 môn học bạ (TB 6 học kỳ, làm tròn 2 chữ số)
              để bổ sung hoặc thay thế; môn học bạ không được là Toán và Ngữ văn.
            </p>
          </div>

          <div className="mb-[20px] rounded-b-[10px] border-1.5 border-t-0 border-gray-mid bg-white p-[28px]">
            <div className="grid grid-cols-1 gap-[20px] md:grid-cols-3">
              <label className="flex flex-col gap-[6px]">
                <span className={labelClass}>Môn thi THPT 1</span>
                <select
                  value={thptSubjectA}
                  onChange={(event) => setThptSubjectA(event.target.value)}
                  className="rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-[14px] py-[11px] text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                  min="0"
                    max="9.99"
                  step="0.01"
                  value={thptScoreA}
                  onChange={(event) => setThptScoreA(normalizeNumericInput(event.target.value, 9.99))}
                  className={inputClass}
                  placeholder="0.00"
                />
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className={labelClass}>Môn thi THPT 2</span>
                <select
                  value={thptSubjectB}
                  onChange={(event) => setThptSubjectB(event.target.value)}
                  className="rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-[14px] py-[11px] text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white"
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                  min="0"
                    max="9.99"
                  step="0.01"
                  value={thptScoreB}
                  onChange={(event) => setThptScoreB(normalizeNumericInput(event.target.value, 9.99))}
                  className={inputClass}
                  placeholder="0.00"
                />
              </label>
              <label className="flex flex-col gap-[6px]">
                <span className={labelClass}>Môn học bạ (TB 6 học kỳ)</span>
                <select
                  value={hocBaSubject}
                  onChange={(event) => setHocBaSubject(event.target.value)}
                  className="rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-[14px] py-[11px] text-[14px] text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white"
                >
                  {subjects
                    .filter((subject) => subject !== 'Toán' && subject !== 'Ngữ văn')
                    .map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]*[.,]?[0-9]{0,2}$"
                  min="0"
                    max="9.99"
                  step="0.01"
                  value={hocBaScore}
                  onChange={(event) => setHocBaScore(normalizeNumericInput(event.target.value, 9.99))}
                  className={inputClass}
                  placeholder="0.00"
                />
              </label>
            </div>

            <div className="mt-[24px] rounded-[10px] bg-green-pale p-[18px] text-center">
              <div className="text-[30px] font-extrabold text-green-main">{combinedScore.toFixed(2)}</div>
              <div className="mt-[4px] text-[12px] font-bold uppercase tracking-[0.6px] text-text-mid">Tổng điểm xét tuyển thang 30</div>
            </div>
          </div>

          <div className="flex justify-end gap-[12px]">
            <button className="rounded-lg border-2 border-gray-mid bg-white px-[26px] py-[11px] text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light hover:text-text-dark">Hủy</button>
            <button className="rounded-lg border-2 border-green-main bg-green-main px-[28px] py-[11px] text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark">Lưu điểm kết hợp</button>
          </div>
        </section>
      )}
    </div>
  );
}
