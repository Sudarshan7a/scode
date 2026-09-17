"use client";

import OAuthSection from "../common/OAuthSection";
import EmailAuthUnavailableNotice from "../common/EmailAuthUnavailableNotice";
import TermsAndPrivacy from "../common/TermsAndPrivacy";
import googleAuth from "@/lib/Oauth/GoogleProvider";
import githubAuth from "@/lib/Oauth/GitHubProvider";

export function MySignupForm() {
  // Handler for OAuth signup
  const handleOAuthSignup = async (providerId: string): Promise<void> => {
    if (providerId === "google") {
      await googleAuth();
    } else if (providerId === "github") {
      await githubAuth();
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

        <EmailAuthUnavailableNotice />

        {/* Terms & Privacy */}
        <div className="mt-4 text-xs text-white">
          <TermsAndPrivacy text="By signing up, you agree to our" />
        </div>
      </div>
    </div>
  );
}

export default MySignupForm;
