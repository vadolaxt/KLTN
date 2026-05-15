"use client";

import { useState, useEffect } from "react";
import MessageList from "@/features/chat/components/message-list";
import ChatSidebar from "@/features/chat/components/chat-side-bar";
import ChatInput from "@/features/chat/components/chat-input";
import {ChatMessage, ChatRequest} from "@/types";
import {ChatService} from "@/service/chat.api";


export default function ChatView() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isChatting, setIsChatting] = useState(false);

	// Tự động lấy lịch sử chat của User khi vừa vào trang
	useEffect(() => {
		const fetchHistory = async () => {
			try {
				const res = await ChatService.getHistory();
				if (res.data) setMessages(res.data);
			} catch (error) {
				console.error("Lỗi tải lịch sử chat", error);
			}
		};
		fetchHistory();
	}, []);

	const handleSendMessage = async (text: string) => {
		setIsChatting(true);
		// Lên UI ngay lập tức
		const userMsg: ChatMessage = { role: "USER", content: text };
		setMessages((prev) => [...prev, userMsg]);

		try {
			const request: ChatRequest = {
				content: text,
			};
			const res = await ChatService.sendMessage(request);
			if (res.data) {
				setMessages((prev) => [...prev, res.data]);
			}
		} catch (error) {
			console.error("Lỗi gửi tin nhắn:", error);
		} finally {
			setIsChatting(false);
		}
	};

	return (
		<div className="flex h-screen bg-[#fafaf8] text-gray-900 overflow-hidden">
			{/* SIDEBAR */}
			<ChatSidebar
				onSelectTopic={handleSendMessage}
			/>

			{/* MAIN CHAT AREA */}
			<main className="flex-1 flex flex-col relative">
				{/* Chat Topbar */}
				<header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-green-700 border-2 border-yellow-500 flex items-center justify-center text-xl shadow-md">🤖</div>
						<div>
							<h2 className="text-sm font-extrabold text-green-900 leading-none">NLU Assistant</h2>
							<p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
								<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Đang hoạt động
							</p>
						</div>
					</div>
				</header>

				{/* MESSAGES OR WELCOME */}
				{messages.length === 0 ? (
					<div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
						<div className="text-6xl mb-4 animate-bounce">🤖</div>
						<h1 className="text-2xl font-black text-green-900">Nông Lâm University Bot</h1>
						<p className="text-gray-500 max-w-md mt-2">Hỏi mình bất cứ điều gì về tuyển sinh, học phí hoặc ngành đào tạo năm 2025!</p>
					</div>
				) : (
					<MessageList messages={messages} />
				)}

				{/* INPUT */}
				<ChatInput onSendMessage={handleSendMessage} />
			</main>
		</div>
	);
}