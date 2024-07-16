"use client";

import React from "react";
import { LoginFormValues } from "@/types/authTypes";
import OAuthSection from "../common/OAuthSection";
import FormDivider from "../common/FormDivider";
import EmailPasswordForm from "./EmailPasswordForm";
import TermsAndPrivacy from "../common/TermsAndPrivacy";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
// import { logIn } from "@/auth/nextjs/actions";

export function MyLoginForm() {
  const router = useRouter();
  // Handler for OAuth login
  const handleOAuthLogin = (providerId: string): void => {
    // TODO: Implement OAuth login flow
    // Here you would implement the actual OAuth flow
    // For example, with NextAuth.js you might use signIn(providerId)
    console.log(`OAuth login with provider: ${providerId}`);
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
        toast.success(result.message);
      }

      // Redirect or show success message
      if (result.redirect) {
        router.push(result.redirect);
      }
    } catch {
      // Handle unexpected signup error silently or with toast notification
    }
    // Add authentication logic here
    // logIn(values);
  };

  return (
    <div className="min-w-md mx-auto bg-myforeground shadow-sm rounded-md p-6">
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
      <div className="mt-6">
        <TermsAndPrivacy text="By logging in, you agree to our" />
      </div>
    </div>
  );
}

export default MyLoginForm;
