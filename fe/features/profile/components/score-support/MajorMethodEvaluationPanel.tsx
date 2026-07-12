import {useEffect, useMemo, useState} from 'react';

import type {MajorScore, MethodScore} from '@/types/scoreSupport';
import {apiClient} from '@/lib/constants/api-client';
import PredictionProbabilityCard from '../../../prediction/components/PredictionProbabilityCard';
import EmptyScoreCell from './EmptyScoreCell';

interface MajorMethodEvaluationPanelProps {
	major?: MajorScore;
	methodScores?: MethodScore[];
	embedded?: boolean;
}

const METHOD_ORDER = ['SCHOOL_RECORD', 'NATIONAL', 'COMBINE', 'COMPETENCY'];
const TARGET_YEAR = 2026;

const METHOD_TO_ADMISSION_METHOD: Record<string, string> = {
	SCHOOL_RECORD: 'hb',
	NATIONAL: 'thpt',
	COMBINE: 'kh',
	COMPETENCY: 'dgnl',
};

const METHOD_LABEL_BY_TYPE: Record<string, string> = {
	SCHOOL_RECORD: 'Học bạ',
	NATIONAL: 'THPT',
	COMBINE: 'Kết hợp',
	COMPETENCY: 'ĐGNL',
};

const formatNumber = (value: number | null | undefined) => {
	if (value === null || value === undefined) {
		return null;
	}

	return value.toLocaleString('vi-VN', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const getMethodLabel = (type: string | null | undefined) => {
	if (!type) {
		return '-';
	}

	return METHOD_LABEL_BY_TYPE[type] ?? type;
};

const getCombinationLabel = (methodScore: MethodScore) => {
	if (methodScore.combination) {
		return methodScore.combination;
	}

	return methodScore.type === 'COMPETENCY' ? 'Không có tổ hợp' : '-';
};

interface ApiResponse<T> {
	data: T;
	message: string;
	status: string;
}

interface PredictResponse {
	result: {
		admission_probability: number;
		predicted_cutoff: number;
		margin: number;
		student_score: number;
	};
}

interface MethodPrediction {
	probability: number | null;
	predictedCutoff: number | null;
	margin: number | null;
	studentScore: number | null;
	isLoading: boolean;
	error: string;
}

const buildPredictionKey = (methodScore: MethodScore) =>
	`${methodScore.type}-${methodScore.combination || 'NONE'}`;

const createPendingPrediction = (): MethodPrediction => ({
	probability: null,
	predictedCutoff: null,
	margin: null,
	studentScore: null,
	isLoading: true,
	error: '',
});

const canPredictMethodScore = (methodScore: MethodScore) =>
	Boolean(methodScore.combination) &&
	Boolean(METHOD_TO_ADMISSION_METHOD[methodScore.type]) &&
	Number.isFinite(methodScore.convertedScore) &&
	methodScore.convertedScore > 0;

const sortMethodScores = (methodScores: MethodScore[]) =>
	[...methodScores].sort((current, next) => {
		const currentOrder = METHOD_ORDER.indexOf(current.type);
		const nextOrder = METHOD_ORDER.indexOf(next.type);

		return (currentOrder === -1 ? Number.MAX_SAFE_INTEGER : currentOrder) -
			(nextOrder === -1 ? Number.MAX_SAFE_INTEGER : nextOrder);
	});

export default function MajorMethodEvaluationPanel({
																		major,
																		methodScores,
																		embedded = false,
																	}: MajorMethodEvaluationPanelProps) {
	const majorCode = major?.majorCode;
	const allMethodScores = useMemo(
		() => sortMethodScores(major?.scores && major.scores.length > 0 ? major.scores : methodScores ?? []),
		[major, methodScores],
	);
	const [predictions, setPredictions] = useState<Record<string, MethodPrediction>>({});
	// const defaultMethodScore = major?.scores?.[0] ?? allMethodScores[0];
	const defaultMethodScore = useMemo(() => {
		if (!allMethodScores || allMethodScores.length === 0) return undefined;
		return allMethodScores.reduce((max, current) =>
			current.convertedScore > max.convertedScore ? current : max
		);
	}, [allMethodScores]);
	const defaultScore = formatNumber(defaultMethodScore?.convertedScore) ?? '-';

	useEffect(() => {
		let isMounted = true;

		const fetchPredictions = async () => {
			if (!majorCode) {
				setPredictions({});
				return;
			}

			const predictables = allMethodScores.filter(canPredictMethodScore);

			if (predictables.length === 0) {
				setPredictions({});
				return;
			}

			const nextInitialPredictions = predictables.reduce<Record<string, MethodPrediction>>((result, methodScore) => {
				result[buildPredictionKey(methodScore)] = createPendingPrediction();
				return result;
			}, {});

			setPredictions(nextInitialPredictions);

			await Promise.all(
				predictables.map(async (methodScore) => {
					const key = buildPredictionKey(methodScore);

					try {
						const response = await apiClient.post<ApiResponse<PredictResponse>>('/predict', {
							schoolCode: 'NLU',
							admissionMethod: METHOD_TO_ADMISSION_METHOD[methodScore.type],
							majorCode,
							subjectCombination: methodScore.combination,
							targetYear: TARGET_YEAR,
							scores: [
								{
									score: methodScore.convertedScore,
								},
							],
						});

						const result = response.data.data.result;

						if (!isMounted) {
							return;
						}

						setPredictions((current) => ({
							...current,
							[key]: {
								probability: result.admission_probability,
								predictedCutoff: result.predicted_cutoff,
								margin: result.margin,
								studentScore: result.student_score,
								isLoading: false,
								error: '',
							},
						}));
					} catch {
						if (!isMounted) {
							return;
						}

						setPredictions((current) => ({
							...current,
							[key]: {
								probability: null,
								predictedCutoff: null,
								margin: null,
								studentScore: null,
								isLoading: false,
								error: 'Không thể dự đoán',
							},
						}));
					}
				}),
			);
		};

		void fetchPredictions();

		return () => {
			isMounted = false;
		};
	}, [allMethodScores, majorCode]);

	const bestPrediction = useMemo(() => {
		return Object.values(predictions)
			.filter((prediction) => prediction.probability !== null && prediction.probability !== undefined)
			.sort((current, next) => (next.probability ?? 0) - (current.probability ?? 0))[0];
	}, [predictions]);

	const probability = bestPrediction?.probability ?? null;

	if (!major) {
		return null;
	}

	return (
		<div
			className={`${embedded ? 'mb-0' : 'mb-5'} overflow-hidden rounded-[12px] border-1.5 border-green-light/50 bg-white shadow-[0_16px_34px_rgba(26,74,26,0.1)]`}
		>
			<div className="border-b border-green-light/30 bg-green-pale px-4 py-4">
				<div className="flex flex-col gap-3">
					<div>
						<div className="text-[12px] font-black uppercase tracking-[0.8px] text-green-main">
							Tất cả phương thức xét tuyển
						</div>
						<div className="mt-1 text-[18px] font-black leading-[1.35] text-green-dark">{major.majorName}</div>
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-[680px] border-collapse">
					<thead>
					<tr className="border-b border-gray-mid bg-white text-text-dark">
						<th className="w-[180px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Phương thức
						</th>
						<th className="w-[180px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Mã tổ hợp
						</th>
						<th className="w-[160px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Điểm gốc
						</th>
						<th className="w-[160px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Điểm quy đổi
						</th>
						<th className="w-[180px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Xác suất trúng tuyển
						</th>
					</tr>
					</thead>
					<tbody>
					{allMethodScores.length === 0 && (
						<tr>
							<td colSpan={5} className="px-4 py-6 text-center text-[13px] font-bold text-text-mid">
								Chưa có phương thức xét tuyển.
							</td>
						</tr>
					)}

					{allMethodScores.map((methodScore, index) => {
						const prediction = predictions[buildPredictionKey(methodScore)];
						const predictionLabel = prediction?.probability === null || prediction?.probability === undefined
							? null
							: `${prediction.probability.toFixed(0)}%`;

						return (
						<tr key={`${methodScore.type}-${methodScore.combination ?? 'none'}-${index}`} className="border-b border-gray-mid transition-colors hover:bg-green-pale/35">
							<td className="px-4 py-3">
								<div className="flex flex-wrap items-center gap-2">
									<span className="text-[13px] font-extrabold text-text-dark">{getMethodLabel(methodScore.type)}</span>
								</div>
							</td>
							<td className="px-4 py-3 text-[13px] font-semibold text-text-mid">
								{getCombinationLabel(methodScore)}
							</td>
							<td className="px-4 py-3 text-[13px] font-semibold text-text-mid">
								{formatNumber(methodScore.rawScore) ?? <EmptyScoreCell label="Thiếu điểm"/>}
							</td>
							<td className="px-4 py-3 text-left text-[15px] font-black text-green-dark">
								{formatNumber(methodScore.convertedScore) ?? <EmptyScoreCell label="-"/>}
							</td>
							<td className="px-4 py-3">
								{prediction?.isLoading ? (
									<span className="text-[12px] font-bold text-text-light">Đang dự đoán...</span>
								) : prediction?.error ? (
									<EmptyScoreCell label={prediction.error}/>
								) : predictionLabel ? (
									<div>
										<div className="text-[16px] font-black text-green-dark">{predictionLabel}</div>
										<div className="mt-0.5 text-[11px] font-semibold text-text-light">
											Chuẩn dự kiến: {formatNumber(prediction.predictedCutoff) ?? '-'}
										</div>
									</div>
								) : (
									<EmptyScoreCell label="Chưa đủ dữ liệu"/>
								)}
							</td>
						</tr>
						);
					})}
					</tbody>
				</table>
			</div>

			<div className="m-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_240px]">
				<div className="rounded-[14px] border-1.5 border-green-light/35 bg-green-pale px-5 py-4">
					<div className="text-[11px] font-black uppercase tracking-[0.7px] text-green-main">Điểm cao nhất</div>
					<div className="mt-3 grid gap-3 sm:grid-cols-2">
						<div>
							<div className="text-[12px] font-extrabold text-text-light">Phương thức</div>
							<div className="mt-1 text-[20px] font-black text-green-dark">
								{defaultMethodScore ? getMethodLabel(defaultMethodScore.type) : '-'}
							</div>
						</div>
						<div>
							<div className="text-[12px] font-extrabold text-text-light">Điểm quy đổi</div>
							<div className="mt-1 text-[28px] font-black leading-none text-green-dark">{defaultScore}</div>
						</div>
					</div>
				</div>
				<PredictionProbabilityCard
					probability={probability}
					majorName={major.majorName}
					hasResult={probability !== null && probability !== undefined}
					title="Xác suất"
					subtitle="Tính theo điểm quy đổi tốt nhất"
					compact
					mini
				/>
			</div>
		</div>
	);
}
