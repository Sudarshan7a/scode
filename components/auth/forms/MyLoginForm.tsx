"use client";

import React from "react";
import { LoginFormValues } from "@/types/authTypes";
import OAuthSection from "../common/OAuthSection";
import FormDivider from "../common/FormDivider";
import EmailPasswordForm from "./EmailPasswordForm";
import TermsAndPrivacy from "../common/TermsAndPrivacy";
import { useRouter } from "next/navigation";
import { useToast, TOAST_MESSAGES } from "@/hooks/useToast";
import { UserCache, AvatarCache } from "@/lib/userCache";
import googleAuth from "@/lib/Oauth/GoogleProvider";
import githubAuth from "@/lib/Oauth/GitHubProvider";

export function MyLoginForm() {
  const router = useRouter();
  const { success, error } = useToast();

  // Handler for OAuth login
  const handleOAuthLogin = async (providerId: string): Promise<void> => {
    if (providerId === "google") {
      await googleAuth();
    } else if (providerId === "github") {
      await githubAuth();
    }
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
        error(result.message || TOAST_MESSAGES.AUTH.LOGIN_ERROR);
        // Optionally show this in UI
        return;
      } else {
        success(result.message || TOAST_MESSAGES.AUTH.LOGIN_SUCCESS);

        // Cache user data from login response
        if (result.user) {
          const avatarId = result.user.avatarId ?? 0; // Default to 0 if undefined
          UserCache.set({
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            avatarId: avatarId,
            pronouns: result.user.pronouns,
            role: result.user.role,
            dateOfBirth: result.user.dateOfBirth,
          });

          // Cache avatar separately
          AvatarCache.set(avatarId);

          // Notify other components about auth state change
          window.dispatchEvent(new Event("auth-change"));
        }
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
      className="min-w-md mx-auto rounded-xl p-4 md:p-5 border backdrop-blur-md relative overflow-hidden
      border-mysecondary/25 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.15)]
      bg-background"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
      />
      <div className="relative z-10">
        {/* OAuth Provider Section */}
        <OAuthSection onOAuthLogin={handleOAuthLogin} />

        <div className="mt-4 rounded-md border border-amber-500/30 bg-amber-100/10 p-3 text-sm text-amber-700 dark:text-amber-200">
          New users should continue with Google or GitHub. Existing users can
          still log in with email and password.
        </div>

        {/* Divider */}
        <FormDivider text="existing users can continue with email" />

        {/* Email/Password Form */}
        <EmailPasswordForm
          onSubmit={handleEmailPasswordSubmit}
          buttonText="Log In"
          showRememberMe={true}
          showForgotPassword={true}
        />

        {/* Terms & Privacy */}
        <div className="mt-4 text-xs text-muted-foreground">
          <TermsAndPrivacy text="By logging in, you agree to our" />
        </div>
      </div>
    </div>
  );
}

export default MyLoginForm;
