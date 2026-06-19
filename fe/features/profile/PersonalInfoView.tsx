'use client';

import {FormEvent, ReactNode} from 'react';
import {CalendarDays, IdCard, MapPin, Save, UserRound, Loader2} from 'lucide-react';
import {useCandidateProfile} from "@/hooks/use-candidate-profile";
import {CandidateProfileRequest} from "@/types";

const inputClass =
	'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3.5 py-2.5 text-[14px] font-semibold text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)] disabled:opacity-60';

const labelClass = 'text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light';

const FieldLabel = ({children, required = false}: { children: ReactNode; required?: boolean }) => (
	<label className={labelClass}>
		{children}
		{required && <span className="ml-1 text-[#e53935]">*</span>}
	</label>
);

const SectionHeading = ({icon, title}: { icon: ReactNode; title: string; }) => (
	<div className="mb-5 flex items-center gap-3 border-b border-gray-mid pb-3">
		<div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-pale text-green-main">
			{icon}
		</div>
		<h2 className="text-[17px] font-extrabold text-green-dark">{title}</h2>
	</div>
);

const formatDateForInput = (dateString?: string | Date | null) => {
	if (!dateString) return "";
	try {
		return new Date(dateString).toISOString().split('T')[0];
	} catch (e) {
		return "";
	}
};

export default function PersonalInfoView() {
	const {profile, isLoading, isUpdating, updateProfile} = useCandidateProfile();

	if (isLoading) {
		return <div className="p-5 text-center font-semibold text-text-mid animate-pulse">Đang tải thông tin hồ sơ...</div>;
	}

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const requestData: CandidateProfileRequest = {
			firstName: formData.get("firstName") as string,
			lastName: formData.get("lastName") as string,
			email: formData.get("email") as string,
			dob: formData.get("dob") ? new Date(formData.get("dob") as string).toISOString() : "",
			identityCard: {
				number: formData.get("identityCard.number") as string,
				issuedDate: formData.get("identityCard.issuedDate") ? new Date(formData.get("identityCard.issuedDate") as string).toISOString() : "", issuedPlace: formData.get("identityCard.issuedPlace") as string,
			},

			sex: formData.get("sex") as string,
			ethnic: formData.get("ethnic") as string,
			graduateYear: (formData.get("graduateYear") as string) || new Date().getFullYear().toString(),
			birthPlace: formData.get("birthPlace") as string,
			address: formData.get("address") as string,
		};

		try {
			await updateProfile(requestData);
		} catch (error) {
			// Lỗi đã được xử lý hiển thị toast ở Hook
			console.log("Submit failed", error);
		}
	};

	return (
		<div className="animate-fade-in">
			<div className="mb-1.5 text-[13px] font-bold uppercase tracking-[2px] text-green-main">Hồ sơ thí sinh</div>
			<div className="mb-7 border-l-5 border-gold pl-3.5 text-[22px] font-extrabold text-green-dark">
				Quản lý thông tin cá nhân
			</div>

			<form className="space-y-8" onSubmit={handleSubmit}>
				<section>
					<SectionHeading icon={<UserRound size={19}/>} title="Thông tin tài khoản"/>
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>Họ và tên đệm</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={profile?.firstName || ""} name="firstName"/>
						</div>
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>Tên</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={profile?.lastName || ""} name="lastName"/>
						</div>
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>Ngày sinh</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={formatDateForInput(profile?.dob)} name="dob" type="date"/>
						</div>
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>Email</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={profile?.email || ""} name="email" type="email"/>
						</div>
					</div>
				</section>

				<section>
					<SectionHeading icon={<IdCard size={19}/>} title="Căn cước công dân"/>
					<div className="grid grid-cols-1 gap-5 md:grid-cols-3">
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>Số CCCD</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={profile?.identityCard?.number || ""} inputMode="numeric" name="identityCard.number"/>
						</div>
						<div className="flex flex-col gap-1.5">
							<FieldLabel>Ngày cấp</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={formatDateForInput(profile?.identityCard?.issuedDate)} name="identityCard.issuedDate" type="date"/>
						</div>
						<div className="flex flex-col gap-1.5">
							<FieldLabel>Nơi cấp</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={profile?.identityCard?.issuedPlace || ""} name="identityCard.issuedPlace"/>
						</div>
					</div>
				</section>

				<section>
					<SectionHeading icon={<MapPin size={19}/>} title="Hồ sơ thí sinh"/>
					<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>Giới tính</FieldLabel>
							<select disabled={isUpdating} className={inputClass} defaultValue={profile?.sex || "Nam"} name="sex">
								<option value="Nam">Nam</option>
								<option value="Nữ">Nữ</option>
								<option value="Khác">Khác</option>
							</select>
						</div>
						<div className="flex flex-col gap-1.5">
							<FieldLabel>Dân tộc</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={profile?.ethnic || ""} name="ethnic"/>
						</div>
						<div className="flex flex-col gap-1.5">
							<FieldLabel required>Năm tốt nghiệp</FieldLabel>
							<select disabled={isUpdating} className={inputClass} defaultValue={profile?.graduateYear || 2026} name="graduateYear">
								<option value="2026">2026</option>
								<option value="2025">2025</option>
								<option value="2024">2024</option>
								<option value="2023">2023</option>
							</select>
						</div>
						<div className="flex flex-col gap-1.5">
							<FieldLabel>Nơi sinh</FieldLabel>
							<input disabled={isUpdating} className={inputClass} defaultValue={profile?.birthPlace === "N/A" ? "" : profile?.birthPlace} name="birthPlace"/>
						</div>
						<div className="flex flex-col gap-1.5 md:col-span-2">
							<FieldLabel required>Địa chỉ liên hệ</FieldLabel>
							<textarea
								disabled={isUpdating}
								className={`${inputClass} min-h-[96px] resize-y leading-relaxed`}
								defaultValue={profile?.address === "N/A" ? "" : profile?.address}
								name="address"
							/>
						</div>
					</div>
				</section>

				<div className="flex justify-end gap-3 border-t border-gray-mid pt-6">
					<button
						type="button"
						disabled={isUpdating}
						onClick={() => window.location.reload()}
						className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light hover:text-text-dark disabled:opacity-60"
					>
						Hủy thay đổi
					</button>
					<button
						type="submit"
						disabled={isUpdating}
						className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark hover:shadow-[0_4px_16px_rgba(45,122,45,0.25)] disabled:opacity-60"
					>
						{isUpdating ? <Loader2 size={17} className="animate-spin"/> : <Save size={17}/>}
						{isUpdating ? "Đang lưu..." : "Lưu thông tin"}
					</button>
				</div>
			</form>
		</div>
	);
}