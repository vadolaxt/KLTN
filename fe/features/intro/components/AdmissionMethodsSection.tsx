import { Activity, Award, BookOpen, CheckCircle2, ClipboardList, FileText, Layers } from 'lucide-react';

interface AdmissionMethodItem {
  icon: string;
  tag: string;
  title: string;
  description: string;
  details: readonly string[];
}

interface AdmissionMethodsSectionProps {
  data: readonly AdmissionMethodItem[];
}

const iconMap = {
  award: Award,
  activity: Activity,
  file: FileText,
  combine: Layers,
  book: BookOpen,
};

export default function AdmissionMethodsSection({ data }: AdmissionMethodsSectionProps) {
  return (
    <section id="methods" className="bg-gray-light px-10 py-16">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-2 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
          Phương thức xét tuyển
        </div>
        <h2 className="mb-9 border-l-5 border-gold pl-4 text-[30px] font-extrabold text-green-dark">
          05 nhóm phương thức năm 2026
        </h2>

        <div className="border-l-2 border-green-light/35">
          {data.map((method, index) => {
            const Icon = iconMap[method.icon as keyof typeof iconMap] ?? ClipboardList;

            return (
              <article key={method.title} className="relative pb-8 pl-8 last:pb-0">
                <div className="absolute -left-[17px] top-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-main text-[12px] font-extrabold text-white shadow-[0_0_0_3px_rgba(45,122,45,0.18)]">
                  {index + 1}
                </div>

                <div className="rounded-[10px] border-1.5 border-gray-mid bg-white p-6">
                  <div className="mb-4 flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-green-pale text-green-main">
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] font-extrabold uppercase tracking-[1px] text-gold">
                        {method.tag}
                      </div>
                      <h3 className="text-[18px] font-extrabold leading-tight text-green-dark">
                        {method.title}
                      </h3>
                    </div>
                  </div>

                  <p className="mb-4 max-w-[860px] text-[14px] leading-[1.7] text-text-mid">
                    {method.description}
                  </p>

                  <div className="space-y-3">
                    {method.details.map((detail) => (
                      <div key={detail} className="flex items-start gap-2.5 text-[13px] leading-[1.65] text-text-mid">
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-green-main" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
