'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { getAdmissionMethodResultsMock } from '@/service/admission.mock';
import type { AdmissionMethodCode, AdmissionMethodResult, CombinationResult } from './admission.types';

const hasEnteredCombinationScore = (combination: CombinationResult) =>
  combination.rawScore !== null || combination.convertedScore !== null;

const hasEnteredMethodScore = (method: AdmissionMethodResult) => {
  if (method.methodCode === 'APTITUDE') {
    return method.representativeResult !== null && method.representativeResult !== undefined;
  }

  return method.combinations.some(hasEnteredCombinationScore);
};

const compareCombinationByConvertedScore = (current: CombinationResult, next: CombinationResult) =>
  (next.convertedScore ?? Number.NEGATIVE_INFINITY) - (current.convertedScore ?? Number.NEGATIVE_INFINITY);

const filterEnteredScoreResults = (methods: AdmissionMethodResult[]) =>
  methods
    .map((method) => ({
      ...method,
      combinations:
        method.methodCode === 'APTITUDE'
          ? method.combinations
          : method.combinations.filter(hasEnteredCombinationScore).sort(compareCombinationByConvertedScore),
    }))
    .filter(hasEnteredMethodScore);

export function useAdmissionMethodResults(year = 2026) {
  const [results, setResults] = useState<AdmissionMethodResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResults = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getAdmissionMethodResultsMock(year);
      setResults(filterEnteredScoreResults(data));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu phương thức xét tuyển.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [year]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadResults();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadResults]);

  const resultByMethod = useMemo(() => {
    return results.reduce<Partial<Record<AdmissionMethodCode, AdmissionMethodResult>>>((mapping, result) => {
      mapping[result.methodCode] = result;
      return mapping;
    }, {});
  }, [results]);

  return {
    results,
    resultByMethod,
    isLoading,
    error,
    reload: loadResults,
  };
}
