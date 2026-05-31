'use client';

import { useState } from 'react';
import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';
import Link from 'next/link';

import PredictionHero from './components/PredictionHero';
import PredictionInputPanel from './components/PredictionInputPanel';
import PredictionResultPanel from './components/PredictionResultPanel';
import type { PredictionResultState } from './types';

export default function PredictionView() {
  const [prediction, setPrediction] = useState<PredictionResultState | null>(null);

  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-gray-light">
      <TopBar />
      <Header />
      <NavBar />

      {/* BREADCRUMB */}
      <div className="bg-green-pale px-10 py-[14px] flex items-center gap-2 text-[13px] text-text-mid border-b border-gray-mid">
        <Link href="/" className="text-green-main font-semibold hover:text-green-dark hover:underline">Trang chủ</Link>
        <span className="text-text-light">›</span>
        <Link href="#" className="text-green-main font-semibold hover:text-green-dark hover:underline">Dịch vụ tuyển sinh</Link>
        <span className="text-text-light">›</span>
        <span>Dự đoán khả năng trúng tuyển</span>
      </div>

      <main className="flex-1">
        <PredictionHero />

        <div className="py-[36px] px-10 grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-7 items-start">
          <PredictionInputPanel onResult={setPrediction} />
          <PredictionResultPanel prediction={prediction} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
