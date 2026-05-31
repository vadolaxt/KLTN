import type { Metadata } from 'next';
import ContactView from '@/features/contact/contact.view';

export const metadata: Metadata = {
  title: 'Liên hệ - Trường Đại học Nông Lâm TP.HCM',
  description:
    'Thông tin trụ sở, số điện thoại liên hệ tuyển sinh và các địa chỉ công khai thông tin của Trường Đại học Nông Lâm TP.HCM.',
};

export default function ContactPage() {
  return <ContactView />;
}
