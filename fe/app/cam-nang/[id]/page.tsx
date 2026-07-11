import type { Metadata } from 'next';
import HandbookDetailView from '@/features/handbook/handbook-detail.view';

export const metadata: Metadata = {
  title: 'Chi tiết cẩm nang tuyển sinh - Trường Đại học Nông Lâm TP.HCM',
};

interface HandbookDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function HandbookDetailPage({ params }: HandbookDetailPageProps) {
  const { id } = await params;
  return <HandbookDetailView id={id} />;
}
