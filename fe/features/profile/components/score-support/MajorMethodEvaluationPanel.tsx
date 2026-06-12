import type { MajorAdmissionResult, MajorMethodEvaluation } from '@/hooks/admission.types';
import PredictionProbabilityCard from '../../../prediction/components/PredictionProbabilityCard';
import EmptyScoreCell from './EmptyScoreCell';

interface MajorMethodEvaluationPanelProps {
  major?: MajorAdmissionResult;
  embedded?: boolean;
}

const METHOD_ORDER = ['THPT', 'TRANSCRIPT', 'APTITUDE', 'COMBINED'];
const FLOW_STEPS = ['Điểm môn', 'Tính tổ hợp', 'Chọn tổ hợp tốt nhất', 'Quy đổi điểm', 'Chọn phương thức', 'Tính xác suất'];

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return null;
  }

  return value.toLocaleString('vi-VN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatScoreWithScale = (score: number | null, scale: number) => {
  const formattedScore = formatNumber(score);

  if (!formattedScore) {
    return null;
  }

  return `${formattedScore}/${scale}`;
};

const sortMethodEvaluations = (evaluations: MajorMethodEvaluation[]) =>
  [...evaluations].sort((current, next) => {
    const scoreDiff =
      (next.convertedScore ?? Number.NEGATIVE_INFINITY) - (current.convertedScore ?? Number.NEGATIVE_INFINITY);

    if (scoreDiff !== 0) {
      return scoreDiff;
    }

    return METHOD_ORDER.indexOf(current.methodCode) - METHOD_ORDER.indexOf(next.methodCode);
  });

export default function MajorMethodEvaluationPanel({ major, embedded = false }: MajorMethodEvaluationPanelProps) {
  if (!major) {
    return null;
  }

  const evaluations = sortMethodEvaluations(major.methodEvaluations ?? []);
  const bestMethod = major.bestMethod;
  const bestScore = formatNumber(bestMethod?.convertedScore) ?? '-';

  return (
    <div
      className={`${embedded ? 'mb-0' : 'mb-5'} overflow-hidden rounded-[12px] border-1.5 border-green-light/50 bg-white shadow-[0_16px_34px_rgba(26,74,26,0.1)]`}
    >
      <div className="border-b border-green-light/30 bg-green-pale px-4 py-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="text-[12px] font-black uppercase tracking-[0.8px] text-green-main">
              Luồng tính điểm ngành
            </div>
            <div className="mt-1 text-[18px] font-black leading-[1.35] text-green-dark">{major.majorName}</div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {FLOW_STEPS.map((step, index) => (
            <div key={step} className="flex items-center gap-2">
              <span className="inline-flex h-8 items-center rounded-md border border-green-light/40 bg-white px-3 text-[12px] font-extrabold text-green-dark">
                {step}
              </span>
              {index < FLOW_STEPS.length - 1 && <span className="text-[13px] font-black text-green-main">→</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="border-b border-gray-mid bg-white text-text-dark">
              <th className="w-[160px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Phương thức
              </th>
              <th className="w-[180px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Tổ hợp tốt nhất
              </th>
              <th className="w-[160px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Điểm gốc
              </th>
              <th className="w-[160px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
                Điểm quy đổi
              </th>
            </tr>
          </thead>
          <tbody>
            {evaluations.map((evaluation) => {
              const isBestMethod = evaluation.methodCode === bestMethod?.methodCode;

              return (
                <tr
                  key={evaluation.methodCode}
                  className={`border-b border-gray-mid transition-colors ${
                    isBestMethod ? 'border-l-4 border-l-gold bg-[#fff8df]' : 'hover:bg-green-pale/35'
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-extrabold text-text-dark">{evaluation.methodName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-text-mid">
                    {evaluation.combinationCode ?? 'Không có tổ hợp'}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-text-mid">
                    {formatScoreWithScale(evaluation.rawScore, evaluation.rawScale) ?? <EmptyScoreCell label="Thiếu điểm" />}
                  </td>
                  <td className="px-4 py-3 text-left text-[15px] font-black text-green-dark">
                    {formatNumber(evaluation.convertedScore) ?? <EmptyScoreCell label="-" />}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="m-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div className="rounded-[14px] border-1.5 border-green-light/35 bg-green-pale px-5 py-4">
          <div className="text-[11px] font-black uppercase tracking-[0.7px] text-green-main">Kết quả tốt nhất</div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-[12px] font-extrabold text-text-light">Phương thức</div>
              <div className="mt-1 text-[20px] font-black text-green-dark">{bestMethod?.methodName ?? '-'}</div>
            </div>
            <div>
              <div className="text-[12px] font-extrabold text-text-light">Điểm quy đổi</div>
              <div className="mt-1 text-[28px] font-black leading-none text-green-dark">{bestScore}</div>
            </div>
          </div>
        </div>
        <PredictionProbabilityCard
          probability={major.probability}
          majorName={major.majorName}
          hasResult={major.probability !== null && major.probability !== undefined}
          title="Xác suất"
          subtitle="Tính theo điểm quy đổi tốt nhất"
          compact
          mini
        />
      </div>
    </div>
  );
}
