'use client';

import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Tổng quan' },
  { id: 'methods', label: 'Phương thức' },
  { id: 'notes', label: 'Lưu ý' },
  { id: 'additional-info', label: 'Thông tin khác' },
  { id: 'contact', label: 'Liên hệ' },
];

export default function QuickNav() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;

      for (const item of NAV_ITEMS) {
        const element = document.getElementById(item.id);
        if (!element) {
          continue;
        }

        const offsetTop = element.offsetTop;
        const offsetHeight = element.offsetHeight;

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) {
      return;
    }

    const offset = 140;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;

    window.scrollTo({
      top: elementPosition - offset,
      behavior: 'smooth',
    });
  };

  return (
    <div className="sticky top-20 z-[90] flex gap-0 overflow-x-auto border-b-2 border-gray-mid bg-white px-10 shadow-sm">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => scrollToSection(item.id)}
          className={`whitespace-nowrap border-b-3 px-6 py-4 text-[14px] font-semibold transition-all duration-200 ${
            activeSection === item.id
              ? 'border-gold text-green-dark'
              : 'border-transparent text-text-mid hover:border-green-light hover:text-green-main'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
