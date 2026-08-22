'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';
import { AdmissionLookupApi, type LookupAdmission } from '@/service/admission-lookup.api';
import { getAdmissionNoteLines } from '@/shared/utils/admission-note';

interface LookupMajor {
  id: string;
  year: number;
  departmentCode: string;
  majorCode: string;
  name: string;
  quota: number;
  cutoffScore: number;
  programType: string;
  combinations: string[];
  note?: string;
}

interface LookupFaculty {
  id: string;
  name: string;
  accent: string;
  majors: LookupMajor[];
}

const FACULTY_COLORS = ['#2d7a2d', '#1a6f9b', '#9a6b16', '#7b4a9e', '#b24c38', '#27766e'];

const FACULTY_NAMES: Record<string, string> = {
  CK: 'Cơ khí',
  CNHHTP: 'Công nghệ hóa học & Thực phẩm',
  CNTT: 'Công nghệ thông tin',
  CNTY: 'Chăn nuôi - Thú Y',
  KHSH: 'Khoa học sinh học',
  KTE: 'Kinh tế',
  LN: 'Lâm nghiệp',
  MTTN: 'Môi trường tài nguyên',
  NH: 'Nông học',
  NNSP: 'Ngoại ngữ - Sư phạm',
  QLDD: 'Quản lý đất đai',
  TS: 'Thủy Sản',
};

const normalizeText = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const matchesQuery = (faculty: LookupFaculty, query: string) => {
  if (!query) {
    return faculty.majors;
  }

  const normalizedQuery = normalizeText(query);

  return faculty.majors.filter((major) => {
    const searchable = [
      faculty.name,
      major.year.toString(),
      major.departmentCode,
      major.majorCode,
      major.name,
      major.programType,
      major.cutoffScore.toString(),
      major.quota.toString(),
      major.combinations.join(' '),
      major.note ?? '',
    ].join(' ');

    return normalizeText(searchable).includes(normalizedQuery);
  });
};

export default function SearchView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFacultyId, setSelectedFacultyId] = useState('all');
  const [admissions, setAdmissions] = useState<LookupAdmission[]>([]);
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    AdmissionLookupApi.getYears()
      .then((years) => {
        setAvailableYears(years);
        if (years.length > 0) {
          setSelectedYear((currentYear) => years.includes(currentYear) ? currentYear : years[0]);
        }
      })
      .catch(() => setLoadError('Không thể tải danh sách năm tuyển sinh.'));
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    setLoadError(null);
    AdmissionLookupApi.getAdmissions(selectedYear)
      .then(setAdmissions)
      .catch(() => {
        setAdmissions([]);
        setLoadError('Không thể tải thông tin tuyển sinh từ hệ thống.');
      })
      .finally(() => setIsLoading(false));
  }, [selectedYear]);

  const admissionFaculties = useMemo<LookupFaculty[]>(() => {
    const groups = new Map<string, LookupAdmission[]>();
    admissions.forEach((item) => {
      const departmentCode = item.departmentCode || 'KHAC';
      groups.set(departmentCode, [...(groups.get(departmentCode) ?? []), item]);
    });

    return Array.from(groups.entries()).map(([departmentCode, items], index) => ({
      id: departmentCode,
      name: FACULTY_NAMES[departmentCode.trim().toUpperCase()] ?? departmentCode,
      accent: FACULTY_COLORS[index % FACULTY_COLORS.length],
      majors: items.map((item) => ({
        id: item.id,
        year: item.year,
        departmentCode: item.departmentCode,
        majorCode: item.majorCode,
        name: item.majorName,
        quota: item.admissionQuota,
        cutoffScore: item.cutoffScore,
        programType: item.programType,
        combinations: item.combinations.map((combination) => combination.code),
        note: item.note,
      })),
    }));
  }, [admissions]);

  const visibleFaculties = useMemo(() => {
    return admissionFaculties
      .filter((faculty) => selectedFacultyId === 'all' || faculty.id === selectedFacultyId)
      .map((faculty) => ({
        ...faculty,
        majors: matchesQuery(faculty, searchQuery),
      }))
      .filter((faculty) => faculty.majors.length > 0);
  }, [admissionFaculties, searchQuery, selectedFacultyId]);

  const visibleMajorCount = visibleFaculties.reduce((total, faculty) => total + faculty.majors.length, 0);
  const visibleQuota = visibleFaculties.reduce(
    (total, faculty) => total + faculty.majors.reduce((facultyTotal, major) => facultyTotal + major.quota, 0),
    0,
  );

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedFacultyId('all');
  };

  const totalAdmissionQuota = admissions.reduce((total, item) => total + item.admissionQuota, 0);

  return (
    <div className="flex min-h-screen flex-col bg-gray-light font-vietnam">
      <TopBar />
      <Header />
      <NavBar />

      <main className="flex-1">
        <section className="bg-white px-5 py-7 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            <h1 className="border-l-4 border-gold pl-4 text-[28px] font-black uppercase leading-tight text-green-dark lg:text-[32px]">
              Tra cứu thông tin tuyển sinh {selectedYear}
            </h1>

            <div className="mt-5 rounded-xl border border-gray-mid bg-[#fafafa] p-4">
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(300px,1fr)_150px_290px_auto] lg:items-center">
                <div className="relative min-w-0">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-main" size={20} />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Tìm tên khoa, tên ngành, mã ngành, tổ hợp..."
                    className="h-11 w-full rounded-lg border border-gray-mid bg-white pl-11 pr-11 text-[14px] font-semibold text-text-dark outline-none placeholder:font-medium placeholder:text-text-light focus:border-green-main focus:ring-3 focus:ring-green-main/10"
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

                <select
                  aria-label="Năm tuyển sinh"
                  value={selectedYear}
                  onChange={(event) => {
                    setSelectedYear(Number(event.target.value));
                    setSelectedFacultyId('all');
                  }}
                  className="h-11 w-full rounded-lg border border-gray-mid bg-white px-3.5 text-[14px] font-bold text-text-dark outline-none focus:border-green-main"
                >
                  {availableYears.map((year) => <option key={year} value={year}>Năm {year}</option>)}
                </select>

                <select
                  aria-label="Khoa"
                  value={selectedFacultyId}
                  onChange={(event) => setSelectedFacultyId(event.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-mid bg-white px-3.5 text-[14px] font-semibold text-text-dark outline-none focus:border-green-main"
                >
                  <option value="all">Tất cả khoa</option>
                  {admissionFaculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!searchQuery && selectedFacultyId === 'all'}
                  className="h-11 whitespace-nowrap rounded-lg bg-green-pale px-4 text-[13px] font-extrabold text-green-main transition-colors hover:bg-green-main hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Xóa lọc
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-gray-mid pt-3 text-[12px] font-semibold text-text-light">
                <span><strong className="text-green-main">{visibleMajorCount}</strong>/{admissions.length} ngành</span>
                <span><strong className="text-green-main">{visibleQuota}</strong>/{totalAdmissionQuota} chỉ tiêu</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-5 py-7 lg:px-10">
          <div className="mx-auto max-w-[1180px]">
            {loadError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
                {loadError}
              </div>
            )}
            <div className="overflow-hidden rounded-[12px] border-1.5 border-gray-mid bg-white shadow-[0_8px_26px_rgba(0,0,0,0.04)]">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1180px] border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-green-dark text-white">
                      <th className="w-[80px] px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.6px]">Năm</th>
                      <th className="w-[120px] px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.6px]">Mã ngành</th>
                      <th className="w-[210px] min-w-[220px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">Tên ngành đào tạo</th>
                      <th className="w-[100px] px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.6px]">Mã khoa</th>
                      <th className="w-[120px] px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.6px]">Chương trình</th>
                      <th className="w-[100px] px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.6px]">Chỉ tiêu</th>
                      <th className="w-[110px] px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.6px]">Điểm chuẩn</th>
                      <th className="w-[180px] min-w-[180px] px-3 py-3 text-center text-[12px] font-extrabold uppercase tracking-[0.6px]">Tổ hợp môn</th>
                      <th className="min-w-[180px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">Ghi chú</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-[14px] font-semibold text-text-light">
                          Đang tải dữ liệu tuyển sinh từ hệ thống...
                        </td>
                      </tr>
                    )}
                    {visibleFaculties.map((faculty, facultyIndex) => (
                      <Fragment key={faculty.id}>
                        <tr style={{ backgroundColor: `${faculty.accent}14` }}>
                          <td colSpan={9} className="border-y border-gray-mid px-3 py-3">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-[13px] font-black uppercase tracking-[0.4px] text-text-dark">
                                    {facultyIndex + 1}. Khoa {faculty.name}
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
                          <tr key={major.id} className="border-b border-gray-mid transition-colors hover:bg-green-pale/45">
                            <td className="px-3 py-3 text-center text-[12px] font-extrabold text-text-light">{major.year}</td>
                            <td className="px-3 py-3 text-center text-[13px] font-bold text-text-mid">{major.majorCode}</td>
                            <td className="max-w-[210px] px-3 py-3 text-[13.5px] font-extrabold leading-[1.45] text-text-dark">{major.name}</td>
                            <td className="px-3 py-3 text-center text-[13px] font-bold text-text-mid">{major.departmentCode}</td>
                            <td className="px-3 py-3 text-center text-[13px] font-bold text-green-dark">{major.programType}</td>
                            <td className="px-3 py-3 text-center text-[14px] font-black" style={{ color: faculty.accent }}>{major.quota}</td>
                            <td className="px-3 py-3 text-center text-[14px] font-black text-green-dark">{major.cutoffScore.toFixed(2)}</td>
                            <td className="px-3 py-3">
                              <div className="flex flex-wrap justify-center gap-1.5">
                                {major.combinations.map((combination) => (
                                  <span key={combination} className="rounded-md border border-gray-mid bg-gray-light px-2 py-1 text-[11px] font-semibold leading-tight text-text-mid">
                                    {combination}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="max-w-[220px] px-3 py-3 text-[12px] leading-5 text-text-mid">
                              {getAdmissionNoteLines(major.note).length > 0 ? (
                                <div className="space-y-1">
                                  {getAdmissionNoteLines(major.note).map((line) => (
                                    <div key={line}>{line}</div>
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

              {!isLoading && visibleFaculties.length === 0 && (
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
