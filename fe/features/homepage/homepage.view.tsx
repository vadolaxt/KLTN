// ─────────────────────────────────────────────
// homepage.view.tsx — Gộp toàn bộ components
// ─────────────────────────────────────────────

'use client';

import { useHomepageBloc } from './bloc/useHomepageBloc';

// Shared
import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';

// Feature-specific
import Banner from './components/Banner';
import StatBar from './components/StatBar';
import FunctionList from './components/FunctionList';
import NewsSection from './components/NewsSection';

export default function HomepageView() {
  const { state } = useHomepageBloc();
  const { stats, services, news, isLoading, error } = state;

  return (
    <div className="min-h-screen flex flex-col font-vietnam">
      {/* ── Layout chrome ── */}
      <TopBar />
      <Header />
      <NavBar />

      {/* ── Main content ── */}
      <main className="flex-1">
        <Banner />

        {/* Loading skeleton */}
        {isLoading && (
          <div className="py-20 flex items-center justify-center text-gray-400 text-sm">
            Đang tải dữ liệu…
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="py-8 px-10 text-red-500 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Data sections */}
        {!isLoading && (
          <>
            {stats.length > 0 && <StatBar stats={stats} />}
            {services.length > 0 && <FunctionList services={services} />}
            {news.length > 0 && <NewsSection news={news} />}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}