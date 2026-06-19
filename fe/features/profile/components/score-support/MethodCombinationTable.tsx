import type { CombinationResult } from '@/hooks/admission.types';
import EmptyScoreCell from './EmptyScoreCell';
import type { ScoreMethod } from './types';

interface MethodCombinationTableProps {
  activeMethod: ScoreMethod;
  combinations: CombinationResult[];
  isLoading?: boolean;
  error?: string;
}

const formatScore = (score: number | null) => (score === null ? null : score.toFixed(2).replace(/\.00$/, ''));

const getStatusLabel = (combination: CombinationResult) => {
  if (combination.status === 'MISSING_SCORE') {
    return combination.missingSubjects?.length ? `Thiếu ${combination.missingSubjects.join(', ')}` : 'Thiếu điểm';
  }

  if (combination.status === 'PENDING_CONVERSION') {
    return 'Chờ quy đổi';
  }

  if (combination.status === 'NOT_ELIGIBLE') {
    return 'Không đủ điều kiện';
  }

  if (combination.status === 'NOT_APPLICABLE') {
    return 'Không áp dụng';
  }

  return '-';
};

export default function MethodCombinationTable({
  activeMethod,
  combinations,
  isLoading = false,
  error = '',
}: MethodCombinationTableProps) {
  const columnCount = activeMethod === 'kh' ? 5 : 4;

  return (
    <div className="overflow-hidden rounded-[12px] border-1.5 border-gray-mid bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-green-dark text-white">
              <th className="w-[130px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Mã tổ hợp
              </th>
              <th className="min-w-[310px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Các môn trong tổ hợp
              </th>
              {activeMethod === 'kh' && (
                <th className="min-w-[220px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                  Môn lấy điểm học bạ
                </th>
              )}
              <th className="w-[170px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Tổng điểm
              </th>
              <th className="w-[150px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Quy đổi
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={columnCount} className="px-4 py-8 text-center text-[13px] font-bold text-text-mid">
                  Đang tải dữ liệu...
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={columnCount} className="px-4 py-8 text-center text-[13px] font-bold text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!isLoading && !error && combinations.length === 0 && (
              <tr>
                <td colSpan={columnCount} className="px-4 py-8 text-center text-[13px] font-bold text-text-mid">
                  Chưa có dữ liệu phương thức xét tuyển.
                </td>
              </tr>
            )}
            {!isLoading &&
              !error &&
              combinations.map((combination) => (
                <tr
                  key={`${activeMethod}-${combination.combinationCode}`}
                  className="group border-b border-gray-mid transition-all hover:bg-green-pale/55"
                >
                  <td className="px-4 py-3">
                    <span className="inline-flex rounded-md bg-green-pale px-2.5 py-1 text-[13px] font-black text-green-dark transition-colors group-hover:bg-green-main group-hover:text-white">
                      {combination.combinationCode}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold leading-[1.55] text-text-mid">
                    {combination.subjectNames.length ? combination.subjectNames.join(', ') : '-'}
                  </td>
                  {activeMethod === 'kh' && (
                    <td className="px-4 py-3 text-[13px] font-semibold leading-[1.55] text-text-mid">
                      {combination.transcriptSubject ?? '-'}
                    </td>
                  )}
                  <td className="px-4 py-3">
                    {formatScore(combination.rawScore) ?? <EmptyScoreCell label={getStatusLabel(combination)} />}
                  </td>
                  <td className="px-4 py-3">
                    {formatScore(combination.convertedScore) ?? <EmptyScoreCell label={getStatusLabel(combination)} />}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
