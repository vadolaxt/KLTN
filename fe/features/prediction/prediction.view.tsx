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

        <div className="px-10 pt-[28px]">
          <div className="flex flex-col gap-3 border-b-2 border-gray-mid pb-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[1px] text-text-light">Trường đang dự đoán</div>
              <div className="mt-1 text-[20px] font-black text-green-dark">{SCHOOL_LABEL[schoolCode]}</div>
            </div>
            <button
              type="button"
              onClick={toggleSchool}
              className="w-full rounded-lg border-2 border-green-main bg-white px-4 py-3 text-[13px] font-extrabold text-green-main transition-all hover:bg-green-main hover:text-white md:w-auto"
            >
              {schoolCode === 'NLU' ? 'Dự đoán trường SGU' : 'Quay lại dự đoán NLU'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 px-10 py-[28px] xl:grid-cols-[1fr_420px]">
          <PredictionInputPanel schoolCode={schoolCode} onResult={setPrediction} />
          <PredictionResultPanel prediction={prediction} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
