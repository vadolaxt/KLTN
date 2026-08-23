'use client';

import type {FormEvent} from 'react';
import {useEffect, useMemo, useState} from 'react';

import type {MajorScore} from '@/types/scoreSupport';
import MajorScoreTable from './MajorScoreTable';
import MajorSearchForm from './MajorSearchForm';
import {ViewScoresService} from "@/service/view-score.api";

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

const normalizeSearchText = (value: string) => value.trim().toLowerCase();

export default function MajorScoreSupportView() {
	const [selectedMajorCode, setSelectedMajorCode] = useState('');
	const [draftKeyword, setDraftKeyword] = useState('');
	const [searchKeyword, setSearchKeyword] = useState('');
	const [majorScores, setMajorScores] = useState<MajorScore[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		let isMounted = true;

		const fetchMajorScores = async () => {
			try {
				setIsLoading(true);
				setError('');

				const response = await ViewScoresService.getMajorScore();
				console.log(response);

				const nextMajorScores = extractMajorScores(response);

				if (isMounted) {
					setMajorScores(nextMajorScores);
				}
			} catch {
				if (isMounted) {
					setMajorScores([]);
					setError('Không thể tải dữ liệu điểm ngành.');
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		void fetchMajorScores();

		return () => {
			isMounted = false;
		};
	}, []);

	const filteredRows = useMemo(() => {
		const keyword = normalizeSearchText(searchKeyword);

		if (!keyword) {
			return majorScores;
		}

		return majorScores.filter((majorScore) => {
			const majorCode = normalizeSearchText(majorScore.majorCode);
			const majorName = normalizeSearchText(majorScore.majorName);

			return majorCode.includes(keyword) || majorName.includes(keyword);
		});
	}, [majorScores, searchKeyword]);

	const handleMajorSearch = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSelectedMajorCode('');
		setSearchKeyword(draftKeyword.trim());
	};

	const handleClearSearch = () => {
		setSelectedMajorCode('');
		setDraftKeyword('');
		setSearchKeyword('');
	};

	return (
		<div className="p-5">
			<MajorSearchForm
				draftQuery={draftKeyword}
				onDraftQueryChange={setDraftKeyword}
				onSearch={handleMajorSearch}
				onClear={handleClearSearch}
			/>
			<div className="mb-4 flex justify-end">
				<div className="rounded-lg border border-green-light/30 bg-green-pale px-4 py-3 text-right text-[12px] font-bold leading-[1.6] text-green-dark">
					Lưu ý: Các ngành được sắp xếp dựa theo xác suất trúng tuyển.
				</div>
			</div>
			<MajorScoreTable
				rows={filteredRows}
				isLoading={isLoading}
				error={error}
				selectedMajorCode={selectedMajorCode}
				onSelectMajor={setSelectedMajorCode}
			/>
		</div>
	);
}
