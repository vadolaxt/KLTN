import React from "react";
import { UserX } from "lucide-react";

interface DeleteConfirmModalProps {
	userId: string | null;
	onClose: () => void;
	onConfirm: (id: string) => Promise<void> | void;
	isSubmitting?: boolean;
}

export default function DeleteConfirmModal({
															 userId,
															 onClose,
															 onConfirm,
															 isSubmitting = false,
														 }: DeleteConfirmModalProps) {
	if (!userId) return null;

	const handleConfirm = async () => {
		await onConfirm(userId);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
			<div className="bg-white border border-gray-mid rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
				<div className="flex items-center gap-3 text-red-500 mb-4">
					<div className="h-10 w-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
						<UserX size={20} />
					</div>
					<h3 className="text-sm font-black uppercase tracking-[0.5px]">Xóa tài khoản</h3>
				</div>

				<p className="text-xs text-text-mid leading-relaxed mb-6">
					Bạn có chắc chắn muốn xóa tài khoản này khỏi hệ thống? Hành động này không thể hoàn tác.
				</p>

				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 border border-gray-mid text-text-mid hover:bg-gray-light font-bold text-xs rounded-xl disabled:opacity-60"
						disabled={isSubmitting}
					>
						Hủy bỏ
					</button>
					<button
						type="button"
						onClick={handleConfirm}
						className="px-4 py-2 bg-[#e53935] hover:bg-[#c62828] text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-60"
						disabled={isSubmitting}
					>
						{isSubmitting ? "Đang xóa..." : "Đồng ý xóa"}
					</button>
				</div>
			</div>
		</div>
	);
}
