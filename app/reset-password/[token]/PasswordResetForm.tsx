"use client";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { strongPassword } from "@/types/authTypes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  authInputClasses,
  authLabelClasses,
} from "@/components/auth/forms/formStyles";

const schema = z
  .object({
    password: strongPassword,
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

type Values = z.infer<typeof schema>;

export function PasswordResetForm({ token }: { token: string }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<Values>({ resolver: zodResolver(schema) });

  function submit(values: Values) {
    startTransition(async () => {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, token }),
      }).then((r) => r.json());

      if (!res.ok) {
        if (res.fieldErrors) {
          Object.entries(res.fieldErrors as Record<string, unknown>).forEach(
            ([k, v]) => {
              if (typeof v === "string" && v)
                form.setError(k as keyof Values, { message: v });
            }
          );
        }
        toast.error(res.message || "Reset failed");
        return;
      }
      toast.success(res.message || "Password reset successful");
      router.push(res.redirect || "/login");
    });
  }

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="space-y-6 relative z-10"
      noValidate
    >
      <div className="space-y-2">
        <label className={authLabelClasses} htmlFor="password">
          New password
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          className={authInputClasses}
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <label className={authLabelClasses} htmlFor="confirmPassword">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          className={authInputClasses}
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          id="showPassword"
          type="checkbox"
          className="h-4 w-4"
          checked={showPassword}
          onChange={(e) => setShowPassword(e.target.checked)}
        />
        <label
          htmlFor="showPassword"
          className="text-xs text-neutral-600 dark:text-neutral-400"
        >
          Show passwords
        </label>
      </div>
      <button
        disabled={pending}
        type="submit"
        className="w-full bg-mysecondary text-white rounded-md py-2.5 font-medium disabled:opacity-60 hover:bg-mysecondary-hover transition-colors shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-mysecondary/60"
      >
        {pending ? "Resetting..." : "Reset password"}
      </button>
    </form>
  );
}
