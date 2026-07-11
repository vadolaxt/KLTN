'use client';

import React, { useState, useEffect, useRef } from 'react';
import TopBar from "@/shared/components/TopBar";
import Header from "@/shared/components/Header";
import NavBar from "@/shared/components/NavBar";
import { ChatService } from "@/service/chat.api";
import { FQA } from "@/types/fqa";
import { ChatMessage, ChatRequest } from "@/types";
import {
	MessageSquare,
	HelpCircle,
	Bot,
	Send,
	Loader2,
	Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { FQAService } from "@/service/fqa-service";

// Thư viện định dạng văn bản Markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function FQAView() {
	const [fqaList, setFqaList] = useState<FQA[]>([]);
	const [isLoadingFQA, setIsLoadingFQA] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	// State tin nhắn đồng bộ theo cấu trúc { role, content }
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [inputValue, setInputValue] = useState('');
	const [isSending, setIsSending] = useState(false);

	const chatEndRef = useRef<HTMLDivElement>(null);

	// Tự động cuộn xuống đáy khung chat
	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isSending]);

	// Tải danh sách câu hỏi gợi ý bên cánh trái từ Server
	useEffect(() => {
		const fetchFQA = async () => {
			setIsLoadingFQA(true);
			try {
				const res = await FQAService.getAllFQA();
				const data = (res.data as unknown as FQA[]) || [];
				setFqaList(data);
			} catch (error) {
				console.error("Lỗi load FQA:", error);
				toast.error("Không thể tải danh sách câu hỏi thường gặp.");
			} finally {
				setIsLoadingFQA(false);
			}
		};
		fetchFQA();
	}, []);

	// XỬ LÝ KHI BẤM VÀO CÂU HỎI BÊN TRÁI
	const handleSelectFQA = (fqa: FQA) => {
		const userMsg: ChatMessage = { role: "USER", content: fqa.question };
		const botMsg: ChatMessage = { role: "ASSISTANT", content: fqa.answer };
		setMessages((prev) => [...prev, userMsg, botMsg]);
	};

	// XỬ LÝ KHI TỰ GÕ Ô CHAT
	const handleSendMessage = async (text: string) => {
		if (!text.trim() || isSending) return;

		setIsSending(true);
		const userMsg: ChatMessage = { role: "USER", content: text };
		setMessages((prev) => [...prev, userMsg]);

		try {
			const request: ChatRequest = { content: text };
			const res = await ChatService.sendMessage(request);

			if (res.data) {
				setMessages((prev) => [...prev, res.data]);
			}
		} catch (error) {
			console.error("Lỗi gửi tin nhắn:", error);
			toast.error("Hệ thống chatbot đang bận, vui lòng thử lại sau.");
		} finally {
			setIsSending(false);
		}
	};

	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!inputValue.trim()) return;

		handleSendMessage(inputValue);
		setInputValue('');
	};

	const filteredFQA = fqaList.filter(item =>
		item.question.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		/* CẤT CÁNH 1: Biến thẻ bọc ngoài cùng thành flex-col cố định chiều cao màn hình (h-screen)
		  và giấu phần thừa (overflow-hidden). Điều này ép trình duyệt không bao giờ xuất hiện scrollbar tổng của trang.
		*/
		<div className="h-screen w-screen flex flex-col font-vietnam bg-gray-light overflow-hidden">

			{/* Giữ nguyên vẹn 3 component điều hướng của bạn */}
			<TopBar/>
			<Header/>
			<NavBar/>

			{/* CẤT CÁNH 2: Thẻ <main> được cấp flex-1 để tự động "đo đạc" và lấy toàn bộ chiều cao còn lại của màn hình.
         Thêm `min-h-0` là điều kiện bắt buộc trong Flexbox để báo hiệu cho phần tử con biết giới hạn diện tích,
         tránh việc nội dung con (ô chat) đẩy khung cha giãn ra.
       */}
			<main className="flex-1 min-h-0 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6 pb-6">

				{/* THANH BÊN TRÁI: DANH SÁCH CÂU HỎI GỢI Ý */}
				<div className="bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden shadow-sm h-full min-h-0">
					<div className="p-4 border-b border-gray-100 bg-gray-50/70 shrink-0">
						<h2 className="text-sm font-black text-green-dark flex items-center gap-2 uppercase tracking-wider">
							<HelpCircle className="text-green-main" size={18} />
							Câu hỏi thường gặp
						</h2>
						<p className="text-[11px] text-gray-500 mt-0.5">Chọn nhanh một câu hỏi để hiển thị câu trả lời ngay</p>

						<div className="mt-3 relative">
							<input
								type="text"
								placeholder="Tìm kiếm câu hỏi..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-3 pr-8 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none focus:border-green-main transition-all"
							/>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto p-2 space-y-1 bg-white">
						{isLoadingFQA ? (
							<div className="py-8 text-center text-gray-400 flex flex-col items-center gap-2">
								<Loader2 className="animate-spin text-green-main" size={20} />
								<span className="text-xs">Đang tải câu hỏi...</span>
							</div>
						) : filteredFQA.length > 0 ? (
							filteredFQA.map((item) => (
								<button
									key={item.id}
									onClick={() => handleSelectFQA(item)}
									className="w-full text-left p-3 rounded-xl text-xs font-semibold text-gray-700 hover:bg-green-main/5 hover:text-green-dark border border-transparent hover:border-green-main/10 transition-all duration-150 flex items-start gap-2 group"
								>
									<MessageSquare size={14} className="text-gray-400 shrink-0 mt-0.5 group-hover:text-green-main" />
									<span className="line-clamp-2 leading-relaxed">{item.question}</span>
								</button>
							))
						) : (
							<div className="py-8 text-center text-xs text-gray-400">
								Không tìm thấy dữ liệu phù hợp.
							</div>
						)}
					</div>
				</div>

				{/* KHUNG BÊN PHẢI: GIAO DIỆN CHAT CHÍNH */}
				<div className="bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden shadow-sm h-full min-h-0">
					{/* Header Khung Chat - shrink-0 giữ nguyên kích thước */}
					<div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-green-dark to-green-main text-white shrink-0">
						<div className="flex items-center gap-3">
							<div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
								<Bot size={20} className="text-green-light" />
							</div>
							<div>
								<h3 className="text-sm font-black tracking-wide flex items-center gap-1.5">
									CHATBOT HỖ TRỢ TUYỂN SINH
									<Sparkles size={13} className="text-yellow-300 animate-pulse" />
								</h3>
								<p className="text-[10px] text-white/75 font-medium">Hỗ trợ thông tin tuyển sinh trực tuyến</p>
							</div>
						</div>
					</div>

					{/* CẤT CÁNH 3: Vùng chứa tin nhắn cuộc trò chuyện.
             - `flex-1` để lấy trọn không gian ở giữa Header và Form.
             - `min-h-0` kèm `overflow-y-auto` kích hoạt thanh cuộn nội bộ ngay khi tin nhắn tràn ra khỏi vùng hiển thị.
           */}
					<div className="flex-1 min-h-0 overflow-y-auto p-4 bg-[#fafaf8] space-y-3">
						{messages.length === 0 ? (
							<div className="h-full flex flex-col items-center justify-center text-center p-6">
								<h4 className="text-sm font-bold text-green-dark">Chào mừng bạn đến với Cổng tư vấn tuyển sinh NLU!</h4>
								<p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
									Hãy chọn một câu hỏi gợi ý ở danh mục bên trái hoặc tự nhập thắc mắc của bạn vào ô bên dưới để trao đổi cùng trợ lý ảo.
								</p>
							</div>
						) : (
							messages.map((message, index) => {
								const isUser = message.role === "USER";
								return (
									<div
										key={`${message.role}-${index}`}
										className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
									>
										{/* Avatar */}
										<div
											className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm text-white shadow-sm ${
												isUser ? "bg-blue-600" : "border-2 border-yellow-500 bg-green-700"
											}`}
										>
											{isUser ? "U" : ""}
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
							})
						)}

						{/* Hiệu ứng ba chấm nhấp nháy khi đang chờ */}
						{isSending && (
							<div className="flex items-center gap-2.5">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-yellow-500 bg-green-700" />
								<div className="rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 shadow-sm">
									<div className="flex gap-1" aria-label="Chatbot đang trả lời">
										<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
										<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
										<span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
									</div>
								</div>
							</div>
						)}

						{/* Điểm neo để cuộn tự động */}
						<div ref={chatEndRef} />
					</div>

					{/* Ô nhập tin nhắn thủ công bên dưới - shrink-0 cố định vị trí ở đáy */}
					<form onSubmit={handleFormSubmit} className="p-4 border-t border-gray-100 bg-white flex gap-2 shrink-0">
						<input
							type="text"
							placeholder="Nhập câu hỏi của bạn tại đây..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							disabled={isSending}
							className="flex-1 px-4 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-main focus:bg-white transition-all disabled:opacity-60"
						/>
						<button
							type="submit"
							disabled={isSending || !inputValue.trim()}
							className="px-4 py-2.5 bg-green-main hover:bg-green-dark disabled:bg-gray-300 text-white rounded-xl shadow-sm transition-colors duration-150 flex items-center justify-center shrink-0"
						>
							<Send size={15} />
						</button>
					</form>

				</div>
			</main>
		</div>
	);
}