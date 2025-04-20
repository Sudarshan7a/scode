import React from "react";
import Logo from "./Logo";
import { links } from "../constants/NavLinks";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="h-[52px] flex px-4 - items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/">
          <Logo />
        </Link>
        <div className="font-navbar flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.id}
              href={link.path}
              className=" text-foreground hover:text-secondary transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
      <div></div>
    </div>
  );
}
