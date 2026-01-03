"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import Image from "next/image";
import ComingSoonDialog from "@/components/custom/ComingSoonDialog";

export interface OAuthButtonProps {
  provider: string;
  logo: string;
  onClick?: () => void;
  className?: string;
}

export default function OAuthButton({
  provider,
  logo,
  onClick,
  className = "",
}: OAuthButtonProps) {
  const [showComingSoon, setShowComingSoon] = useState(false);

  const handleClick = () => {
    // Show coming soon dialog instead of OAuth flow
    //  (true);
    if (onClick) onClick();
  };

  return (
    <>
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className={`w-full bg-mysecondary/80 dark:bg-mysecondary/80 text-mybackground hover:text-mybackground flex items-center justify-center gap-2 border border-[var(--color-myforeground)]/20 hover:cursor-pointer hover:bg-mysecondary-hover dark:hover:bg-mysecondary-hover ${className}`}
      >
        <div className="h-5 w-5 relative">
          <Image
            src={logo}
            alt={`${provider} logo`}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <span>Continue with {provider}</span>
      </Button>
      <ComingSoonDialog
        open={showComingSoon}
        onOpenChange={setShowComingSoon}
        featureName={`${provider} login`}
      />
    </>
  );
}