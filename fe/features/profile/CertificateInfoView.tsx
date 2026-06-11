'use client';

import { useMemo, useState } from 'react';
import { Award, CalendarDays, FileText, Save, ShieldCheck, UploadCloud } from 'lucide-react';

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
  'w-full rounded-lg border-1.5 border-gray-mid bg-[#fafafa] px-3.5 py-2.5 text-[14px] font-semibold text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]';

const labelClass = 'text-[12px] font-extrabold uppercase tracking-[0.7px] text-text-light';

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.max(size / 1024, 1).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export default function CertificateInfoView() {
  const [form, setForm] = useState<CertificateForm>({
    fullName: 'Phạm Ngọc Thiện',
    identity: '056304011073',
    certificateType: '',
    organization: '',
    score: '',
    issuedDate: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileStatus = useMemo(() => {
    if (!selectedFile) {
      return 'Chưa chọn file chứng chỉ';
    }

    return `${selectedFile.name} - ${formatFileSize(selectedFile.size)}`;
  }, [selectedFile]);

  const updateField = (field: keyof CertificateForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-1.5 text-[13px] font-bold uppercase tracking-[2px] text-green-main">Hồ sơ thí sinh</div>
      <div className="mb-7 border-l-5 border-gold pl-3.5 text-[22px] font-extrabold text-green-dark">
        Cập nhật chứng chỉ tiếng Anh
      </div>

      <div>
        <form className="rounded-lg border-1.5 border-gray-mid bg-white p-6">
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

          <section className="mb-7">
            <div className="mb-4 flex items-center gap-2 text-[15px] font-extrabold text-green-dark">
              <ShieldCheck size={18} className="text-green-main" />
              Thông tin thí sinh
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Họ và tên thí sinh</span>
                <input className={inputClass} value={form.fullName} onChange={(event) => updateField('fullName', event.target.value)} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>CCCD/CMND</span>
                <input
                  className={inputClass}
                  inputMode="numeric"
                  value={form.identity}
                  onChange={(event) => updateField('identity', event.target.value.replace(/\D/g, '').slice(0, 12))}
                />
              </label>
            </div>
          </section>

          <section className="mb-7">
            <div className="mb-4 flex items-center gap-2 text-[15px] font-extrabold text-green-dark">
              <FileText size={18} className="text-green-main" />
              Thông tin chứng chỉ
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Tên chứng chỉ</span>
                <select className={inputClass} value={form.certificateType} onChange={(event) => updateField('certificateType', event.target.value)}>
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
                <select className={inputClass} value={form.organization} onChange={(event) => updateField('organization', event.target.value)}>
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
                <input className={inputClass} type="date" value={form.issuedDate} onChange={(event) => updateField('issuedDate', event.target.value)} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={labelClass}>Điểm thực tế</span>
                <input
                  className={inputClass}
                  inputMode="decimal"
                  placeholder="Ví dụ: 6.5"
                  value={form.score}
                  onChange={(event) => updateField('score', event.target.value.replace(',', '.').replace(/[^\d.]/g, '').slice(0, 5))}
                />
              </label>
            </div>
          </section>

          <section className="mb-7">
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-green-light bg-green-pale px-5 py-7 text-center transition-all hover:border-green-main hover:bg-white">
              <UploadCloud size={34} className="mb-3 text-green-main" />
              <span className="text-[14px] font-extrabold text-green-dark">Tải file minh chứng chứng chỉ</span>
              <span className="mt-1 text-[12px] font-semibold text-text-light">PDF, JPG, JPEG. Dung lượng tối đa 1MB.</span>
              <span className="mt-3 rounded-md bg-white px-3 py-1.5 text-[12px] font-bold text-green-main">{fileStatus}</span>
              <input
                accept=".pdf,.jpg,.jpeg"
                className="hidden"
                type="file"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
            </label>
          </section>

          <div className="flex justify-end gap-3 border-t border-gray-mid pt-5">
            <button
              className="rounded-lg border-2 border-gray-mid bg-white px-6 py-2.5 text-[14px] font-semibold text-text-mid transition-all hover:bg-gray-light hover:text-text-dark"
              type="button"
            >
              Hủy thay đổi
            </button>
            <button
              className="inline-flex items-center gap-2 rounded-lg border-2 border-green-main bg-green-main px-7 py-2.5 text-[14px] font-bold text-white transition-all hover:border-green-dark hover:bg-green-dark"
              type="button"
            >
              <Save size={17} />
              Lưu chứng chỉ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
