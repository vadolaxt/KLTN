// 'use client';
//
// import { useState, useMemo } from 'react';
// import { Save, Loader2 } from 'lucide-react';
// import { useAcademicProfile, useAcademicFormSync } from "@/hooks/use-academic-score-profile";
//
// type ScoreSource = 'hoc_ba' | 'thpt' | 'dgnl';
//
// const scoreSources: Array<{ value: ScoreSource; label: string; description: string }> = [
// 	{ value: 'hoc_ba', label: 'Học bạ', description: 'Điểm trung bình theo môn' },
// 	{ value: 'thpt', label: 'THPT', description: 'Điểm thi tốt nghiệp' },
// 	{ value: 'dgnl', label: 'ĐGNL (Điểm cao nhất)', description: 'Điểm đánh giá năng lực' },
// ];
//
// const inputClass =
// 	'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3 py-2.5 text-[14px] font-bold text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]';
//
// const labelClass = 'text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light';
//
// const normalizeNumericInput = (value: string, max: number) => {
// 	const cleaned = value.replace(',', '.').replace(/[^\d.]/g, '');
// 	if (cleaned === '') return '';
//
// 	const [rawInteger, ...fractionPieces] = cleaned.split('.');
// 	const fraction = fractionPieces.join('').slice(0, 2);
// 	const hasTrailingDot = cleaned.endsWith('.') && fractionPieces.length === 1;
// 	const integer = rawInteger.replace(/^0+(?=\d)/, '') || '0';
// 	const normalized = hasTrailingDot ? `${integer}.` : fraction ? `${integer}.${fraction}` : integer;
// 	const parsed = Number(normalized);
//
// 	if (!Number.isFinite(parsed)) return '';
// 	if (parsed > max) return max.toString();
//
// 	return normalized;
// };
//
// export default function AcademicScoresView() {
// 	const [activeSource, setActiveSource] = useState<ScoreSource>('hoc_ba');
//
// 	// Hook gọi API lấy dữ liệu gốc từ Server
// 	const { data, loading, error } = useAcademicProfile();
// 	const profileData = data?.data;
//
// 	// Gọi Custom Hook để quản lý Form State & Đồng bộ dữ liệu
// 	const {
// 		localHocBa,
// 		setLocalHocBa,
// 		localThpt,
// 		setLocalThpt,
// 		localDgnl,
// 		setLocalDgnl,
// 		syncData // Hàm khôi phục dữ liệu gốc khi bấm nút Hủy
// 	} = useAcademicFormSync(profileData);
//
// 	// Trích xuất dữ liệu phục vụ hiển thị cấu trúc UI
// 	const schoolRecords = profileData?.schoolRecord?.subjectScoreRecords || [];
// 	const nationalRecords = profileData?.nationalExamResult?.subjectScores || [];
// 	const schoolAvg = profileData?.schoolRecordAvg || {};
//
// 	// Tự động rút trích danh sách Môn học (Học bạ)
// 	const uniqueSubjectsHocBa = useMemo(() => {
// 		const map = new Map();
// 		schoolRecords.forEach((r: any) => {
// 			if (!map.has(r.subject.id)) map.set(r.subject.id, r.subject);
// 		});
// 		return Array.from(map.values());
// 	}, [schoolRecords]);
//
// 	// Tự động rút trích danh sách Học kỳ (VD: "10-1", "10-2") -> Sắp xếp theo chuỗi sẽ đúng thứ tự lớp
// 	const uniqueSemesters = useMemo(() => {
// 		const set = new Set<string>();
// 		schoolRecords.forEach((r: any) => {
// 			set.add(`${r.gradeLevel}-${r.semester}`);
// 		});
// 		return Array.from(set).sort();
// 	}, [schoolRecords]);
//
// 	// Tự động rút trích danh sách Môn học (THPT)
// 	const uniqueSubjectsThpt = useMemo(() => {
// 		return nationalRecords.map((r: any) => r.subject);
// 	}, [nationalRecords]);
//
// 	// Handlers xử lý thay đổi form
// 	const handleHocBaChange = (subjectId: string, semKey: string, value: string) => {
// 		setLocalHocBa(prev => ({
// 			...prev,
// 			[subjectId]: {
// 				...(prev[subjectId] || {}),
// 				[semKey]: normalizeNumericInput(value, 10)
// 			}
// 		}));
// 	};
//
// 	const handleThptChange = (subjectId: string, value: string) => {
// 		setLocalThpt(prev => ({
// 			...prev,
// 			[subjectId]: normalizeNumericInput(value, 10)
// 		}));
// 	};
//
// 	// Xử lý Trạng thái Loading và Error
// 	if (loading) {
// 		return (
// 			<div className="flex h-[300px] w-full items-center justify-center">
// 				<Loader2 className="animate-spin text-green-main" size={40} />
// 			</div>
// 		);
// 	}
//
// 	if (error || !profileData) {
// 		return <div className="p-4 text-red-500 font-bold">Không thể tải hồ sơ điểm của thí sinh.</div>;
// 	}
//
// 	return (
// 		<div className="animate-fade-in">
// 			<div className="mb-1.5 text-[13px] font-bold uppercase tracking-[2px] text-green-main">Hồ sơ thí sinh</div>
// 			<div className="mb-7 border-l-5 border-gold pl-3.5 text-[22px] font-extrabold text-green-dark">Quản lý điểm</div>
//
// 			{/* Tabs chọn nguồn điểm */}
// 			<div className="mb-7 grid grid-cols-1 gap-3 md:grid-cols-3">
// 				{scoreSources.map((source) => (
// 					<button
// 						key={source.value}
// 						className={`rounded-lg border-2 px-4 py-3 text-left transition-all ${
// 							activeSource === source.value
// 								? 'border-green-main bg-green-pale text-green-dark shadow-[0_6px_18px_rgba(45,122,45,0.12)]'
// 								: 'border-gray-mid bg-white text-text-mid hover:border-green-light hover:bg-green-pale'
// 						}`}
// 						onClick={() => setActiveSource(source.value)}
// 						type="button"
// 					>
// 						<span className="block text-[15px] font-extrabold">{source.label}</span>
// 						<span className="mt-1 block text-[11px] font-semibold text-text-light">{source.description}</span>
// 					</button>
// 				))}
// 			</div>
//
// 			<section>
// 				{/* ======= TAB HỌC BẠ ======= */}
// 				{activeSource === 'hoc_ba' && (
// 					<div className="space-y-5">
// 						<div className="overflow-x-auto rounded-lg border-1.5 border-gray-mid">
// 							<table className="w-full min-w-[940px] border-collapse bg-white">
// 								<thead>
// 								<tr className="bg-gray-light">
// 									<th className="w-[190px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px] text-text-light">
// 										Tên môn
// 									</th>
// 									{uniqueSemesters.map((semKey) => {
// 										const [grade, sem] = semKey.split('-');
// 										return (
// 											<th key={semKey} className="w-[100px] px-2 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.4px] text-text-light">
// 												HK{sem} L{grade}
// 											</th>
// 										);
// 									})}
// 									<th className="w-[120px] px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.4px] text-text-light">
// 										TB 6 HK
// 									</th>
// 								</tr>
// 								</thead>
// 								<tbody>
// 								{uniqueSubjectsHocBa.map((subject: any) => (
// 									<tr key={subject.id} className="border-t border-gray-mid">
// 										<td className="px-3 py-2.5">
// 											<div className="text-[13px] font-extrabold leading-snug text-text-dark">{subject.subjectName}</div>
// 										</td>
// 										{uniqueSemesters.map((semKey) => (
// 											<td key={`${subject.id}-${semKey}`} className="px-2 py-2.5">
// 												<input
// 													className={`${inputClass} px-2 py-2 text-center text-[13px]`}
// 													inputMode="decimal"
// 													max="10"
// 													min="0"
// 													onChange={(e) => handleHocBaChange(subject.id, semKey, e.target.value)}
// 													pattern="^[0-9]*[.,]?[0-9]{0,2}$"
// 													placeholder="0.00"
// 													step="0.01"
// 													type="text"
// 													value={localHocBa[subject.id]?.[semKey] ?? ''}
// 												/>
// 											</td>
// 										))}
// 										<td className="px-3 py-2.5">
// 											<input
// 												className="w-full rounded-lg border-1.5 border-gray-mid bg-gray-light px-2 py-2 text-center text-[13px] font-extrabold text-green-main outline-none"
// 												readOnly
// 												value={schoolAvg[subject.id] ?? ''}
// 											/>
// 										</td>
// 									</tr>
// 								))}
// 								</tbody>
// 							</table>
// 						</div>
//
// 						<div className="flex justify-end gap-3">
// 							<button
// 								onClick={syncData}
// 								className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light"
// 								type="button"
// 							>
// 								Hủy
// 							</button>
// 							<button className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark" type="button">
// 								<Save size={17} />
// 								Lưu học bạ
// 							</button>
// 						</div>
// 					</div>
// 				)}
//
// 				{/* ======= TAB ĐIỂM THPT ======= */}
// 				{activeSource === 'thpt' && (
// 					<div className="space-y-5">
// 						<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
// 							{uniqueSubjectsThpt.map((subject: any) => (
// 								<label key={subject.id} className="flex flex-col gap-2 rounded-lg border-1.5 border-gray-mid bg-white p-3">
// 									<span className="min-h-[36px] text-[13px] font-extrabold leading-snug text-text-dark">{subject.subjectName}</span>
// 									<input
// 										className={`${inputClass} text-center`}
// 										inputMode="decimal"
// 										max="10"
// 										min="0"
// 										onChange={(e) => handleThptChange(subject.id, e.target.value)}
// 										pattern="^[0-9]*[.,]?[0-9]{0,2}$"
// 										placeholder="0.00"
// 										step="0.01"
// 										type="text"
// 										value={localThpt[subject.id] ?? ''}
// 									/>
// 								</label>
// 							))}
// 						</div>
//
// 						<div className="flex justify-end gap-3">
// 							<button
// 								onClick={syncData}
// 								className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light"
// 								type="button"
// 							>
// 								Hủy
// 							</button>
// 							<button className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark" type="button">
// 								<Save size={17} />
// 								Lưu điểm THPT
// 							</button>
// 						</div>
// 					</div>
// 				)}
//
// 				{/* ======= TAB ĐIỂM ĐGNL ======= */}
// 				{activeSource === 'dgnl' && (
// 					<div className="space-y-5">
// 						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
// 							<label className="flex flex-col gap-2 rounded-lg border-1.5 border-gray-mid bg-white p-4">
// 								<span className={labelClass}>Điểm ĐGNL</span>
// 								<input
// 									className={`${inputClass} text-center`}
// 									inputMode="decimal"
// 									max="1200"
// 									min="0"
// 									onChange={(e) => setLocalDgnl(normalizeNumericInput(e.target.value, 1200))}
// 									placeholder="0"
// 									type="text"
// 									value={localDgnl}
// 								/>
// 							</label>
// 						</div>
//
// 						<div className="flex justify-end gap-3">
// 							<button
// 								onClick={syncData}
// 								className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light"
// 								type="button"
// 							>
// 								Hủy
// 							</button>
// 							<button className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark" type="button">
// 								<Save size={17} />
// 								Lưu điểm ĐGNL
// 							</button>
// 						</div>
// 					</div>
// 				)}
// 			</section>
// 		</div>
// 	);
// }


'use client';

import { useState, useMemo, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { useAcademicProfile, useAcademicFormSync } from "@/hooks/use-academic-score-profile";
import {toast} from "sonner";

type ScoreSource = 'hoc_ba' | 'thpt' | 'dgnl';

const scoreSources: Array<{ value: ScoreSource; label: string; description: string }> = [
	{ value: 'hoc_ba', label: 'Học bạ', description: 'Điểm trung bình theo môn' },
	{ value: 'thpt', label: 'THPT', description: 'Điểm thi tốt nghiệp' },
	{ value: 'dgnl', label: 'ĐGNL (Điểm cao nhất)', description: 'Điểm đánh giá năng lực' },
];

const inputClass =
	'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3 py-2.5 text-[14px] font-bold text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]';

const labelClass = 'text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light';

const normalizeNumericInput = (value: string, max: number) => {
	const cleaned = value.replace(',', '.').replace(/[^\d.]/g, '');
	if (cleaned === '') return '';

	const [rawInteger, ...fractionPieces] = cleaned.split('.');
	const fraction = fractionPieces.join('').slice(0, 2);
	const hasTrailingDot = cleaned.endsWith('.') && fractionPieces.length === 1;
	const integer = rawInteger.replace(/^0+(?=\d)/, '') || '0';
	const normalized = hasTrailingDot ? `${integer}.` : fraction ? `${integer}.${fraction}` : integer;
	const parsed = Number(normalized);

	if (!Number.isFinite(parsed)) return '';
	if (parsed > max) return max.toString();

	return normalized;
};

export default function AcademicScoresView() {
	const [activeSource, setActiveSource] = useState<ScoreSource>('hoc_ba');

	const { data, loading, error, saveProfile, isSaving } = useAcademicProfile();
	const profileData = data?.data;

	const {
		localHocBa,
		setLocalHocBa,
		localThpt,
		setLocalThpt,
		localDgnl,
		setLocalDgnl,
		syncData
	} = useAcademicFormSync(profileData);

	const schoolRecords = profileData?.schoolRecord?.subjectScoreRecords || [];
	const nationalRecords = profileData?.nationalExamResult?.subjectScores || [];
	const schoolAvg = profileData?.schoolRecordAvg || {};

	// ==========================================
	// 1. XỬ LÝ CHUYỂN TAB -> RESET DATA VỀ BAN ĐẦU
	// ==========================================
	useEffect(() => {
		syncData();
	}, [activeSource, syncData]);


	// ==========================================
	// 2. XỬ LÝ LƯU DỮ LIỆU LÊN SERVER
	// ==========================================
	const handleSave = async () => {
		if (!profileData) return;

		// Rebuild lại payload chuẩn form Request dựa trên local state hiện tại
		const payload: any = {
			schoolRecord: {
				subjectScoreRecords: schoolRecords.map((r: any) => ({
					subject: { id: r.subject.id, code: r.subject.code, subjectName: r.subject.subjectName },
					score: Number(localHocBa[r.subject.id]?.[`${r.gradeLevel}-${r.semester}`] || 0),
					gradeLevel: r.gradeLevel,
					semester: r.semester
				}))
			},
			nationalExamResult: {
				id: profileData.nationalExamResult?.id || null,
				subjectScores: nationalRecords.map((r: any) => ({
					subject: { id: r.subject.id, code: r.subject.code, subjectName: r.subject.subjectName },
					score: Number(localThpt[r.subject.id] || 0),
					gradeLevel: r.gradeLevel,
					semester: r.semester
				}))
			},
			competencyTestResult: {
				score: Number(localDgnl || 0)
			}
		};

		const result = await saveProfile(payload);
		if (result.success) {
			toast.success('Đã lưu dữ liệu thành công!');
		} else {
			toast.error('Có lỗi xảy ra khi lưu dữ liệu!');
		}
	};


	const uniqueSubjectsHocBa = useMemo(() => {
		const map = new Map();
		schoolRecords.forEach((r: any) => {
			if (!map.has(r.subject.id)) map.set(r.subject.id, r.subject);
		});
		return Array.from(map.values());
	}, [schoolRecords]);

	const uniqueSemesters = useMemo(() => {
		const set = new Set<string>();
		schoolRecords.forEach((r: any) => {
			set.add(`${r.gradeLevel}-${r.semester}`);
		});
		return Array.from(set).sort();
	}, [schoolRecords]);

	const uniqueSubjectsThpt = useMemo(() => {
		return nationalRecords.map((r: any) => r.subject);
	}, [nationalRecords]);

	const handleHocBaChange = (subjectId: string, semKey: string, value: string) => {
		setLocalHocBa(prev => ({
			...prev,
			[subjectId]: {
				...(prev[subjectId] || {}),
				[semKey]: normalizeNumericInput(value, 10)
			}
		}));
	};

	const handleThptChange = (subjectId: string, value: string) => {
		setLocalThpt(prev => ({
			...prev,
			[subjectId]: normalizeNumericInput(value, 10)
		}));
	};

	if (loading) {
		return (
			<div className="flex h-[300px] w-full items-center justify-center">
				<Loader2 className="animate-spin text-green-main" size={40} />
			</div>
		);
	}

	if (error || !profileData) {
		return <div className="p-4 text-red-500 font-bold">Không thể tải hồ sơ điểm của thí sinh.</div>;
	}

	return (
		<div className="animate-fade-in">
			<div className="mb-1.5 text-[13px] font-bold uppercase tracking-[2px] text-green-main">Hồ sơ thí sinh</div>
			<div className="mb-7 border-l-5 border-gold pl-3.5 text-[22px] font-extrabold text-green-dark">Quản lý điểm</div>

			{/* Tabs chọn nguồn điểm */}
			<div className="mb-7 grid grid-cols-1 gap-3 md:grid-cols-3">
				{scoreSources.map((source) => (
					<button
						key={source.value}
						className={`rounded-lg border-2 px-4 py-3 text-left transition-all ${
							activeSource === source.value
								? 'border-green-main bg-green-pale text-green-dark shadow-[0_6px_18px_rgba(45,122,45,0.12)]'
								: 'border-gray-mid bg-white text-text-mid hover:border-green-light hover:bg-green-pale'
						}`}
						onClick={() => setActiveSource(source.value)}
						type="button"
					>
						<span className="block text-[15px] font-extrabold">{source.label}</span>
						<span className="mt-1 block text-[11px] font-semibold text-text-light">{source.description}</span>
					</button>
				))}
			</div>

			<section>
				{/* ======= TAB HỌC BẠ ======= */}
				{activeSource === 'hoc_ba' && (
					<div className="space-y-5">
						<div className="overflow-x-auto rounded-lg border-1.5 border-gray-mid">
							<table className="w-full min-w-[940px] border-collapse bg-white">
								<thead>
								<tr className="bg-gray-light">
									<th className="w-[190px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px] text-text-light">
										Tên môn
									</th>
									{uniqueSemesters.map((semKey) => {
										const [grade, sem] = semKey.split('-');
										return (
											<th key={semKey} className="w-[100px] px-2 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.4px] text-text-light">
												HK{sem} L{grade}
											</th>
										);
									})}
									<th className="w-[120px] px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.4px] text-text-light">
										TB 6 HK
									</th>
								</tr>
								</thead>
								<tbody>
								{uniqueSubjectsHocBa.map((subject: any) => (
									<tr key={subject.id} className="border-t border-gray-mid">
										<td className="px-3 py-2.5">
											<div className="text-[13px] font-extrabold leading-snug text-text-dark">{subject.subjectName}</div>
										</td>
										{uniqueSemesters.map((semKey) => (
											<td key={`${subject.id}-${semKey}`} className="px-2 py-2.5">
												<input
													className={`${inputClass} px-2 py-2 text-center text-[13px]`}
													inputMode="decimal"
													max="10"
													min="0"
													onChange={(e) => handleHocBaChange(subject.id, semKey, e.target.value)}
													pattern="^[0-9]*[.,]?[0-9]{0,2}$"
													placeholder="0.00"
													step="0.01"
													type="text"
													value={localHocBa[subject.id]?.[semKey] ?? ''}
												/>
											</td>
										))}
										<td className="px-3 py-2.5">
											<input
												className="w-full rounded-lg border-1.5 border-gray-mid bg-gray-light px-2 py-2 text-center text-[13px] font-extrabold text-green-main outline-none"
												readOnly
												value={schoolAvg[subject.id] ?? ''}
											/>
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>

						<div className="flex justify-end gap-3">
							<button
								onClick={syncData}
								disabled={isSaving}
								className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light disabled:opacity-50"
								type="button"
							>
								Hủy
							</button>
							<button
								onClick={handleSave}
								disabled={isSaving}
								className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark disabled:opacity-50"
								type="button"
							>
								{isSaving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
								{isSaving ? 'Đang lưu...' : 'Lưu học bạ'}
							</button>
						</div>
					</div>
				)}

				{/* ======= TAB ĐIỂM THPT ======= */}
				{activeSource === 'thpt' && (
					<div className="space-y-5">
						<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
							{uniqueSubjectsThpt.map((subject: any) => (
								<label key={subject.id} className="flex flex-col gap-2 rounded-lg border-1.5 border-gray-mid bg-white p-3">
									<span className="min-h-[36px] text-[13px] font-extrabold leading-snug text-text-dark">{subject.subjectName}</span>
									<input
										className={`${inputClass} text-center`}
										inputMode="decimal"
										max="10"
										min="0"
										onChange={(e) => handleThptChange(subject.id, e.target.value)}
										pattern="^[0-9]*[.,]?[0-9]{0,2}$"
										placeholder="0.00"
										step="0.01"
										type="text"
										value={localThpt[subject.id] ?? ''}
									/>
								</label>
							))}
						</div>

						<div className="flex justify-end gap-3">
							<button
								onClick={syncData}
								disabled={isSaving}
								className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light disabled:opacity-50"
								type="button"
							>
								Hủy
							</button>
							<button
								onClick={handleSave}
								disabled={isSaving}
								className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark disabled:opacity-50"
								type="button"
							>
								{isSaving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
								{isSaving ? 'Đang lưu...' : 'Lưu điểm THPT'}
							</button>
						</div>
					</div>
				)}

				{/* ======= TAB ĐIỂM ĐGNL ======= */}
				{activeSource === 'dgnl' && (
					<div className="space-y-5">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<label className="flex flex-col gap-2 rounded-lg border-1.5 border-gray-mid bg-white p-4">
								<span className={labelClass}>Điểm ĐGNL</span>
								<input
									className={`${inputClass} text-center`}
									inputMode="decimal"
									max="1200"
									min="0"
									onChange={(e) => setLocalDgnl(normalizeNumericInput(e.target.value, 1200))}
									placeholder="0"
									type="text"
									value={localDgnl}
								/>
							</label>
						</div>

						<div className="flex justify-end gap-3">
							<button
								onClick={syncData}
								disabled={isSaving}
								className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light disabled:opacity-50"
								type="button"
							>
								Hủy
							</button>
							<button
								onClick={handleSave}
								disabled={isSaving}
								className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark disabled:opacity-50"
								type="button"
							>
								{isSaving ? <Loader2 className="animate-spin" size={17} /> : <Save size={17} />}
								{isSaving ? 'Đang lưu...' : 'Lưu điểm ĐGNL'}
							</button>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}