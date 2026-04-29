// ─────────────────────────────────────────────
// NewsCard — Thẻ tin tức tuyển sinh
// ─────────────────────────────────────────────

import { formatDate } from '@/core/utils/helpers';
import type { NewsItem } from '@/features/homepage/bloc/homepage.state';

const GRAD_MAP: Record<NewsItem['gradientVariant'], string> = {
  green: 'bg-gradient-to-br from-[#1e5c1e] to-[#2d7a2d]',
  blue: 'bg-gradient-to-br from-[#1a3a6a] to-[#2d5a9a]',
  purple: 'bg-gradient-to-br from-[#3a1a5c] to-[#5a2d8a]',
};

type NewsCardProps = NewsItem;

export default function NewsCard({
  tag,
  title,
  description,
  date,
  emoji,
  gradientVariant,
}: NewsCardProps) {
  return (
    <article className="bg-white rounded-xl overflow-hidden transition-all duration-[250ms] cursor-pointer shadow-[0_2px_12px_rgba(0,0,0,0.07)] hover:-translate-y-1 hover:shadow-[0_10px_32px_rgba(0,0,0,0.13)] group">
      {/* Image area */}
      <div className={`w-full h-[200px] flex items-center justify-center text-[56px] ${GRAD_MAP[gradientVariant]}`}>
        {emoji}
      </div>

      {/* Body */}
      <div className="p-5">
        <span className="inline-block text-[11px] font-bold uppercase tracking-[0.5px] px-2.5 py-0.5 rounded-full mb-2.5 bg-green-pale text-green-main">
          {tag}
        </span>
        <h3 className="text-[15px] font-bold leading-[1.45] mb-2 text-text-dark">
          {title}
        </h3>
        <p className="text-[13px] leading-[1.6] text-text-light">
          {description}
        </p>
        <time className="block text-[12px] mt-3 text-text-light" suppressHydrationWarning>
          {formatDate(date)}
        </time>
      </div>
    </article>
  );
}