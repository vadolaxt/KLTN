'use client';

import type { FormEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';

import { getMajorAdmissionResultsMock } from '@/service/admission.mock';
import type { MajorAdmissionPage, MajorAdmissionResult } from './admission.types';

const hasEnteredMajorScore = (major: MajorAdmissionResult) =>
  major.bestMethod !== null &&
  major.bestMethod !== undefined &&
  Number.isFinite(major.bestMethod.convertedScore);

const compareMajorByConvertedScore = (current: MajorAdmissionResult, next: MajorAdmissionResult) => {
  const scoreDiff = (next.bestMethod?.convertedScore ?? Number.NEGATIVE_INFINITY) -
    (current.bestMethod?.convertedScore ?? Number.NEGATIVE_INFINITY);

  if (scoreDiff !== 0) {
    return scoreDiff;
  }

  return (next.probability ?? Number.NEGATIVE_INFINITY) - (current.probability ?? Number.NEGATIVE_INFINITY);
};

const filterEnteredMajorScores = (resultPage: MajorAdmissionPage): MajorAdmissionPage => {
  const content = resultPage.content.filter(hasEnteredMajorScore).sort(compareMajorByConvertedScore);

  return {
    ...resultPage,
    content,
    totalElements: content.length,
    totalPages: Math.max(1, Math.ceil(content.length / resultPage.size)),
  };
};

export function useMajorAdmissionResults(year = 2026) {
  const [draftKeyword, setDraftKeyword] = useState('');
  const [keyword, setKeyword] = useState('');
  const [page, setPage] = useState(0);
  const [size] = useState(50);
  const [resultPage, setResultPage] = useState<MajorAdmissionPage>({
    content: [],
    page: 0,
    size,
    totalElements: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadResults = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getMajorAdmissionResultsMock({ year, keyword, page, size });
      setResultPage(filterEnteredMajorScores(data));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Không thể tải dữ liệu ngành học.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [keyword, page, size, year]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadResults();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadResults]);

  const handleSearch = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setPage(0);
      setKeyword(draftKeyword);
    },
    [draftKeyword],
  );

  const clearSearch = useCallback(() => {
    setDraftKeyword('');
    setKeyword('');
    setPage(0);
  }, []);

  return {
    draftKeyword,
    setDraftKeyword,
    keyword,
    rows: resultPage.content,
    page: resultPage,
    isLoading,
    error,
    handleSearch,
    clearSearch,
    reload: loadResults,
  };
}
