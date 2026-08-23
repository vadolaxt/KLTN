import type {CombinationScore} from '@/types/scoreSupport';
import EmptyScoreCell from '../score-support/EmptyScoreCell';
import type {ScoreMethod} from '../score-support/types';

interface MethodCombinationTableProps {
	activeMethod: ScoreMethod;
	combinations?: CombinationScore[];
	isLoading?: boolean;
	error?: string;
}

const formatScore = (score: number) =>
	score.toFixed(2).replace(/\.00$/, '');

export default function MethodCombinationTable({
																  activeMethod,
																  combinations = [],
																  isLoading = false,
																  error = '',
															  }: MethodCombinationTableProps) {
	const columnCount = 5;

	return (
		<div className="overflow-hidden rounded-[12px] border-1.5 border-gray-mid bg-white">
			<div className="overflow-x-auto">
				<table className="w-full min-w-[900px] border-collapse">
					<thead>
					<tr className="bg-green-dark text-white">
						<th className="w-[130px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Mã tổ hợp
						</th>

						<th className="min-w-[310px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Các môn trong tổ hợp
						</th>

						{/*{isCombinedMethod && (*/}
						{/*	<th className="min-w-[220px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">*/}
						{/*		Môn lấy điểm học bạ*/}
						{/*	</th>*/}
						{/*)}*/}

						<th className="w-[170px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Tổng điểm
						</th>

						<th className="w-[150px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Điểm ưu tiên
						</th>
						<th className="w-[180px] px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
							Điểm xét tuyển
						</th>
					</tr>
					</thead>

					<tbody>
					{isLoading && (
						<tr>
							<td
								colSpan={columnCount}
								className="px-4 py-8 text-center text-[13px] font-bold text-text-mid"
							>
								Đang tải dữ liệu...
							</td>
						</tr>
					)}

					{!isLoading && error && (
						<tr>
							<td
								colSpan={columnCount}
								className="px-4 py-8 text-center text-[13px] font-bold text-red-600"
							>
								{error}
							</td>
						</tr>
					)}

					{!isLoading && !error && combinations.length === 0 && (
						<tr>
							<td
								colSpan={columnCount}
								className="px-4 py-8 text-center text-[13px] font-bold text-text-mid"
							>
								Chưa có dữ liệu điểm cho phương thức này.
							</td>
						</tr>
					)}

					{!isLoading &&
						!error &&
						combinations.map((combination) => (
							<tr
								key={`${activeMethod}-${combination.combination}`}
								className="group border-b border-gray-mid transition-all hover:bg-green-pale/55"
							>
								<td className="px-4 py-3">
										<span className="inline-flex rounded-md bg-green-pale px-2.5 py-1 text-[13px] font-black text-green-dark transition-colors group-hover:bg-green-main group-hover:text-white">
											{combination.combination}
										</span>
								</td>

								<td className="px-4 py-3 text-[13px] font-semibold leading-[1.55] text-text-mid">
									{combination.subjectList.length > 0
										? combination.subjectList.join(', ')
										: '-'}
								</td>

								{/*{isCombinedMethod && (*/}
								{/*	<td className="px-4 py-3 text-[13px] font-semibold leading-[1.55] text-text-mid">*/}
								{/*		{combination.replacedSubject ? (*/}
								{/*			<span className="inline-flex rounded-md bg-green-pale px-2.5 py-1 text-[13px] font-bold text-green-dark">*/}
								{/*					{combination.replacedSubject}*/}
								{/*				</span>*/}
								{/*		) : (*/}
								{/*			<p></p>*/}
								{/*		)}*/}
								{/*	</td>*/}
								{/*)}*/}

								<td className="px-4 py-3 text-[14px] font-black text-green-dark">
									{combination.complete === false ? (
										<EmptyScoreCell label={`Thiếu ${combination.missingSubjects?.length ?? 0} môn`}/>
									) : combination.score > 0 ? (
										formatScore(combination.score)
									) : (
										<EmptyScoreCell label="Chưa có điểm"/>
									)}
								</td>

								<td className="px-4 py-3 text-[14px] font-black text-green-main">
									{combination.complete === false ? '-' : formatScore(combination.priorityScore ?? 0)}
								</td>
								<td className="px-4 py-3 text-[14px] font-black text-green-dark">
									{combination.convertScore > 0 ? formatScore(combination.convertScore) : (
										<EmptyScoreCell label={combination.complete === false ? 'Chưa đủ điểm' : 'Ngoài khung quy đổi'}/>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
