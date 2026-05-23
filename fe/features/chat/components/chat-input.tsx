"use client";
import {useState} from "react";

export default function ChatInput({onSendMessage}: { onSendMessage: (msg: string) => void }) {
	const [input, setInput] = useState("");

	const handleSend = () => {
		if (!input.trim()) return;
		onSendMessage(input);
		setInput("");
	};

	return (
		<div className="p-6 bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
			<div className="max-w-4xl mx-auto flex items-end gap-3 bg-gray-50 border-2 border-gray-200 rounded-xl p-3 focus-within:border-green-600 focus-within:bg-white transition-all">
		<textarea
			value={input}
			onChange={(e) => setInput(e.target.value)}
			onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
			placeholder="Nhập câu hỏi của thí sinh..."
			className="flex-1 bg-transparent border-none outline-none resize-none text-sm py-1 max-h-32"
			rows={1}
		/>
				<button
					onClick={handleSend}
					className="bg-green-700 hover:bg-green-800 text-white p-3 rounded-lg transition-transform active:scale-95 shadow-lg"
				>
					<svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
						<path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
					</svg>
				</button>
			</div>
		</div>
	);
}