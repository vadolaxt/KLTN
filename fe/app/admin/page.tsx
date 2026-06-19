import AdminView from '@/features/admin/admin.view';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang quản trị tuyển sinh - Trường Đại Học Nông Lâm TP. HCM',
  description: 'Hệ thống quản lý thông tin, người dùng, chỉ tiêu, điểm chuẩn và tin tức tuyển sinh.',
};

export default function AdminPage() {
  return <AdminView />;
}
