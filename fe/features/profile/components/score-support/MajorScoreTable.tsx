'use client';

import {Fragment, useEffect, useState} from 'react';

import type {MajorScore, MethodScore} from '@/types/scoreSupport';
import EmptyScoreCell from './EmptyScoreCell';
import MajorMethodEvaluationPanel from './MajorMethodEvaluationPanel';
import {ViewScoresService} from "@/service/view-score.api";

interface MajorScoreTableProps {
	rows?: MajorScore[];
	isLoading?: boolean;
	error?: string;
	selectedMajorCode?: string;
	onSelectMajor?: (majorCode: string) => void;
}

const METHOD_LABEL_BY_TYPE: Record<string, string> = {
	SCHOOL_RECORD: 'Học bạ',
	NATIONAL: 'THPT',
	COMBINE: 'Kết hợp',
	COMPETENCY: 'ĐGNL',
};

const formatScore = (score: number | null | undefined) =>
	score === null || score === undefined ? null : score.toFixed(2).replace(/\.00$/, '');

const getMethodLabel = (type: string | null | undefined) => {
	if (!type) {
		return '-';
	}

	return METHOD_LABEL_BY_TYPE[type] ?? type;
};

const getCombinationLabel = (methodScore?: MethodScore) => {
	if (!methodScore) {
		return null;
	}

	if (methodScore.combination) {
		return methodScore.combination;
	}

	return methodScore.type === 'COMPETENCY' ? 'ĐGNL' : null;
};

const extractMajorScores = (response: unknown): MajorScore[] => {
	const directResponse = response as {majorScores?: MajorScore[]};
	if (Array.isArray(directResponse.majorScores)) {
		return directResponse.majorScores;
	}

	const apiResponse = response as {data?: {majorScores?: MajorScore[]}};
	if (Array.isArray(apiResponse.data?.majorScores)) {
		return apiResponse.data.majorScores;
	}

	return [];
};

export default function MajorScoreTable({
														 rows,
														 isLoading = false,
														 error = '',
														 selectedMajorCode,
														 onSelectMajor,
													 }: MajorScoreTableProps) {
	const [majorScores, setMajorScores] = useState<MajorScore[]>([]);
	const [isFetchingMajorScores, setIsFetchingMajorScores] = useState(false);
	const [fetchError, setFetchError] = useState('');
	const [internalSelectedMajorCode, setInternalSelectedMajorCode] = useState('');

	const shouldFetchMajorScores = rows === undefined;
	const tableRows = rows ?? majorScores;
	const currentSelectedMajorCode = selectedMajorCode ?? internalSelectedMajorCode;
	const tableIsLoading = isLoading || (shouldFetchMajorScores && isFetchingMajorScores);
	const tableError = error || (shouldFetchMajorScores ? fetchError : '');

	useEffect(() => {
		if (!shouldFetchMajorScores) {
			return;
		}

		let isMounted = true;

		const fetchMajorScores = async () => {
			try {
				setIsFetchingMajorScores(true);
				setFetchError('');

				const response = await ViewScoresService.getMajorScore();
				console.log(response);
				const nextMajorScores = extractMajorScores(response);

				if (isMounted) {
					setMajorScores(nextMajorScores);
				}
			} catch {
				if (isMounted) {
					setMajorScores([]);
					setFetchError('Không thể tải dữ liệu điểm ngành.');
				}
			} finally {
				if (isMounted) {
					setIsFetchingMajorScores(false);
				}
			}
		};

		void fetchMajorScores();

		return () => {
			isMounted = false;
		};
	}, [shouldFetchMajorScores]);

	const handleSelectMajor = (majorCode: string) => {
		const nextMajorCode = currentSelectedMajorCode === majorCode ? '' : majorCode;

		if (selectedMajorCode === undefined) {
			setInternalSelectedMajorCode(nextMajorCode);
		}

		onSelectMajor?.(nextMajorCode);
	};

	return (
		<div className="overflow-hidden rounded-[12px] border-1.5 border-gray-mid bg-white">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[820px] border-collapse">
					<thead>
					<tr className="bg-green-dark text-white">
						<th className="w-[104px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Mã ngành
						</th>
						<th className="min-w-[240px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Tên ngành
						</th>
						<th className="w-[120px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							PTXT
						</th>
						<th className="w-[120px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Mã tổ hợp
						</th>
						<th className="w-[120px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Điểm gốc
						</th>
						<th className="w-[130px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Điểm ưu tiên
						</th>
						<th className="w-[130px] px-3 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Điểm xét tuyển
						</th>
					</tr>
					</thead>
					<tbody>
					{tableIsLoading && (
						<tr>
							<td colSpan={7} className="px-6 py-10 text-center text-[13px] font-bold text-text-mid">
								Đang tải dữ liệu...
							</td>
						</tr>
					)}

					{!tableIsLoading && tableError && (
						<tr>
							<td colSpan={7} className="px-6 py-10 text-center text-[13px] font-bold text-red-600">
								{tableError}
							</td>
						</tr>
					)}

					{!tableIsLoading &&
						!tableError &&
						tableRows.map((row) => {
							const defaultMethodScore = row.scores?.[0];
							const remainingMethodScores = row.scores?.slice(1) ?? [];
							const combinationLabel = getCombinationLabel(defaultMethodScore);
							const isSelected = currentSelectedMajorCode === row.majorCode;

							return (
								<Fragment key={row.majorCode}>
									<tr
										onClick={() => handleSelectMajor(row.majorCode)}
										className={`group border-b border-gray-mid transition-all hover:bg-green-pale/55 ${
											isSelected ? 'bg-green-pale/60' : ''
										} cursor-pointer`}
									>
										<td className="px-3 py-3 text-[13px] font-black text-green-dark">{row.majorCode}</td>
										<td className="px-3 py-3 text-[13px] font-extrabold leading-[1.5] text-text-dark">
											{row.majorName}
										</td>
										<td className="px-3 py-3 text-[13px] font-bold text-text-mid">
											{defaultMethodScore ? getMethodLabel(defaultMethodScore.type) : <EmptyScoreCell label="Chưa có"/>}
										</td>
										<td className="px-3 py-3">
											{combinationLabel ? (
												<span className="inline-flex rounded-md bg-green-pale px-2.5 py-1 text-[12px] font-black text-green-dark transition-colors group-hover:bg-green-main group-hover:text-white">
													{combinationLabel}
												</span>
											) : (
												<EmptyScoreCell label="-"/>
											)}
										</td>
										<td className="px-3 py-3 text-[13px] font-semibold text-text-mid">
											{formatScore(defaultMethodScore?.rawScore) ?? <EmptyScoreCell label="Chưa có"/>}
										</td>
										<td className="px-3 py-3 text-[15px] font-black text-green-dark">
											{formatScore(defaultMethodScore?.priorityScore) ?? <EmptyScoreCell label="0"/>}
										</td>
										<td className="px-3 py-3 text-[15px] font-black text-green-dark">
											{formatScore(defaultMethodScore?.convertedScore) ?? <EmptyScoreCell label="Chưa có"/>}
										</td>
									</tr>

									{isSelected && (
										<tr className="border-b border-gray-mid bg-gray-light/60">
											<td colSpan={7} className="px-3 py-3">
												<div className="animate-fade-in">
													<MajorMethodEvaluationPanel major={row} methodScores={remainingMethodScores} embedded/>
												</div>
											</td>
										</tr>
									)}
								</Fragment>
							);
						})}
					</tbody>
				</table>
			</div>

			{!tableIsLoading && !tableError && tableRows.length === 0 && (
				<div className="px-6 py-10 text-center">
					<div className="text-[16px] font-extrabold text-green-dark">Không tìm thấy ngành phù hợp</div>
					<p className="mt-2 text-[13px] text-text-mid">Thử tìm bằng mã ngành hoặc tên ngành khác.</p>
				</div>
			)}
		</div>
	);
}
