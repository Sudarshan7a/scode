"use client";
import React from "react";
import Logo from "./Logo";
import { navlinks } from "../constants/NavLinks";
import Link from "next/link";
import AvatarIcon from "./icons/AvatarIcon";
import { useLayoutVisibility } from "../hooks/useLayoutVisibility";
import RegistrationForm from "./custom/schedule/RegistrationForm"; // Import the hook
import MyNotifications from "./custom/MyNotification";
import { Button } from "./ui/button";

const buttonUnderlineTailwind =
  "hover:no-underline  relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-1 after:left-0 after:bg-current after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:ease-out after:duration-200";

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
                className=" transition-colors duration-200"
              >
                <Button
                  variant="link"
                  className={`text-foreground ${buttonUnderlineTailwind}`}
                >
                  {link.name}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-full flex items-center gap-6">
            <RegistrationForm
              formType="schedule"
              buttonUnderlineStyle={buttonUnderlineTailwind}
            />
            <RegistrationForm
              formType="host"
              buttonUnderlineStyle={buttonUnderlineTailwind}
            />
            <RegistrationForm
              formType="join"
              buttonUnderlineStyle={buttonUnderlineTailwind}
            />
          </div>
          <div className="flex items-center gap-6">
            <MyNotifications />
            <Link href="/profile">
              <Button variant="link" className="hover:bg-mysecondary/20 ">
                <AvatarIcon className="scale-175" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  );
}
