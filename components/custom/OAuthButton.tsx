"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

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
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      console.log(`Authenticating with ${provider}`);
      // Default OAuth logic could go here
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleClick}
      className={`w-full bg-mysecondary/80 text-mybackground hover:text-mybackground flex items-center justify-center gap-2 border border-[var(--color-myforeground)]/20 hover:cursor-pointer hover:bg-mysecondary/90 hover:scale-105 ${className}`}
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
  );
}
