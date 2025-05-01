"use client";

import React from "react";
import { SignupFormValues } from "./SignupEmailPasswordForm";
import OAuthSection from "../common/OAuthSection";
import FormDivider from "../common/FormDivider";
import SignupEmailPasswordForm from "./SignupEmailPasswordForm";
import TermsAndPrivacy from "../common/TermsAndPrivacy";

export function MySignupForm() {
  // Handler for OAuth signup
  const handleOAuthSignup = (providerId: string): void => {
    console.log(`Initiating ${providerId} OAuth signup flow`);
    // Implement actual OAuth flow here (e.g., signIn(providerId))
  };

  // Handler for email/password signup
  const handleEmailPasswordSubmit = (values: SignupFormValues): void => {
    console.log("Sign-up submitted:", values);
    // Add signup logic here (API call, error handling, etc.)
  };

  return (
    <div className="min-w-md mx-auto bg-myforeground shadow-sm rounded-md p-6">
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
      <div className="mt-6">
        <TermsAndPrivacy text="By signing up, you agree to our" />
      </div>
    </div>
  );
}

export default MySignupForm;
