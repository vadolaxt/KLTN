'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdmin } from '@/hooks/use-admin';

import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardOverview from './components/DashboardOverview';
import UserManagement from './components/user-manage/UserManagement';
import AdmissionManagement from './components/AdmissionManagement';
import NewsManagement from './components/NewsManagement';

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

	useEffect(() => {
		if (!isCheckingAuth && !isAuthenticated) {
			router.replace(isForbidden ? '/homepage' : '/login');
		}
	}, [isAuthenticated, isCheckingAuth, isForbidden, router]);

	const handleLogout = async () => {
		await logout();
		router.push('/homepage');
		router.refresh();
	};

	if (isCheckingAuth || !isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center font-vietnam bg-[linear-gradient(135deg,#f4f9f4_0%,#ffffff_50%,#f0f7f0_100%)] relative px-4 overflow-hidden">
				<div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(45,122,45,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(45,122,45,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
				<div className="absolute -left-40 -top-40 w-96 h-96 rounded-full bg-green-light/5 blur-3xl" />
				<div className="absolute -right-40 -bottom-40 w-96 h-96 rounded-full bg-green-main/5 blur-3xl" />

				<div className="relative z-10 rounded-3xl border border-green-main/10 bg-white/90 px-8 py-6 text-center shadow-xl">
					<div className="text-sm font-bold uppercase tracking-[0.2em] text-green-main">
						Hệ thống quản trị
					</div>
					<div className="mt-3 text-2xl font-black text-green-dark">
						{isCheckingAuth
							? 'Đang kiểm tra đăng nhập...'
							: isForbidden
								? 'Không có quyền quản trị'
								: 'Đang chuyển đến trang đăng nhập...'}
					</div>
					<p className="mt-2 text-sm text-text-light">
						{isForbidden
							? 'Tài khoản hiện tại không có quyền quản trị.'
							: 'Admin dùng chung tài khoản đăng nhập của hệ thống.'}
					</p>
				</div>
			</div>
		);
	}

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
					</div>
				</main>
			</div>
		</div>
	);
}
