"use client";

import { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  authInputClasses,
  authLabelClasses,
} from "@/components/auth/forms/formStyles";
import Logo from "@/components/Logo";

const schema = z.object({ email: z.string().trim().email("Invalid email") });
type FormValues = z.infer<typeof schema>;

async function requestReset(values: FormValues) {
  return fetch("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  }).then((r) => r.json());
}

async function handleFormSubmit(
  values: FormValues,
  form: UseFormReturn<FormValues>,
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
) {
  const data = await requestReset(values).catch(() => ({
    ok: false,
    message: "Unexpected error",
  }));
  if (!data.ok) {
    if (data.fieldErrors?.email)
      form.setError("email", { message: data.fieldErrors.email });
    toast.error(data.message || "Request failed");
    return;
  }
  toast.success(data.message || "If that email exists, a reset link was sent");
  setSubmitted(true);
}

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, rgba(255,152,25,0.24), rgba(60,141,227,0.20))",
      }}
      className="flex flex-col items-center pt-20 px-4 min-h-screen w-full bg-mysecondary/40 dark:bg-background transition-colors"
    >
      <Logo className="mb-12 scale-150" />
      <div className="w-full max-w-md rounded-2xl p-8 border border-[var(--color-mysecondary)]/25 bg-white/85 dark:bg-[#1f1f1f]/85 backdrop-blur-xl shadow-[0_4px_28px_-6px_rgba(0,0,0,0.25)] relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(60,141,227,0.16), rgba(255,152,25,0.18))",
            mask: "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.85))",
          }}
        />
        <div className="relative z-10">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50 mb-2">
            Reset your password
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed max-w-prose">
            Enter the email tied to your account. We will send a secure link to
            reset your password.
          </p>
          {!submitted && (
            <form
              onSubmit={form.handleSubmit((v) =>
                handleFormSubmit(v, form, setSubmitted)
              )}
              className="space-y-6"
            >
              <div className="space-y-2">
                <label className={authLabelClasses} htmlFor="email">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={authInputClasses}
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-mysecondary text-white rounded-md py-2.5 font-medium hover:bg-mysecondary-hover transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-mysecondary/60"
              >
                Send reset link
              </button>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Remembered it?{" "}
                <a
                  href="/login"
                  className="text-mysecondary hover:text-mysecondary-hover font-medium"
                >
                  Back to login
                </a>
              </div>
            </form>
          )}
          {submitted && (
            <div className="space-y-5">
              <div className="rounded-md border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.05] p-4">
                <h2 className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mb-1">
                  Check your inbox
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  If an account exists for that email you will receive a reset
                  link shortly.
                </p>
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  form.reset();
                }}
                className="w-full bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 text-neutral-800 dark:text-neutral-200 border border-black/10 dark:border-white/10 rounded-md py-2 text-sm transition-colors"
              >
                Try a different email
              </button>
              <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                Didn’t get it? Wait a couple minutes, then retry.{" "}
                <a
                  href="/login"
                  className="text-mysecondary hover:text-mysecondary-hover font-medium"
                >
                  Return to login
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
