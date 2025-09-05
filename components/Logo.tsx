"use client";
import { usePathname } from "next/navigation";

import React from "react";

export default function Logo({
  className,
  forceShow,
}: {
  className?: string;
  forceShow?: boolean;
}) {
  const pathname = usePathname();
  const hideLayout = !pathname.startsWith("/room");
  const shouldRender = forceShow || hideLayout;
  return (
    shouldRender && (
      <div className={`${className} flex  items-center gap-0.5`}>
        <span className="Slogo">S</span>
        <div className="_logo"></div>
        <span className="codelogo">code</span>
      </div>
    )
  );
}
