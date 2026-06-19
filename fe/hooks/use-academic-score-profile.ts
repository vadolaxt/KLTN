import { useState, useEffect, useCallback } from 'react';
import { AcademicScoreProfileService } from "@/service/academicScoreProfile.api";
import { AcademicScoreProfileRequest } from "@/types/academicScoreProfile";

export function useAcademicProfile() {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [error, setError] = useState<any>(null);

	const fetchAcademicProfile = useCallback(async () => {
		try {
			setLoading(true);
			const response = await AcademicScoreProfileService.getAcademicScoreProfile();
			console.log('>>> Academic Score Profile Data từ Hook:', response);
			setData(response);
		} catch (err) {
			console.error('>>> Error fetching academic profile từ Hook:', err);
			setError(err);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAcademicProfile();
	}, [fetchAcademicProfile]);

	// Hook xử lý lưu dữ liệu
	const saveProfile = useCallback(async (payload: AcademicScoreProfileRequest) => {
		try {
			setIsSaving(true);
			await AcademicScoreProfileService.editAcademicScoreProfile(payload);
			// Sau khi lưu thành công, kéo lại dữ liệu mới từ Server để cập nhật điểm trung bình (schoolRecordAvg)
			await fetchAcademicProfile();
			return { success: true };
		} catch (err) {
			console.error('>>> Error saving academic profile:', err);
			return { success: false, error: err };
		} finally {
			setIsSaving(false);
		}
	}, [fetchAcademicProfile]);

	return {
		data,
		loading,
		isSaving, // Trạng thái hiển thị spin khi đang lưu
		error,
		refetch: fetchAcademicProfile,
		saveProfile
	};
}

export function useAcademicFormSync(profileData: any) {
	const [localHocBa, setLocalHocBa] = useState<Record<string, Record<string, string>>>({});
	const [localThpt, setLocalThpt] = useState<Record<string, string>>({});
	const [localDgnl, setLocalDgnl] = useState<string>('');

	const syncData = useCallback(() => {
		if (!profileData) return;

		const schoolRecords = profileData.schoolRecord?.subjectScoreRecords || [];
		const nationalRecords = profileData.nationalExamResult?.subjectScores || [];
		const dgnlScore = profileData.competencyTestResult?.score || 0;

		const hocBaObj: Record<string, Record<string, string>> = {};
		schoolRecords.forEach((r: any) => {
			if (!hocBaObj[r.subject.id]) hocBaObj[r.subject.id] = {};
			hocBaObj[r.subject.id][`${r.gradeLevel}-${r.semester}`] = r.score === 0 ? '' : String(r.score);
		});
		setLocalHocBa(hocBaObj);

		const thptObj: Record<string, string> = {};
		nationalRecords.forEach((r: any) => {
			thptObj[r.subject.id] = r.score === 0 ? '' : String(r.score);
		});
		setLocalThpt(thptObj);

		setLocalDgnl(dgnlScore === 0 ? '' : String(dgnlScore));
	}, [profileData]);

	useEffect(() => {
		syncData();
	}, [syncData]);

	return {
		localHocBa,
		setLocalHocBa,
		localThpt,
		setLocalThpt,
		localDgnl,
		setLocalDgnl,
		syncData,
	};
}