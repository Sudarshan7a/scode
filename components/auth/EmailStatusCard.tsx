"use client";
import { ReactNode } from "react";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  icon?: ReactNode;
  title: string;
  message: string | ReactNode;
  variant?: "info" | "success" | "error";
  actionLabel?: string;
  actionHref?: string;
  subtle?: string | ReactNode;
  loading?: boolean;
};

const palette: Record<string, string> = {
  info: "border-[var(--color-mysecondary)] bg-[var(--color-mybackground)]",
  success:
    "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
  error:
    "border-destructive bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300",
};

export function EmailStatusCard({
  icon,
  title,
  message,
  variant = "info",
  actionHref,
  actionLabel,
  subtle,
  loading,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[var(--color-mybackground)]">
      <div
        className={cn(
          "w-full max-w-md rounded-xl border p-8 shadow-sm transition-colors",
          palette[variant]
        )}
      >
        <div className="flex flex-col items-center text-center gap-4">
          {icon && (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-accent text-accent-foreground animate-in fade-in">
              {icon}
            </div>
          )}
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <div
            className={cn(
              "text-sm leading-relaxed",
              loading && "animate-pulse"
            )}
          >
            {message}
          </div>
          {actionHref && actionLabel && (
            <Link
              href={actionHref}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "mt-2 w-full"
              )}
            >
              {actionLabel}
            </Link>
          )}
          {subtle && (
            <div className="text-xs text-muted-foreground mt-2">{subtle}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmailStatusCard;
