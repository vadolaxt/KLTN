'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpenCheck,
  Check,
  Edit3,
  FileText,
  Hash,
  Layers,
  Search,
  X,
} from 'lucide-react';
import { AdmissionInfo, AdmissionUpdateRequest } from '@/service/admin.api';

interface AdmissionManagementProps {
  admissions: AdmissionInfo[];
  selectedYear: number;
  availableYears: number[];
  availableCombinationCodes: string[];
  setSelectedYear: (year: number) => void;
  updateAdmissionInfo: (id: string, payload: AdmissionUpdateRequest) => Promise<void>;
  isLoading: boolean;
}

const getCombinationCodes = (admission: AdmissionInfo) => {
  return admission.combinations.map((combination) => combination.code);
};

export default function AdmissionManagement({
  admissions,
  selectedYear,
  availableYears,
  availableCombinationCodes,
  setSelectedYear,
  updateAdmissionInfo,
  isLoading,
}: AdmissionManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [programFilter, setProgramFilter] = useState('ALL');

  const [editItem, setEditItem] = useState<AdmissionInfo | null>(null);
  const [editQuota, setEditQuota] = useState(0);
  const [editCutoffScore, setEditCutoffScore] = useState(0);
  const [editProgramType, setEditProgramType] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editCombinationCodes, setEditCombinationCodes] = useState<string[]>([]);
  const [formError, setFormError] = useState('');

  const departments = useMemo(() => {
    return Array.from(new Set(admissions.map((item) => item.departmentCode).filter(Boolean))).sort();
  }, [admissions]);

  const programTypes = useMemo(() => {
    return Array.from(new Set(admissions.map((item) => item.programType).filter(Boolean))).sort();
  }, [admissions]);

  const combinationOptions = useMemo(() => {
    const codesFromCurrentYear = admissions.flatMap(getCombinationCodes);
    return Array.from(new Set([...availableCombinationCodes, ...codesFromCurrentYear])).sort();
  }, [admissions, availableCombinationCodes]);

  const filteredAdmissions = admissions.filter((item) => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchMatch =
      !normalizedSearch ||
      item.majorName.toLowerCase().includes(normalizedSearch) ||
      item.majorCode.includes(normalizedSearch) ||
      item.departmentCode.toLowerCase().includes(normalizedSearch) ||
      item.programType.toLowerCase().includes(normalizedSearch);

    const deptMatch = deptFilter === 'ALL' || item.departmentCode === deptFilter;
    const programMatch = programFilter === 'ALL' || item.programType === programFilter;

    return searchMatch && deptMatch && programMatch;
  });

  const openEditModal = (admission: AdmissionInfo) => {
    setEditItem(admission);
    setEditQuota(admission.admissionQuota);
    setEditCutoffScore(admission.cutoffScore);
    setEditProgramType(admission.programType || '');
    setEditNote(admission.note || '');
    setEditCombinationCodes(getCombinationCodes(admission));
    setFormError('');
  };

  const toggleCombination = (code: string) => {
    setEditCombinationCodes((prev) => (
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!editItem) return;

    if (editQuota <= 0) {
      setFormError('Chỉ tiêu tuyển sinh phải lớn hơn 0');
      return;
    }

    if (editCutoffScore < 0 || editCutoffScore > 30) {
      setFormError('Điểm chuẩn phải nằm trong khoảng 0 đến 30');
      return;
    }

    if (!editProgramType.trim()) {
      setFormError('Vui lòng nhập loại chương trình đào tạo');
      return;
    }

    if (editCombinationCodes.length === 0) {
      setFormError('Vui lòng chọn ít nhất một tổ hợp môn xét tuyển');
      return;
    }

    await updateAdmissionInfo(editItem.id, {
      admissionQuota: editQuota,
      cutoffScore: editCutoffScore,
      programType: editProgramType.trim(),
      note: editNote.trim(),
      combinationCodes: editCombinationCodes,
    });
    setEditItem(null);
  };

  return (
    <div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-6">
        <div className="relative flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Tìm theo tên ngành, mã ngành, mã khoa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-light text-xs text-text-dark px-3.5 py-2.5 pl-9 rounded-xl border border-gray-mid focus:outline-none focus:border-green-main focus:ring-1 focus:ring-green-main font-medium"
          />
          <Search size={15} className="absolute left-3 top-3 text-text-light" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="bg-gray-light border border-gray-mid px-3 py-2 rounded-xl text-xs font-bold text-text-mid outline-none"
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

          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="bg-gray-light border border-gray-mid px-3 py-2 rounded-xl text-xs font-bold text-text-mid outline-none"
          >
            <option value="ALL">Tất cả chương trình</option>
            {programTypes.map((program) => (
              <option key={program} value={program}>
                {program}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-mid rounded-xl">
        <table className="min-w-[1180px] w-full divide-y divide-gray-mid text-left">
          <thead className="bg-gray-light text-[10px] font-black uppercase tracking-[1.5px] text-text-light">
            <tr>
              <th className="px-4 py-4">Năm</th>
              <th className="px-4 py-4">Mã ngành</th>
              <th className="px-4 py-4">Tên ngành đào tạo</th>
              <th className="px-4 py-4">Mã khoa</th>
              <th className="px-4 py-4">Chương trình</th>
              <th className="px-4 py-4">Chỉ tiêu</th>
              <th className="px-4 py-4">Điểm chuẩn</th>
              <th className="px-4 py-4">Tổ hợp môn</th>
              <th className="px-4 py-4">Ghi chú</th>
              <th className="px-4 py-4 text-center">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-mid bg-white text-xs">
            {isLoading ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-text-light font-medium">
                  Đang tải thông tin tuyển sinh năm {selectedYear}...
                </td>
              </tr>
            ) : filteredAdmissions.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-10 text-text-light font-medium">
                  Không tìm thấy dòng tuyển sinh phù hợp.
                </td>
              </tr>
            ) : (
              filteredAdmissions.map((item) => (
                <tr key={item.id} className="hover:bg-green-pale/10 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap font-bold text-text-mid">{item.year}</td>
                  <td className="px-4 py-4 whitespace-nowrap font-mono font-bold text-text-mid">
                    {item.majorCode}
                  </td>
                  <td className="px-4 py-4 min-w-[240px] font-extrabold text-text-dark">
                    {item.majorName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-text-mid font-bold">
                    {item.departmentCode}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-text-mid">{item.programType}</td>
                  <td className="px-4 py-4 whitespace-nowrap font-extrabold text-green-dark">
                    {item.admissionQuota}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap font-extrabold text-green-dark">
                    {item.cutoffScore.toFixed(2)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[260px]">
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
                  <td className="px-4 py-4 max-w-[220px] text-text-light">
                    <span className="line-clamp-2">{item.note || '-'}</span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg border border-gray-mid text-text-mid hover:bg-green-pale hover:text-green-dark hover:border-green-main/30 transition-all inline-flex items-center gap-1.5"
                    >
                      <Edit3 size={13} />
                      <span className="text-[11px] font-bold">Sửa</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white border border-gray-mid rounded-2xl w-full max-w-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-4 border-b border-gray-light mb-5">
              <div>
                <h3 className="text-sm font-black text-text-dark uppercase tracking-[0.5px]">
                  Cập nhật thông tin tuyển sinh
                </h3>
                <p className="text-[10px] text-text-light mt-0.5 font-bold">
                  {editItem.majorName} ({editItem.majorCode}) - {editItem.year}
                </p>
              </div>
              <button onClick={() => setEditItem(null)} className="text-text-light hover:text-text-dark">
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mb-4 bg-red-50 text-red-600 border border-red-200 p-3 rounded-lg text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-text-mid flex items-center gap-1">
                    <Hash size={13} className="text-green-main" />
                    Chỉ tiêu
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editQuota}
                    onChange={(e) => setEditQuota(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-gray-mid px-4 text-xs font-bold text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-text-mid flex items-center gap-1">
                    <BookOpenCheck size={13} className="text-green-main" />
                    Điểm chuẩn
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="30"
                    value={editCutoffScore}
                    onChange={(e) => setEditCutoffScore(Number(e.target.value))}
                    className="h-11 w-full rounded-xl border border-gray-mid px-4 text-xs font-bold text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-text-mid flex items-center gap-1">
                    <Layers size={13} className="text-green-main" />
                    Chương trình
                  </label>
                  <input
                    type="text"
                    value={editProgramType}
                    onChange={(e) => setEditProgramType(e.target.value)}
                    className="h-11 w-full rounded-xl border border-gray-mid px-4 text-xs font-bold text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-text-mid">
                  Tổ hợp môn xét tuyển
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 bg-gray-light/30 border border-gray-mid p-3 rounded-xl max-h-44 overflow-y-auto">
                  {combinationOptions.map((code) => {
                    const isChecked = editCombinationCodes.includes(code);
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => toggleCombination(code)}
                        className="flex items-center justify-between p-2 rounded-lg border text-xs font-semibold transition-all hover:bg-white cursor-pointer"
                        style={{
                          borderColor: isChecked ? '#2d7a2d' : '#e0e0e0',
                          backgroundColor: isChecked ? '#e8f5e9' : 'transparent',
                          color: isChecked ? '#1a4a1a' : '#444444',
                        }}
                      >
                        <span>{code}</span>
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

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-extrabold uppercase tracking-[0.5px] text-text-mid flex items-center gap-1">
                  <FileText size={13} className="text-green-main" />
                  Ghi chú
                </label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-mid px-4 py-3 text-xs font-medium text-text-dark outline-none bg-gray-light/20 focus:border-green-main focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-light">
                <button
                  type="button"
                  onClick={() => setEditItem(null)}
                  className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-main hover:bg-green-dark text-white font-bold text-xs rounded-xl shadow-sm"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
