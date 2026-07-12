'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Search } from 'lucide-react';
import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';
import { NEWS_CATEGORY_LABEL, NewsApiService, NewsArticle, NewsCategory } from '@/service/news.api';
import { formatDate } from '@/core/utils/helpers';

const FILTERS: Array<{ label: string; value: NewsCategory | 'ALL' }> = [
  { label: 'Tất cả', value: 'ALL' },
  { label: NEWS_CATEGORY_LABEL.ADMISSION_INFO, value: 'ADMISSION_INFO' },
  { label: NEWS_CATEGORY_LABEL.CAREER_GUIDANCE, value: 'CAREER_GUIDANCE' },
  { label: NEWS_CATEGORY_LABEL.PRESS_NEWS, value: 'PRESS_NEWS' },
];

const CATEGORY_STYLE: Record<NewsCategory, string> = {
  ADMISSION_INFO: 'bg-green-pale text-green-dark border-green-main/15',
  CAREER_GUIDANCE: 'bg-[#eef6ff] text-[#1f5f99] border-[#b8dcff]',
  PRESS_NEWS: 'bg-[#fff7e6] text-[#8a5a00] border-[#f3d28b]',
};

function NewsImage({ article }: { article: NewsArticle }) {
  if (!article.imageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-green-dark text-5xl text-white">
        {article.category === 'ADMISSION_INFO' ? '📌' : article.category === 'CAREER_GUIDANCE' ? '🎓' : '📰'}
      </div>
    );
  }

  return <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />;
}

export default function HandbookView() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'ALL'>('ALL');
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadArticles() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await NewsApiService.getPublished({
          category: activeCategory,
          keyword: keyword.trim() || undefined,
        });
        if (!ignore) setArticles(response.data);
      } catch {
        if (!ignore) setError('Không thể tải danh sách cẩm nang tuyển sinh.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    const timer = window.setTimeout(loadArticles, 250);
    return () => {
      ignore = true;
      window.clearTimeout(timer);
    };
  }, [activeCategory, keyword]);

  const featured = articles[0];
  const remaining = useMemo(() => articles.slice(featured ? 1 : 0), [articles, featured]);

  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-white">
      <TopBar />
      <Header />
      <NavBar />

      <main className="flex-1">
        <section className="bg-[linear-gradient(135deg,#f4f9f4_0%,#ffffff_55%,#fff7e6_100%)] px-10 py-12">
          <div className="mx-auto max-w-6xl">
            <p className="text-[13px] font-bold uppercase tracking-[2px] mb-2 text-green-main">
              Nguồn chính thức từ trang tuyển sinh NLU
            </p>
            <h1 className="text-4xl font-black text-green-dark">
              Cẩm nang tuyển sinh
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-text-mid">
              Tổng hợp thông tin tuyển sinh, hướng nghiệp chuyên sâu và điểm tin được dẫn nguồn từ trang tuyển sinh Trường Đại học Nông Lâm TP.HCM.
            </p>

            <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveCategory(filter.value)}
                    className={`rounded-md border px-4 py-2 text-xs font-extrabold transition-all ${
                      activeCategory === filter.value
                        ? 'border-green-main bg-green-main text-white'
                        : 'border-gray-mid bg-white text-text-mid hover:border-green-main hover:text-green-dark'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full lg:w-[360px]">
                <Search size={16} className="absolute left-3 top-3 text-text-light" />
                <input
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder="Tìm theo tiêu đề, tóm tắt..."
                  className="h-10 w-full rounded-md border border-gray-mid bg-white pl-9 pr-3 text-sm outline-none focus:border-green-main"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="px-10 py-12">
          <div className="mx-auto max-w-6xl">
            {isLoading && (
              <div className="rounded-lg border border-gray-mid bg-gray-light px-5 py-10 text-center text-sm font-semibold text-text-light">
                Đang tải cẩm nang tuyển sinh...
              </div>
            )}

            {error && !isLoading && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            {!isLoading && !error && articles.length === 0 && (
              <div className="rounded-lg border border-gray-mid bg-gray-light px-5 py-10 text-center text-sm font-semibold text-text-light">
                Không tìm thấy bài viết phù hợp.
              </div>
            )}

            {!isLoading && !error && featured && (
              <div className="space-y-8">
                <Link href={`/cam-nang/${featured.id}`} className="grid overflow-hidden rounded-lg border border-gray-mid bg-white no-underline shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg lg:grid-cols-[1.15fr_1fr]">
                  <div className="h-[280px] lg:h-full">
                    <NewsImage article={featured} />
                  </div>
                  <div className="p-7">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.5px] ${CATEGORY_STYLE[featured.category]}`}>
                      {NEWS_CATEGORY_LABEL[featured.category]}
                    </span>
                    <h2 className="mt-4 text-2xl font-black leading-tight text-green-dark">
                      {featured.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-text-mid">
                      {featured.summary}
                    </p>
                    <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-bold text-text-light">
                      <time suppressHydrationWarning>{formatDate(featured.publishedAt)}</time>
                      <span>{featured.views.toLocaleString()} lượt xem</span>
                      {featured.sourceUrl && (
                        <span className="inline-flex items-center gap-1 text-green-main">
                          Nguồn chính thức <ExternalLink size={13} />
                        </span>
                      )}
                    </div>
                  </div>
                </Link>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {remaining.map((article) => (
                    <Link
                      key={article.id}
                      href={`/cam-nang/${article.id}`}
                      className="overflow-hidden rounded-lg border border-gray-mid bg-white no-underline shadow-sm transition-all hover:-translate-y-1 hover:border-green-main/30 hover:shadow-lg"
                    >
                      <div className="h-44 overflow-hidden">
                        <NewsImage article={article} />
                      </div>
                      <div className="p-5">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${CATEGORY_STYLE[article.category]}`}>
                          {NEWS_CATEGORY_LABEL[article.category]}
                        </span>
                        <h3 className="mt-3 line-clamp-2 text-[16px] font-black leading-snug text-text-dark">
                          {article.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-text-light">
                          {article.summary}
                        </p>
                        <time className="mt-4 block text-xs font-semibold text-text-light" suppressHydrationWarning>
                          {formatDate(article.publishedAt)}
                        </time>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
