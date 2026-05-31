"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlidingActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
}

export default function SlidingActionButton({
  children,
  className,
  disabled,
  icon,
  isLoading = false,
  loadingText = "Đang xử lý...",
  ...props
}: SlidingActionButtonProps) {
  return (
    <button
      className={cn(
        "group relative h-12 w-full overflow-hidden rounded-lg border-2 border-green-main bg-green-main px-5 text-[15px] font-extrabold text-white shadow-[0_12px_28px_rgba(45,122,45,0.24)] transition-all duration-300 hover:-translate-y-0.5 hover:border-green-dark hover:shadow-[0_16px_36px_rgba(26,74,26,0.32)] disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,#1a4a1a_0%,#2d7a2d_54%,#0d2b0d_100%)] transition-transform duration-500 group-hover:translate-x-0" />
      <span className="relative flex items-center justify-center gap-2">
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : icon}
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
}
