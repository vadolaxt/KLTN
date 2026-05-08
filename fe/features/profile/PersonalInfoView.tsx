'use client';

export default function PersonalInfoView() {
  return (
    <div className="animate-fade-in">
      <div className="text-[13px] font-bold text-green-main uppercase tracking-[2px] mb-1.5">Hồ sơ thí sinh</div>
      <div className="text-[22px] font-extrabold text-green-dark mb-1.5 border-l-5 border-gold pl-3.5">Thông Tin Cá Nhân</div>
      <div className="text-[13px] text-text-light mb-8 pl-[19px]">Vui lòng điền đầy đủ và chính xác các thông tin bên dưới. Thông tin sai lệch có thể ảnh hưởng đến quá trình xét tuyển.</div>

        {/* Photo Upload */}
        <div className="flex gap-7 items-start p-6 bg-green-pale rounded-xl mb-7 border-1.5 border-dashed border-green-light transition-all hover:bg-[#dcedc8] hover:border-green-main">
          <div className="w-[100px] h-[120px] bg-white rounded-lg border-2 border-dashed border-green-main flex flex-col items-center justify-center gap-2 cursor-pointer flex-shrink-0 transition-all hover:border-gold hover:bg-green-pale">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-green-main"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            <span className="text-[11px] text-green-main font-semibold text-center">Tải ảnh<br/>lên</span>
          </div>
          <div className="flex-1">
            <h4 className="text-[14px] font-bold text-green-dark mb-2">Ảnh chân dung (3×4)</h4>
            <p className="text-[12.5px] text-text-mid leading-relaxed">
              Ảnh chụp trong vòng 6 tháng gần nhất, nền trắng hoặc nền sáng.<br/>
              Định dạng: JPG, PNG. Kích thước tối đa: 5MB.<br/>
              Kích thước tối thiểu: 400×533 px (tỷ lệ 3:4).
            </p>
            <div className="mt-2.5 flex gap-2 items-center">
              <button className="bg-green-main text-white border-2 border-green-main px-4 py-1.5 rounded-md text-[12px] font-semibold transition-all hover:bg-green-dark hover:border-green-dark">Chọn ảnh</button>
              <span className="inline-flex items-center gap-1 bg-[#fff8e1] text-[#f57f17] px-2.5 py-1 rounded-full text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>Chưa có ảnh
              </span>
            </div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          {/* Thông tin cơ bản */}
          <div className="col-span-2 h-[1px] bg-gray-mid my-2 relative">
            <span className="absolute top-1/2 left-0 -translate-y-1/2 bg-white pr-3 text-[11px] font-extrabold uppercase tracking-[1px] text-text-light">Thông tin cơ bản</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Họ và tên đệm <span className="text-[#e53935]">*</span></label>
            <input type="text" className="p-[11px_14px] border-1.5 border-green-light rounded-lg text-[14px] text-text-dark bg-white outline-none transition-all focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" defaultValue="Nguyễn Văn" placeholder="Họ và tên đệm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Tên <span className="text-[#e53935]">*</span></label>
            <input type="text" className="p-[11px_14px] border-1.5 border-green-light rounded-lg text-[14px] text-text-dark bg-white outline-none transition-all focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" defaultValue="An" placeholder="Tên" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Ngày sinh <span className="text-[#e53935]">*</span></label>
            <input type="date" className="p-[11px_14px] border-1.5 border-green-light rounded-lg text-[14px] text-text-dark bg-white outline-none transition-all focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" defaultValue="2007-03-15" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Giới tính <span className="text-[#e53935]">*</span></label>
            <select defaultValue="Nam" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Số CCCD/CMND <span className="text-[#e53935]">*</span></label>
            <input type="text" className="p-[11px_14px] border-1.5 border-green-light rounded-lg text-[14px] text-text-dark bg-white outline-none transition-all focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" defaultValue="079207012345" placeholder="12 chữ số" />
            <span className="text-[11px] text-text-light">Số Căn cước công dân gắn chip (12 chữ số)</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Ngày cấp CCCD <span className="text-[#e53935]">*</span></label>
            <input type="date" className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Dân tộc</label>
            <select defaultValue="Kinh" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="Kinh">Kinh</option>
              <option value="Tày">Tày</option>
              <option value="Thái">Thái</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Tôn giáo</label>
            <select defaultValue="Không" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="Không">Không</option>
              <option value="Phật giáo">Phật giáo</option>
              <option value="Thiên Chúa giáo">Thiên Chúa giáo</option>
              <option value="Khác">Khác</option>
            </select>
          </div>

          {/* Thông tin liên hệ */}
          <div className="col-span-2 h-[1px] bg-gray-mid my-2 relative mt-2">
            <span className="absolute top-1/2 left-0 -translate-y-1/2 bg-white pr-3 text-[11px] font-extrabold uppercase tracking-[1px] text-text-light">Thông tin liên hệ</span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Số điện thoại <span className="text-[#e53935]">*</span></label>
            <input type="tel" className="p-[11px_14px] border-1.5 border-green-light rounded-lg text-[14px] text-text-dark bg-white outline-none transition-all focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" defaultValue="0912 345 678" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Email <span className="text-[#e53935]">*</span></label>
            <input type="email" className="p-[11px_14px] border-1.5 border-green-light rounded-lg text-[14px] text-text-dark bg-white outline-none transition-all focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" defaultValue="nguyenvanan@gmail.com" />
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Địa chỉ thường trú <span className="text-[#e53935]">*</span></label>
            <input type="text" className="p-[11px_14px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Tỉnh/Thành phố <span className="text-[#e53935]">*</span></label>
            <select defaultValue="HCM" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="HCM">TP. Hồ Chí Minh</option>
              <option value="HN">Hà Nội</option>
              <option value="DN">Đà Nẵng</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Quận/Huyện <span className="text-[#e53935]">*</span></label>
            <select defaultValue="" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="">-- Chọn quận/huyện --</option>
              <option value="Quận 1">Quận 1</option>
              <option value="Quận 3">Quận 3</option>
              <option value="TP. Thủ Đức">TP. Thủ Đức</option>
            </select>
          </div>

          {/* Thông tin học vấn */}
          <div className="col-span-2 h-[1px] bg-gray-mid my-2 relative mt-2">
            <span className="absolute top-1/2 left-0 -translate-y-1/2 bg-white pr-3 text-[11px] font-extrabold uppercase tracking-[1px] text-text-light">Thông tin học vấn</span>
          </div>

          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Tên trường THPT <span className="text-[#e53935]">*</span></label>
            <input type="text" className="p-[11px_14px] border-1.5 border-green-light rounded-lg text-[14px] text-text-dark bg-white outline-none transition-all focus:border-green-main focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]" defaultValue="THPT Nguyễn Du – TP. Hồ Chí Minh" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Năm tốt nghiệp <span className="text-[#e53935]">*</span></label>
            <select defaultValue="2025" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Hạnh kiểm trung bình 3 năm</label>
            <select defaultValue="Tốt" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="Tốt">Tốt</option>
              <option value="Khá">Khá</option>
              <option value="Trung bình">Trung bình</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Đối tượng ưu tiên</label>
            <select defaultValue="KV2 – Nông thôn" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="Không có">Không có</option>
              <option value="KV2 – Nông thôn">KV2 – Nông thôn</option>
              <option value="KV1 – Vùng khó khăn">KV1 – Vùng khó khăn</option>
              <option value="UT1 – Con thương binh">UT1 – Con thương binh</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-bold uppercase tracking-[0.8px] text-text-mid">Khu vực</label>
            <select defaultValue="KV2 – Ngoại thành, thị xã" className="py-[11px] pl-[14px] pr-[36px] border-1.5 border-gray-mid rounded-lg text-[14px] text-text-dark bg-[#fafafa] outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:shadow-[0_0_0_3px_rgba(45,122,45,0.12)]">
              <option value="KV3 – Thành thị">KV3 – Thành thị</option>
              <option value="KV2 – Ngoại thành, thị xã">KV2 – Ngoại thành, thị xã</option>
              <option value="KV2-NT – Nông thôn">KV2-NT – Nông thôn</option>
              <option value="KV1 – Vùng ưu tiên">KV1 – Vùng ưu tiên</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-mid">
          <button className="px-6 py-2.5 border-2 border-gray-mid text-text-mid bg-white rounded-lg text-[14px] font-semibold transition-all hover:bg-gray-light hover:border-[#bbb] hover:text-text-dark">Hủy thay đổi</button>
          <button className="px-7 py-2.5 bg-green-main text-white border-2 border-green-main rounded-lg text-[14px] font-bold flex items-center gap-2 transition-all hover:bg-green-dark hover:border-green-dark hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(45,122,45,0.3)]">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M17 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
            Lưu thông tin
          </button>
        </div>
    </div>
  );
}
