"use client";

import React from "react";
import OAuthButton from "./OAuthButton";
import { oauthProviders } from "@/constants/OAuthProviders";

interface OAuthSectionProps {
  onOAuthLogin: (providerId: string) => void;
}

export function OAuthSection({ onOAuthLogin }: OAuthSectionProps) {
  return (
    <div className="space-y-3 mb-6">
      {oauthProviders.map((provider) => (
        <OAuthButton
          key={provider.id}
          provider={provider.name}
          logo={provider.logo}
          onClick={() => onOAuthLogin(provider.id)}
        />
      ))}
    </div>
  );
}

export default OAuthSection;
