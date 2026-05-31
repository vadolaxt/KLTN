import { ICONS } from '@/lib/constants/icons';
import type { ServiceItem } from '@/features/homepage/bloc/homepage.state';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ServiceCardProps = ServiceItem;

export default function ServiceCard({
  iconKey,
  name,
  description,
  linkLabel,
  href,
  variant,
}: ServiceCardProps) {
  const isChatbot = variant === 'chatbot';

  return (
    <article
      className={`relative rounded-lg p-7 flex flex-col gap-2.5 overflow-hidden group transition-all duration-[250ms] ${
        isChatbot
          ? 'bg-gradient-to-br from-green-dark to-green-main border-none shadow-[0_12px_32px_rgba(26,74,26,0.24)]'
          : 'bg-white border-[1.5px] border-gray-mid hover:shadow-[0_8px_32px_rgba(45,122,45,0.15)] hover:border-green-light hover:-translate-y-[3px]'
      }`}
    >
      <div
        className={`absolute top-0 left-0 right-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[250ms] ${
          isChatbot ? 'bg-gold' : 'bg-green-main'
        }`}
      />

      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isChatbot ? 'bg-white/15' : 'bg-green-pale'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`w-6 h-6 ${isChatbot ? 'fill-white' : 'fill-green-main'}`}
        >
          <path d={ICONS[iconKey].path} />
        </svg>
      </div>

      <div
        className={`text-[15px] font-bold uppercase tracking-[0.5px] ${
          isChatbot ? 'text-white' : 'text-green-dark'
        }`}
      >
        {name}
      </div>

      {isChatbot ? (
        <Link
          href={href}
          className="mt-2 flex items-center gap-3 rounded-lg bg-white/10 p-3.5 no-underline transition-all hover:bg-white/20"
        >
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-white/20">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white">
              <path d={ICONS.CHAT.path} />
            </svg>
          </div>
          <span className="flex-1 text-[16px] font-bold text-white">Bắt đầu tư vấn</span>
          <ArrowRight size={18} className="text-gold-light transition-transform group-hover:translate-x-1" />
        </Link>
      ) : (
        <>
          <p className="text-[13.5px] leading-[1.6] flex-1 text-text-mid">
            {description}
          </p>
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 self-start mt-1.5 px-4 py-2 rounded-md text-[13px] font-bold transition-all duration-200 bg-green-pale text-green-main no-underline hover:bg-green-main hover:text-white"
          >
            {linkLabel}
            <ArrowRight size={15} />
          </Link>
        </>
      )}
    </article>
  );
}
