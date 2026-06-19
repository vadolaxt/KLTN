'use client';

import { useMemo, useState } from 'react';

import { useAdmissionMethodResults } from '@/hooks/use-admission-method-results';
import DgnlScoreCards from './DgnlScoreCards';
import { METHODS } from './constants';
import MethodCombinationTable from './MethodCombinationTable';
import MethodSwitcher from './MethodSwitcher';
import { SCORE_METHOD_TO_ADMISSION_METHOD, type ScoreMethod } from './types';

export default function MethodScoreSupportView() {
  const [activeMethod, setActiveMethod] = useState<ScoreMethod>('thpt');
  const { resultByMethod, isLoading, error } = useAdmissionMethodResults();
  const visibleMethods = useMemo(
    () => METHODS.filter((method) => resultByMethod[SCORE_METHOD_TO_ADMISSION_METHOD[method.value]]),
    [resultByMethod],
  );
  const displayMethod = visibleMethods.some((method) => method.value === activeMethod)
    ? activeMethod
    : visibleMethods[0]?.value ?? activeMethod;
  const activeMethodIndex = visibleMethods.findIndex((method) => method.value === displayMethod);
  const currentMethod = visibleMethods[activeMethodIndex] ?? METHODS.find((method) => method.value === displayMethod) ?? METHODS[0];
  const currentMethodResult = resultByMethod[SCORE_METHOD_TO_ADMISSION_METHOD[displayMethod]];
  const combinationRows = useMemo(() => currentMethodResult?.combinations ?? [], [currentMethodResult]);

  const goToMethod = (direction: -1 | 1) => {
    if (visibleMethods.length === 0) {
      return;
    }

    const nextIndex = (activeMethodIndex + direction + visibleMethods.length) % visibleMethods.length;
    setActiveMethod(visibleMethods[nextIndex].value);
  };

  return (
    <div className="mb-7 overflow-hidden rounded-[14px] border-1.5 border-gray-mid bg-white shadow-[0_16px_38px_rgba(26,74,26,0.08)]">
      <div className="p-5">
        {visibleMethods.length > 0 && (
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <MethodSwitcher
              activeMethod={displayMethod}
              methods={visibleMethods}
              onChange={setActiveMethod}
              onStep={goToMethod}
            />

            <div className="rounded-md border border-green-light/30 bg-green-pale px-4 py-3 text-[12px] font-bold leading-[1.65] text-green-dark lg:max-w-[500px]">
              {currentMethod.description}
            </div>
          </div>
        )}

        {displayMethod === 'dgnl' ? (
          <DgnlScoreCards result={currentMethodResult} isLoading={isLoading} error={error} />
        ) : (
          <MethodCombinationTable
            activeMethod={displayMethod}
            combinations={combinationRows}
            isLoading={isLoading}
            error={error}
          />
        )}

        {displayMethod === 'kh' && (
          <div className="mt-4 rounded-lg border border-gold/30 bg-[#fff8df] px-4 py-3 text-[12px] font-semibold leading-[1.75] text-text-mid">
            Phương thức kết hợp dùng điểm 02 môn thi tốt nghiệp THPT năm 2026 và 01 môn còn lại trong tổ hợp bằng điểm học bạ. Môn dùng học bạ để bổ sung hoặc thay thế không được là Toán và Ngữ văn. Điểm học bạ là trung bình 6 học kỳ từ học kỳ I lớp 10 đến học kỳ II lớp 12, làm tròn đến hai số lẻ thập phân.
          </div>
        )}
      </div>
    </div>
  );
}
