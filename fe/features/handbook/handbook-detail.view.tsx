'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Eye } from 'lucide-react';
import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';
import { NEWS_CATEGORY_LABEL, NewsApiService, NewsArticle } from '@/service/news.api';
import { formatDate } from '@/core/utils/helpers';

interface HandbookDetailViewProps {
  id: string;
}

export default function HandbookDetailView({ id }: HandbookDetailViewProps) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadArticle() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await NewsApiService.getById(id);
        if (!ignore) setArticle(response.data);
      } catch {
        if (!ignore) setError('Không thể tải chi tiết bài viết.');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    loadArticle();
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-white">
      <TopBar />
      <Header />
      <NavBar />

      <main className="flex-1 bg-[linear-gradient(180deg,#f4f9f4_0%,#ffffff_260px)] px-10 py-10">
        <article className="mx-auto max-w-4xl">
          <Link href="/cam-nang" className="inline-flex items-center gap-2 text-sm font-bold text-green-main no-underline hover:text-green-dark">
            <ArrowLeft size={16} />
            Quay lại cẩm nang
          </Link>

          {isLoading && (
            <div className="mt-8 rounded-lg border border-gray-mid bg-white px-5 py-10 text-center text-sm font-semibold text-text-light">
              Đang tải bài viết...
            </div>
          )}

          {error && !isLoading && (
            <div className="mt-8 rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {article && !isLoading && !error && (
            <div className="mt-6 overflow-hidden rounded-lg border border-gray-mid bg-white shadow-sm">
              {article.imageUrl && (
                <div className="h-[320px] overflow-hidden bg-green-dark">
                  <img src={article.imageUrl} alt={article.title} className="h-full w-full object-cover" />
                </div>
              )}

              <div className="p-7 md:p-9">
                <span className="inline-flex rounded-full border border-green-main/15 bg-green-pale px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.5px] text-green-dark">
                  {NEWS_CATEGORY_LABEL[article.category]}
                </span>
                <h1 className="mt-4 text-3xl font-black leading-tight text-green-dark md:text-4xl">
                  {article.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-text-light">
                  <time suppressHydrationWarning>{formatDate(article.publishedAt)}</time>
                  <span className="inline-flex items-center gap-1">
                    <Eye size={14} />
                    {article.views.toLocaleString()} lượt xem
                  </span>
                  <span>{article.sourceName || 'Trang tuyển sinh NLU'}</span>
                </div>

                <p className="mt-6 rounded-lg bg-gray-light p-4 text-sm font-semibold leading-7 text-text-mid">
                  {article.summary}
                </p>

                <div className="mt-7 whitespace-pre-line text-[15px] leading-8 text-text-dark">
                  {article.content}
                </div>

                {article.sourceUrl && (
                  <a
                    href={article.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-green-main px-5 py-3 text-sm font-extrabold text-white no-underline transition-colors hover:bg-green-dark"
                  >
                    Xem nguồn chính thức
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
