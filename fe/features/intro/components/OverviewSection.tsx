import { BookOpen, CalendarDays, Globe2, GraduationCap, ListChecks, Map, MapPin } from 'lucide-react';

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
}

const iconMap = {
  calendar: CalendarDays,
  school: GraduationCap,
  map: Map,
  list: ListChecks,
  book: BookOpen,
  public: Globe2,
  location: MapPin,
};

function InfoItem({ icon, label, value }: InfoRowProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] ?? ListChecks;

  return (
    <div className="flex min-w-[240px] flex-1 items-start gap-3 border-t border-gray-mid pt-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-green-pale text-green-main">
        <Icon size={18} />
      </div>
      <div>
        <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.6px] text-text-light">
          {label}
        </div>
        <div className="text-[13.5px] font-semibold leading-[1.45] text-text-dark">
          {value}
        </div>
      </div>
    </div>
  );
}

interface OverviewSectionProps {
  data: {
    label: string;
    heading: string;
    paragraphs: readonly string[];
    highlight: string;
    visualInfo: readonly InfoRowProps[];
  };
}

export default function OverviewSection({ data }: OverviewSectionProps) {
  return (
    <section id="overview" className="bg-white px-10 py-16">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-2 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
          {data.label}
        </div>
        <h2 className="mb-8 border-l-5 border-gold pl-4 text-[30px] font-extrabold text-green-dark">
          {data.heading}
        </h2>

        <div className="max-w-[900px]">
          {data.paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-[18px] text-[15px] leading-[1.85] text-text-mid">
              {paragraph.split('**').map((text, textIndex) => (
                textIndex % 2 === 1
                  ? <strong key={textIndex} className="font-extrabold text-green-dark">{text}</strong>
                  : text
              ))}
            </p>
          ))}
        </div>

        <div className="my-7 rounded-r-[10px] border-l-5 border-green-main bg-green-pale p-[20px_24px] text-[15px] font-semibold italic leading-relaxed text-green-dark">
          {data.highlight}
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-5">
          {data.visualInfo.map((info) => (
            <InfoItem key={`${info.label}-${info.value}`} {...info} />
          ))}
        </div>
      </div>
    </section>
  );
}
