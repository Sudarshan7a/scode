import React from "react";
import Logo from "./Logo";
import { navlinks, meetingLinks } from "../constants/NavLinks";
import Link from "next/link";
import NotificationIcon from "./icons/NotificationIcon";
import AvatarIcon from "./icons/AvatarIcon";

export default function Navbar() {
  return (
    <div className="h-[52px] flex px-8 items-center justify-between border-b-2 border-b-secondary shadow-secondary/30 shadow-md bg-background">
      <div className="flex items-center gap-6">
        <Link href="/">
          <Logo />
        </Link>
        <div className="font-navbar flex items-center gap-6">
          {navlinks.map((link) => (
            <Link
              key={link.id}
              href={link.path}
              className="text-foreground hover:text-secondary transition-colors duration-200"
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
              className="text-foreground hover:text-secondary transition-colors duration-200"
            >
              {link}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <NotificationIcon />
          <AvatarIcon />
        </div>
      </div>
    </div>
  );
}
