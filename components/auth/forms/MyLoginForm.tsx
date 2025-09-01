"use client";

import React from "react";
import { LoginFormValues } from "../../../types/authTypes";
import OAuthSection from "../common/OAuthSection";
import FormDivider from "../common/FormDivider";
import EmailPasswordForm from "./EmailPasswordForm";
import TermsAndPrivacy from "../common/TermsAndPrivacy";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { logIn } from "../../../auth/nextjs/actions";

export function MyLoginForm() {
  const router = useRouter();
  // Handler for OAuth login
  const handleOAuthLogin = (_providerId: string): void => {
    console.log("OAuth login with provider:", _providerId);
    // TODO: Implement OAuth login flow
    // Here you would implement the actual OAuth flow
    // For example, with NextAuth.js you might use signIn(providerId)
  };

  // Handler for email/password login
  const handleEmailPasswordSubmit = async (
    values: LoginFormValues
  ): Promise<void> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        // Optionally show this in UI
        return;
      } else {
        toast.success(result.message || "Login successful!");
      }

      // Always redirect after successful login. Use a full navigation to ensure
      // the refresh token cookie set by the server is sent on the next request.
      const redirectPath = result.redirect || "/dashboard";
      console.log("Login successful, redirecting to:", redirectPath);
      try {
        // Prefer router.replace for SPA navigation, then force full navigation
        // only if needed to ensure cookies are present.
        router.replace(redirectPath);
        // As an extra measure, ensure browser performs a full navigation so
        // cookies set in the response are available immediately.
        if (typeof window !== "undefined") {
          // Small timeout to allow router.replace to run; fallback to location.assign
          setTimeout(() => {
            if (window.location.pathname !== redirectPath) {
              window.location.assign(redirectPath);
            }
          }, 150);
        }
      } catch {
        if (typeof window !== "undefined") {
          window.location.assign(redirectPath);
        }
      }
    } catch {
      // Handle unexpected signup error silently or with toast notification
    }
    // Add authentication logic here
    // logIn(values);
  };

  return (
    <div
      className="min-w-md mx-auto rounded-xl p-6 border backdrop-blur-md relative overflow-hidden
      border-[var(--color-mysecondary)]/25 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.15)]
      bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
      />
      <div className="relative z-10">
        {/* OAuth Provider Section */}
        <OAuthSection onOAuthLogin={handleOAuthLogin} />

        {/* Divider */}
        <FormDivider text="or continue with email" />

        {/* Email/Password Form */}
        <EmailPasswordForm
          onSubmit={handleEmailPasswordSubmit}
          buttonText="Log In"
          showRememberMe={true}
          showForgotPassword={true}
        />

        {/* Terms & Privacy */}
        <div className="mt-6 text-xs text-muted-foreground">
          <TermsAndPrivacy text="By logging in, you agree to our" />
        </div>
      </div>
    </div>
  );
}

export default MyLoginForm;
