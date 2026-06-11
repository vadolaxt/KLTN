'use client';

import { Fragment, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';
import {
  ADMISSION_FACULTIES,
  TOTAL_ADMISSION_MAJORS,
  TOTAL_ADMISSION_QUOTA,
  type AdmissionFaculty,
} from './constants/admission_lookup_data';

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const matchesQuery = (faculty: AdmissionFaculty, query: string) => {
  if (!query) {
    return faculty.majors;
  }

  const normalizedQuery = normalizeText(query);

  return faculty.majors.filter((major) => {
    const searchable = [
      faculty.name,
      major.stt,
      major.admissionCode,
      major.majorCode,
      major.name,
      major.quota.toString(),
      major.combinations.join(' '),
      major.note?.join(' ') ?? '',
    ].join(' ');

    return normalizeText(searchable).includes(normalizedQuery);
  });
};

export default function SearchView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const visibleFaculties = useMemo(() => {
    return ADMISSION_FACULTIES
      .filter((faculty) => selectedFacultyId === 'all' || faculty.id === selectedFacultyId)
      .map((faculty) => ({
        ...faculty,
        majors: matchesQuery(faculty, searchQuery),
      }))
      .filter((faculty) => faculty.majors.length > 0);
  }, [searchQuery, selectedFacultyId]);

  const visibleMajorCount = visibleFaculties.reduce((total, faculty) => total + faculty.majors.length, 0);
  const visibleQuota = visibleFaculties.reduce(
    (total, faculty) => total + faculty.majors.reduce((facultyTotal, major) => facultyTotal + major.quota, 0),
    0,
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFacultyId('all');
  };

  const saveRecentSearch = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      return;
    }

    setRecentSearches((current) => [
      trimmedValue,
      ...current.filter((item) => normalizeText(item) !== normalizeText(trimmedValue)),
    ].slice(0, 3));
  };

  const selectedFaculty = ADMISSION_FACULTIES.find((faculty) => faculty.id === selectedFacultyId);

  return (
    <div className="flex min-h-screen flex-col bg-gray-light font-vietnam">
      <TopBar />
      <Header />
      <NavBar />

      <main className="flex-1">
        <section className="bg-white px-10 py-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-3 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
              Tra cứu tuyển sinh
            </div>
            <h1 className="max-w-[820px] border-l-5 border-gold pl-5 text-[40px] font-black uppercase leading-tight text-green-dark">
              Danh mục ngành, mã xét tuyển và tổ hợp năm 2026
            </h1>
            <p className="mt-4 max-w-[860px] text-[15px] leading-[1.75] text-text-mid">
              Tìm nhanh theo tên ngành, mã ngành, mã xét tuyển, tổ hợp hoặc khoa/nhóm ngành. Màu ở đầu mỗi nhóm giúp phân biệt các khoa khi đọc bảng dài.
            </p>

            <div className="mt-8 rounded-[12px] border-1.5 border-gray-mid bg-[#fafafa] p-5">
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-main" size={20} />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    onBlur={(event) => saveRecentSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        saveRecentSearch(event.currentTarget.value);
                      }
                    }}
                    placeholder="Tìm ngành, mã ngành, mã xét tuyển, tổ hợp..."
                    className="w-full rounded-lg border-1.5 border-gray-mid bg-white py-3 pl-12 pr-12 text-[15px] font-semibold text-text-dark outline-none transition-all placeholder:font-medium placeholder:text-text-light focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-text-light transition-colors hover:bg-gray-light hover:text-green-main"
                      aria-label="Xóa tìm kiếm"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="flex w-full flex-col gap-1.5 lg:max-w-[420px]">
                    <label className="text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light">
                      Lọc theo khoa/nhóm ngành
                    </label>
                    <select
                      value={selectedFacultyId}
                      onChange={(event) => setSelectedFacultyId(event.target.value)}
                      className="w-full rounded-lg border-1.5 border-gray-mid bg-white px-3.5 py-2.5 text-[14px] font-semibold text-text-dark outline-none transition-all hover:border-green-light focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]"
                    >
                      <option value="all">Tất cả khoa/nhóm ngành</option>
                      {ADMISSION_FACULTIES.map((faculty) => (
                        <option key={faculty.id} value={faculty.id}>
                          {faculty.name}
                        </option>
                      ))}
                    </select>
                    {selectedFaculty && (
                      <div className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1 text-[12px] font-bold text-text-mid">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: selectedFaculty.accent }} />
                        {selectedFaculty.name}
                      </div>
                    )}
                  </div>

                  {recentSearches.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                      <span className="text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light">
                        Tìm gần đây
                      </span>
                      {recentSearches.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => setSearchQuery(item)}
                          className="rounded-full border border-gray-mid bg-white px-3 py-1.5 text-[12px] font-bold text-text-mid transition-colors hover:border-green-main hover:text-green-main"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-[13px]">
                  <div className="rounded-md bg-white px-3 py-2 font-semibold text-text-mid">
                    Hiển thị <span className="font-black text-green-main">{visibleMajorCount}</span> / {TOTAL_ADMISSION_MAJORS} ngành
                  </div>
                  <div className="rounded-md bg-white px-3 py-2 font-semibold text-text-mid">
                    Chỉ tiêu đang lọc <span className="font-black text-green-main">{visibleQuota}</span> / {TOTAL_ADMISSION_QUOTA}
                  </div>
                  {(searchQuery || selectedFacultyId !== 'all') && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="rounded-md bg-green-pale px-3 py-2 text-[13px] font-extrabold text-green-main transition-colors hover:bg-green-main hover:text-white"
                    >
                      Xóa bộ lọc
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-10 py-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="overflow-hidden rounded-[12px] border-1.5 border-gray-mid bg-white shadow-[0_8px_26px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-green-dark text-white">
                      <th className="w-[70px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">STT</th>
                      <th className="w-[120px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">Mã xét tuyển</th>
                      <th className="w-[110px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">Mã ngành</th>
                      <th className="min-w-[280px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">Tên nhóm ngành/ngành</th>
                      <th className="w-[110px] px-3 py-3 text-right text-[12px] font-extrabold uppercase tracking-[0.6px]">Chỉ tiêu</th>
                      <th className="min-w-[330px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">Tổ hợp xét tuyển</th>
                      <th className="min-w-[180px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleFaculties.map((faculty, facultyIndex) => (
                      <Fragment key={faculty.id}>
                        <tr style={{ backgroundColor: `${faculty.accent}14` }}>
                          <td colSpan={7} className="border-y border-gray-mid px-3 py-3">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <span className="h-8 w-1.5 rounded-full" style={{ backgroundColor: faculty.accent }} />
                                <div>
                                  <div className="text-[13px] font-black uppercase tracking-[0.4px] text-text-dark">
                                    {facultyIndex + 1}. {faculty.name}
                                  </div>
                                  <div className="mt-0.5 text-[12px] font-semibold text-text-light">
                                    {faculty.majors.length} ngành hiển thị
                                  </div>
                                </div>
                              </div>
                              <div className="rounded-md bg-white px-3 py-1.5 text-[12px] font-extrabold" style={{ color: faculty.accent }}>
                                {faculty.majors.reduce((total, major) => total + major.quota, 0)} chỉ tiêu
                              </div>
                            </div>
                          </td>
                        </tr>

                        {faculty.majors.map((major) => (
                          <tr key={`${faculty.id}-${major.stt}-${major.admissionCode}`} className="border-b border-gray-mid transition-colors hover:bg-green-pale/45">
                            <td className="px-3 py-3 text-[12px] font-extrabold text-text-light">{major.stt}</td>
                            <td className="px-3 py-3 text-[13px] font-bold text-green-dark">{major.admissionCode}</td>
                            <td className="px-3 py-3 text-[13px] font-bold text-text-mid">{major.majorCode}</td>
                            <td className="px-3 py-3 text-[13.5px] font-extrabold leading-[1.45] text-text-dark">{major.name}</td>
                            <td className="px-3 py-3 text-right text-[14px] font-black" style={{ color: faculty.accent }}>{major.quota}</td>
                            <td className="px-3 py-3">
                              <div className="flex flex-wrap gap-1.5">
                                {major.combinations.map((combination) => (
                                  <span key={combination} className="rounded-md border border-gray-mid bg-gray-light px-2 py-1 text-[11px] font-semibold leading-tight text-text-mid">
                                    {combination}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-3 py-3 text-[12px] leading-[1.55] text-text-mid">
                              {major.note?.length ? (
                                <div className="space-y-1">
                                  {major.note.map((note) => (
                                    <div key={note}>- {note}</div>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-text-light">-</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {visibleFaculties.length === 0 && (
                <div className="p-10 text-center">
                  <div className="text-[16px] font-extrabold text-green-dark">Không tìm thấy ngành phù hợp</div>
                  <p className="mt-2 text-[13px] text-text-mid">Thử tìm bằng mã ngành, tên ngành hoặc tổ hợp khác.</p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-4 rounded-md bg-green-main px-4 py-2 text-[13px] font-extrabold text-white transition-colors hover:bg-green-dark"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
