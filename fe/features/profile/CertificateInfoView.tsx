'use client';

import { useEffect, useMemo, useState } from 'react';
import { Award, CalendarDays, FileText, Save, ShieldCheck, UploadCloud, FileIcon, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { useCertificate } from "@/hooks/use-certificate-result";
import { UploadImageService } from "@/service/upload-image.api";
import { CertificateResultRequest } from "@/types";

type CertificateForm = {
	fullName: string;
	identity: string;
	certificateType: string;
	organization: string;
	score: string;
	issuedDate: string;
};

const certificateTypes = ['IELTS', 'TOEFL ITP'];
const organizations = ['British Council (BC)', 'International Development Program (IDP)'];

const inputClass =
	'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3.5 py-2.5 text-[14px] font-semibold text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)] disabled:opacity-60 disabled:bg-gray-100 disabled:cursor-not-allowed';

const labelClass = 'text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light';

const formatFileSize = (size: number) => {
	if (size < 1024 * 1024) {
		return `${Math.max(size / 1024, 1).toFixed(1)} KB`;
	}
	return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDateForInput = (dateString?: string | null) => {
	if (!dateString) return "";
	try {
		return new Date(dateString).toISOString().split('T')[0];
	} catch (e) {
		return "";
	}
};

export default function CertificateInfoView() {
	const { profileData, isLoading, isUpdating, updateCertificate } = useCertificate();

	const [form, setForm] = useState<CertificateForm>({
		fullName: '',
		identity: '',
		certificateType: '',
		organization: '',
		score: '',
		issuedDate: '',
	});

	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	// Lấy URL hiện tại từ API (nếu có)
	const existingImageUrl = (profileData?.certificateResult as any)?.imageUrl || "";
	const isExistingPdf = existingImageUrl.toLowerCase().endsWith('.pdf');

	useEffect(() => {
		if (profileData) {
			setForm({
				fullName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
				identity: profileData.identityCard?.number || '',
				certificateType: profileData.certificateResult?.certificateType || '',
				organization: profileData.certificateResult?.organization || '',
				score: profileData.certificateResult?.score?.toString() || '',
				issuedDate: formatDateForInput(profileData.certificateResult?.issuedDate),
			});
		}
	}, [profileData]);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0] ?? null;
		setSelectedFile(file);

		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}

		if (file && file.type.startsWith('image/')) {
			const url = URL.createObjectURL(file);
			setPreviewUrl(url);
		}
	};

	const handleRemoveFile = (e: React.MouseEvent) => {
		e.preventDefault();
		setSelectedFile(null);
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			setPreviewUrl(null);
		}
		// Clear input value để có thể chọn lại đúng file đó
		const fileInput = document.getElementById('certificate-upload') as HTMLInputElement;
		if (fileInput) fileInput.value = '';
	};

	const fileStatus = useMemo(() => {
		if (!selectedFile) {
			return 'Chưa chọn file chứng chỉ mới';
		}
		return `${selectedFile.name} - ${formatFileSize(selectedFile.size)}`;
	}, [selectedFile]);

	const updateField = (field: keyof CertificateForm, value: string) => {
		setForm((current) => ({ ...current, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		let finalImageUrl = existingImageUrl;

		try {
			if (selectedFile) {
				const formData = new FormData();
				formData.append("file", selectedFile);

				const uploadRes = await UploadImageService.upload(formData);
				if (uploadRes.data) {
					finalImageUrl = uploadRes.data;
				}
			}

			const requestPayload: CertificateResultRequest = {
				certificateType: form.certificateType,
				organization: form.organization,
				issuedDate: form.issuedDate ? new Date(form.issuedDate).toISOString() : "",
				score: parseFloat(form.score) || 0,
				imageUrl: finalImageUrl,
			};

			await updateCertificate(requestPayload);

			setSelectedFile(null);
			setPreviewUrl(null);
		} catch (error) {
			console.log("Cập nhật thất bại", error);
		}
	};

	// GIAO DIỆN KHI ĐANG FETCH DATA TỪ API
	if (isLoading) {
		return (
			<div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-4 rounded-xl border-1.5 border-gray-mid bg-white p-8 shadow-sm animate-fade-in">
				<div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-green-pale">
					<Loader2 size={32} className="animate-spin text-green-main" />
				</div>
				<div className="flex flex-col items-center gap-1">
					<span className="text-[16px] font-extrabold text-green-dark">Đang tải hồ sơ chứng chỉ</span>
					<span className="text-[13px] font-semibold text-text-light animate-pulse">Vui lòng đợi trong giây lát...</span>
				</div>
			</div>
		);
	}

	return (
		<div className="animate-fade-in">
			<div className="mb-1.5 text-[13px] font-bold uppercase tracking-[2px] text-green-main">Hồ sơ thí sinh</div>
			<div className="mb-7 border-l-5 border-gold pl-3.5 text-[22px] font-extrabold text-green-dark">
				Cập nhật chứng chỉ tiếng Anh
			</div>

			<div className="relative">
				{/* Lớp phủ mờ khóa form khi đang submit */}
				{isUpdating && (
					<div className="absolute inset-0 z-10 rounded-lg bg-white/50 backdrop-blur-[1px] transition-all" />
				)}

				<form onSubmit={handleSubmit} className="rounded-lg border-1.5 border-gray-mid bg-white p-6 relative z-0">
					{/* Header section */}
					<div className="mb-6 flex flex-col gap-3 border-b border-gray-mid pb-5 md:flex-row md:items-start md:justify-between">
						<div>
							<div className="inline-flex items-center gap-2 rounded-md bg-green-pale px-3 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.7px] text-green-main">
								<Award size={15} />
								Chứng chỉ quốc tế
							</div>
							<h1 className="mt-3 text-[21px] font-black leading-snug text-green-dark">
								Cập nhật điểm và minh chứng chứng chỉ tiếng Anh
							</h1>
						</div>
						<div className="flex w-fit items-center gap-2 rounded-lg border border-green-light bg-green-pale px-3 py-2 text-[12px] font-bold text-green-dark">
							<CalendarDays size={16} />
							Tuyển sinh 2026
						</div>
					</div>

					{/* Thí sinh section - Đã khóa sửa đổi */}
					<section className="mb-7">
						<div className="mb-4 flex items-center gap-2 text-[15px] font-extrabold text-green-dark">
							<ShieldCheck size={18} className="text-green-main" />
							Thông tin thí sinh
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<label className="flex flex-col gap-1.5">
								<span className={labelClass}>Họ và tên thí sinh</span>
								<input disabled className={inputClass} value={form.fullName} />
							</label>
							<label className="flex flex-col gap-1.5">
								<span className={labelClass}>CCCD/CMND</span>
								<input disabled className={inputClass} value={form.identity} />
							</label>
						</div>
					</section>

					{/* Chứng chỉ section */}
					<section className="mb-7">
						<div className="mb-4 flex items-center gap-2 text-[15px] font-extrabold text-green-dark">
							<FileText size={18} className="text-green-main" />
							Thông tin chứng chỉ
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<label className="flex flex-col gap-1.5">
								<span className={labelClass}>Tên chứng chỉ</span>
								<select disabled={isUpdating} className={inputClass} value={form.certificateType} onChange={(event) => updateField('certificateType', event.target.value)}>
									<option value="">Chọn chứng chỉ</option>
									{certificateTypes.map((certificate) => (
										<option key={certificate} value={certificate}>
											{certificate}
										</option>
									))}
								</select>
							</label>
							<label className="flex flex-col gap-1.5">
								<span className={labelClass}>Đơn vị cấp chứng chỉ</span>
								<select disabled={isUpdating} className={inputClass} value={form.organization} onChange={(event) => updateField('organization', event.target.value)}>
									<option value="">Chọn đơn vị cấp</option>
									{organizations.map((organization) => (
										<option key={organization} value={organization}>
											{organization}
										</option>
									))}
								</select>
							</label>
							<label className="flex flex-col gap-1.5">
								<span className={labelClass}>Ngày bắt đầu hiệu lực</span>
								<input disabled={isUpdating} className={inputClass} type="date" value={form.issuedDate} onChange={(event) => updateField('issuedDate', event.target.value)} />
							</label>
							<label className="flex flex-col gap-1.5">
								<span className={labelClass}>Điểm thực tế</span>
								<input
									disabled={isUpdating}
									className={inputClass}
									inputMode="decimal"
									placeholder="Ví dụ: 6.5"
									value={form.score}
									onChange={(event) => updateField('score', event.target.value.replace(',', '.').replace(/[^\d.]/g, '').slice(0, 5))}
								/>
							</label>
						</div>
					</section>

					{/* Upload & Preview section */}
					<section className="mb-7">
						<label className={`group relative flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-light bg-green-pale px-5 py-6 text-center transition-all hover:border-green-main hover:bg-white ${isUpdating ? 'pointer-events-none opacity-60' : ''}`}>

							{/* Nút Xóa File (Chỉ hiện khi có chọn file mới) */}
							{selectedFile && (
								<button
									onClick={handleRemoveFile}
									className="absolute right-3 top-3 z-10 rounded-full bg-gray-dark/10 p-1.5 text-text-mid transition-all hover:bg-[#e53935] hover:text-white"
									title="Xóa file đã chọn"
								>
									<X size={16} />
								</button>
							)}

							{/* Ưu tiên 1: Hiển thị Preview Ảnh của file MỚI được chọn */}
							{previewUrl ? (
									<div className="flex flex-col items-center gap-3 animate-fade-in">
										<div className="relative max-h-[140px] max-w-[240px] overflow-hidden rounded-md border border-gray-mid shadow-sm bg-white">
											<img
												src={previewUrl}
												alt="Certificate preview"
												className="h-full w-full object-contain p-1"
											/>
										</div>
										<span className="rounded-md bg-white px-3 py-1 text-[12px] font-bold text-green-main shadow-sm border border-green-light">
										{fileStatus}
									</span>
									</div>
								) :
								/* Ưu tiên 2: Hiển thị icon File của file MỚI (nếu là dạng PDF) */
								selectedFile ? (
										<div className="flex flex-col items-center animate-fade-in">
											<FileIcon size={40} className="mb-2 text-gold animate-bounce" />
											<span className="text-[14px] font-extrabold text-green-dark">Tài liệu đã được chọn</span>
											<span className="mt-3 rounded-md bg-white px-3 py-1.5 text-[12px] font-bold text-green-main shadow-sm border border-green-light">
										{fileStatus}
									</span>
										</div>
									) :
									/* Ưu tiên 3: Hiển thị Ảnh hoặc Tài liệu TỪ API (đã lưu từ trước) */
									existingImageUrl ? (
											<div className="flex flex-col items-center gap-3 animate-fade-in">
												{isExistingPdf ? (
													<FileIcon size={40} className="mb-2 text-green-main" />
												) : (
													<div className="relative max-h-[140px] max-w-[240px] overflow-hidden rounded-md border border-gray-mid shadow-sm bg-white">
														<img
															src={existingImageUrl}
															alt="Saved Certificate"
															className="h-full w-full object-contain p-1"
														/>
													</div>
												)}
												<div className="flex flex-col items-center">
													<span className="text-[14px] font-extrabold text-green-dark">Tài liệu minh chứng hiện tại</span>
													<span className="mt-2 rounded-md bg-white px-3 py-1 text-[12px] font-bold text-green-main shadow-sm border border-green-light group-hover:bg-green-pale">
											Nhấn vào để tải lên file mới thay thế
										</span>
												</div>
											</div>
										) :
										/* Default: Giao diện trống khi chưa có gì */
										(
											<>
												<UploadCloud size={34} className="mb-3 text-green-main group-hover:scale-110 transition-transform" />
												<span className="text-[14px] font-extrabold text-green-dark">Tải file minh chứng chứng chỉ</span>
												<span className="mt-1 text-[12px] font-semibold text-text-light">PDF, JPG, JPEG. Dung lượng tối đa 1MB.</span>
												<span className="mt-3 rounded-md bg-white px-3 py-1.5 text-[12px] font-bold text-green-main shadow-sm">
										Chưa có tệp nào
									</span>
											</>
										)}

							<input
								id="certificate-upload"
								disabled={isUpdating}
								accept=".pdf,.jpg,.jpeg"
								className="hidden"
								type="file"
								onChange={handleFileChange}
							/>
						</label>
					</section>

					{/* Action buttons */}
					<div className="flex justify-end gap-3 border-t border-gray-mid pt-5">
						<button
							disabled={isUpdating}
							className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light hover:text-text-dark disabled:opacity-60 disabled:cursor-not-allowed"
							type="button"
							onClick={() => window.location.reload()}
						>
							Hủy thay đổi
						</button>
						<button
							disabled={isUpdating}
							className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark disabled:opacity-60 disabled:cursor-not-allowed"
							type="submit"
						>
							{isUpdating ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
							{isUpdating ? 'Đang xử lý...' : 'Lưu chứng chỉ'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}