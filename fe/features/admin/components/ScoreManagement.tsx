'use client';

import React, { useMemo, useState } from 'react';
import {
  Calendar,
  Check,
  Edit3,
  Search,
  SlidersHorizontal,
  TrendingUp,
  X,
} from 'lucide-react';
import { AdmissionInfo } from '@/service/admin.api';

interface ScoreManagementProps {
  scores: AdmissionInfo[];
  selectedYear: number;
  availableYears: number[];
  availableCombinationCodes: string[];
  setSelectedYear: (year: number) => void;
  updateCutoffScore: (id: string, newScore: number, combinations?: string[]) => Promise<void>;
  isLoading: boolean;
}

const getCombinationCodes = (admission: AdmissionInfo) => {
  return admission.combinations.map((combination) => combination.code);
};

export default function ScoreManagement({
  scores,
  selectedYear,
  availableYears,
  availableCombinationCodes,
  setSelectedYear,
  updateCutoffScore,
  isLoading,
}: ScoreManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');

  const [editScoreItem, setEditScoreItem] = useState<AdmissionInfo | null>(null);
  const [newScoreVal, setNewScoreVal] = useState(0);
  const [newCombinations, setNewCombinations] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const departments = useMemo(() => {
    return Array.from(new Set(scores.map((item) => item.departmentCode).filter(Boolean))).sort();
  }, [scores]);

  const combinationOptions = useMemo(() => {
    const codesFromCurrentYear = scores.flatMap(getCombinationCodes);
    return Array.from(new Set([...availableCombinationCodes, ...codesFromCurrentYear])).sort();
  }, [availableCombinationCodes, scores]);

  const filteredScores = scores.filter((item) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchMatch =
      !normalizedSearch ||
      item.majorName.toLowerCase().includes(normalizedSearch) ||
      item.majorCode.includes(normalizedSearch) ||
      item.departmentCode.toLowerCase().includes(normalizedSearch);

    const deptMatch = deptFilter === 'ALL' || item.departmentCode === deptFilter;

    return searchMatch && deptMatch;
  });

  const handleEditClick = (item: AdmissionInfo) => {
    setEditScoreItem(item);
    setNewScoreVal(item.cutoffScore);
    setNewCombinations(getCombinationCodes(item));
    setFormError('');
  };

  const handleCombToggle = (combinationCode: string) => {
    setNewCombinations((prev) => (
      prev.includes(combinationCode)
        ? prev.filter((code) => code !== combinationCode)
        : [...prev, combinationCode]
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editScoreItem) return;

    if (newScoreVal < 0 || newScoreVal > 30) {
      setFormError('Điểm chuẩn phải nằm trong khoảng 0 đến 30');
      return;
    }

    if (newCombinations.length === 0) {
      setFormError('Vui lòng chọn ít nhất một tổ hợp môn xét tuyển');
      return;
    }

    await updateCutoffScore(editScoreItem.id, newScoreVal, newCombinations);
    setEditScoreItem(null);
  };

  return (
    <div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Tìm kiếm theo ngành học, mã ngành, mã khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-light text-xs text-text-dark px-3.5 py-2.5 pl-9 rounded-xl border border-gray-mid focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main font-medium"
          />
          <Search size={15} className="absolute left-3 top-3 text-text-light" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Calendar size={14} className="text-green-main" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-gray-light border border-gray-mid px-3 py-2 rounded-xl text-xs font-extrabold text-green-dark outline-none"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                Năm {year}
              </option>
            ))}
          </select>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="bg-gray-light border border-gray-mid px-3 py-2 rounded-xl text-xs font-bold text-text-mid outline-none"
          >
            <option value="ALL">Tất cả khoa</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-mid rounded-xl">
        <table className="min-w-[980px] w-full divide-y divide-gray-mid text-left">
          <thead className="bg-gray-light text-[10px] font-black uppercase tracking-[1.5px] text-text-light">
            <tr>
              <th className="px-5 py-4">Mã ngành</th>
              <th className="px-5 py-4">Ngành đào tạo</th>
              <th className="px-5 py-4">Mã khoa</th>
              <th className="px-5 py-4">Năm</th>
              <th className="px-5 py-4">Chương trình</th>
              <th className="px-5 py-4">Tổ hợp môn</th>
              <th className="px-5 py-4">Điểm chuẩn</th>
              <th className="px-5 py-4 text-center">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-mid bg-white text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-text-light font-medium">
                  Đang tải điểm chuẩn năm {selectedYear}...
                </td>
              </tr>
            ) : filteredScores.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-10 text-text-light font-medium">
                  Không tìm thấy điểm chuẩn phù hợp.
                </td>
              </tr>
            ) : (
              filteredScores.map((item) => (
                <tr key={item.id} className="hover:bg-green-pale/10 transition-colors">
                  <td className="px-5 py-4 whitespace-nowrap font-mono font-bold text-text-mid">
                    {item.majorCode}
                  </td>
                  <td className="px-5 py-4 min-w-[240px] font-extrabold text-text-dark">
                    {item.majorName}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-bold text-text-mid">
                    {item.departmentCode}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-bold text-text-mid">
                    {item.year}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-text-mid">
                    {item.programType}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[280px]">
                      {getCombinationCodes(item).map((code) => (
                        <span
                          key={code}
                          className="bg-gray-light text-text-dark text-[10px] font-black px-2 py-0.5 rounded border border-gray-mid"
                        >
                          {code}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap font-extrabold text-[15px] text-green-dark">
                    {item.cutoffScore.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => handleEditClick(item)}
                      className="p-1.5 rounded-lg border border-gray-mid text-text-mid hover:bg-green-pale hover:text-green-dark hover:border-green-main/30 transition-all inline-flex items-center gap-1.5"
                    >
                      <Edit3 size={13} />
                      <span className="text-[11px] font-bold">Cập nhật</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editScoreItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-mid rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-gray-light mb-5">
              <div>
                <h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">
                  Cập nhật điểm chuẩn
                </h3>
                <p className="text-[10px] text-text-light mt-0.5 font-bold">
                  {editScoreItem.majorName} ({editScoreItem.majorCode}) - {selectedYear}
                </p>
              </div>
              <button onClick={() => setEditScoreItem(null)} className="text-text-light hover:text-text-dark">
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-text-mid flex items-center gap-1">
                  <TrendingUp size={13} className="text-green-main" />
                  Điểm chuẩn
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="30"
                  value={newScoreVal}
                  onChange={(e) => setNewScoreVal(Number(e.target.value))}
                  className="h-11 w-full rounded-xl border border-gray-mid px-4 text-xs font-bold text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-text-mid flex items-center gap-1">
                  <SlidersHorizontal size={13} className="text-green-main" />
                  Tổ hợp môn xét tuyển
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 bg-gray-light/30 border border-gray-mid p-3 rounded-xl max-h-48 overflow-y-auto">
                  {combinationOptions.map((comb) => {
                    const isChecked = newCombinations.includes(comb);
                    return (
                      <button
                        key={comb}
                        type="button"
                        onClick={() => handleCombToggle(comb)}
                        className="flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all hover:bg-white cursor-pointer"
                        style={{
                          borderColor: isChecked ? '#2d7a2d' : '#e0e0e0',
                          backgroundColor: isChecked ? '#e8f5e9' : 'transparent',
                          color: isChecked ? '#1a4a1a' : '#444444',
                        }}
                      >
                        <span>{comb}</span>
                        <span
                          className="w-4 h-4 rounded border flex items-center justify-center transition-all shrink-0"
                          style={{
                            borderColor: isChecked ? '#2d7a2d' : '#e0e0e0',
                            backgroundColor: isChecked ? '#2d7a2d' : 'transparent',
                          }}
                        >
                          {isChecked && <Check size={10} className="text-white stroke-[3px]" />}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-light mt-5">
                <button
                  type="button"
                  onClick={() => setEditScoreItem(null)}
                  className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Lưu cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
