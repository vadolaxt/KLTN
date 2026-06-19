'use client';

import React, { useState } from 'react';
import { 
  LockKeyhole, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface AdminLoginProps {
  login: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  switchToRegister: () => void;
}

export default function AdminLogin({ 
  login, 
  isLoading, 
  error, 
  switchToRegister 
}: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let isValid = true;
    if (!email) {
      setEmailError('Vui lòng nhập email');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError('Định dạng email không hợp lệ');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Vui lòng nhập mật khẩu');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Mật khẩu tối thiểu 6 ký tự');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      login(email, password);
    }
  };

  return (
    <div className="w-full max-w-[460px] rounded-2xl border border-gray-mid bg-white p-8 shadow-[0_20px_50px_rgba(45,122,45,0.08)]">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-pale text-green-dark border border-green-main/10 shadow-sm">
          <LockKeyhole size={22} />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[2px] text-green-main">
          Hệ thống Quản trị
        </p>
        <h1 className="mt-1 text-2xl font-black text-green-dark tracking-tight">
          Cổng Tuyển Sinh NLU
        </h1>
        <p className="mt-2 text-xs text-text-light font-medium leading-relaxed">
          Đăng nhập bằng tài khoản quản trị viên để quản lý hồ sơ, tin tức, và đề án tuyển sinh.
        </p>
      </div>

      {/* Global Error */}
      {error && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Credentials Helper */}
      <div className="mb-6 p-3 bg-gray-light border border-gray-mid rounded-lg text-[11px] text-text-mid font-medium">
        💡 <strong className="text-green-dark font-extrabold">Tài khoản quản trị seed từ BE:</strong><br />
        Email: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-mid">admin@nlu.edu.vn</code><br />
        Mật khẩu: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-mid">Admin@1234</code>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-[0.8px] text-text-mid">
            Email Quản trị
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={16} />
            <input
              type="email"
              placeholder="admin@nlu.edu.vn"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className="h-12 w-full rounded-xl border border-gray-mid bg-gray-light/30 pl-11 pr-4 text-xs text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:ring-2 focus:ring-green-pale"
              required
            />
          </div>
          {emailError && <p className="text-[11px] font-bold text-red-500 mt-1">{emailError}</p>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-[0.8px] text-text-mid">
            Mật khẩu
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <div className="relative">
            <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={16} />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (passwordError) setPasswordError('');
              }}
              className="h-12 w-full rounded-xl border border-gray-mid bg-gray-light/30 pl-11 pr-4 text-xs text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:ring-2 focus:ring-green-pale"
              required
            />
          </div>
          {passwordError && <p className="text-[11px] font-bold text-red-500 mt-1">{passwordError}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 mt-4 rounded-xl bg-green-main hover:bg-green-dark text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-green-main/50"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Đang xác thực...
            </>
          ) : (
            <>
              Đăng nhập quản trị
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Switch mode */}
      <div className="mt-8 text-center text-xs text-text-mid pt-4 border-t border-gray-light">
        <span>Yêu cầu quyền quản trị? </span>
        <button
          type="button"
          onClick={switchToRegister}
          className="font-extrabold text-green-main hover:text-green-dark hover:underline"
        >
          Đăng ký tài khoản Admin mới
        </button>
      </div>
    </div>
  );
}
