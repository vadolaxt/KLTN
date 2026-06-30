'use client';

import type { PredictionResultState } from '../types';
import PredictionProbabilityCard from './PredictionProbabilityCard';

interface PredictionResultPanelProps {
  prediction: PredictionResultState | null;
}

const formatOptionalScore = (value?: number | null) =>
  typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '-';

export default function PredictionResultPanel({ prediction }: PredictionResultPanelProps) {
  return (
    <div className="flex flex-col gap-5">
      <PredictionProbabilityCard
        probability={prediction?.result.admission_probability}
        majorName={prediction?.majorName}
        hasResult={Boolean(prediction)}
      />

      <div className="overflow-hidden rounded-[14px] border-1.5 border-gray-mid bg-white">
        <div className="bg-[#1a3a6a] px-6 py-4">
          <h3 className="text-[14px] font-extrabold text-white">Kết quả dự đoán</h3>
          <p className="mt-0.5 text-[11px] text-white/75">Thông tin ngành, phương thức và điểm chuẩn tham chiếu</p>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-mid bg-gray-light px-4 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-[0.6px] text-text-mid">
                Thông tin
              </th>
              <th className="border-b-2 border-gray-mid bg-gray-light px-4 py-2.5 text-left text-[11px] font-extrabold uppercase tracking-[0.6px] text-text-mid">
                Kết quả
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Trường</td>
              <td className="px-4 py-3 text-[13px] text-text-mid">
                {prediction ? prediction.schoolName ?? 'Trường Đại học Nông Lâm TP.HCM' : '-'}
              </td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Ngành</td>
              <td className="px-4 py-3 text-[13px] text-text-mid">{prediction?.majorName ?? '-'}</td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Phương thức</td>
              <td className="px-4 py-3 text-[13px] text-text-mid">{prediction?.methodLabel ?? '-'}</td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Tổ hợp</td>
              <td className="px-4 py-3 text-[13px] font-extrabold text-green-main">{prediction?.combinationCode ?? '-'}</td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Điểm ưu tiên</td>
              <td className="px-4 py-3 text-[15px] font-extrabold text-green-main">
                {formatOptionalScore(prediction?.priorityScore)}
              </td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Điểm dùng dự đoán</td>
              <td className="px-4 py-3 text-[15px] font-extrabold text-green-main">
                {formatOptionalScore(prediction?.studentScore)}
              </td>
            </tr>
            <tr className="border-b border-gray-mid">
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Điểm chuẩn 2025</td>
              <td className="px-4 py-3 text-[15px] font-extrabold text-green-main">
                {formatOptionalScore(prediction?.result.previous_year_cutoff_score)}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-[13px] font-bold text-text-dark">Điểm chuẩn 2024</td>
              <td className="px-4 py-3 text-[15px] font-extrabold text-green-main">
                {formatOptionalScore(prediction?.result.two_years_ago_cutoff_score)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
