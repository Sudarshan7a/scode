"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SignupFormValues } from "@/types/authTypes";
import OAuthSection from "../common/OAuthSection";
import FormDivider from "../common/FormDivider";
import SignupEmailPasswordForm from "./SignupEmailPasswordForm";
import TermsAndPrivacy from "../common/TermsAndPrivacy";
import { useToast, TOAST_MESSAGES } from "@/hooks/useToast";
export function MySignupForm() {
  const router = useRouter();
  const { success, error } = useToast();

  // Handler for OAuth signup
  const handleOAuthSignup = (_providerId: string): void => {
    console.log("OAuth signup with provider:", _providerId);
    // TODO: Implement OAuth signup flow
    // Implement actual OAuth flow here (e.g., signIn(providerId))
  };

  // Handler for email/password signup
  const handleEmailPasswordSubmit = async (
    values: SignupFormValues
  ): Promise<{
    ok: boolean;
    message?: string;
    redirect?: string;
    fieldErrors?: Partial<Record<keyof SignupFormValues | "root", string>>;
  }> => {
    // Add signup logic here (API call, error handling, etc.)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await res.json();

      if (!res.ok || !result.ok) {
        error(result.message ?? TOAST_MESSAGES.AUTH.SIGNUP_ERROR);
        return {
          ok: false,
          message: result.message,
          fieldErrors: result.fieldErrors,
        };
      }

      success(result.message ?? TOAST_MESSAGES.AUTH.SIGNUP_SUCCESS);

      // Redirect or show success message
      if (result.redirect) {
        router.push(result.redirect);
      }

      return { ok: true, message: result.message, redirect: result.redirect };
    } catch (err) {
      const message = `Unexpected signup error: ${err}`;
      error(TOAST_MESSAGES.AUTH.SIGNUP_ERROR);
      return { ok: false, message };
    }
  };

  return (
    <div
      className=" bg-background min-w-md mx-auto rounded-xl p-4 md:p-5 border backdrop-blur-md relative overflow-hidden
      border-mysecondary/25 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.15)]
      "
    >
      {/* soft themed gradient overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
      />
      <div className="relative z-10">
        {/* OAuth Provider Section */}
        <OAuthSection onOAuthLogin={handleOAuthSignup} />

        {/* Divider */}
        <FormDivider text="or continue with email" />

        {/* Email/Password Signup Form */}
        <SignupEmailPasswordForm
          onSubmit={handleEmailPasswordSubmit}
          buttonText="Sign Up"
        />

        {/* Terms & Privacy */}
        <div className="mt-4 text-xs text-white">
          <TermsAndPrivacy text="By signing up, you agree to our" />
        </div>
      </div>
    </div>
  );
}

export default MySignupForm;
