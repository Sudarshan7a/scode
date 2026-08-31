"use client";

import React from "react";

export function MyLoginForm() {
  return (
    <div
      className="min-w-md mx-auto rounded-xl p-4 md:p-5 border backdrop-blur-md relative overflow-hidden
      border-mysecondary/25 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.15)]
      bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
      />
      <div className="relative z-10 space-y-3">
        <div className="rounded-md border border-amber-500/30 bg-amber-100/10 p-3 text-sm text-amber-700 dark:text-amber-200">
          Sign in is temporarily unavailable due to technical difficulties.
        </div>
        <div className="rounded-md border border-amber-500/30 bg-amber-100/10 p-3 text-sm text-amber-700 dark:text-amber-200">
          Forgot password is also temporarily unavailable. We are working to fix
          both as soon as possible.
        </div>
      </div>
    </div>
  );
}

export default MyLoginForm;
