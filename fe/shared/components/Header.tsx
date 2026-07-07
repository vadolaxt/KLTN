"use client";

import Link from "next/link";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {LogOut, User, ChevronDown, Settings, LayoutDashboard} from "lucide-react";
import {AuthService} from "@/service/auth.api";
import {toast} from "sonner";

export default function Header() {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useEffect(() => {
		const isLogin = localStorage.getItem("isLogin");
		setIsLoggedIn(isLogin === "true");
	}, []);

	const handleLogout = async () => {
		try {
			await AuthService.logout();
			toast.success("Đăng xuất thành công");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			localStorage.removeItem("isLogin");
			localStorage.removeItem("userName");
			setIsLoggedIn(false);
			setIsDropdownOpen(false);
			router.push("/homepage");
			router.refresh();
		}
	};

	return (
		<header className="w-full px-10 flex items-center justify-between h-[80px] sticky top-0 z-50 bg-white border-b border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.07)]">
			{/* Logo Section */}
			<Link href="/" className="flex items-center gap-3.5 hover:opacity-90 transition-opacity">
				<div className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-[18px] font-black text-white tracking-[1px] flex-shrink-0 bg-green-700 border-[3px] border-yellow-500">
					NLU
				</div>
				<div>
					<div className="text-[16px] font-extrabold uppercase tracking-[0.3px] leading-[1.2] text-green-900">
						Trường Đại Học Nông Lâm TP. HCM
					</div>
					<div className="text-[10.5px] uppercase tracking-[0.5px] font-medium text-gray-400">
						University of Agriculture &amp; Forestry Ho Chi Minh City
					</div>
				</div>
			</Link>

			{/* Logic hiển thị dựa trên trạng thái isLoggedIn */}
			<div className="flex items-center gap-4">
				{!isLoggedIn ? (
					/* TRƯỜNG HỢP CHƯA ĐĂNG NHẬP */
					<div className="flex gap-3">
						<Link
							href="/login"
							className="px-[22px] py-[9px] text-[14px] font-semibold rounded-md transition-all duration-200 text-green-700 border-2 border-green-700 bg-transparent hover:bg-green-700 hover:text-white"
						>
							Đăng nhập
						</Link>
						<Link
							href="/register"
							className="px-[22px] py-[9px] text-[14px] font-semibold rounded-md transition-all duration-200 text-white bg-green-700 border-2 border-green-700 hover:bg-green-800 hover:border-green-800"
						>
							Đăng ký xét tuyển
						</Link>
					</div>
				) : (
					/* TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP */
					<div className="relative">
						{/* Nút bấm Avatar & Tài khoản */}
						<button
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-gray-50 transition-all border border-gray-100 shadow-sm"
						>
							<div className="w-9 h-9 rounded-full bg-green-700 flex items-center justify-center text-white font-bold">
								<User size={20}/>
							</div>
							<span className="text-[14px] font-semibold text-gray-700 uppercase tracking-wide">Tài khoản</span>
							<ChevronDown
								size={16}
								className={`text-gray-400 transition-transform duration-200 ${
									isDropdownOpen ? "rotate-180" : ""
								}`}
							/>
						</button>

						{/* Dropdown Menu */}
						{isDropdownOpen && (
							<>
								{/* Lớp overlay ảo để click ra ngoài thì đóng dropdown */}
								<div
									className="fixed inset-0 z-[-1]"
									onClick={() => setIsDropdownOpen(false)}
								/>

								<div className="absolute right-0 mt-3 w-60 bg-white border border-gray-100 rounded-xl shadow-2xl py-2 z-[60] overflow-hidden animate-in fade-in zoom-in duration-150">
									<div className="px-4 py-2 border-b border-gray-50 mb-1">
										<p className="text-[11px] text-gray-400 uppercase font-bold tracking-widest">
											Cổng sinh viên
										</p>
									</div>

									<Link
										href="/ho-so"
										className="flex items-center gap-3 px-4 py-3 text-[14px] text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
										onClick={() => setIsDropdownOpen(false)}
									>
										<Settings size={18}/>
										Quản lý tài khoản
									</Link>

									<Link
										href="/xet-tuyen"
										className="flex items-center gap-3 px-4 py-3 text-[14px] text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
										onClick={() => setIsDropdownOpen(false)}
									>
										<LayoutDashboard size={18}/>
										Kết quả xét tuyển
									</Link>

									<div className="h-px bg-gray-100 my-1 mx-2"></div>

									<button
										onClick={handleLogout}
										className="w-full flex items-center gap-3 px-4 py-3 text-[14px] text-red-600 hover:bg-red-50 transition-colors font-medium"
									>
										<LogOut size={18}/>
										Đăng xuất
									</button>
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</header>
	);
}
