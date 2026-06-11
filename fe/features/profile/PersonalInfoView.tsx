'use client';

import type { ReactNode } from 'react';
import { CalendarDays, IdCard, MapPin, Save, UserRound } from 'lucide-react';

const inputClass =
  'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3.5 py-2.5 text-[14px] font-semibold text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]';

const labelClass = 'text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light';

const FieldLabel = ({ children, required = false }: { children: ReactNode; required?: boolean }) => (
  <label className={labelClass}>
    {children}
    {required && <span className="ml-1 text-[#e53935]">*</span>}
  </label>
);

const SectionHeading = ({
  icon,
  title,
}: {
  icon: ReactNode;
  title: string;
}) => (
  <div className="mb-5 flex items-center gap-3 border-b border-gray-mid pb-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-pale text-green-main">
      {icon}
    </div>
    <h2 className="text-[17px] font-extrabold text-green-dark">{title}</h2>
  </div>
);

export default function PersonalInfoView() {
  return (
    <div className="animate-fade-in">
      <div className="mb-1.5 text-[13px] font-bold uppercase tracking-[2px] text-green-main">Hồ sơ thí sinh</div>
      <div className="mb-7 border-l-5 border-gold pl-3.5 text-[22px] font-extrabold text-green-dark">
        Quản lý thông tin cá nhân
      </div>

      <form className="space-y-8">
        <section>
          <SectionHeading icon={<UserRound size={19} />} title="Thông tin tài khoản" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Họ và tên đệm</FieldLabel>
              <input className={inputClass} defaultValue="Nguyễn Văn" name="lastName" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Tên</FieldLabel>
              <input className={inputClass} defaultValue="An" name="firstName" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Ngày sinh</FieldLabel>
              <input className={inputClass} defaultValue="2007-03-15" name="dob" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Email</FieldLabel>
              <input className={inputClass} defaultValue="nguyenvanan@gmail.com" name="email" type="email" />
            </div>
          </div>
        </section>

        <section>
          <SectionHeading icon={<IdCard size={19} />} title="Căn cước công dân" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Số CCCD</FieldLabel>
              <input className={inputClass} defaultValue="079207012345" inputMode="numeric" name="identityCard.number" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Ngày cấp</FieldLabel>
              <input className={inputClass} name="identityCard.issuedDate" type="date" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Nơi cấp</FieldLabel>
              <input className={inputClass} defaultValue="Cục Cảnh sát QLHC về TTXH" name="identityCard.issuedPlace" />
            </div>
          </div>
        </section>

        <section>
          <SectionHeading icon={<MapPin size={19} />} title="Hồ sơ thí sinh" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Giới tính</FieldLabel>
              <select className={inputClass} defaultValue="Nam" name="sex">
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Dân tộc</FieldLabel>
              <input className={inputClass} defaultValue="Kinh" name="ethnic" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel required>Năm tốt nghiệp</FieldLabel>
              <select className={inputClass} defaultValue="2026" name="graduateYear">
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Nơi sinh</FieldLabel>
              <input className={inputClass} defaultValue="TP. Hồ Chí Minh" name="birthPlace" />
            </div>
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <FieldLabel required>Địa chỉ liên hệ</FieldLabel>
              <textarea
                className={`${inputClass} min-h-[96px] resize-y leading-relaxed`}
                defaultValue="12 Nguyễn Văn Bảo, phường 4, quận Gò Vấp, TP. Hồ Chí Minh"
                name="address"
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border-1.5 border-gray-mid bg-gray-light px-4 py-3">
          <div className="flex flex-wrap items-center gap-3 text-[13px] font-semibold text-text-mid">
            <CalendarDays size={17} className="text-green-main" />
            <span>Cập nhật lần cuối: Chưa có thay đổi mới.</span>
          </div>
        </section>

        <div className="flex justify-end gap-3 border-t border-gray-mid pt-6">
          <button
            type="button"
            className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light hover:text-text-dark"
          >
            Hủy thay đổi
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark hover:shadow-[0_4px_16px_rgba(45,122,45,0.25)]"
          >
            <Save size={17} />
            Lưu thông tin
          </button>
        </div>
      </form>
    </div>
  );
}
