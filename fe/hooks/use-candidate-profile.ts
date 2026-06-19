'use client';

import { useState, useEffect, useCallback } from 'react';
import { CandidateProfileResponse, CandidateProfileRequest } from '@/types';
import { toast } from "sonner";
import { CandidateProfileService } from "@/service/candidate-profile.api";

export function useCandidateProfile() {
	const [profile, setProfile] = useState<CandidateProfileResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [error, setError] = useState<unknown | null>(null);

	const fetchProfile = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await CandidateProfileService.getProfile();

			if (response && response.data) {
				setProfile(response.data);
			}
		} catch (err: any) {
			console.error("=== Hook: Lỗi khi gọi API profile ===", err);
			toast.error(err.message || "Không thể tải dữ liệu hồ sơ");
			setError(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchProfile();
	}, [fetchProfile]);

	const updateProfile = async (data: CandidateProfileRequest) => {
		try {
			setIsUpdating(true);
			await CandidateProfileService.editProfile(data);
			toast.success("Cập nhật thông tin thành công!");

			await fetchProfile();
		} catch (err: any) {
			toast.error(err.message || "Có lỗi xảy ra khi lưu thông tin");
			throw err;
		} finally {
			setIsUpdating(false);
		}
	};

	return { profile, isLoading, isUpdating, error, updateProfile };
}