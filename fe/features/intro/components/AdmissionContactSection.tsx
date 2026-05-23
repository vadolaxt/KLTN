import { ExternalLink, Globe2, Mail, MapPin, Phone } from 'lucide-react';

interface ContactRow {
  icon: string;
  label: string;
  value: string;
}

interface AdmissionContactSectionProps {
  data: {
    label: string;
    heading: string;
    description: string;
    rows: readonly ContactRow[];
  };
  sourceUrl: string;
}

const iconMap = {
  location: MapPin,
  phone: Phone,
  mail: Mail,
  public: Globe2,
};

export default function AdmissionContactSection({ data, sourceUrl }: AdmissionContactSectionProps) {
  return (
    <section id="contact" className="bg-green-pale px-10 py-14">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-2 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
          {data.label}
        </div>
        <h2 className="mb-4 border-l-5 border-gold pl-4 text-[30px] font-extrabold text-green-dark">
          {data.heading}
        </h2>
        <p className="max-w-[760px] text-[14.5px] leading-[1.75] text-text-mid">
          {data.description}
        </p>

        <div className="mt-7 rounded-[10px] border-1.5 border-green-light/30 bg-white">
          {data.rows.map((row) => {
            const Icon = iconMap[row.icon as keyof typeof iconMap] ?? Globe2;

            return (
              <div key={row.label} className="flex items-start gap-3 border-b border-gray-mid p-5 last:border-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-green-pale text-green-main">
                  <Icon size={20} />
                </div>
                <div>
                  <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.6px] text-text-light">
                    {row.label}
                  </div>
                  <div className="text-[14px] font-semibold leading-[1.5] text-text-dark">
                    {row.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <a
          href={sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-green-main px-4 py-2.5 text-[13px] font-extrabold text-white transition-colors hover:bg-green-dark"
        >
          Mở cổng tuyển sinh NLU
          <ExternalLink size={16} />
        </a>
      </div>
    </section>
  );
}
