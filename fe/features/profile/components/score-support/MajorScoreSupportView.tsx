'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { useMajorAdmissionResults } from '@/hooks/use-major-admission-results';
import MajorScoreTable from './MajorScoreTable';
import MajorSearchForm from './MajorSearchForm';

export default function MajorScoreSupportView() {
  const [selectedMajorCode, setSelectedMajorCode] = useState('');
  const { draftKeyword, setDraftKeyword, rows, isLoading, error, handleSearch, clearSearch } =
    useMajorAdmissionResults();

  const handleMajorSearch = (event: FormEvent<HTMLFormElement>) => {
    setSelectedMajorCode('');
    handleSearch(event);
  };

  const handleClearSearch = () => {
    setSelectedMajorCode('');
    clearSearch();
  };

  return (
    <div className="p-5">
      <MajorSearchForm
        draftQuery={draftKeyword}
        onDraftQueryChange={setDraftKeyword}
        onSearch={handleMajorSearch}
        onClear={handleClearSearch}
      />
      <MajorScoreTable
        rows={rows}
        isLoading={isLoading}
        error={error}
        selectedMajorCode={selectedMajorCode}
        onSelectMajor={setSelectedMajorCode}
      />
    </div>
  );
}
