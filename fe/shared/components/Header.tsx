"use client";

import Link from "next/link";
import Image from "next/image";
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {LogOut, User, ChevronDown, Settings} from "lucide-react";
import {AuthService} from "@/service/auth.api";
import {toast} from "sonner";

export default function Header() {
	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useEffect(() => {
		const isLogin = localStorage.getItem("isLogin");
		const syncTimer = window.setTimeout(() => setIsLoggedIn(isLogin === "true"), 0);
		return () => window.clearTimeout(syncTimer);
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
			localStorage.removeItem("accessToken");
			localStorage.removeItem("role");
			localStorage.removeItem("isAdminLogin");
			localStorage.removeItem("adminProfile");
			setIsLoggedIn(false);
			setIsDropdownOpen(false);
			router.push("/homepage");
			router.refresh();
		}
	};

	return (
		<header className="sticky top-0 z-50 flex h-[64px] w-full items-center justify-between border-b border-gray-200 bg-white px-3 shadow-[0_2px_12px_rgba(0,0,0,0.07)] sm:h-[80px] sm:px-6 lg:px-10">
			{/* Logo Section */}
			<Link href="/" className="flex min-w-0 items-center gap-2 transition-opacity hover:opacity-90 sm:gap-3.5">
				<div className="flex h-[44px] w-[44px] flex-shrink-0 items-center justify-center overflow-hidden rounded-full border-[2px] border-yellow-500 bg-green-700 text-[18px] font-black tracking-[1px] text-white sm:h-[58px] sm:w-[58px] sm:border-[3px]">
					<Image
						className="h-full w-full object-contain"
						src="https://upload.wikimedia.org/wikipedia/vi/thumb/e/e1/Logo_HCMUAF.svg/3840px-Logo_HCMUAF.svg.png"
						alt="Logo Trường Đại học Nông Lâm TP.HCM"
						width={58}
						height={58}
						unoptimized
					/>
				</div>
				<div className="hidden lg:block">
					<div className="text-[16px] font-extrabold uppercase tracking-[0.3px] leading-[1.2] text-green-900">
						Trường Đại Học Nông Lâm TP. HCM
					</div>
					<div className="text-[10.5px] uppercase tracking-[0.5px] font-medium text-gray-400">
						University of Agriculture &amp; Forestry Ho Chi Minh City
					</div>
				</div>
			</Link>

			{/* Logic hiển thị dựa trên trạng thái isLoggedIn */}
			<div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
				{!isLoggedIn ? (
					/* TRƯỜNG HỢP CHƯA ĐĂNG NHẬP */
					<div className="flex gap-2 sm:gap-3">
						<Link
							href="/login"
							className="rounded-md border-2 border-green-700 bg-transparent px-3 py-2 text-[12px] font-semibold text-green-700 transition-all duration-200 hover:bg-green-700 hover:text-white sm:px-[22px] sm:py-[9px] sm:text-[14px]"
						>
							Đăng nhập
						</Link>
						<Link
							href="/register"
							className="hidden rounded-md border-2 border-green-700 bg-green-700 px-[22px] py-[9px] text-[14px] font-semibold text-white transition-all duration-200 hover:border-green-800 hover:bg-green-800 sm:block"
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
							<span className="hidden text-[14px] font-semibold uppercase tracking-wide text-gray-700 sm:inline">Tài khoản</span>
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

									{/*<Link*/}
									{/*	href="/xet-tuyen"*/}
									{/*	className="flex items-center gap-3 px-4 py-3 text-[14px] text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"*/}
									{/*	onClick={() => setIsDropdownOpen(false)}*/}
									{/*>*/}
									{/*	<LayoutDashboard size={18}/>*/}
									{/*	Kết quả xét tuyển*/}
									{/*</Link>*/}

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
