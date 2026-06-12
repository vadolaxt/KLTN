'use client';

import {useState} from 'react';
import {Save} from 'lucide-react';

type ScoreSource = 'hoc_ba' | 'thpt' | 'dgnl';

type Subject = {
	code: string;
	name: string;
};

type SemesterColumn = {
	key: string;
	label: string;
};

const scoreSources: Array<{ value: ScoreSource; label: string; description: string }> = [
	{value: 'hoc_ba', label: 'Học bạ', description: 'Điểm trung bình theo môn'},
	{value: 'thpt', label: 'THPT', description: 'Điểm thi tốt nghiệp'},
	{value: 'dgnl', label: 'ĐGNL', description: 'Điểm đánh giá năng lực'},
];

const graduationSubjects: Subject[] = [
	{code: 'TOAN', name: 'Toán'},
	{code: 'VAN', name: 'Ngữ văn'},
	{code: 'VAT_LI', name: 'Vật lí'},
	{code: 'HOA_HOC', name: 'Hóa học'},
	{code: 'SINH_HOC', name: 'Sinh học'},
	{code: 'LICH_SU', name: 'Lịch sử'},
	{code: 'DIA_LI', name: 'Địa lí'},
	{code: 'GDKT_PL', name: 'GDKTPL'},
	{code: 'TIN_HOC', name: 'Tin học'},
	{code: 'CN_CONG_NGHIEP', name: 'CN Công nghiệp'},
	{code: 'CN_NONG_NGHIEP', name: 'CN Nông nghiệp'},
	{code: 'NGOAI_NGU', name: 'Ngoại ngữ'},
];

const transcriptSemesters: SemesterColumn[] = [
	{key: 'g10s1', label: 'HK1 L10'},
	{key: 'g10s2', label: 'HK2 L10'},
	{key: 'g11s1', label: 'HK1 L11'},
	{key: 'g11s2', label: 'HK2 L11'},
	{key: 'g12s1', label: 'HK1 L12'},
	{key: 'g12s2', label: 'HK2 L12'},
];

const inputClass =
	'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3 py-2.5 text-[14px] font-bold text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]';

const labelClass = 'text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light';

const normalizeNumericInput = (value: string, max: number) => {
	const cleaned = value.replace(',', '.').replace(/[^\d.]/g, '');
	if (cleaned === '') {
		return '';
	}

	const [rawInteger, ...fractionPieces] = cleaned.split('.');
	const fraction = fractionPieces.join('').slice(0, 2);
	const hasTrailingDot = cleaned.endsWith('.') && fractionPieces.length === 1;
	const integer = rawInteger.replace(/^0+(?=\d)/, '') || '0';
	const normalized = hasTrailingDot ? `${integer}.` : fraction ? `${integer}.${fraction}` : integer;
	const parsed = Number(normalized);

	if (!Number.isFinite(parsed)) {
		return '';
	}

	if (parsed > max) {
		return max.toString();
	}

	return normalized;
};

const ScoreInput = ({max = 10, placeholder = '0.00'}: { max?: number; placeholder?: string }) => (
	<input
		className={`${inputClass} text-center`}
		inputMode="decimal"
		max={max}
		min="0"
		onChange={(event) => {
			event.currentTarget.value = normalizeNumericInput(event.currentTarget.value, max);
		}}
		pattern="^[0-9]*[.,]?[0-9]{0,2}$"
		placeholder={placeholder}
		step="0.01"
		type="text"
	/>
);

const createEmptyTranscriptScores = () =>
	Object.fromEntries(graduationSubjects.map((subject) => [subject.code, transcriptSemesters.map(() => '')])) as Record<string, string[]>;

const getTranscriptAverage = (scores: string[]) => {
	const hasAllScores = scores.length === transcriptSemesters.length && scores.every((score) => score.trim() !== '');
	const parsedScores = scores.map((score) => Number(score));
	const hasFullSixSemesters = hasAllScores && parsedScores.every((score) => Number.isFinite(score));

	if (!hasFullSixSemesters) {
		return '';
	}

	const average = parsedScores.reduce((total, score) => total + score, 0) / transcriptSemesters.length;
	return average.toFixed(2);
};

export default function AcademicScoresView() {
	const [activeSource, setActiveSource] = useState<ScoreSource>('hoc_ba');
	const [transcriptScores, setTranscriptScores] = useState<Record<string, string[]>>(createEmptyTranscriptScores);

	const updateTranscriptScore = (subjectCode: string, semesterIndex: number, value: string) => {
		const normalizedValue = normalizeNumericInput(value, 10);

		setTranscriptScores((current) => ({
			...current,
			[subjectCode]: current[subjectCode].map((score, index) => (index === semesterIndex ? normalizedValue : score)),
		}));
	};

	return (
		<div className="animate-fade-in">
			<div className="mb-1.5 text-[13px] font-bold uppercase tracking-[2px] text-green-main">Hồ sơ thí sinh</div>
			<div className="mb-7 border-l-5 border-gold pl-3.5 text-[22px] font-extrabold text-green-dark">Quản lý điểm</div>

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
				{activeSource === 'hoc_ba' && (
					<div className="space-y-5">
						<div className="overflow-x-auto rounded-lg border-1.5 border-gray-mid">
							<table className="w-full min-w-[940px] border-collapse bg-white">
								<thead>
								<tr className="bg-gray-light">
									<th className="w-[190px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px] text-text-light">Tên môn</th>
									{transcriptSemesters.map((semester) => (
										<th key={semester.key} className="w-[100px] px-2 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.4px] text-text-light">
											{semester.label}
										</th>
									))}
									<th className="w-[120px] px-3 py-3 text-center text-[11px] font-extrabold uppercase tracking-[0.4px] text-text-light">
										TB 6 HK
									</th>
								</tr>
								</thead>
								<tbody>
								{graduationSubjects.map((subject) => (
									<tr key={subject.code} className="border-t border-gray-mid">
										<td className="px-3 py-2.5">
											<div className="text-[13px] font-extrabold leading-snug text-text-dark">{subject.name}</div>
										</td>
										{transcriptSemesters.map((semester, semesterIndex) => (
											<td key={`${subject.code}-${semester.key}`} className="px-2 py-2.5">
												<input
													className={`${inputClass} px-2 py-2 text-center text-[13px]`}
													inputMode="decimal"
													max="10"
													min="0"
													onChange={(event) => updateTranscriptScore(subject.code, semesterIndex, event.target.value)}
													pattern="^[0-9]*[.,]?[0-9]{0,2}$"
													placeholder="0.00"
													step="0.01"
													type="text"
													value={transcriptScores[subject.code][semesterIndex]}
												/>
											</td>
										))}
										<td className="px-3 py-2.5">
											<input
												className="w-full rounded-lg border-1.5 border-gray-mid bg-gray-light px-2 py-2 text-center text-[13px] font-extrabold text-green-main outline-none"
												readOnly
												value={getTranscriptAverage(transcriptScores[subject.code])}
											/>
										</td>
									</tr>
								))}
								</tbody>
							</table>
						</div>

						<div className="flex justify-end gap-3">
							<button className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light" type="button">
								Hủy
							</button>
							<button className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark" type="button">
								<Save size={17}/>
								Lưu học bạ
							</button>
						</div>
					</div>
				)}

				{activeSource === 'thpt' && (
					<div className="space-y-5">
						<div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
							{graduationSubjects.map((subject) => (
								<label key={subject.code} className="flex flex-col gap-2 rounded-lg border-1.5 border-gray-mid bg-white p-3">
									<span className="min-h-[36px] text-[13px] font-extrabold leading-snug text-text-dark">{subject.name}</span>
									<ScoreInput/>
								</label>
							))}
						</div>

						<div className="flex justify-end gap-3">
							<button className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light" type="button">
								Hủy
							</button>
							<button className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark" type="button">
								<Save size={17}/>
								Lưu điểm THPT
							</button>
						</div>
					</div>
				)}

				{activeSource === 'dgnl' && (
					<div className="space-y-5">
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<label className="flex flex-col gap-2 rounded-lg border-1.5 border-gray-mid bg-white p-4">
								<span className={labelClass}>Điểm ĐGNL đợt 1</span>
								<ScoreInput max={1200} placeholder="0"/>
							</label>
							<label className="flex flex-col gap-2 rounded-lg border-1.5 border-gray-mid bg-white p-4">
								<span className={labelClass}>Điểm ĐGNL đợt 2</span>
								<ScoreInput max={1200} placeholder="0"/>
							</label>
						</div>

						<div className="flex justify-end gap-3">
							<button className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light" type="button">
								Hủy
							</button>
							<button className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark" type="button">
								<Save size={17}/>
								Lưu điểm ĐGNL
							</button>
						</div>
					</div>
				)}
			</section>
		</div>
	);
}
