'use client';

import { useState, useEffect, useCallback } from 'react';
import { CandidateProfileResponse, CertificateResultRequest } from '@/types';
import { CandidateProfileService } from "@/service/candidate-profile.api";
import { toast } from "sonner";

export function useCertificate() {
	const [profileData, setProfileData] = useState<CandidateProfileResponse | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isUpdating, setIsUpdating] = useState<boolean>(false);
	const [error, setError] = useState<unknown | null>(null);

	const fetchCertificateInfo = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await CandidateProfileService.getProfile();

			if (response && response.data) {
				setProfileData(response.data);
			}
		} catch (err: any) {
			console.error("=== Hook Certificate: Lỗi lấy dữ liệu ===", err);
			toast.error(err.message || "Không thể tải dữ liệu chứng chỉ");
			setError(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	const updateCertificate = async (request: CertificateResultRequest) => {
		try {
			setIsUpdating(true);
			await CandidateProfileService.editCertificate(request);
			toast.success("Cập nhật chứng chỉ thành công!");

			// Refresh lại dữ liệu sau khi update thành công
			await fetchCertificateInfo();
		} catch (err: any) {
			console.error("Lỗi cập nhật chứng chỉ:", err);
			toast.error(err.message || "Có lỗi xảy ra khi lưu thông tin");
			throw err;
		} finally {
			setIsUpdating(false);
		}
	};

	useEffect(() => {
		fetchCertificateInfo();
	}, [fetchCertificateInfo]);

	return { profileData, isLoading, isUpdating, error, refetch: fetchCertificateInfo, updateCertificate };
}