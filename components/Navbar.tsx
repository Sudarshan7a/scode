"use client";
import React from "react";
import Logo from "./Logo";
import { navlinks } from "../constants/NavLinks";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import { useLayoutVisibility } from "../hooks/useLayoutVisibility";
import RegistrationForm from "./custom/schedule/RegistrationForm"; // Import the hook
import MyNotifications from "./custom/MyNotification";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./../components/ui/popover";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { clearAllUserCaches } from "@/lib/userCache";

const buttonUnderlineTailwind =
  "hover:no-underline  relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-1 after:left-0 after:bg-current after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:ease-out after:duration-200";

export default function Navbar() {
  const router = useRouter();
  async function logout() {
    const res = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    const result = await res.json();
    
    // Clear all user caches from localStorage
    if (result.clearCache) {
      clearAllUserCaches();
    }
    
    if (result) {
      toast.success(result.message);
      router.push(result.redirect);
    }
  }
  const showLayout = useLayoutVisibility(); // Use the hook
  const pathname = usePathname();
  const isDashboard = pathname === "/dashboard";
  const isHomePage = pathname === "/";

  return (
    showLayout && (
      <div className="h-[52px] flex px-8 items-center justify-between border-b-1 border-b-mysecondary shadow-mysecondary/40 shadow-sm bg-mybackground">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Logo />
          </Link>
          <div className="font-navbar flex items-center gap-6">
            {navlinks
              .filter((link) => !(isHomePage && link.path === "/dashboard"))
              .map((link) => (
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
            {!isDashboard && (
              <>
                <RegistrationForm
                  formType="host"
                  buttonUnderlineStyle={buttonUnderlineTailwind}
                />
                <RegistrationForm
                  formType="join"
                  buttonUnderlineStyle={buttonUnderlineTailwind}
                />
              </>
            )}
          </div>
          <div className="flex items-center gap-6">
            <MyNotifications />
            <Popover>
              <PopoverTrigger>
                <UserAvatar className="w-9 h-9 hover:ring-2 hover:ring-mysecondary/50 rounded-full transition-all" />
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-1 px-4 py-1  border-mysecondary w-fit mr-2 mt-2 rounded-md shadow-lg">
                <Link href="/profile">
                  <Button
                    variant="link"
                    className="text-foreground hover:bg-mysecondary/20 "
                  >
                    Profile
                  </Button>
                </Link>
                <hr className="border-mysecondary" />

                <Button
                  variant="link"
                  className="text-foreground hover:bg-mysecondary/20 "
                  onClick={logout}
                >
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    )
  );
}
