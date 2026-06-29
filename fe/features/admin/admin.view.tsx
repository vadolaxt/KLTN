'use client';

import React from 'react';
import {useAdmin} from '@/hooks/use-admin';

// Layout & Authentication Components
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';

// Dashboard Tab Components
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/user-manage/UserManagement';
import AdmissionManagement from './components/AdmissionManagement';
import ScoreManagement from './components/ScoreManagement';
import NewsManagement from './components/NewsManagement';
import {AuthService} from "@/service/auth.api";
import {toast} from "sonner";
import {useRouter} from "next/navigation";

export default function AdminView() {
	const {
		// Auth State
		isAuthenticated,
		isRegisterMode,
		setIsRegisterMode,
		currentUser,
		login,
		register,
		logout,

		// Layout State
		activeTab,
		setActiveTab,
		selectedYear,
		setSelectedYear,
		availableYears,
		availableCombinationCodes,
		isLoading,
		error,

		// Data List State
		users,
		admissions,
		scores,
		news,
		stats,

		// Actions
		createUser,
		updateUserRole,
		toggleUserStatus,
		deleteUser,
		updateAdmissionInfo,
		updateCutoffScore,
		createNewsArticle,
		updateNewsArticle,
		deleteNewsArticle
	} = useAdmin();

	const router = useRouter();

	const handleLogout = async () => {
		try {
			await AuthService.logout();
			toast.success("Đăng xuất thành công");
		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			localStorage.removeItem("isLogin");
			router.push("/homepage");
			router.refresh();
		}
	};

	// ─────────────────────────────────────────────
	// 1. GUEST / UNAUTHENTICATED RENDER
	// ─────────────────────────────────────────────
	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center font-vietnam bg-[linear-gradient(135deg,#f4f9f4_0%,#ffffff_50%,#f0f7f0_100%)] relative px-4 overflow-hidden">
				{/* Background Grid Accent */}
				<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(45,122,45,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(45,122,45,0.04)_1px,transparent_1px)] bg-[size:32px_32px]"/>

				{/* Decorative Glowing Orbs (Green & Grey) */}
				<div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-green-light/5 blur-3xl"/>
				<div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-green-main/5 blur-3xl"/>

				<div className="relative z-10 w-full flex justify-center">
					{isRegisterMode ? (
						<AdminRegister
							register={register}
							isLoading={isLoading}
							error={error}
							switchToLogin={() => setIsRegisterMode(false)}
						/>
					) : (
						<AdminLogin
							login={login}
							isLoading={isLoading}
							error={error}
							switchToRegister={() => setIsRegisterMode(true)}
						/>
					)}
				</div>
			</div>
		);
	}

	// ─────────────────────────────────────────────
	// 2. AUTHENTICATED WORKSPACE RENDER
	// ─────────────────────────────────────────────
	const adminFullName = currentUser
		? `${currentUser.lastName} ${currentUser.firstName}`
		: 'Quản trị viên';

	return (
		<div className="min-h-screen grid grid-cols-[260px_1fr] font-vietnam bg-gray-light text-text-dark">
			{/* Sidebar Navigation */}
			<aside className="h-screen sticky top-0 overflow-y-auto">
				<AdminSidebar
					activeTab={activeTab}
					setActiveTab={setActiveTab}
					logout={handleLogout}
					adminName={adminFullName}
				/>
			</aside>

			{/* Main Workspace (Header + View Container) */}
			<div className="flex flex-col h-screen overflow-hidden">
				{/* Top Header */}
				<AdminHeader
					activeTab={activeTab}
					adminName={adminFullName}
					adminEmail={currentUser?.email}
				/>

				{/* Scrollable View Area */}
				<main className="flex-1 overflow-y-auto p-8 bg-gray-light">
					<div className="max-w-6xl mx-auto">
						{activeTab === 'dashboard' && (
							<DashboardOverview
								stats={stats}
								isLoading={isLoading}
							/>
						)}

						{activeTab === 'users' && (
							<UserManagement/>
						)}

						{activeTab === 'admissions' && (
							<AdmissionManagement
								admissions={admissions}
								selectedYear={selectedYear}
								availableYears={availableYears}
								availableCombinationCodes={availableCombinationCodes}
								setSelectedYear={setSelectedYear}
								updateAdmissionInfo={updateAdmissionInfo}
								isLoading={isLoading}
							/>
						)}

						{activeTab === 'scores' && (
							<ScoreManagement
								scores={scores}
								selectedYear={selectedYear}
								availableYears={availableYears}
								availableCombinationCodes={availableCombinationCodes}
								setSelectedYear={setSelectedYear}
								updateCutoffScore={updateCutoffScore}
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
					</div>
				</main>
			</div>
		</div>
	);
}
