import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';
import ProfileSidebar from './components/ProfileSidebar';
import ProfileHeader from './components/ProfileHeader';
import Link from 'next/link';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-gray-light">
      <TopBar />
      <Header />
      <NavBar />

      {/* BREADCRUMB */}
      <div className="bg-green-pale px-10 py-[14px] flex items-center gap-2 text-[13px] text-text-mid border-b border-gray-mid">
        <Link href="/" className="text-green-main font-semibold hover:text-green-dark hover:underline">🏠 Trang chủ</Link>
        <span className="text-text-light">›</span>
        <Link href="#" className="text-green-main font-semibold hover:text-green-dark hover:underline">Dịch vụ tuyển sinh</Link>
        <span className="text-text-light">›</span>
        <span>Quản lý hồ sơ thí sinh</span>
      </div>

      {/* PAGE WRAP */}
      <main className="flex-1 grid grid-cols-[260px_1fr] min-h-[calc(100vh-200px)] bg-gray-light">
        {/* SIDEBAR */}
        <aside className="bg-white border-r border-gray-mid py-[30px]">
          <ProfileSidebar />
        </aside>

        {/* MAIN CONTENT */}
        <div className="py-[32px] px-[36px]">
          <ProfileHeader />
          <div className="bg-white border-1.5 border-t-0 border-gray-mid rounded-b-xl p-[36px]">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
