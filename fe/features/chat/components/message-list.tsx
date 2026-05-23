"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessage } from "@/types";

export default function MessageList({messages}: { messages: ChatMessage[] }) {
	return (
		<div className="flex-1 overflow-y-auto p-8 flex flex-col gap-4 bg-[#fafaf8]">
			{messages.map((msg, idx) => (
				<div
					key={idx}
					className={`flex gap-3 ${
						msg.role === "USER" ? "flex-row-reverse" : "flex-row"
					}`}
				>
					{/* Avatar */}
					<div
						className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 shadow-sm ${
							msg.role === "USER"
								? "bg-blue-600"
								: "bg-green-700 border-2 border-yellow-500"
						}`}
					>
						{msg.role === "USER" ? "U" : "🤖"}
					</div>

					{/* Bubble Chat */}
					<div
						className={`max-w-[80%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
							msg.role === "USER"
								? "bg-green-700 text-white rounded-br-none"
								: "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
						}`}
					>
						{msg.role === "USER" ? (
							// Tin nhắn User thường là văn bản thuần túy
							<p className="whitespace-pre-wrap">{msg.content}</p>
						) : (
							<div className="prose prose-sm max-w-none
							prose-p:leading-relaxed prose-p:my-1
							prose-headings:text-green-900 prose-headings:font-bold
							prose-strong:text-green-800 prose-ul:list-disc prose-ul:ml-4">
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}>

									{msg.content}
								</ReactMarkdown>
							</div>
						)}

						{/* Timestamp giả lập nếu cần */}
						<p className={`text-[10px] mt-2 opacity-50 ${msg.role === "USER" ? "text-right" : "text-left"}`}>
							{new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
						</p>
					</div>
				</div>
			))}
		</div>
	)
		;
}
