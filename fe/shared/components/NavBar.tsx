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
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full px-10 flex items-center bg-green-dark">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === '/homepage'
            ? pathname === '/' || pathname === '/homepage'
            : pathname?.startsWith(link.href);

        return (
          <Link
            key={link.label}
            href={link.href}
            className={`text-[14px] font-semibold px-[22px] py-[14px] block tracking-[0.2px] transition-all duration-200 border-b-[3px] no-underline ${
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
