"use client";
import React from "react";
import Logo from "./Logo";
import { navlinks, meetingLinks } from "../constants/NavLinks";
import Link from "next/link";
import NotificationIcon from "./icons/NotificationIcon";
import AvatarIcon from "./icons/AvatarIcon";
import { useLayoutVisibility } from "../hooks/useLayoutVisibility"; // Import the hook

export default function Navbar() {
  const showLayout = useLayoutVisibility(["/login", "/signup", "/room"]); // Use the hook

  return (
    showLayout && (
      <div className="h-[52px] flex px-8 items-center justify-between border-b-1 border-b-mysecondary shadow-mysecondary/40 shadow-sm bg-mybackground">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Logo />
          </Link>
          <div className="font-navbar flex items-center gap-6">
            {navlinks.map((link) => (
              <Link
                key={link.id}
                href={link.path}
                className="text-myforeground hover:text-mysecondary transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-full flex items-center gap-6">
            {meetingLinks.map((link, index) => (
              <Link
                key={index}
                href="#"
                className="text-myforeground hover:text-mysecondary transition-colors duration-200"
              >
                {link}
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-6">
            <NotificationIcon />
            <Link href="/profile">
              <AvatarIcon />
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
