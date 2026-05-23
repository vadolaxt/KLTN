'use client';

import type { PredictionResultState } from '../types';

interface PredictionResultPanelProps {
  prediction: PredictionResultState | null;
}

const formatScore = (value: number) => value.toFixed(2);

const normalizeProbability = (value: number) => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(value <= 1 ? value * 100 : value, 100));
};

const getLevel = (probability: number) => {
  if (probability >= 85) {
    return { label: 'Rất cao', color: '#1b5e20', text: 'Điểm hiện tại đang vượt ngưỡng dự kiến với biên an toàn tốt.' };
  }
  if (probability >= 65) {
    return { label: 'Khả quan', color: '#2e7d32', text: 'Điểm hiện tại có lợi thế so với điểm chuẩn dự kiến.' };
  }
  if (probability >= 45) {
    return { label: 'Cần cân nhắc', color: '#c9a227', text: 'Điểm hiện tại sát ngưỡng dự kiến, nên theo dõi thêm biến động chỉ tiêu và phổ điểm.' };
  }
  return { label: 'Không khả quan', color: '#c62828', text: 'Điểm hiện tại thấp hơn ngưỡng dự kiến, nên cân nhắc thêm nguyện vọng an toàn.' };
};

export default function PredictionResultPanel({ prediction }: PredictionResultPanelProps) {
  const probability = normalizeProbability(prediction?.result.admission_probability ?? 0);
  const level = getLevel(probability);
  const dashOffset = 125.6 - (125.6 * probability) / 100;

  return (
    <div className="flex flex-col gap-5">
      <div className="overflow-hidden rounded-[14px] border-1.5 border-gray-mid bg-white">
        <div className="bg-green-dark px-6 py-4">
          <h3 className="text-[14px] font-extrabold text-white">Xác suất trúng tuyển</h3>
          <p className="mt-0.5 text-[11px] text-white/75">Kết quả dự đoán theo ngành và tổ hợp đã chọn</p>
        </div>

        <div className="px-6 py-7 text-center">
          <div className="relative mx-auto mb-6 w-[240px] max-w-full pb-5">
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
              <div className="text-[48px] font-extrabold leading-none" style={{ color: level.color }}>
                {probability.toFixed(0)}<span className="text-[24px]">%</span>
              </div>
              <div className="mt-1 text-[12px] font-bold uppercase tracking-[1px]" style={{ color: level.color }}>
                {prediction ? level.label : 'Chưa dự đoán'}
              </div>
            </div>
          </div>

          <div className="rounded-[10px] border-1.5 border-gray-mid bg-gray-light px-5 py-4 text-left">
            <h4 className="mb-1 text-[14px] font-extrabold text-green-dark">
              {prediction ? `Ngành ${prediction.majorName}` : 'Chưa có kết quả'}
            </h4>
            <p className="text-[12px] leading-[1.6] text-text-mid">
              {prediction ? level.text : 'Nhập điểm và bấm phân tích để xem xác suất trúng tuyển dự kiến.'}
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border-1.5 border-gray-mid bg-white">
        <div className="bg-[#1a3a6a] px-6 py-4">
          <h3 className="text-[14px] font-extrabold text-white">So sánh điểm dự kiến</h3>
          <p className="mt-0.5 text-[11px] text-white/75">Điểm thí sinh so với điểm chuẩn dự kiến 2026</p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-mid bg-gray-light px-4 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-[0.6px] text-text-mid">Chỉ số</th>
              <th className="border-b-2 border-gray-mid bg-gray-light px-4 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-[0.6px] text-text-mid">Giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Phương thức</td>
              <td className="px-4 py-3 text-[13px] text-text-mid">{prediction?.methodLabel ?? '-'}</td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Tổ hợp</td>
              <td className="px-4 py-3 text-[13px] text-text-mid">{prediction?.combinationCode ?? '-'}</td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Điểm của thí sinh</td>
              <td className="px-4 py-3 text-[15px] font-extrabold text-green-main">
                {prediction ? formatScore(prediction.studentScore) : '-'}
              </td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Điểm chuẩn dự kiến</td>
              <td className="px-4 py-3 text-[15px] font-extrabold text-green-main">
                {prediction ? formatScore(prediction.result.predicted_cutoff) : '-'}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Độ lệch</td>
              <td className={`px-4 py-3 text-[15px] font-extrabold ${
                prediction && prediction.result.margin >= 0 ? 'text-green-main' : 'text-[#c62828]'
              }`}>
                {prediction ? `${prediction.result.margin >= 0 ? '+' : ''}${formatScore(prediction.result.margin)}` : '-'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
