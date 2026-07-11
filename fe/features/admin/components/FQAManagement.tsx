'use client';

import React, { useState, useEffect } from 'react';
import {
	Plus,
	Search,
	Edit2,
	Trash2,
	X,
	Check,
	HelpCircle,
	MessageSquareCode,
	Loader2
} from 'lucide-react';
import { FQA } from "@/types/fqa";
import { toast } from "sonner";
import {FQAService} from "@/service/fqa-service";

export default function FQAManagement() {
	const [fqaList, setFqaList] = useState<FQA[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// State quản lý Modal (Popup) Thêm / Sửa
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingFqa, setEditingFqa] = useState<FQA | null>(null);
	const [formData, setFormData] = useState<Omit<FQA, 'id'>>({ question: '', answer: '' });

	// State quản lý Modal xác nhận xóa
	const [deleteId, setDeleteId] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Hàm gọi API lấy danh sách FQA từ Server
	const fetchFQA = async () => {
		setIsLoading(true);
		try {
			const res = await FQAService.getAllFQA();
			// Ép kiểu sang Array nếu API trả về một mảng bọc trong res.data
			const data = (res.data as unknown as FQA[]) || [];
			setFqaList(data);
		} catch (error) {
			console.error("Fetch FQA error:", error);
			toast.error("Không thể tải danh sách câu hỏi chatbot!");
		} finally {
			setIsLoading(false);
		}
	};

	// Gọi khi render component lần đầu tiên
	useEffect(() => {
		fetchFQA();
	}, []);

	// Bộ lọc tìm kiếm câu hỏi / câu trả lời cục bộ
	const filteredList = fqaList.filter(item =>
		item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
		item.answer.toLowerCase().includes(searchTerm.toLowerCase())
	);

	// Mở modal để Thêm mới
	const handleOpenCreate = () => {
		setEditingFqa(null);
		setFormData({ question: '', answer: '' });
		setIsModalOpen(true);
	};

	// Mở modal để Chỉnh sửa
	const handleOpenEdit = (fqa: FQA) => {
		setEditingFqa(fqa);
		setFormData({ question: fqa.question, answer: fqa.answer });
		setIsModalOpen(true);
	};

	// Xử lý Submit Form (Lưu Thêm/Sửa thông qua API)
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!formData.question.trim() || !formData.answer.trim()) return;

		setIsSubmitting(true);
		try {
			if (editingFqa && editingFqa.id) {
				// Logic Cập nhật thông qua API
				const payload: FQA = { id: editingFqa.id, ...formData };
				await FQAService.editFQA(payload);
				toast.success("Cập nhật câu hỏi chatbot thành công!");
			} else {
				// Logic Thêm mới thông qua API
				await FQAService.addFQA(formData as FQA);
				toast.success("Thêm câu hỏi chatbot mới thành công!");
			}
			setIsModalOpen(false);
			fetchFQA(); // Cập nhật lại danh sách mới nhất từ server
		} catch (error) {
			console.error("Submit FQA error:", error);
			toast.error("Thao tác thất bại. Vui lòng kiểm tra lại dữ liệu!");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Xử lý Xóa dữ liệu thông qua API
	const handleDelete = async () => {
		if (!deleteId) return;

		setIsSubmitting(true);
		try {
			await FQAService.deleteFQA(deleteId);
			toast.success("Xóa câu hỏi chatbot thành công!");
			setDeleteId(null);
			fetchFQA(); // Cập nhật lại danh sách mới nhất từ server
		} catch (error) {
			console.error("Delete FQA error:", error);
			toast.error("Không thể xóa câu hỏi này!");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Tiêu đề & Nút Thêm mới */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h1 className="text-xl font-black text-green-dark tracking-tight flex items-center gap-2">
						<MessageSquareCode className="text-green-main" size={24} />
						QUẢN LÝ BỘ CÂU HỎI CHATBOT (FQA)
					</h1>
				</div>

				<button
					onClick={handleOpenCreate}
					disabled={isLoading}
					className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-main hover:bg-green-dark disabled:bg-gray-300 text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200"
				>
					<Plus size={18} />
					Thêm câu hỏi mới
				</button>
			</div>

			{/* Thanh tìm kiếm */}
			<div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
				<div className="relative max-w-md">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
					<input
						type="text"
						placeholder="Tìm kiếm theo câu hỏi hoặc câu trả lời..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-main focus:bg-white transition-all duration-200"
					/>
				</div>
			</div>

			{/* Trạng thái Loading hoặc Hiển thị Danh sách dữ liệu FQA */}
			{isLoading ? (
				<div className="bg-white rounded-xl border border-gray-200 p-12 flex flex-col items-center justify-center gap-3 text-gray-400">
					<Loader2 className="animate-spin text-green-main" size={32} />
					<p className="text-sm font-medium">Đang tải dữ liệu bộ câu hỏi...</p>
				</div>
			) : (
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
					{filteredList.length > 0 ? (
						<div className="divide-y divide-gray-100">
							{filteredList.map((item, index) => (
								<div key={item.id} className="p-5 hover:bg-gray-50/50 transition-colors duration-150 flex items-start justify-between gap-4">
									<div className="flex gap-3 flex-1">
										<div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-green-main/10 text-green-main text-xs font-bold">
											{index + 1}
										</div>
										<div className="space-y-1.5 flex-1">
											<h3 className="text-sm font-bold text-gray-800 flex items-start gap-1.5 leading-snug">
												<HelpCircle size={16} className="text-green-main/70 shrink-0 mt-0.5" />
												{item.question}
											</h3>
											<p className="text-xs text-gray-600 pl-5 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100/60 whitespace-pre-wrap">
												{item.answer}
											</p>
										</div>
									</div>

									{/* Các nút Hành động */}
									<div className="flex items-center gap-1.5 shrink-0">
										<button
											onClick={() => handleOpenEdit(item)}
											className="p-2 text-gray-500 hover:text-green-main hover:bg-green-main/10 rounded-md transition-all"
											title="Chỉnh sửa"
										>
											<Edit2 size={15} />
										</button>
										<button
											onClick={() => setDeleteId(item.id || null)}
											className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all"
											title="Xóa"
										>
											<Trash2 size={15} />
										</button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="py-12 text-center text-gray-400 text-sm">
							Chưa có bộ câu hỏi nào.
						</div>
					)}
				</div>
			)}

			{/* MODAL: THÊM / SỬA FQA */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-gray-100">
						{/* Header Modal */}
						<div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
							<h2 className="text-sm font-black text-green-dark uppercase tracking-wider">
								{editingFqa ? 'Cập nhật câu hỏi chatbot' : 'Thêm câu hỏi chatbot mới'}
							</h2>
							<button
								onClick={() => !isSubmitting && setIsModalOpen(false)}
								disabled={isSubmitting}
								className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-200/50 disabled:opacity-50"
							>
								<X size={18} />
							</button>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							<div className="space-y-1.5">
								<label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Câu hỏi tuyển sinh <span className="text-red-500">*</span></label>
								<textarea
									rows={2}
									placeholder="Nhập nội dung câu hỏi học sinh thường hỏi..."
									value={formData.question}
									onChange={(e) => setFormData({ ...formData, question: e.target.value })}
									required
									disabled={isSubmitting}
									className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-main resize-none transition-all disabled:bg-gray-50"
								/>
							</div>

							<div className="space-y-1.5">
								<label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Câu trả lời phản hồi <span className="text-red-500">*</span></label>
								<textarea
									rows={4}
									placeholder="Nhập câu trả lời chính xác để hệ thống Chatbot phản hồi..."
									value={formData.answer}
									onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
									required
									disabled={isSubmitting}
									className="w-full px-3.5 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-green-main resize-none transition-all disabled:bg-gray-50"
								/>
							</div>

							{/* Footer Modal Buttons */}
							<div className="flex justify-end gap-2.5 pt-2 border-t border-gray-100 mt-6">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									disabled={isSubmitting}
									className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50"
								>
									Hủy bỏ
								</button>
								<button
									type="submit"
									disabled={isSubmitting}
									className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-green-main hover:bg-green-dark rounded-lg shadow-sm transition-all disabled:bg-gray-400"
								>
									{isSubmitting ? (
										<Loader2 className="animate-spin" size={14} />
									) : (
										<Check size={14} />
									)}
									Lưu thay đổi
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* MODAL XÁC NHẬN XÓA */}
			{deleteId && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
					<div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4 border border-gray-100">
						<h3 className="text-sm font-black text-gray-800 uppercase">Xác nhận xóa câu hỏi?</h3>
						<p className="text-xs text-gray-500 leading-relaxed">
							Hành động này không thể hoàn tác. Dữ liệu câu hỏi này sẽ bị xóa vĩnh viễn khỏi cơ sở dữ liệu huấn luyện chatbot.
						</p>
						<div className="flex justify-end gap-2 pt-2">
							<button
								onClick={() => !isSubmitting && setDeleteId(null)}
								disabled={isSubmitting}
								className="px-3.5 py-2 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-all disabled:opacity-50"
							>
								Hủy bỏ
							</button>
							<button
								onClick={handleDelete}
								disabled={isSubmitting}
								className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all disabled:bg-gray-400"
							>
								{isSubmitting && <Loader2 className="animate-spin" size={12} />}
								Đồng ý xóa
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}