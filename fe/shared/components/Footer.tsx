// ─────────────────────────────────────────────
import Link from 'next/link';

const FOOTER_COLS = [
  {
    title: 'Tuyển sinh',
    links: [
      { label: 'Đề án tuyển sinh 2026', href: '/de-an-tuyen-sinh' },
      { label: 'Phương thức xét tuyển', href: '/de-an-tuyen-sinh#methods' },
    ],
  },
  {
    title: 'Hỗ trợ',
    links: [
      { label: 'Tra cứu tuyển sinh', href: '/tra-cuu' },
      { label: 'Quản lý hồ sơ', href: '/ho-so' },
      { label: 'Cẩm nang tuyển sinh', href: '/cam-nang' },
    ],
  },
  {
    title: 'Nhà trường',
    links: [
      { label: 'Số điện thoại: (84-28)-38966780', href: '#' },
      { label: 'Số fax: 84-28-38960713', href: '#' },
      { label: 'vptruong@hcmuaf.edu.vn', href: '//ado.hcmuaf.edu.vn' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-green-dark px-4 pb-6 pt-8 text-[#a8d8a8] sm:px-6 lg:px-10 lg:pt-10">
      <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3.5 mb-3.5">
            <div>
              <div className="text-[14px] font-extrabold uppercase text-white leading-tight">
                TRƯỜNG ĐẠI HỌC NÔNG LÂM TP. HCM
              </div>
            </div>
          </div>
          <p className="text-[13px] leading-[1.7] text-[#8bc88b]">
            Địa chỉ: Khu Phố 9, phường Linh Xuân, TP. Hồ Chí Minh, Việt Nam
            <br />
            (ĐC cũ: Khu phố 6, Phường Linh Trung, Quận Thủ Đức, TP.HCM)
            <br />
            Phân hiệu Ninh Thuận: Số 8 Yên Ninh, phường Ninh Chữ, tỉnh Khánh Hòa, Việt Nam
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
      <div className="flex flex-col gap-2 border-t border-white/10 pt-5 text-[11px] text-[#5a8a5a] sm:flex-row sm:justify-between sm:text-[12px]">
        <span>© 2026 Trường Đại Học Nông Lâm TP. HCM. Bản quyền thuộc về nhà trường.</span>
        <span>Thiết kế bởi Sinh viên Khoa Công nghệ thông tin</span>
      </div>
    </footer>
  );
}
