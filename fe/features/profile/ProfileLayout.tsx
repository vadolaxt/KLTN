import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';
import ProfileSidebar from './components/ProfileSidebar';

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-gray-light">
      <TopBar />
      <Header />
      <NavBar />

      {/* PAGE WRAP */}
      <main className="flex-1 grid grid-cols-[260px_1fr] min-h-[calc(100vh-200px)] bg-gray-light">
        {/* SIDEBAR */}
        <aside className="bg-white border-r border-gray-mid py-[30px]">
          <ProfileSidebar />
        </aside>

        {/* MAIN CONTENT */}
        <div className="py-[32px] px-[36px]">
          <div className="bg-white border-1.5 border-gray-mid rounded-xl p-[36px]">
            {children}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
