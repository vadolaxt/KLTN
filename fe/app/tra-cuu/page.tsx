import type { Metadata } from 'next';
import SearchView from '@/features/search/search.view';

export const metadata: Metadata = {
  title: 'Tra cứu ngành tuyển sinh 2026 - Trường Đại học Nông Lâm TP.HCM',
  description:
    'Tra cứu mã xét tuyển, mã ngành, chỉ tiêu dự kiến và tổ hợp xét tuyển năm 2026 của Trường Đại học Nông Lâm TP.HCM.',
};

export default function SearchPage() {
  return <SearchView />;
}
