'use client';

import React, { useMemo, useState } from 'react';
import {
  BookOpenCheck,
  Check,
  Edit3,
  Eye,
  Hash,
  Layers,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { AdmissionCreateRequest, AdmissionInfo, AdmissionUpdateRequest } from '@/service/admin.api';
import { getAdmissionNoteLines } from '@/shared/utils/admission-note';

interface AdmissionManagementProps {
  admissions: AdmissionInfo[];
  selectedYear: number;
  availableYears: number[];
  availableCombinationCodes: string[];
  setSelectedYear: (year: number) => void;
  updateAdmissionInfo: (id: string, payload: AdmissionUpdateRequest) => Promise<void>;
  createAdmissionInfo: (payload: AdmissionCreateRequest) => Promise<void>;
  deleteAdmissionInfo: (id: string) => Promise<void>;
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
  createAdmissionInfo,
  deleteAdmissionInfo,
  isLoading,
}: AdmissionManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [programFilter, setProgramFilter] = useState('ALL');

  const [detailItem, setDetailItem] = useState<AdmissionInfo | null>(null);
  const [editItem, setEditItem] = useState<AdmissionInfo | null>(null);
  const [editQuota, setEditQuota] = useState(0);
  const [editCutoffScore, setEditCutoffScore] = useState(0);
  const [editProgramType, setEditProgramType] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editCombinationCodes, setEditCombinationCodes] = useState<string[]>([]);
  const [formError, setFormError] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState<AdmissionCreateRequest>({
    schoolCode: 'NLU', year: selectedYear, departmentCode: '', majorName: '', majorCode: '',
    admissionQuota: 1, cutoffScore: 0, combinationCodes: [], programType: 'Đại trà', note: '',
  });

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
      combinationCodes: editCombinationCodes,
      note: editNote.trim(),
    });
    setEditItem(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!createForm.departmentCode.trim() || !createForm.majorName.trim() || !createForm.majorCode.trim()) {
      setFormError('Vui lòng nhập đầy đủ mã khoa, mã ngành và tên ngành');
      return;
    }
    if (createForm.admissionQuota < 1 || createForm.cutoffScore < 0 || createForm.cutoffScore > 30) {
      setFormError('Chỉ tiêu phải lớn hơn 0 và điểm chuẩn nằm trong khoảng 0 đến 30');
      return;
    }
    if (createForm.combinationCodes.length === 0) {
      setFormError('Vui lòng chọn ít nhất một tổ hợp môn');
      return;
    }
    try {
      await createAdmissionInfo(createForm);
      setShowCreate(false);
      setCreateForm((prev) => ({
        ...prev,
        departmentCode: '',
        majorName: '',
        majorCode: '',
        combinationCodes: [],
        note: '',
      }));
    } catch {
      // API layer displays the server validation message.
    }
  };

  const handleDelete = async (item: AdmissionInfo) => {
    if (!window.confirm(`Xóa thông tin tuyển sinh ngành ${item.majorName} năm ${item.year}?`)) return;
    await deleteAdmissionInfo(item.id);
  };

  return (
    <div className="bg-white border border-gray-mid rounded-2xl p-6 shadow-sm">
      <div className="mx-auto w-fit max-w-full">
      <div className="flex w-full flex-col gap-4 xl:flex-row xl:items-center xl:justify-between mb-6">
        <div className="relative w-full xl:w-[300px] xl:flex-none">
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
          <button
            type="button"
            onClick={() => {
              setCreateForm((prev) => ({ ...prev, year: selectedYear }));
              setFormError('');
              setShowCreate(true);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-green-main px-3 py-2 text-xs font-bold text-white hover:bg-green-dark"
          >
            <Plus size={14} /> Thêm mới
          </button>
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

      <div className="w-fit max-w-full overflow-x-auto border border-gray-mid rounded-xl">
        <table className="w-max min-w-[820px] table-auto divide-y divide-gray-mid text-left [&_th:first-child]:!pl-8 [&_td:first-child]:!pl-8 [&_td:nth-child(1)]:text-center [&_th:nth-child(2)]:!w-[120px] [&_td:nth-child(2)]:!w-[120px] [&_th:nth-child(2)]:!pl-5 [&_td:nth-child(2)]:!pl-5 [&_td:nth-child(2)]:text-center [&_th:nth-child(4)]:!w-[90px] [&_td:nth-child(4)]:!w-[90px] [&_td:nth-child(4)]:text-center [&_td:nth-child(5)]:text-center [&_td:nth-child(6)]:text-center [&_td:nth-child(7)]:text-center [&_th:nth-child(8)]:!w-[140px] [&_td:nth-child(8)]:!w-[140px] [&_td:nth-child(8)]:!max-w-[140px] [&_th:last-child]:!pr-8 [&_td:last-child]:!pr-8">
          <thead className="bg-gray-light text-[11px] font-black uppercase tracking-[0.3px] text-text-light [&_th]:!px-2 [&_th]:text-center">
            <tr className="whitespace-nowrap">
              <th className="px-4 py-4">Năm</th>
              <th className="px-4 py-4">Mã ngành</th>
              <th className="px-4 py-4">Tên ngành đào tạo</th>
              <th className="px-4 py-4">Mã khoa</th>
              <th className="px-4 py-4">Chương trình</th>
              <th className="px-4 py-4">Chỉ tiêu</th>
              <th className="px-4 py-4">Điểm chuẩn</th>
              <th className="px-4 py-4">Tổ hợp môn</th>
              <th className="px-4 py-4 text-center">Cập nhật</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-mid bg-white text-xs [&_td]:!px-1">
            {isLoading ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-text-light font-medium">
                  Đang tải thông tin tuyển sinh năm {selectedYear}...
                </td>
              </tr>
            ) : filteredAdmissions.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10 text-text-light font-medium">
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
                  <td className="w-[220px] max-w-[220px] px-3 py-4 font-extrabold text-text-dark">
                    <span className="line-clamp-2 leading-5" title={item.majorName}>{item.majorName}</span>
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
                  <td className="w-[140px] max-w-[140px] px-4 py-4 text-center">
                    <div className="flex flex-wrap justify-center gap-1.5">
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
                  <td className="px-2 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() => setDetailItem(item)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-mid p-1.5 text-text-mid transition-all hover:border-green-main/30 hover:bg-green-pale hover:text-green-dark"
                    >
                      <Eye size={13} />
                      <span className="text-[11px] font-bold">Xem</span>
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-gray-mid p-1.5 text-text-mid transition-all hover:border-green-main/30 hover:bg-green-pale hover:text-green-dark"
                    >
                      <Edit3 size={13} />
                      <span className="text-[11px] font-bold">Sửa</span>
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="ml-2 inline-flex items-center gap-1.5 rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={13} />
                      <span className="text-[11px] font-bold">Xóa</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>

      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-2xl border border-gray-mid bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between border-b border-gray-light pb-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.5px] text-text-dark">
                  Chi tiết thông tin tuyển sinh
                </h3>
                <p className="mt-0.5 text-[10px] font-bold text-text-light">
                  {detailItem.majorName} ({detailItem.majorCode}) - {detailItem.year}
                </p>
              </div>
              <button type="button" onClick={() => setDetailItem(null)} className="text-text-light hover:text-text-dark">
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
              <div className="rounded-xl border border-gray-mid bg-gray-light/30 p-3">
                <div className="text-[10px] font-extrabold uppercase text-text-light">Mã khoa</div>
                <div className="mt-1 font-bold text-text-dark">{detailItem.departmentCode}</div>
              </div>
              <div className="rounded-xl border border-gray-mid bg-gray-light/30 p-3">
                <div className="text-[10px] font-extrabold uppercase text-text-light">Chương trình</div>
                <div className="mt-1 font-bold text-text-dark">{detailItem.programType}</div>
              </div>
              <div className="rounded-xl border border-gray-mid bg-gray-light/30 p-3">
                <div className="text-[10px] font-extrabold uppercase text-text-light">Chỉ tiêu</div>
                <div className="mt-1 font-bold text-green-dark">{detailItem.admissionQuota}</div>
              </div>
              <div className="rounded-xl border border-gray-mid bg-gray-light/30 p-3">
                <div className="text-[10px] font-extrabold uppercase text-text-light">Điểm chuẩn</div>
                <div className="mt-1 font-bold text-green-dark">{detailItem.cutoffScore.toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-mid bg-gray-light/30 p-3">
              <div className="text-[10px] font-extrabold uppercase text-text-light">Tổ hợp môn</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {getCombinationCodes(detailItem).map((code) => (
                  <span key={code} className="rounded border border-gray-mid bg-white px-2 py-0.5 text-[10px] font-black text-text-dark">
                    {code}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-gray-mid bg-gray-light/30 p-3">
              <div className="text-[10px] font-extrabold uppercase text-text-light">Ghi chú</div>
              {getAdmissionNoteLines(detailItem.note).length > 0 ? (
                <div className="mt-2 space-y-1 text-xs font-semibold leading-5 text-text-mid">
                  {getAdmissionNoteLines(detailItem.note).map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-xs font-semibold text-text-light">-</div>
              )}
            </div>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-3xl rounded-2xl border border-gray-mid bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between border-b border-gray-light pb-4">
              <h3 className="text-sm font-black uppercase text-text-dark">Thêm thông tin tuyển sinh</h3>
              <button type="button" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            {formError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">{formError}</div>}
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <input required placeholder="Mã trường" value={createForm.schoolCode} onChange={(e) => setCreateForm({ ...createForm, schoolCode: e.target.value })} className="rounded-xl border border-gray-mid px-3 py-2.5 text-xs" />
                <input required type="number" placeholder="Năm" value={createForm.year} onChange={(e) => setCreateForm({ ...createForm, year: Number(e.target.value) })} className="rounded-xl border border-gray-mid px-3 py-2.5 text-xs" />
                <input required placeholder="Mã khoa" value={createForm.departmentCode} onChange={(e) => setCreateForm({ ...createForm, departmentCode: e.target.value })} className="rounded-xl border border-gray-mid px-3 py-2.5 text-xs" />
                <input required placeholder="Mã ngành" value={createForm.majorCode} onChange={(e) => setCreateForm({ ...createForm, majorCode: e.target.value })} className="rounded-xl border border-gray-mid px-3 py-2.5 text-xs" />
              </div>
              <input required placeholder="Tên ngành" value={createForm.majorName} onChange={(e) => setCreateForm({ ...createForm, majorName: e.target.value })} className="w-full rounded-xl border border-gray-mid px-3 py-2.5 text-xs" />

              <fieldset className="rounded-xl border border-gray-mid px-4 pb-4 pt-2">
                <legend className="mx-auto px-3 text-[11px] font-extrabold uppercase tracking-[0.5px] text-text-mid">
                  Chương trình, chỉ tiêu & điểm chuẩn
                </legend>
                <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-3">
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase text-text-light">Chương trình đào tạo</span>
                    <select required value={createForm.programType} onChange={(e) => setCreateForm({ ...createForm, programType: e.target.value })} className="rounded-xl border border-gray-mid bg-white px-3 py-2.5 text-xs">
                      <option value="Đại trà">Đại trà</option>
                      <option value="Nâng cao">Nâng cao</option>
                      <option value="Tiên tiến">Tiên tiến</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase text-text-light">Chỉ tiêu</span>
                    <input required min={1} type="number" value={createForm.admissionQuota} onChange={(e) => setCreateForm({ ...createForm, admissionQuota: Number(e.target.value) })} className="rounded-xl border border-gray-mid px-3 py-2.5 text-xs" />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase text-text-light">Điểm chuẩn</span>
                    <input required min={0} max={30} step="0.01" type="number" value={createForm.cutoffScore} onChange={(e) => setCreateForm({ ...createForm, cutoffScore: Number(e.target.value) })} className="rounded-xl border border-gray-mid px-3 py-2.5 text-xs" />
                  </label>
                </div>
              </fieldset>
              <div>
                <p className="mb-2 text-[11px] font-extrabold uppercase text-text-mid">Tổ hợp môn</p>
                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto rounded-xl border border-gray-mid p-3">
                  {combinationOptions.map((code) => (
                    <label key={code} className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-gray-light px-2 py-1.5 text-xs font-bold">
                      <input type="checkbox" checked={createForm.combinationCodes.includes(code)} onChange={() => setCreateForm((prev) => ({ ...prev, combinationCodes: prev.combinationCodes.includes(code) ? prev.combinationCodes.filter((item) => item !== code) : [...prev.combinationCodes, code] }))} />
                      {code}
                    </label>
                  ))}
                </div>
              </div>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold uppercase text-text-mid">Ghi chú</span>
                <textarea
                  value={createForm.note ?? ''}
                  onChange={(e) => setCreateForm({ ...createForm, note: e.target.value })}
                  rows={2}
                  placeholder="Nhập ghi chú tuyển sinh (nếu có)..."
                  className="w-full resize-none rounded-xl border border-gray-mid px-3 py-2.5 text-xs outline-none focus:border-green-main"
                />
              </label>
              <div className="flex justify-end gap-3 border-t border-gray-light pt-4">
                <button type="button" onClick={() => setShowCreate(false)} className="rounded-xl border border-gray-mid px-4 py-2 text-xs font-bold">Hủy</button>
                <button type="submit" className="rounded-xl bg-green-main px-4 py-2 text-xs font-bold text-white">Thêm thông tin</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-extrabold uppercase text-text-mid">Ghi chú</span>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  rows={3}
                  placeholder="Nhập ghi chú tuyển sinh (nếu có)..."
                  className="w-full resize-none rounded-xl border border-gray-mid px-4 py-3 text-xs text-text-dark outline-none focus:border-green-main"
                />
              </label>

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
