// ─────────────────────────────────────────────
// NewsSection — Section tin tức tuyển sinh
// ─────────────────────────────────────────────

import NewsCard from './NewsCard';
import type { NewsItem } from '@/features/homepage/bloc/homepage.state';

interface NewsSectionProps {
  news: NewsItem[];
}

export default function NewsSection({ news }: NewsSectionProps) {
  return (
    <section className="px-10 py-16 bg-gray-light">
      {/* Header */}
      <p className="text-[13px] font-bold uppercase tracking-[2px] mb-2 text-green-main">
        Cập nhật mới nhất
      </p>
      <h2 className="text-[30px] font-extrabold mb-9 pl-4 text-green-dark border-l-[5px] border-gold">
        Tin Tức Tuyển Sinh Mới Nhất
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-6">
        {news.map((item) => (
          <NewsCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  );
}