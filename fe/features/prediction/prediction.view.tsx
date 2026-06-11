'use client';

import { useState } from 'react';
import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';

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
