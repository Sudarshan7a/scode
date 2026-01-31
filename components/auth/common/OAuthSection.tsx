"use client";

import React from "react";
import OAuthButton from "./OAuthButton";
import { oauthProviders } from "@/constants/OAuthProviders";

interface OAuthSectionProps {
  onOAuthLogin: (providerId: string) => void | Promise<void>;
}

export function OAuthSection({ onOAuthLogin }: OAuthSectionProps) {
  // Create a stable map of handlers to avoid inline arrow recreation in render loop
  const handlers = React.useMemo(() => {
    const map: Record<string, () => void> = {};
    oauthProviders.forEach((p) => {
      map[p.id] = () => onOAuthLogin(p.id);
    });
    return map;
  }, [onOAuthLogin]);

  return (
    <div className="space-y-3 mb-6">
      {oauthProviders.map((provider) => (
        <OAuthButton
          key={provider.id}
          provider={provider.name}
          logo={provider.logo}
          onClick={handlers[provider.id]}
        />
      ))}
    </div>
  );
}

export default OAuthSection;
