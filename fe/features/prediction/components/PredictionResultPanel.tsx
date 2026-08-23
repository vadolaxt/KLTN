'use client';

import { useEffect, useState } from 'react';
import type { PredictionResultState } from '../types';
import PredictionProbabilityCard from './PredictionProbabilityCard';

interface PredictionResultPanelProps {
  prediction: PredictionResultState | null;
}

const formatOptionalScore = (value?: number | null) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return '-';
  }

  return Number.isInteger(value) ? value.toFixed(0) : value.toFixed(2);
};

export default function PredictionResultPanel({ prediction }: PredictionResultPanelProps) {
  const [showAllMajors, setShowAllMajors] = useState(false);
  const totalAdmissionScore = prediction
    ? Number(((prediction.baseScore ?? 0) + (prediction.priorityScore ?? 0)).toFixed(2))
    : null;

  const resultRows = [
    ['Trường', prediction ? prediction.schoolName ?? 'Trường Đại học Nông Lâm TP.HCM' : '-'],
    ['Ngành', prediction?.majorName ?? '-'],
    ['Phương thức', prediction?.methodLabel ?? '-'],
    ['Tổ hợp', prediction?.combinationCode ?? '-'],
    ['Điểm ưu tiên', formatOptionalScore(prediction?.priorityScore)],
    ['Điểm quy đổi để dự đoán', formatOptionalScore(prediction?.studentScore)],
    ['Điểm chuẩn 2025', formatOptionalScore(prediction?.result.previous_year_cutoff_score)],
    ['Điểm chuẩn 2024', formatOptionalScore(prediction?.result.two_years_ago_cutoff_score)],
  ];
  const topMajors = prediction?.result.top_k_majors ?? [];
  const visibleMajors = showAllMajors ? topMajors : topMajors.slice(0, 5);
  const hasMoreMajors = topMajors.length > 5;
  const isCompetencyMethod = prediction?.methodLabel === 'Đánh giá năng lực';

  useEffect(() => {
    setShowAllMajors(false);
  }, [prediction]);

  return (
    <div className="flex min-w-0 flex-col gap-5 sm:gap-7">
      <section className="rounded-[18px] bg-white p-4 sm:p-7 lg:p-8" aria-labelledby="score-result-title">
        <h2 id="score-result-title" className="border-b border-gray-mid pb-4 text-[18px] font-black uppercase text-[#15336b] sm:text-[20px]">
          Kết quả tính điểm
        </h2>

        <div className="grid grid-cols-1 gap-6 pt-5 md:grid-cols-[minmax(220px,0.85fr)_minmax(0,1.15fr)] md:gap-8">
          <div className="flex min-h-[210px] flex-col items-center justify-center rounded-xl bg-[#f9fbff] px-4 py-7 text-center md:bg-transparent">
            <p className="text-[16px] font-bold text-[#53679b] sm:text-[18px]">Tổng điểm xét tuyển</p>
            <p className="mt-2 text-[52px] font-black leading-none text-[#1f5bd8] sm:text-[60px]">
              {formatOptionalScore(totalAdmissionScore).replace('-', '0')}
            </p>
            <p className="mt-3 text-[12px] font-medium italic text-[#8b94ad]">điểm chưa quy đổi</p>
          </div>

          <dl className="min-w-0 divide-y divide-gray-mid">
            {resultRows.map(([label, value]) => (
              <div key={label} className="grid grid-cols-[minmax(105px,0.8fr)_minmax(0,1.2fr)] gap-3 py-3 first:pt-0 md:grid-cols-[minmax(130px,0.75fr)_minmax(0,1.25fr)]">
                <dt className="text-[12px] font-extrabold text-text-dark sm:text-[13px]">{label}</dt>
                <dd className={`min-w-0 break-words text-[12px] sm:text-[13px] ${label.startsWith('Điểm') || label === 'Tổ hợp' ? 'font-extrabold text-green-main' : 'text-text-mid'}`}>
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-5 rounded-xl bg-[#f3f7ff] px-4 py-3 text-[11px] leading-[1.65] text-[#466198] sm:text-[12px]">
          {isCompetencyMethod
            ? 'Với điểm ĐGNL từ 900 trở lên, điểm ưu tiên = ((1200 - điểm ĐGNL) / 300) × mức điểm ưu tiên. Tổng điểm sau ưu tiên được quy đổi theo tổ hợp để dự đoán.'
            : 'Khi tổng điểm gốc đạt từ ngưỡng ưu tiên trở lên, điểm ưu tiên được giảm dần theo công thức của quy chế tuyển sinh hiện hành. Kết quả chỉ mang tính tham khảo.'}
        </p>
      </section>

      <section className="grid min-w-0 grid-cols-1 gap-5 rounded-[18px] bg-white p-3 sm:p-4 lg:grid-cols-[minmax(250px,0.8fr)_minmax(0,1.2fr)]" aria-label="Kết quả dự đoán">
        <PredictionProbabilityCard
          probability={prediction?.result.admission_probability}
          majorName={prediction?.majorName}
          hasResult={Boolean(prediction)}
          compact
        />

        <div className="min-w-0 px-2 py-3 sm:px-3">
          <h3 className="border-b border-text-mid pb-2 text-[17px] font-black text-text-dark sm:text-[19px]">
            Top ngành có xác suất cao
          </h3>
          {topMajors.length > 0 ? (
            <div className="mt-1 min-w-0">
              <div className="grid grid-cols-[minmax(68px,0.7fr)_minmax(0,2fr)_auto] gap-2 border-b border-gray-mid px-1 py-2 text-[9px] font-extrabold uppercase tracking-[0.4px] text-text-light sm:text-[10px]">
                <span>Mã ngành</span>
                <span>Tên ngành</span>
                <span className="text-right">Xác suất</span>
              </div>
              <ol
                className={`divide-y divide-gray-mid ${
                  showAllMajors
                    ? 'max-h-[330px] overflow-y-auto overscroll-contain pr-1 [scrollbar-color:#2b8434_#edf4ed] [scrollbar-width:thin]'
                    : ''
                }`}
                aria-label={showAllMajors ? 'Tất cả ngành phù hợp, có thể cuộn' : '5 ngành có xác suất cao nhất'}
              >
                {visibleMajors.map((major) => {
                  const probability = Math.max(0, Math.min(major.admission_probability, 100));
                  return (
                    <li key={major.major_code} className="grid min-h-[52px] grid-cols-[minmax(68px,0.7fr)_minmax(0,2fr)_auto] items-center gap-2 px-1 py-3">
                      <span className="break-words text-[10px] font-extrabold text-green-main sm:text-[11px]">{major.major_code}</span>
                      <span className="min-w-0 break-words text-[10px] font-bold leading-[1.45] text-text-dark sm:text-[11px]">{major.major_name}</span>
                      <span className="text-right text-[15px] font-black text-green-dark sm:text-[17px]">{probability.toFixed(0)}%</span>
                    </li>
                  );
                })}
              </ol>
              {hasMoreMajors && (
                <div className="mt-3 flex justify-end border-t border-gray-mid pt-3">
                  <button
                    type="button"
                    onClick={() => setShowAllMajors((current) => !current)}
                    className="rounded-lg border border-green-main px-4 py-2 text-[11px] font-extrabold text-green-main transition-colors hover:bg-green-pale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-main focus-visible:ring-offset-2 sm:text-[12px]"
                    aria-expanded={showAllMajors}
                  >
                    {showAllMajors ? 'Thu gọn' : 'Xem thêm'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex min-h-[250px] flex-col items-center justify-center rounded-xl px-4 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-pale text-[22px] text-green-main" aria-hidden="true">↗</div>
              <p className="mt-4 text-[14px] font-extrabold text-green-dark">
                {prediction ? 'Không có ngành phù hợp' : 'Chưa có dữ liệu xếp hạng'}
              </p>
              <p className="mt-1 max-w-[320px] text-[12px] leading-[1.6] text-text-light">
                {prediction
                  ? 'Không tìm thấy ngành hỗ trợ tổ hợp đã chọn để xếp hạng.'
                  : 'Nhập điểm và tính điểm xét tuyển để xem danh sách ngành phù hợp.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
