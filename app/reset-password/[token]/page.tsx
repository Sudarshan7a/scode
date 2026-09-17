"use client";

import Link from "next/link";
import Logo from "@/components/Logo";
import EmailAuthUnavailableNotice from "@/components/auth/common/EmailAuthUnavailableNotice";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-mysecondary/40 px-4 pt-20 transition-colors dark:bg-background bg-[linear-gradient(135deg,rgba(255,152,25,0.24),rgba(60,141,227,0.20))]">
      <Logo className="mb-12 scale-150" />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-mysecondary/25 bg-white/85 p-8 shadow-[0_4px_28px_-6px_rgba(0,0,0,0.25)] backdrop-blur-xl dark:bg-[#1f1f1f]/85">
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
              Password reset unavailable
            </h1>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Password reset is temporarily unavailable while we resolve a
              third-party service issue.
            </p>
          </div>
          <EmailAuthUnavailableNotice />
          <Link
            href="/login"
            className="block text-center text-sm font-medium text-mysecondary hover:text-mysecondary-hover"
          >
            Return to login
          </Link>
        </div>
      </div>
    </div>
  );
}
