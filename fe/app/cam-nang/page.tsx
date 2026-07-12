import type { Metadata } from 'next';
import HandbookView from '@/features/handbook/handbook.view';

export const metadata: Metadata = {
  title: 'Cẩm nang tuyển sinh - Trường Đại học Nông Lâm TP.HCM',
  description: 'Thông tin tuyển sinh, hướng nghiệp chuyên sâu và điểm tin chính thức từ trang tuyển sinh NLU.',
};

export default function HandbookPage() {
  return <HandbookView />;
}
