"use client";

import Logo from "@/components/Logo";

export default function ForgotPasswordPage() {
  return (
    <div
      className="flex flex-col items-center pt-20 px-4 min-h-screen w-full bg-mysecondary/40 dark:bg-background transition-colors bg-[linear-gradient(135deg,rgba(255,152,25,0.24),rgba(60,141,227,0.20))]"
    >
      <Logo className="mb-12 scale-150" />
      <div className="w-full max-w-md rounded-2xl p-8 border border-mysecondary/25 bg-white/85 dark:bg-[#1f1f1f]/85 backdrop-blur-xl shadow-[0_4px_28px_-6px_rgba(0,0,0,0.25)] relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[linear-gradient(135deg,rgba(60,141,227,0.16),rgba(255,152,25,0.18))]"
          style={{
            mask: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.85))",
          }}
        />
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed max-w-prose">
            Forgot password is temporarily unavailable due to technical
            difficulties. We are working to fix this as soon as possible.
          </p>
          <div className="rounded-md border border-amber-500/30 bg-amber-100/10 p-4 text-sm text-amber-700 dark:text-amber-200">
            Password reset requests are paused right now.
          </div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-5">
            Please check back shortly.
          </div>
        </div>
      </div>
    </div>
  );
}
