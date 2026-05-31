import Link from 'next/link';
import { Building2, ExternalLink, FileText, Globe2, GraduationCap, MapPin, Phone } from 'lucide-react';

import TopBar from '@/shared/components/TopBar';
import Header from '@/shared/components/Header';
import NavBar from '@/shared/components/NavBar';
import Footer from '@/shared/components/Footer';
import { CONTACT_DATA } from './constants/contact_data';

const sectionTitleClass = 'border-l-5 border-gold pl-4 text-[28px] font-extrabold text-green-dark';

export default function ContactView() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-light font-vietnam">
      <TopBar />
      <Header />
      <NavBar />

      <div className="border-b border-gray-mid bg-green-pale px-10 py-[14px] text-[13px] text-text-mid">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-semibold text-green-main hover:text-green-dark hover:underline">
            Trang chủ
          </Link>
          <span className="text-text-light">/</span>
          <span>Liên hệ</span>
        </div>
      </div>

      <main className="flex-1">
        <section className="bg-white px-10 py-10">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-3 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
              Thông tin liên hệ
            </div>
            <h1 className="max-w-[780px] border-l-5 border-gold pl-5 text-[42px] font-black uppercase leading-tight text-green-dark">
              {CONTACT_DATA.hero.title}
            </h1>
            <p className="mt-4 max-w-[820px] text-[15px] leading-[1.75] text-text-mid">
              {CONTACT_DATA.hero.subtitle}
            </p>
          </div>
        </section>

        <section className="px-10 py-10">
          <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-6 lg:grid-cols-3">
            {CONTACT_DATA.contactChannels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                target={channel.href.startsWith('http') ? '_blank' : undefined}
                rel={channel.href.startsWith('http') ? 'noreferrer' : undefined}
                className="rounded-lg border-1.5 border-gray-mid bg-white p-5 transition-all hover:border-green-light hover:shadow-[0_8px_24px_rgba(45,122,45,0.12)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md bg-green-pale text-green-main">
                  {channel.label.includes('điện thoại') ? <Phone size={22} /> : <Globe2 size={22} />}
                </div>
                <div className="mb-1 text-[12px] font-bold uppercase tracking-[0.7px] text-text-light">
                  {channel.label}
                </div>
                <div className="flex items-center gap-2 text-[16px] font-extrabold text-green-dark">
                  <span>{channel.value}</span>
                  <ExternalLink size={16} className="shrink-0 text-gold" />
                </div>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-white px-10 py-12">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-8">
              <div className="mb-2 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
                Trụ sở và phân hiệu
              </div>
              <h2 className={sectionTitleClass}>Địa chỉ các trụ sở</h2>
            </div>

            <div className="overflow-x-auto rounded-lg border-1.5 border-gray-mid">
              <table className="w-full min-w-[860px] border-collapse bg-white">
                <thead>
                  <tr className="bg-gray-light">
                    <th className="border-b-2 border-gray-mid px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px] text-text-mid">STT</th>
                    <th className="border-b-2 border-gray-mid px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px] text-text-mid">Loại trường</th>
                    <th className="border-b-2 border-gray-mid px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px] text-text-mid">Tên trường</th>
                    <th className="border-b-2 border-gray-mid px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-[0.6px] text-text-mid">Địa điểm</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTACT_DATA.campuses.map((campus) => (
                    <tr key={campus.index} className="border-b border-gray-mid last:border-0">
                      <td className="px-4 py-4 text-[13px] font-extrabold text-green-main">{campus.index}</td>
                      <td className="px-4 py-4 text-[13px] font-bold text-text-dark">{campus.type}</td>
                      <td className="px-4 py-4 text-[13px] text-text-mid">{campus.name}</td>
                      <td className="px-4 py-4 text-[13px] text-text-mid">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="mt-0.5 shrink-0 text-gold" />
                          <span>{campus.location}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="px-10 py-12">
          <div className="mx-auto max-w-[1180px]">
            <div className="mb-8">
              <div className="mb-2 text-[13px] font-bold uppercase tracking-[2px] text-green-main">
                Công khai thông tin
              </div>
              <h2 className={sectionTitleClass}>Hoạt động của cơ sở đào tạo</h2>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {CONTACT_DATA.publicLinks.map((item) => {
                const content = (
                  <>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-green-pale text-green-main">
                      {item.label === 'Chương trình đào tạo' ? <GraduationCap size={20} /> : item.label === 'Cơ sở vật chất' ? <Building2 size={20} /> : <FileText size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-extrabold text-green-dark">
                        {item.label}
                      </div>
                      <div className="mt-1 break-words text-[13px] text-text-mid">
                        {item.value}
                      </div>
                    </div>
                    {item.href && <ExternalLink size={16} className="shrink-0 text-text-light" />}
                  </>
                );

                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-4 rounded-lg border-1.5 border-gray-mid bg-white p-5 transition-all hover:border-green-light hover:shadow-[0_8px_24px_rgba(45,122,45,0.12)]"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={item.label} className="flex items-start gap-4 rounded-lg border-1.5 border-gray-mid bg-white p-5">
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
