"use client";

import { useEffect, useState } from "react";

import MessageList from "@/features/chat/components/message-list";
import ChatInput from "@/features/chat/components/chat-input";

import { ChatService } from "@/service/chat.api";
import type { ChatMessage, ChatRequest } from "@/types";

interface ChatPanelProps {
	onClose?: () => void;
}

export default function ChatPanel({ onClose }: ChatPanelProps) {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [isLoadingHistory, setIsLoadingHistory] = useState(true);
	const [isSending, setIsSending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const fetchHistory = async () => {
			try {
				setIsLoadingHistory(true);
				setError(null);

				const response = await ChatService.getHistory();

				if (isMounted && response.data) {
					setMessages(response.data);
				}
			} catch (historyError) {
				console.error("Lỗi tải lịch sử chat:", historyError);

				if (isMounted) {
					setError("Không thể tải lịch sử trò chuyện.");
				}
			} finally {
				if (isMounted) {
					setIsLoadingHistory(false);
				}
			}
		};

		void fetchHistory();

		return () => {
			isMounted = false;
		};
	}, []);

	const handleSendMessage = async (text: string) => {
		const content = text.trim();

		if (!content || isSending) {
			return;
		}

		const userMessage: ChatMessage = {
			role: "USER",
			content,
		};

		setMessages((currentMessages) => [
			...currentMessages,
			userMessage,
		]);

		setError(null);
		setIsSending(true);

		try {
			const request: ChatRequest = {
				content,
			};

			const response = await ChatService.sendMessage(request);

			if (response.data) {
				setMessages((currentMessages) => [
					...currentMessages,
					response.data,
				]);
			}
		} catch (sendError) {
			console.error("Lỗi gửi tin nhắn:", sendError);
			setError("Gửi tin nhắn thất bại. Vui lòng thử lại.");
		} finally {
			setIsSending(false);
		}
	};

	return (
		<section className="flex h-full min-h-0 flex-col overflow-hidden bg-[#fafaf8] text-gray-900">
			<header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
				<div className="flex min-w-0 items-center gap-3">
					<div className="min-w-0">
						<h2 className="truncate text-sm font-extrabold leading-none text-green-900">
							Chatbot tư vấn tuyển sinh
						</h2>
					</div>
				</div>

				{/* Chỉ hiện nút đóng khi ChatPanel được dùng trong widget */}
				{onClose && (
					<button
						type="button"
						onClick={onClose}
						aria-label="Đóng chatbot"
						className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
					>
						<svg
							viewBox="0 0 24 24"
							aria-hidden="true"
							className="h-5 w-5 fill-none stroke-current stroke-2"
						>
							<path
								d="M6 6l12 12M18 6 6 18"
								strokeLinecap="round"
							/>
						</svg>
					</button>
				)}
			</header>

			{/* Thông báo lỗi */}
			{error && (
				<div className="border-b border-red-100 bg-red-50 px-4 py-2 text-xs text-red-600">
					{error}
				</div>
			)}

			{isLoadingHistory ? (
				<div className="flex flex-1 items-center justify-center text-sm text-gray-400">
					Đang tải cuộc trò chuyện…
				</div>
			) : messages.length === 0 ? (
				<div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
					<div className="mb-3 text-5xl">🤖</div>

					<h3 className="text-lg font-black text-green-900">
						Nông Lâm University Bot
					</h3>

					<p className="mt-2 max-w-xs text-sm leading-6 text-gray-500">
						Hỏi mình về tuyển sinh, học phí hoặc các ngành đào tạo.
					</p>
				</div>
			) : (
				<MessageList
					messages={messages}
					isTyping={isSending}
				/>
			)}

			<ChatInput
				onSendMessage={handleSendMessage}
				disabled={isSending || isLoadingHistory}
			/>
		</section>
	);
}