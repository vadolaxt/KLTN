import { CheckCircle2 } from 'lucide-react';

interface AdditionalInfoGroup {
  title: string;
  items: readonly string[];
}

interface EnglishCertificateConversion {
  ielts: string;
  toeflItp: string;
  convertedScore: string;
}

interface AdmissionAdditionalInfoSectionProps {
  data: {
    label: string;
    heading: string;
    groups: readonly AdditionalInfoGroup[];
  };
  englishCertificateConversion: readonly EnglishCertificateConversion[];
}

export default function AdmissionAdditionalInfoSection({ data, englishCertificateConversion }: AdmissionAdditionalInfoSectionProps) {
  return (
    <section id="additional-info" className="bg-gray-light px-10 py-16">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-2 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
          {data.label}
        </div>
        <h2 className="mb-9 border-l-5 border-gold pl-4 text-[30px] font-extrabold text-green-dark">
          {data.heading}
        </h2>

        <div className="rounded-[10px] border-1.5 border-gray-mid bg-white">
          {data.groups.map((group) => (
            <article key={group.title} className="border-b border-gray-mid p-6 last:border-0">
              <h3 className="mb-4 text-[17px] font-extrabold text-green-dark">
                {group.title}
              </h3>

              <div className="space-y-3">
                {group.items.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-[13.5px] leading-[1.75] text-text-mid">
                    <CheckCircle2 size={16} className="mt-1 shrink-0 text-green-main" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {group.title === 'Các điều kiện phụ sử dụng trong xét tuyển' && (
                <div className="mt-5 overflow-x-auto rounded-lg border-1.5 border-gray-mid">
                  <table className="w-full min-w-[620px] border-collapse bg-white text-center">
                    <thead>
                      <tr className="bg-green-pale">
                        <th className="border-b border-r border-gray-mid px-3 py-2.5 text-[12px] font-extrabold text-green-dark">Điểm bài thi IELTS</th>
                        <th className="border-b border-r border-gray-mid px-3 py-2.5 text-[12px] font-extrabold text-green-dark">Điểm bài thi TOEFL ITP</th>
                        <th className="border-b border-gray-mid px-3 py-2.5 text-[12px] font-extrabold text-green-dark">Điểm quy đổi môn Tiếng Anh</th>
                      </tr>
                    </thead>
                    <tbody>
                      {englishCertificateConversion.map((row) => (
                        <tr key={`${row.ielts}-${row.toeflItp}`} className="border-b border-gray-mid last:border-0">
                          <td className="border-r border-gray-mid px-3 py-2.5 text-[13px] font-semibold text-text-dark">{row.ielts}</td>
                          <td className="border-r border-gray-mid px-3 py-2.5 text-[13px] font-semibold text-text-dark">{row.toeflItp}</td>
                          <td className="px-3 py-2.5 text-[13px] font-extrabold text-green-main">{row.convertedScore}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
