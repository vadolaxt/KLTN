import { CalendarDays, ExternalLink } from 'lucide-react';

interface IntroHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  sourceUrl: string;
}

export default function IntroHero({ eyebrow, title, subtitle, description, sourceUrl }: IntroHeroProps) {
  return (
    <section className="relative min-h-[340px] overflow-hidden bg-[#123f1f] text-white">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(12,43,18,0.96),rgba(24,89,42,0.9),rgba(18,63,31,0.92))]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(18,63,31,0),rgba(0,0,0,0.18))]" />

      <div className="relative mx-auto flex min-h-[340px] max-w-[1180px] items-center px-10 py-12">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] font-bold uppercase tracking-[1.2px] text-gold-light">
            <CalendarDays size={15} />
            {eyebrow}
          </div>

          <h1 className="max-w-[760px] text-[42px] font-black uppercase leading-[1.08] tracking-normal md:text-[52px]">
            {title}
          </h1>
          <p className="mt-3 max-w-[720px] text-[18px] font-semibold text-white/88">
            {subtitle}
          </p>
          <p className="mt-3 max-w-[720px] text-[14.5px] leading-[1.75] text-white/75">
            {description}
          </p>

          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2.5 text-[13px] font-extrabold text-green-dark transition-colors hover:bg-gold-light"
          >
            Xem nguồn chính thức
            <ExternalLink size={16} />
          </a>
        </div>

      </div>
    </section>
  );
}
