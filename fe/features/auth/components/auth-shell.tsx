"use client";

import { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck2,
  GraduationCap,
  MessageCircleQuestion,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import TopBar from "@/shared/components/TopBar";
import Header from "@/shared/components/Header";
import NavBar from "@/shared/components/NavBar";
import Footer from "@/shared/components/Footer";

type AuthMode = "login" | "register" | "forgot";

interface AuthShellProps {
  mode: AuthMode;
  children: ReactNode;
}

const AUTH_COPY: Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    description: string;
    ctaHref: string;
    ctaLabel: string;
  }
> = {
  login: {
    eyebrow: "Hệ thống hỗ trợ tuyển sinh",
    title: "Chào mừng thí sinh",
    description:
      "Thí sinh đăng nhập để quản lý hồ sơ, theo dõi tiến độ và nhận hỗ trợ nhanh khi cần.",
    ctaHref: "/register",
    ctaLabel: "Tạo tài khoản mới",
  },
  register: {
    eyebrow: "Hệ thống hỗ trợ tuyển sinh",
    title: "Chào mừng thí sinh",
    description:
      "Thí sinh đăng nhập để quản lý hồ sơ, theo dõi tiến độ và nhận hỗ trợ nhanh khi cần.",
    ctaHref: "/login",
    ctaLabel: "Đã có tài khoản",
  },
  forgot: {
    eyebrow: "Hệ thống hỗ trợ tuyển sinh",
    title: "Chào mừng thí sinh",
    description:
      "Thí sinh đăng nhập để quản lý hồ sơ, theo dõi tiến độ và nhận hỗ trợ nhanh khi cần.",
    ctaHref: "/login",
    ctaLabel: "Quay lại đăng nhập",
  },
};

const JOURNEY_ITEMS = [
  {
    icon: GraduationCap,
    title: "Hồ sơ rõ ràng",
    description: "Các trường nhập liệu bám sát thông tin thí sinh cần cung cấp.",
  },
  {
    icon: MessageCircleQuestion,
    title: "Tư vấn tức thì",
    description: "Chatbot hỗ trợ khi cần hỏi nhanh về ngành, điểm và quy trình.",
  },
  {
    icon: CalendarCheck2,
    title: "Theo dõi tiến độ",
    description: "Đăng nhập để quản lý hồ sơ và các bước xét tuyển quan trọng.",
  },
];

export default function AuthShell({ mode, children }: AuthShellProps) {
  const copy = AUTH_COPY[mode];

  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-white">
      <TopBar />
      <Header />
      <NavBar />

      <main className="relative flex-1 overflow-hidden bg-white px-4 py-10 sm:px-6 lg:px-10">
        <div className="relative mx-auto grid w-full max-w-6xl items-stretch gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="hidden min-h-[520px] overflow-hidden rounded-lg bg-[linear-gradient(145deg,#0d2b0d_0%,#1a4a1a_52%,#2d7a2d_100%)] p-6 text-white shadow-[0_18px_50px_rgba(26,74,26,0.24)] lg:flex lg:flex-col lg:justify-between">
            <div className="relative">
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-white/10" />
              <div className="absolute right-6 top-20 h-24 w-24 rounded-full border border-gold/40" />

              <div className="mb-10 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border-2 border-gold bg-white/10 text-[14px] font-black">
                  NLU
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[2px] text-gold-light">
                    {copy.eyebrow}
                  </p>
                  <p className="text-[13px] text-white/70">Trường Đại học Nông Lâm TP. HCM</p>
                </div>
              </div>

              <h1 className="max-w-[520px] text-[30px] font-black leading-tight text-white">
                {copy.title}
              </h1>
              <p className="mt-3 max-w-[440px] text-[14px] leading-6 text-white/80">
                {copy.description}
              </p>

              <div className="mt-6 space-y-4">
                {JOURNEY_ITEMS.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="flex gap-3">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-gold-light">
                        <Icon size={20} />
                      </div>
                      <div>
                        <h2 className="text-[13px] font-extrabold text-white">{item.title}</h2>
                        <p className="mt-1 text-[12px] leading-5 text-white/70">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative border-t border-white/12 pt-5">
              <div className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-white/78">
                <ShieldCheck size={18} className="text-gold-light" />
                Bảo mật phiên đăng nhập và xác thực OTP qua email
              </div>
              <Link
                href={copy.ctaHref}
                className="group inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-[13px] font-bold text-white transition-all hover:border-gold-light hover:bg-white/20"
              >
                <Sparkles size={16} className="text-gold-light" />
                {copy.ctaLabel}
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </section>

          <section className="flex min-h-[520px] items-center justify-center">
            {children}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
