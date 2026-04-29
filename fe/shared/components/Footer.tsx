// ─────────────────────────────────────────────
// Footer — Footer toàn trang
// ─────────────────────────────────────────────

import Link from 'next/link';

const FOOTER_COLS = [
  {
    title: 'Tuyển sinh',
    links: [
      { label: 'Đề án tuyển sinh 2025', href: '#' },
      { label: 'Phương thức xét tuyển', href: '#' },
      { label: 'Ngành đào tạo', href: '#' },
      { label: 'Học phí', href: '#' },
      { label: 'Ký túc xá', href: '#' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Tra cứu tuyển sinh', href: '#' },
      { label: 'Quản lý hồ sơ', href: '#' },
      { label: 'Cẩm nang tuyển sinh', href: '#' },
      { label: 'Câu hỏi thường gặp', href: '#' },
      { label: 'Liên hệ tư vấn', href: '#' },
    ],
  },
  {
    title: 'Nhà trường',
    links: [
      { label: 'Giới thiệu', href: '#' },
      { label: 'Đào tạo', href: '#' },
      { label: 'Nghiên cứu khoa học', href: '#' },
      { label: 'Hợp tác quốc tế', href: '#' },
      { label: 'Cựu sinh viên', href: '#' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="px-10 pt-10 pb-6 bg-green-dark text-[#a8d8a8]">
      <div className="grid gap-10 mb-8 grid-cols-[2fr_1fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3.5 mb-3.5">
            <div className="w-[58px] h-[58px] rounded-full flex items-center justify-center text-[18px] font-black text-white flex-shrink-0 bg-white/10 border-[3px] border-gold">
              NLU
            </div>
            <div>
              <div className="text-[14px] font-extrabold uppercase text-white leading-tight">
                Trường Đại Học Nông Lâm TP. HCM
              </div>
              <div className="text-[10px] uppercase tracking-[0.5px] text-[#8bc88b]">
                University of Agriculture &amp; Forestry Ho Chi Minh City
              </div>
            </div>
          </div>
          <p className="text-[13px] leading-[1.7] text-[#8bc88b]">
            Địa chỉ: KP 6, P. Linh Trung, TP. Thủ Đức, TP. HCM
            <br />
            Điện thoại: 028 3896 6780
            <br />
            Email: tuyensinh@hcmuaf.edu.vn
          </p>
        </div>

        {/* Link columns */}
        {FOOTER_COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-white text-[14px] font-bold uppercase tracking-[0.5px] mb-3.5">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[13px] transition-colors duration-200 text-[#8bc88b] no-underline hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="pt-5 flex justify-between text-[12px] border-t border-white/10 text-[#5a8a5a]">
        <span>© 2025 Trường Đại Học Nông Lâm TP. HCM. Bản quyền thuộc về nhà trường.</span>
        <span>Thiết kế bởi Phòng Công nghệ thông tin - NLU</span>
      </div>
    </footer>
  );
}