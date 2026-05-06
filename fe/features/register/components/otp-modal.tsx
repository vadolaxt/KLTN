"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {useState} from "react";
import {toast} from "sonner";

interface OTPModalProps {
	isOpen: boolean;
	onClose: () => void;
	email: string;
	onVerify: (otp: string) => Promise<void>;
}

export default function OTPModal({
												isOpen,
												onClose,
												email,
												onVerify,
											}: OTPModalProps) {
	const [otp, setOtp] = useState("");
	const [isVerifying, setIsVerifying] = useState(false);

	// Hàm xử lý khi đóng/mở modal
	const handleOpenChange = (open: boolean) => {
		if (!open) {
			setOtp(""); // Xóa sạch OTP khi modal bị đóng
			onClose();  // Gọi hàm onClose từ props
		}
	};

	const handleComplete = async (value: string) => {
		setIsVerifying(true);
		try {
			await onVerify(value);
			toast.success("Xác thực thành công!");
		} catch (error) {
			setOtp(""); // Thường thì khi sai cũng nên xóa để user nhập lại
			toast.error("Mã OTP không chính xác, vui lòng thử lại.");
		} finally {
			setIsVerifying(false);
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-[425px] flex flex-col items-center">
				<DialogHeader className="text-center">
					<DialogTitle className="text-2xl">Xác thực OTP</DialogTitle>
					<DialogDescription>
						Chúng tôi đã gửi mã xác thực đến email <br/>
						<span className="font-bold text-foreground">{email}</span>
					</DialogDescription>
				</DialogHeader>

				<div className="py-4">
					<InputOTP
						maxLength={6}
						value={otp}
						onChange={(val) => setOtp(val)}
						onComplete={handleComplete}
						disabled={isVerifying}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0}/>
							<InputOTPSlot index={1}/>
							<InputOTPSlot index={2}/>
							<InputOTPSlot index={3}/>
							<InputOTPSlot index={4}/>
							<InputOTPSlot index={5}/>
						</InputOTPGroup>
					</InputOTP>
				</div>

				<p className="text-sm text-muted-foreground">
					{isVerifying ? "Đang xác thực..." : "Vui lòng nhập 6 chữ số"}
				</p>
			</DialogContent>
		</Dialog>
	);
}