import { Info } from 'lucide-react';

interface AdmissionNote {
  title: string;
  text: string;
}

interface AdmissionNotesSectionProps {
  data: {
    label: string;
    heading: string;
    items: readonly AdmissionNote[];
  };
}

export default function AdmissionNotesSection({ data }: AdmissionNotesSectionProps) {
  return (
    <section id="notes" className="bg-white px-10 py-16">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-2 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
          {data.label}
        </div>
        <h2 className="mb-8 border-l-5 border-gold pl-4 text-[30px] font-extrabold text-green-dark">
          {data.heading}
        </h2>

        <div className="rounded-[10px] border-1.5 border-gray-mid bg-[#fafafa]">
          {data.items.map((item) => (
            <article key={item.title} className="flex gap-4 border-b border-gray-mid p-5 last:border-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-green-pale text-green-main">
                <Info size={19} />
              </div>
              <div>
                <h3 className="mb-1.5 text-[15px] font-extrabold text-green-dark">{item.title}</h3>
                <p className="text-[13.5px] leading-[1.75] text-text-mid">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
