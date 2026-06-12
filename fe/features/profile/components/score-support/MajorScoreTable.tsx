import { Fragment } from 'react';

import type { MajorAdmissionResult } from '@/hooks/admission.types';
import EmptyScoreCell from './EmptyScoreCell';
import MajorMethodEvaluationPanel from './MajorMethodEvaluationPanel';

interface MajorScoreTableProps {
  rows: MajorAdmissionResult[];
  isLoading?: boolean;
  error?: string;
  selectedMajorCode?: string;
  onSelectMajor?: (majorCode: string) => void;
}

const formatScore = (score: number | null | undefined) =>
  score === null || score === undefined ? null : score.toFixed(2).replace(/\.00$/, '');

const formatProbability = (probability: number | null | undefined) => {
  if (probability === null || probability === undefined) {
    return null;
  }

  return `${Math.round(probability * 100)}%`;
};

const getStatusLabel = (row: MajorAdmissionResult) => {
  if (row.status === 'MISSING_SCORE') {
    return 'Thiếu điểm';
  }

  if (row.status === 'NOT_APPLICABLE') {
    return 'Không áp dụng';
  }

  if (row.status === 'NOT_ELIGIBLE') {
    return 'Không đủ điều kiện';
  }

  if (row.status === 'PENDING_CONVERSION') {
    return 'Chờ quy đổi';
  }

  return '-';
};

export default function MajorScoreTable({
  rows,
  isLoading = false,
  error = '',
  selectedMajorCode,
  onSelectMajor,
}: MajorScoreTableProps) {
  return (
    <div className="overflow-hidden rounded-[12px] border-1.5 border-gray-mid bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="bg-green-dark text-white">
              <th className="w-[104px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Mã ngành
              </th>
              <th className="min-w-[220px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Tên ngành
              </th>
              <th className="w-[104px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                PTXT
              </th>
              <th className="w-[108px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Mã tổ hợp
              </th>
              <th className="min-w-[190px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Các môn trong tổ hợp
              </th>
              <th className="w-[104px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Tổng điểm
              </th>
              <th className="w-[104px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Xác suất
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-[13px] font-bold text-text-mid">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-[13px] font-bold text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!isLoading &&
              !error &&
              rows.map((row) => {
                const isSelected = selectedMajorCode === row.majorCode;

                return (
                  <Fragment key={row.majorCode}>
                    <tr
                      onClick={() => onSelectMajor?.(isSelected ? '' : row.majorCode)}
                      className={`group border-b border-gray-mid transition-all hover:bg-green-pale/55 ${
                        isSelected ? 'bg-green-pale/60' : ''
                      } ${onSelectMajor ? 'cursor-pointer' : ''}`}
                    >
                      <td className="px-3 py-3 text-[13px] font-black text-green-dark">{row.majorCode}</td>
                      <td className="px-3 py-3 text-[13px] font-extrabold leading-[1.5] text-text-dark">
                        {row.majorName}
                      </td>
                      <td className="px-3 py-3 text-[13px] font-bold text-text-mid">
                        {row.bestMethod?.methodName ?? <EmptyScoreCell label={getStatusLabel(row)} />}
                      </td>
                      <td className="px-3 py-3">
                        {row.bestMethod?.combinationCode ? (
                          <span className="inline-flex rounded-md bg-green-pale px-2.5 py-1 text-[12px] font-black text-green-dark transition-colors group-hover:bg-green-main group-hover:text-white">
                            {row.bestMethod.combinationCode}
                          </span>
                        ) : (
                          <EmptyScoreCell label={row.bestMethod?.methodCode === 'APTITUDE' ? 'ĐGNL' : getStatusLabel(row)} />
                        )}
                      </td>
                      <td className="px-3 py-3 text-[13px] font-semibold leading-[1.55] text-text-mid">
                        {row.bestMethod?.subjectNames?.length ? row.bestMethod.subjectNames.join(', ') : <EmptyScoreCell />}
                      </td>
                      <td className="px-3 py-3">
                        {formatScore(row.bestMethod?.convertedScore) ?? <EmptyScoreCell label={getStatusLabel(row)} />}
                      </td>
                      <td className="px-3 py-3">
                        {formatProbability(row.probability) ?? <EmptyScoreCell label="Chưa có" />}
                      </td>
                    </tr>
                    {isSelected && (
                      <tr className="border-b border-gray-mid bg-gray-light/60">
                        <td colSpan={7} className="px-3 py-3">
                          <div className="animate-fade-in">
                            <MajorMethodEvaluationPanel major={row} embedded />
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      {!isLoading && !error && rows.length === 0 && (
        <div className="px-6 py-10 text-center">
          <div className="text-[16px] font-extrabold text-green-dark">Không tìm thấy ngành phù hợp</div>
          <p className="mt-2 text-[13px] text-text-mid">Thử tìm bằng mã ngành hoặc tên ngành khác.</p>
        </div>
      )}
    </div>
  );
}
