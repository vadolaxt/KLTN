'use client';

interface PredictionProbabilityCardProps {
  probability?: number | null;
  majorName?: string;
  hasResult?: boolean;
  title?: string;
  subtitle?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  compact?: boolean;
  mini?: boolean;
}

const normalizeProbability = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(value <= 1 ? value * 100 : value, 100));
};

const getLevel = (probability: number) => {
  if (probability >= 65) {
    return {
      label: 'Khả quan',
      color: '#2e7d32',
      text: 'Điểm hiện tại có lợi thế so với điểm chuẩn dự kiến.',
    };
  }

  if (probability >= 45) {
    return {
      label: 'Cần cân nhắc',
      color: '#c9a227',
      text: 'Điểm hiện tại sát ngưỡng dự kiến, nên theo dõi thêm biến động chỉ tiêu và phổ điểm.',
    };
  }

  return {
    label: 'Không khả quan',
    color: '#c62828',
    text: 'Điểm hiện tại thấp hơn ngưỡng dự kiến, nên cân nhắc thêm nguyện vọng an toàn.',
  };
};

export default function PredictionProbabilityCard({
  probability: probabilityValue,
  majorName,
  hasResult = false,
  title = 'Xác suất trúng tuyển',
  subtitle = 'Kết quả dự đoán theo ngành và tổ hợp đã chọn',
  emptyTitle = 'Chưa có kết quả',
  emptyDescription = 'Nhập điểm và bấm phân tích để xem xác suất trúng tuyển dự kiến.',
  compact = false,
  mini = false,
}: PredictionProbabilityCardProps) {
  const probability = normalizeProbability(probabilityValue ?? 0);
  const level = getLevel(probability);
  const dashOffset = 125.6 - (125.6 * probability) / 100;

  return (
    <div className="h-full overflow-hidden rounded-[14px] border-1.5 border-gray-mid bg-white">
      <div className={`bg-green-dark ${mini ? 'px-4 py-3' : 'px-6 py-4'}`}>
        <h3 className="text-[14px] font-extrabold text-white">{title}</h3>
        {!mini && <p className="mt-0.5 text-[11px] text-white/75">{subtitle}</p>}
      </div>

      <div className={`${mini ? 'px-4 py-4' : compact ? 'px-5 py-5' : 'px-6 py-7'} text-center`}>
        <div
          className={`relative mx-auto ${
            mini ? 'mb-3 w-[142px]' : compact ? 'mb-4 w-[190px]' : 'mb-6 w-[240px]'
          } max-w-full pb-5`}
        >
          <svg viewBox="0 0 100 50" className="w-full overflow-visible" aria-hidden="true">
            <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#e0e0e0" strokeWidth="12" strokeLinecap="round" />
            <path
              d="M 10 50 A 40 40 0 0 1 90 50"
              fill="none"
              stroke={level.color}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray="125.6"
              strokeDashoffset={dashOffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="pointer-events-none absolute left-1/2 top-[68%] -translate-x-1/2 -translate-y-1/2 text-center">
            <div
              className={`${mini ? 'text-[30px]' : compact ? 'text-[38px]' : 'text-[48px]'} font-extrabold leading-none`}
              style={{ color: level.color }}
            >
              {probability.toFixed(0)}<span className={mini ? 'text-[16px]' : 'text-[24px]'}>%</span>
            </div>
            <div className={`${mini ? 'text-[10px]' : 'text-[12px]'} mt-1 font-bold uppercase tracking-[1px]`} style={{ color: level.color }}>
              {hasResult ? level.label : 'Chưa dự đoán'}
            </div>
          </div>
        </div>

        <div className={`rounded-[10px] border-1.5 border-gray-mid bg-gray-light ${mini ? 'px-3 py-3' : 'px-5 py-4'} text-left`}>
          <h4 className={`${mini ? 'text-[12px]' : 'text-[14px]'} mb-1 font-extrabold text-green-dark`}>
            {hasResult ? `Ngành ${majorName ?? ''}` : emptyTitle}
          </h4>
          {!mini && <p className="text-[12px] leading-[1.6] text-text-mid">{hasResult ? level.text : emptyDescription}</p>}
        </div>
      </div>
    </div>
  );
}
