'use client';

import {useEffect, useMemo, useState} from 'react';

import {useAdmissionMethodResults} from '@/hooks/use-admission-method-results';
import DgnlScoreCards from './DgnlScoreCards';
import {METHODS} from './constants';
import MethodCombinationTable from './MethodCombinationTable';
import MethodSwitcher from './MethodSwitcher';
import {SCORE_METHOD_TO_ADMISSION_METHOD, type ScoreMethod} from '../score-support/types';
import {ViewScoreResponse} from "@/types/scoreSupport";
import {ViewScoresService} from "@/service/view-score.api";

export default function MethodScoreSupportView() {
	const [activeMethod, setActiveMethod] = useState<ScoreMethod>('thpt');
	const {resultByMethod, isLoading, error} = useAdmissionMethodResults();
	const visibleMethods = useMemo(
		() => METHODS.filter((method) => resultByMethod[SCORE_METHOD_TO_ADMISSION_METHOD[method.value]]),
		[resultByMethod],
	);
	const displayMethod = visibleMethods.some((method) => method.value === activeMethod)
		? activeMethod
		: visibleMethods[0]?.value ?? activeMethod;
	const activeMethodIndex = visibleMethods.findIndex((method) => method.value === displayMethod);
	const currentMethod = visibleMethods[activeMethodIndex] ?? METHODS.find((method) => method.value === displayMethod) ?? METHODS[0];

	const goToMethod = (direction: -1 | 1) => {
		if (visibleMethods.length === 0) {
			return;
		}

		const nextIndex = (activeMethodIndex + direction + visibleMethods.length) % visibleMethods.length;
		setActiveMethod(visibleMethods[nextIndex].value);
	};

	const [scoreResponse, setScoreResponse] = useState<ViewScoreResponse>({
		schoolRecordMethodScore: [],
		nationalMethodScore: [],
		combineMethodScore: [],
		competencyMethod: {
			score: 0,
			convertScore: {},
		},
	});

	const [isScoreLoading, setIsScoreLoading] = useState(true);
	const [scoreError, setScoreError] = useState('');

	useEffect(() => {
		const fetchScores = async () => {
			try {
				setIsScoreLoading(true);
				setScoreError('');

				const response = await ViewScoresService.getUserScore();
				console.log(response);

				setScoreResponse(response.data);
			} catch (error) {
				console.error('Get user score failed:', error);
				setScoreError('Không thể tải dữ liệu điểm.');
			} finally {
				setIsScoreLoading(false);
			}
		};

		void fetchScores();
	}, []);

	return (
		<div className="mb-7 overflow-hidden rounded-[14px] border-1.5 border-gray-mid bg-white shadow-[0_16px_38px_rgba(26,74,26,0.08)]">
			<div className="p-5">
				{visibleMethods.length > 0 && (
					<div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
						<MethodSwitcher
							activeMethod={displayMethod}
							methods={visibleMethods}
							onChange={setActiveMethod}
							onStep={goToMethod}
						/>

						<div className="rounded-md border border-green-light/30 bg-green-pale px-4 py-3 text-[12px] font-bold leading-[1.65] text-green-dark lg:max-w-[500px]">
							{currentMethod.description}
						</div>
					</div>
				)}

				{displayMethod === 'dgnl' ? (
					<DgnlScoreCards
						score={scoreResponse.competencyMethod}
						isLoading={isScoreLoading}
						error={scoreError}
					/>
				) : displayMethod === 'hb' ? (
					<MethodCombinationTable
						activeMethod={displayMethod}
						combinations={scoreResponse.schoolRecordMethodScore}
						isLoading={isScoreLoading}
						error={scoreError}
					/>
				) : displayMethod === 'thpt' ? (
					<MethodCombinationTable
						activeMethod={displayMethod}
						combinations={scoreResponse.nationalMethodScore}
						isLoading={isScoreLoading}
						error={scoreError}
					/>
				) : displayMethod === 'kh' ? (
					<MethodCombinationTable
						activeMethod={displayMethod}
						combinations={scoreResponse.combineMethodScore}
						isLoading={isScoreLoading}
						error={scoreError}
					/>
				) : (
					<div className="rounded-lg border border-gray-mid px-4 py-8 text-center text-[13px] font-bold text-text-mid">
						Chưa có dữ liệu cho phương thức này.
					</div>
				)}
			</div>
		</div>
	);
}
