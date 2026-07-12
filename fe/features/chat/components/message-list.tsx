// "use client";
//
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import type { ChatMessage } from "@/types";
//
// export default function MessageList({messages}: { messages: ChatMessage[] }) {
// 	return (
// 		<div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4 bg-[#fafaf8]">
// 			{messages.map((msg, idx) => (
// 				<div
// 					key={idx}
// 					className={`flex gap-3 ${
// 						msg.role === "USER" ? "flex-row-reverse" : "flex-row"
// 					}`}
// 				>
// 					{/* Avatar */}
// 					<div
// 						className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
// 							msg.role === "USER"
// 								? "bg-blue-600"
// 								: "bg-green-700 border-2 border-yellow-500"
// 						}`}
// 					>
// 						{msg.role === "USER" ? "U" : "🤖"}
// 					</div>
//
// 					{/* Bubble Chat */}
// 					<div
// 						className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
// 							msg.role === "USER"
// 								? "bg-green-700 text-white rounded-br-none"
// 								: "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
// 						}`}
// 					>
// 						{msg.role === "USER" ? (
// 							// Tin nhắn User thường là văn bản thuần túy
// 							<p className="whitespace-pre-wrap">{msg.content}</p>
// 						) : (
// 							<div className="prose prose-sm max-w-none
// 							prose-p:leading-relaxed prose-p:my-1
// 							prose-headings:text-green-900 prose-headings:font-bold
// 							prose-strong:text-green-800 prose-ul:list-disc prose-ul:ml-4">
// 								<ReactMarkdown
// 									remarkPlugins={[remarkGfm]}>
//
// 									{msg.content}
// 								</ReactMarkdown>
// 							</div>
// 						)}
//
// 						{/* Timestamp giả lập nếu cần */}
// 						<p className={`text-[10px] mt-2 opacity-50 ${msg.role === "USER" ? "text-right" : "text-left"}`}>
// 							{new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
// 						</p>
// 					</div>
// 				</div>
// 			))}
// 		</div>
// 	)
// 		;
// }

"use client";

import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { ChatMessage } from "@/types";

interface MessageListProps {
	messages: ChatMessage[];
	isTyping?: boolean;
}

export default function MessageList({
													messages,
													isTyping = false,
												}: MessageListProps) {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({
			behavior: "smooth",
		});
	}, [messages, isTyping]);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#fafaf8] p-4">
			{messages.map((message, index) => {
				const isUser = message.role === "USER";

				return (
					<div
						key={`${message.role}-${index}`}
						className={`flex gap-2.5 ${
							isUser ? "flex-row-reverse" : "flex-row"
						}`}
					>
						{/* Avatar */}
						<div
							className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-white shadow-sm ${
								isUser
									? "bg-blue-600"
									: "border-2 border-yellow-500 bg-green-700"
							}`}
						>
							{isUser ? "" : ""}
						</div>

						{/* Nội dung tin nhắn */}
						<div
							className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
								isUser
									? "rounded-br-sm bg-green-700 text-white"
									: "rounded-bl-sm border border-gray-200 bg-white text-gray-800"
							}`}
						>
							{isUser ? (
								<p className="whitespace-pre-wrap break-words">
									{message.content}
								</p>
							) : (
								<div
									className="
                    prose
                    prose-sm
                    max-w-none
                    break-words
                    prose-headings:font-bold
                    prose-headings:text-green-900
                    prose-p:my-1
                    prose-p:leading-relaxed
                    prose-strong:text-green-800
                    prose-ul:ml-4
                    prose-ul:list-disc
                  "
								>
									<ReactMarkdown remarkPlugins={[remarkGfm]}>
										{message.content}
									</ReactMarkdown>
								</div>
							)}
						</div>
					</div>
				);
			})}

			{/* Hiệu ứng chatbot đang nhập */}
			{isTyping && (
				<div className="flex items-center gap-2.5">
					<div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
						<div
							className="flex gap-1"
							aria-label="Chatbot đang trả lời"
						>
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
							<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
						</div>
					</div>
				</div>
			)}

			{/* Vị trí dùng để tự động cuộn */}
			<div ref={bottomRef} />
		</div>
	);
}