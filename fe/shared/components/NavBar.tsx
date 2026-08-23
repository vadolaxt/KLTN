'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '/homepage' },
  { label: 'Đề án tuyển sinh', href: '/de-an-tuyen-sinh' },
  { label: 'Tra cứu', href: '/tra-cuu' },
  { label: 'Hồ sơ', href: '/ho-so' },
  { label: 'Dự đoán trúng tuyển', href: '/du-doan' },
  { label: 'Cẩm nang', href: '/cam-nang' },
  { label: 'Liên hệ', href: '/lien-he' },
  { label: 'Tư vấn với chatbot', href: '/cau-hoi-thuong-gap' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-[64px] z-40 flex w-full items-center overflow-x-auto bg-green-dark px-1 sm:top-[80px] sm:px-6 lg:px-10">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === '/homepage'
            ? pathname === '/' || pathname === '/homepage'
            : pathname?.startsWith(link.href);

        return (
          <Link
            key={link.label}
            href={link.href}
            className={`block whitespace-nowrap border-b-[3px] px-4 py-3 text-[12px] font-semibold tracking-[0.2px] no-underline transition-all duration-200 sm:px-[18px] sm:py-[14px] sm:text-[13px] lg:px-[22px] lg:text-[14px] ${
              isActive
                ? 'text-white bg-green-main border-gold'
                : 'text-[#e0f0e0] bg-transparent border-transparent hover:bg-green-main hover:text-white'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
