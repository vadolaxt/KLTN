import type {CompetencyScore} from '@/types/scoreSupport';

interface DgnlScoreCardsProps {
	score?: CompetencyScore;
	isLoading?: boolean;
	error?: string;
}

const formatScore = (value: number | undefined | null) => {
	if (value === undefined || value === null || Number.isNaN(value)) {
		return '-';
	}

	return value.toFixed(2).replace(/\.?0+$/, '');
};

export default function DgnlScoreCards({
														score,
														isLoading = false,
														error = '',
													}: DgnlScoreCardsProps) {
	const convertedScores = Object.entries(score?.convertScore ?? {});

	if (isLoading) {
		return (
			<div className="rounded-[10px] border-1.5 border-gray-mid bg-gray-light p-5 text-[13px] font-bold text-text-mid">
				Đang tải...
			</div>
		);
	}

	if (error) {
		return (
			<div className="rounded-[10px] border-1.5 border-red-200 bg-red-50 p-5 text-[13px] font-bold text-red-600">
				{error}
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div className="group rounded-[10px] border-1.5 border-gray-mid bg-gray-light p-5 transition-all hover:-translate-y-0.5 hover:border-green-light hover:bg-white hover:shadow-[0_14px_28px_rgba(45,122,45,0.1)]">
					<div className="text-[12px] font-extrabold uppercase tracking-[0.9px] text-text-light transition-colors group-hover:text-green-main">
						Điểm ĐGNL
					</div>

					<div className="mt-4 flex h-14 items-center rounded-lg border border-dashed border-gray-mid bg-white px-4 text-[24px] font-black text-text-light transition-colors group-hover:border-green-light group-hover:text-green-main">
						{formatScore(score?.score)}
					</div>
				</div>

				{/*<div className="group rounded-[10px] border-1.5 border-gray-mid bg-gray-light p-5 transition-all hover:-translate-y-0.5 hover:border-green-light hover:bg-white hover:shadow-[0_14px_28px_rgba(45,122,45,0.1)]">*/}
				{/*	<div className="text-[12px] font-extrabold uppercase tracking-[0.9px] text-text-light transition-colors group-hover:text-green-main">*/}
				{/*		Số tổ hợp quy đổi*/}
				{/*	</div>*/}

				{/*	<div className="mt-4 flex h-14 items-center rounded-lg border border-dashed border-gray-mid bg-white px-4 text-[24px] font-black text-text-light transition-colors group-hover:border-green-light group-hover:text-green-main">*/}
				{/*		{convertedScores.length}*/}
				{/*	</div>*/}
				{/*</div>*/}
			</div>

			<div className="overflow-hidden rounded-[12px] border-1.5 border-gray-mid bg-white">
				<div className="bg-green-dark px-4 py-3 text-[12px] font-extrabold uppercase tracking-[0.6px] text-white">
					Điểm quy đổi theo tổ hợp
				</div>

				<div className="overflow-x-auto">
					<table className="w-full min-w-[520px] border-collapse">
						<thead>
						<tr className="bg-green-pale text-green-dark">
							<th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
								Tổ hợp
							</th>
							<th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px]">
								Điểm quy đổi
							</th>
						</tr>
						</thead>

						<tbody>
						{convertedScores.length > 0 ? (
							convertedScores.map(([combination, convertedScore]) => (
								<tr
									key={combination}
									className="border-t border-gray-mid text-[13px] font-bold text-text-mid"
								>
									<td className="px-4 py-3 text-green-dark">
										{combination}
									</td>
									<td className="px-4 py-3">
										{formatScore(convertedScore)}
									</td>
								</tr>
							))
						) : (
							<tr className="border-t border-gray-mid text-[13px] font-bold text-text-mid">
								<td className="px-4 py-4 text-center text-text-light" colSpan={2}>
									Chưa có điểm quy đổi.
								</td>
							</tr>
						)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}