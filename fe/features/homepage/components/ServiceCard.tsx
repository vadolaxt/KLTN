// ─────────────────────────────────────────────
// ServiceCard — Thẻ dịch vụ tuyển sinh
// ─────────────────────────────────────────────

import { ICONS } from '@/lib/constants/icons';
import type { ServiceItem } from '@/features/homepage/bloc/homepage.state';
import Link from 'next/link';

type ServiceCardProps = ServiceItem;

export default function ServiceCard({
  iconKey,
  name,
  description,
  linkLabel,
  variant,
}: ServiceCardProps) {
  const isChatbot = variant === 'chatbot';

  return (
    <div
      className={`relative rounded-xl p-7 flex flex-col gap-2.5 overflow-hidden group transition-all duration-[250ms] ${
        isChatbot
          ? 'bg-gradient-to-br from-green-dark to-green-main border-none'
          : 'bg-white border-[1.5px] border-gray-mid hover:shadow-[0_8px_32px_rgba(45,122,45,0.15)] hover:border-green-light hover:-translate-y-[3px]'
      }`}
    >
      {/* Top accent bar */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-[250ms] ${
          isChatbot ? 'bg-gold' : 'bg-green-main'
        }`}
      />

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
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

      {/* Name */}
      <div
        className={`text-[15px] font-bold uppercase tracking-[0.5px] ${
          isChatbot ? 'text-white' : 'text-green-dark'
        }`}
      >
        {name}
      </div>

      {/* Chatbot badge OR description + link */}
      {isChatbot ? (
        <div className="flex items-center gap-3 rounded-[10px] p-3.5 mt-2 bg-white/10">
          <div className="w-11 h-11 rounded-[10px] flex items-center justify-center text-[22px] flex-shrink-0 bg-white/20">
            🤖
          </div>
          <span className="text-[16px] font-bold text-white">Chatbot</span>
        </div>
      ) : (
        <>
          <p className="text-[13.5px] leading-[1.6] flex-1 text-text-mid">
            {description}
          </p>
          <Link
            href="#"
            className="inline-block self-start mt-1.5 px-4 py-2 rounded-md text-[13px] font-bold transition-all duration-200 bg-green-pale text-green-main no-underline hover:bg-green-main hover:text-white"
          >
            {linkLabel}
          </Link>
        </>
      )}
    </div>
  );
}