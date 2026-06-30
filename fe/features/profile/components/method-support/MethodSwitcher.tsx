import {ChevronLeft, ChevronRight} from 'lucide-react';

import {METHODS} from './constants';
import type {ScoreMethod} from '../score-support/types';

interface MethodSwitcherProps {
	activeMethod: ScoreMethod;
	methods?: typeof METHODS;
	onChange: (method: ScoreMethod) => void;
	onStep: (direction: -1 | 1) => void;
}

export default function MethodSwitcher({activeMethod, methods = METHODS, onChange, onStep}: MethodSwitcherProps) {
	if (methods.length === 0) {
		return null;
	}

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={() => onStep(-1)}
				className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-mid bg-white text-green-main transition-all hover:border-green-main hover:bg-green-pale hover:shadow-[0_8px_16px_rgba(45,122,45,0.12)]"
				aria-label="Phương thức trước"
			>
				<ChevronLeft size={18}/>
			</button>

			<div className="flex max-w-full gap-2 overflow-x-auto rounded-lg border border-gray-mid bg-gray-light p-1">
				{methods.map((method) => (
					<button
						key={method.value}
						type="button"
						onClick={() => onChange(method.value)}
						className={`whitespace-nowrap rounded-md px-4 py-2.5 text-[13px] font-extrabold transition-all ${
							activeMethod === method.value
								? 'bg-green-dark text-white shadow-[0_8px_16px_rgba(26,74,26,0.2)]'
								: 'bg-transparent text-text-mid hover:bg-white hover:text-green-main'
						}`}
					>
						{method.shortLabel}
					</button>
				))}
			</div>

			<button
				type="button"
				onClick={() => onStep(1)}
				className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-mid bg-white text-green-main transition-all hover:border-green-main hover:bg-green-pale hover:shadow-[0_8px_16px_rgba(45,122,45,0.12)]"
				aria-label="Phương thức tiếp theo"
			>
				<ChevronRight size={18}/>
			</button>
		</div>
	);
}
