"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export interface OAuthButtonProps {
  provider: string;
  logo: string;
  onClick?: () => void | Promise<void>;
  className?: string;
}

export default function OAuthButton({
  provider,
  logo,
  onClick,
  className = "",
}: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (onClick) {
      setIsLoading(true);
      try {
        await onClick();
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className={`w-full bg-mysecondary/80 dark:bg-mysecondary/80 text-mybackground hover:text-mybackground flex items-center justify-center gap-2 border border-myforeground/20 hover:cursor-pointer hover:bg-mysecondary-hover dark:hover:bg-mysecondary-hover disabled:opacity-70 ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <div className="h-5 w-5 relative">
          <Image
            src={logo}
            alt={`${provider} logo`}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
      <span>{isLoading ? "Connecting..." : `Continue with ${provider}`}</span>
    </Button>
  );
}