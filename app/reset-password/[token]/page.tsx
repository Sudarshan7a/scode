import { PasswordResetForm } from "./PasswordResetForm";
import Logo from "@/components/Logo";

// Adapt to Next.js 15 PageProps expecting params: Promise<any>
export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <div
      className="flex flex-col items-center pt-20 px-4 min-h-screen w-full bg-mysecondary/40 dark:bg-background transition-colors bg-[linear-gradient(135deg,rgba(255,152,25,0.24),rgba(60,141,227,0.20))]"
    >
      <Logo className="mb-12 scale-150" />
      <div className="w-full max-w-md rounded-2xl p-8 border border-mysecondary/25 bg-white/85 dark:bg-[#1f1f1f]/85 backdrop-blur-xl shadow-[0_4px_28px_-6px_rgba(0,0,0,0.25)] relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
        />
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
            Choose a new password
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed max-w-prose">
            Your new password must be 8+ characters and include upper & lower
            case letters and a number.
          </p>
          {token?.length ? (
            <PasswordResetForm token={token} />
          ) : (
            <div className="rounded-md border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.05] p-4 text-sm text-neutral-600 dark:text-neutral-300">
              Invalid reset link. Please request a new one.
            </div>
          )}
          <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center mt-6">
            Problems? Request a new link from the{" "}
            <a
              href="/forgot-password"
              className="text-mysecondary hover:text-mysecondary-hover font-medium"
            >
              forgot password page
            </a>
            .
          </div>
        </div>
      </div>
    </div>
  );
}
