'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  ArrowRight, 
  AlertCircle,
  Loader2,
  User,
  CreditCard
} from 'lucide-react';

interface AdminRegisterProps {
  register: (data: { firstName: string; lastName: string; email: string; identity: string }) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  switchToLogin: () => void;
}

export default function AdminRegister({ 
  register, 
  isLoading, 
  error, 
  switchToLogin 
}: AdminRegisterProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [identity, setIdentity] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [identityError, setIdentityError] = useState('');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const identityPattern = /^\d{9,12}$/; // CMND/CCCD 9-12 digits

  const validate = () => {
    let isValid = true;

    if (!lastName.trim()) {
      setLastNameError('Vui lòng nhập Họ');
      isValid = false;
    } else {
      setLastNameError('');
    }

    if (!firstName.trim()) {
      setFirstNameError('Vui lòng nhập Tên');
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (!email) {
      setEmailError('Vui lòng nhập email');
      isValid = false;
    } else if (!emailPattern.test(email)) {
      setEmailError('Email không hợp lệ (vd: admin@nlu.edu.vn)');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!identity) {
      setIdentityError('Vui lòng nhập số CCCD/CMND');
      isValid = false;
    } else if (!identityPattern.test(identity)) {
      setIdentityError('Số CCCD/CMND phải gồm 9 - 12 chữ số');
      isValid = false;
    } else {
      setIdentityError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        identity: identity.trim()
      });
    }
  };

  return (
    <div className="w-full max-w-[460px] rounded-2xl border border-gray-mid bg-white p-8 shadow-[0_20px_50px_rgba(45,122,45,0.08)]">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-pale text-green-dark border border-green-main/10 shadow-sm">
          <ShieldCheck size={22} />
        </div>
        <p className="text-[11px] font-black uppercase tracking-[2px] text-green-main">
          Hệ thống Quản trị
        </p>
        <h1 className="mt-1 text-2xl font-black text-green-dark tracking-tight">
          Đăng ký tài khoản Admin
        </h1>
        <p className="mt-2 text-xs text-text-light font-medium leading-relaxed">
          Tạo tài khoản quản trị mới để hỗ trợ công tác tuyển sinh trực tuyến của trường.
        </p>
      </div>

      {/* Global Error */}
      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-xs font-semibold text-red-600">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-[0.8px] text-text-mid">
              Họ
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-main/60" size={14} />
              <input
                type="text"
                placeholder="Nguyễn"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  if (lastNameError) setLastNameError('');
                }}
                className="h-11 w-full rounded-xl border border-gray-mid bg-gray-light/30 pl-9 pr-3 text-xs text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white"
                required
              />
            </div>
            {lastNameError && <p className="text-[10px] font-bold text-red-500">{lastNameError}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-extrabold uppercase tracking-[0.8px] text-text-mid">
              Tên
              <span className="ml-0.5 text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-main/60" size={14} />
              <input
                type="text"
                placeholder="Văn An"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  if (firstNameError) setFirstNameError('');
                }}
                className="h-11 w-full rounded-xl border border-gray-mid bg-gray-light/30 pl-9 pr-3 text-xs text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white"
                required
              />
            </div>
            {firstNameError && <p className="text-[10px] font-bold text-red-500">{firstNameError}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-[0.8px] text-text-mid">
            Email cơ quan
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={16} />
            <input
              type="email"
              placeholder="an.nv@nlu.edu.vn"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              className="h-11 w-full rounded-xl border border-gray-mid bg-gray-light/30 pl-11 pr-4 text-xs text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:ring-2 focus:ring-green-pale"
              required
            />
          </div>
          {emailError && <p className="text-[10px] font-bold text-red-500">{emailError}</p>}
        </div>

        {/* CCCD / CMND */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-extrabold uppercase tracking-[0.8px] text-text-mid">
            Số CCCD / CMND
            <span className="ml-0.5 text-red-500">*</span>
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 text-green-main" size={16} />
            <input
              type="text"
              placeholder="Nhập 9 hoặc 12 số"
              value={identity}
              onChange={(e) => {
                setIdentity(e.target.value);
                if (identityError) setIdentityError('');
              }}
              className="h-11 w-full rounded-xl border border-gray-mid bg-gray-light/30 pl-11 pr-4 text-xs text-text-dark outline-none transition-all hover:border-green-light hover:bg-white focus:border-green-main focus:bg-white focus:ring-2 focus:ring-green-pale"
              required
            />
          </div>
          {identityError && <p className="text-[10px] font-bold text-red-500">{identityError}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 mt-4 rounded-xl bg-green-main hover:bg-green-dark text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:bg-green-main/50"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Đang đăng ký...
            </>
          ) : (
            <>
              Đăng ký Admin
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Switch mode */}
      <div className="mt-6 text-center text-xs text-text-mid pt-4 border-t border-gray-light">
        <span>Đã có tài khoản quản trị? </span>
        <button
          type="button"
          onClick={switchToLogin}
          className="font-extrabold text-green-main hover:text-green-dark hover:underline"
        >
          Quay lại Đăng nhập
        </button>
      </div>
    </div>
  );
}
