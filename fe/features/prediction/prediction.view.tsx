'use client';

import { useState } from 'react';
import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';

import PredictionHero from './components/PredictionHero';
import PredictionInputPanel from './components/PredictionInputPanel';
import PredictionResultPanel from './components/PredictionResultPanel';
import type { PredictionResultState, SchoolCode } from './types';

const SCHOOL_LABEL: Record<SchoolCode, string> = {
  NLU: 'Đại học Nông Lâm TP.HCM',
  SGU: 'Đại học Sài Gòn',
};

export default function PredictionView() {
  const [prediction, setPrediction] = useState<PredictionResultState | null>(null);
  const [schoolCode, setSchoolCode] = useState<SchoolCode>('NLU');

  const toggleSchool = () => {
    setSchoolCode((current) => (current === 'NLU' ? 'SGU' : 'NLU'));
    setPrediction(null);
  };

  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-gray-light">
      <TopBar />
      <Header />
      <NavBar />

      <main className="flex-1">
        <PredictionHero />

        <div className="mx-auto w-full max-w-[800px] px-4 pt-6 sm:px-6 lg:px-0 lg:pt-8">
          <div className="flex flex-col gap-3 border-b-2 border-gray-mid pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[1px] text-text-light">Trường</div>
              <div className="mt-1 text-[20px] font-black text-green-dark">{SCHOOL_LABEL[schoolCode]}</div>
            </div>
            <button
              type="button"
              onClick={toggleSchool}
              className="w-full rounded-lg border-2 border-green-main bg-white px-4 py-3 text-[13px] font-extrabold text-green-main transition-all hover:bg-green-main hover:text-white sm:w-auto"
            >
              {schoolCode === 'NLU' ? 'Dự đoán trường SGU' : 'Quay lại dự đoán NLU'}
            </button>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-[800px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-0 lg:py-7">
          <div className="flex flex-col gap-3">
            <PredictionInputPanel schoolCode={schoolCode} onResult={setPrediction} />
            <p className="rounded-lg border border-[#ffe0b2] bg-[#fff8e1] px-4 py-3 text-[11px] leading-[1.6] text-[#7a4b00] sm:text-[12px]">
              Lưu ý: Kết quả dự đoán chỉ dựa trên thông tin thí sinh tự nhập. Hệ thống không xác minh tính chính xác của dữ liệu này, vì vậy thí sinh nên kiểm tra kỹ điểm số và thông tin trước khi tham khảo kết quả.
            </p>
          </div>
          <PredictionResultPanel prediction={prediction} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
