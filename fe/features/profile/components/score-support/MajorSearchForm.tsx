import {FormEvent} from 'react';
import {Search, X} from 'lucide-react';

interface MajorSearchFormProps {
	draftQuery: string;
	onDraftQueryChange: (query: string) => void;
	onSearch: (event: FormEvent<HTMLFormElement>) => void;
	onClear: () => void;
}

export default function MajorSearchForm({
														 draftQuery,
														 onDraftQueryChange,
														 onSearch,
														 onClear,
													 }: MajorSearchFormProps) {
	return (
		// <form onSubmit={onSearch} className="mb-5 rounded-[12px] border-1.5 border-gray-mid bg-gray-light p-4">
		// 	<div className="flex flex-col gap-3 lg:flex-row">
		// 		<div className="relative flex-1">
		// 			<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-green-main" size={20}/>
		// 			<input
		// 				value={draftQuery}
		// 				onChange={(event) => onDraftQueryChange(event.target.value)}
		// 				placeholder="Tìm ngành học, mã ngành..."
		// 				className="w-full rounded-lg border-1.5 border-gray-mid bg-white py-3 pl-12 pr-12 text-[14px] font-semibold text-text-dark outline-none transition-all placeholder:font-medium placeholder:text-text-light hover:border-green-light focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]"
		// 			/>
		// 			{draftQuery && (
		// 				<button
		// 					type="button"
		// 					onClick={onClear}
		// 					className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-text-light transition-colors hover:bg-green-pale hover:text-green-main"
		// 					aria-label="Xóa tìm kiếm"
		// 				>
		// 					<X size={17}/>
		// 				</button>
		// 			)}
		// 		</div>
		// 		<button
		// 			type="submit"
		// 			className="rounded-lg bg-green-main px-5 py-3 text-[14px] font-extrabold text-white transition-all hover:bg-green-dark hover:shadow-[0_10px_20px_rgba(45,122,45,0.18)]"
		// 		>
		// 			Tìm kiếm ngành học
		// 		</button>
		// 	</div>
		// </form>
		<div></div>
	);
}
