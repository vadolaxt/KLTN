import type { AdmissionMethodResult } from '@/hooks/admission.types';

interface DgnlScoreCardsProps {
  result?: AdmissionMethodResult;
  isLoading?: boolean;
  error?: string;
}

const formatDgnlValue = (value: number | undefined, scale: number | undefined) => {
  if (value === undefined || scale === undefined) {
    return '-';
  }

  return `${value.toFixed(1).replace(/\.0$/, '')}/${scale}`;
};

export default function DgnlScoreCards({ result, isLoading = false, error = '' }: DgnlScoreCardsProps) {
  const representativeResult = result?.representativeResult;
  const values = [
    formatDgnlValue(representativeResult?.rawScore, representativeResult?.rawScale),
    formatDgnlValue(representativeResult?.convertedScore, representativeResult?.convertedScale),
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {['Điểm (đợt cao nhất)', 'Quy đổi'].map((label, index) => (
        <div
          key={label}
          className="group rounded-[10px] border-1.5 border-gray-mid bg-gray-light p-5 transition-all hover:-translate-y-0.5 hover:border-green-light hover:bg-white hover:shadow-[0_14px_28px_rgba(45,122,45,0.1)]"
        >
          <div className="text-[12px] font-extrabold uppercase tracking-[0.9px] text-text-light transition-colors group-hover:text-green-main">
            {label}
          </div>
          <div className="mt-4 flex h-14 items-center rounded-lg border border-dashed border-gray-mid bg-white px-4 text-[24px] font-black text-text-light transition-colors group-hover:border-green-light group-hover:text-green-main">
            {isLoading ? 'Đang tải...' : error || values[index]}
          </div>
        </div>
      ))}
    </div>
  );
}
