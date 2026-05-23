import type { Metadata } from 'next';
import { IntroView } from '@/features/intro/intro.view';

export const metadata: Metadata = {
  title: 'Đề án tuyển sinh 2026 - Trường Đại học Nông Lâm TP.HCM',
  description:
    'Tóm tắt đề án tuyển sinh đại học chính quy và cao đẳng ngành Giáo dục Mầm non năm 2026 của Trường Đại học Nông Lâm TP.HCM.',
};

export default function AdmissionSchemePage() {
  return <IntroView />;
}
