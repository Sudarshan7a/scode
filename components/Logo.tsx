"use client";
import { usePathname } from "next/navigation";

import React from "react";

export default function Logo({ className }: { className?: string }) {
  const pathname = usePathname();
  const hideLayout = !pathname.startsWith("/room");
  return (
    hideLayout && (
      <div className={`${className} flex items-center gap-0.5`}>
        <span className="Slogo">S</span>
        <div className="_logo"></div>
        <span className="codelogo">code</span>
      </div>
    )
  );
}
