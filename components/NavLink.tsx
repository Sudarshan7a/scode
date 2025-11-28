"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (isActive) {
      e.preventDefault();
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn("transition-colors duration-200", className)}
    >
      <Button
        variant="link"
        className={cn(
          "text-foreground hover:no-underline relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-1 after:left-0 after:bg-current after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:ease-out after:duration-200",
          isActive && "after:scale-x-100"
        )}
      >
        {children}
      </Button>
    </Link>
  );
}
