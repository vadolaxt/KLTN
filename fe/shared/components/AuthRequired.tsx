"use client";

import { ReactNode, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Loader2, ShieldAlert } from "lucide-react";
import TopBar from "@/shared/components/TopBar";
import Header from "@/shared/components/Header";
import NavBar from "@/shared/components/NavBar";
import Footer from "@/shared/components/Footer";

interface AuthRequiredProps {
  children: ReactNode;
  featureName?: string;
}

const getAuthSnapshot = () => {
  if (typeof window === "undefined") return "checking";
  return localStorage.getItem("isLogin") === "true" ? "authed" : "guest";
};

const subscribeToAuth = (onStoreChange: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("auth-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("auth-change", onStoreChange);
  };
};

export default function AuthRequired({
  children,
  featureName = "chức năng này",
}: AuthRequiredProps) {
  const authStatus = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, () => "checking");

  if (authStatus === "authed") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col font-vietnam bg-gray-light">
      <TopBar />
      <Header />
      <NavBar />

      <main className="relative flex-1 overflow-hidden bg-[linear-gradient(135deg,#f7fbf4_0%,#ffffff_50%,#fff8e1_100%)] px-4 py-16 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(45,122,45,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(45,122,45,0.05)_1px,transparent_1px)] bg-[size:44px_44px]" />

        <section className="relative mx-auto flex max-w-3xl flex-col items-center rounded-lg border border-green-main/15 bg-white/95 px-6 py-12 text-center shadow-[0_24px_70px_rgba(26,74,26,0.18)] sm:px-10">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-lg border-2 border-gold bg-green-pale text-green-dark shadow-[0_10px_28px_rgba(45,122,45,0.18)]">
            {authStatus === "checking" ? (
              <Loader2 size={30} className="animate-spin" />
            ) : (
              <ShieldAlert size={30} />
            )}
          </div>

          <p className="text-[12px] font-extrabold uppercase tracking-[2px] text-green-main">
            Khu vực dành cho thí sinh
          </p>
          <h1 className="mt-2 text-[28px] font-black leading-tight text-green-dark">
            {authStatus === "checking" ? "Đang kiểm tra đăng nhập" : "Vui lòng đăng nhập"}
          </h1>
          <p className="mt-3 max-w-[560px] text-[15px] leading-7 text-text-mid">
            {authStatus === "checking"
              ? "Hệ thống đang kiểm tra phiên truy cập của thí sinh."
              : `Thí sinh cần đăng nhập để sử dụng ${featureName}. Sau khi đăng nhập, thí sinh có thể tiếp tục thao tác ngay trên cổng tuyển sinh.`}
          </p>

          {authStatus === "guest" && (
            <Link
              href="/login"
              className="group relative mt-7 inline-flex h-12 overflow-hidden rounded-lg border-2 border-green-main bg-green-main px-6 text-[15px] font-extrabold text-white shadow-[0_12px_28px_rgba(45,122,45,0.24)] transition-all hover:-translate-y-0.5 hover:border-green-dark hover:shadow-[0_16px_36px_rgba(26,74,26,0.32)]"
            >
              <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,#1a4a1a_0%,#2d7a2d_54%,#0d2b0d_100%)] transition-transform duration-500 group-hover:translate-x-0" />
              <span className="relative flex items-center justify-center gap-2">
                <LockKeyhole size={18} />
                Đăng nhập ngay
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
