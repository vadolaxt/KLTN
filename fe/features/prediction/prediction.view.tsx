'use client';

import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';

import PredictionHero from './components/PredictionHero';
import PredictionInputPanel from './components/PredictionInputPanel';
import PredictionResultPanel from './components/PredictionResultPanel';

export default function PredictionView() {
  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-gray-light">
      <TopBar />
      <Header />
      <NavBar />

      {/* BREADCRUMB */}
      <div className="bg-green-pale px-10 py-[14px] flex items-center gap-2 text-[13px] text-text-mid border-b border-gray-mid">
        <a href="/" className="text-green-main font-semibold hover:text-green-dark hover:underline">🏠 Trang chủ</a>
        <span className="text-text-light">›</span>
        <a href="#" className="text-green-main font-semibold hover:text-green-dark hover:underline">Dịch vụ tuyển sinh</a>
        <span className="text-text-light">›</span>
        <span>Dự đoán khả năng trúng tuyển</span>
      </div>

      <main className="flex-1">
        <PredictionHero />

        <div className="py-[36px] px-10 grid grid-cols-[1fr_420px] gap-7 items-start">
          <PredictionInputPanel />
          <PredictionResultPanel />
        </div>
      </main>

      <Footer />
    </div>
  );
}
