// ─────────────────────────────────────────────
// Navbar — Navigation bar
// ─────────────────────────────────────────────

'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Trang chủ', href: '#' },
  { label: 'Giới thiệu', href: '#' },
  { label: 'Tuyển sinh', href: '#' },
  { label: 'Đào tạo', href: '#' },
  { label: 'Nghiên cứu', href: '#' },
  { label: 'Tin tức', href: '#' },
  { label: 'Liên hệ', href: '#' },
];

export default function Navbar() {
  const [active, setActive] = useState('Trang chủ');

  return (
    <nav className="w-full px-10 flex items-center bg-green-dark">
      {NAV_LINKS.map((link) => {
        const isActive = active === link.label;
        return (
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => {
              e.preventDefault();
              setActive(link.label);
            }}
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