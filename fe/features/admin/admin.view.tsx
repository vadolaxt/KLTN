'use client';

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';

import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/user-manage/UserManagement';
import AdmissionManagement from './components/AdmissionManagement';
import NewsManagement from './components/NewsManagement';
import {AuthService} from "@/service/auth.api";
import {toast} from "sonner";
import FQAManagement from "@/features/admin/components/FQAManagement";

export default function AdminView() {
	const {
		isAuthenticated,
		isCheckingAuth,
		isForbidden,
		currentUser,
		logout,

		activeTab,
		setActiveTab,
		selectedYear,
		setSelectedYear,
		availableYears,
		availableCombinationCodes,
		isLoading,

		admissions,
		news,
		stats,

		updateAdmissionInfo,
		createAdmissionInfo,
		deleteAdmissionInfo,
		createNewsArticle,
		updateNewsArticle,
		deleteNewsArticle,
	} = useAdmin();

	const router = useRouter();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	useEffect(() => {
		const isLogin = localStorage.getItem("isLogin");
		setIsLoggedIn(isLogin === "true");
	}, []);

	useEffect(() => {
		if (!isCheckingAuth && !isAuthenticated) {
			router.replace(isForbidden ? '/homepage' : '/login');
		}
	}, [isAuthenticated, isCheckingAuth, isForbidden, router]);

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
			localStorage.removeItem("isAdminLogin");
			localStorage.removeItem("role");
			setIsLoggedIn(false);
			setIsDropdownOpen(false);
			router.push("/homepage");
			router.refresh();
		}
	};

	const adminFullName = currentUser
		? `${currentUser.lastName} ${currentUser.firstName}`
		: 'Quản trị viên';

	return (
		<div className="min-h-screen grid grid-cols-[260px_1fr] font-vietnam bg-gray-light text-text-dark">
			<aside className="h-screen sticky top-0 overflow-y-auto">
				<AdminSidebar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					logout={handleLogout}
					adminName={adminFullName}
				/>
			</aside>

			<div className="flex h-screen flex-col overflow-hidden">
				<AdminHeader
					activeTab={activeTab}
					adminName={adminFullName}
					adminEmail={currentUser?.email}
				/>

				<main className="flex-1 overflow-y-auto bg-gray-light p-8">
					<div className="mx-auto max-w-6xl">
						{activeTab === 'dashboard' && (
							<DashboardOverview
								stats={stats}
								isLoading={isLoading}
								selectedYear={selectedYear}
								setSelectedYear={setSelectedYear}
								availableYears={availableYears}
							/>
						)}

						{activeTab === 'users' && <UserManagement />}

						{activeTab === 'admissions' && (
							<AdmissionManagement
								admissions={admissions}
								selectedYear={selectedYear}
								availableYears={availableYears}
								availableCombinationCodes={availableCombinationCodes}
								setSelectedYear={setSelectedYear}
								updateAdmissionInfo={updateAdmissionInfo}
								createAdmissionInfo={createAdmissionInfo}
								deleteAdmissionInfo={deleteAdmissionInfo}
								isLoading={isLoading}
							/>
						)}

						{activeTab === 'news' && (
							<NewsManagement
								news={news}
								createNewsArticle={createNewsArticle}
								updateNewsArticle={updateNewsArticle}
								deleteNewsArticle={deleteNewsArticle}
								isLoading={isLoading}
							/>
						)}

						{activeTab === 'fqa' && (
							<FQAManagement/>
						)}
					</div>
				</main>
			</div>
		</div>
	);
}
