"use client";
import React, { useState, useEffect, useCallback } from "react";
import Logo from "./Logo";
import { navlinks } from "../constants/NavLinks";
import Link from "next/link";
import NavLink from "./NavLink";
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
import { clearAllUserCaches, UserCache } from "@/lib/userCache";

const buttonUnderlineTailwind =
  "hover:no-underline  relative after:content-[''] after:absolute after:w-full after:h-[1px] after:bottom-1 after:left-0 after:bg-current after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:ease-out after:duration-200";

export default function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    // First check localStorage cache
    const cachedUser = UserCache.get();
    if (cachedUser !== null) {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // If no cache, verify with server using httpOnly cookies
    try {
      const response = await fetch("/api/user/me", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          // Populate the cache with user data
          UserCache.set({
            name: data.user.name,
            email: data.user.email,
            avatarId: data.user.avatarId ?? 0,
            pronouns: data.user.pronouns,
            role: data.user.role,
            dateOfBirth: data.user.dateOfBirth,
          });
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

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
      setIsAuthenticated(false);
      router.push(result.redirect);
    }
  }
  const showLayout = useLayoutVisibility();
  const isDashboard = pathname === "/dashboard";
  const isHomePage = pathname === "/";

  return (
    showLayout && (
      <div className="h-14 flex px-8 items-center justify-between border-b border-mysecondary/15 shadow-sm shadow-mysecondary/5 bg-mybackground/95 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="transition-transform duration-200 hover:scale-105">
            <Logo />
          </Link>
          <div className="font-navbar flex items-center gap-6">
            {navlinks
              .filter(
                (link) =>
                  !(
                    isHomePage &&
                    !isAuthenticated &&
                    link.path === "/dashboard"
                  )
              )
              .map((link) => (
                <NavLink key={link.id} href={link.path}>
                  {link.name}
                </NavLink>
              ))}
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="h-full flex items-center gap-4">
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
          {!isLoading && (
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <MyNotifications />
                  <Popover>
                    <PopoverTrigger>
                      <UserAvatar className="w-9 h-9 hover:ring-2 hover:ring-mysecondary/40 rounded-full transition-all duration-200 hover:scale-105" />
                    </PopoverTrigger>
                    <PopoverContent className="flex flex-col gap-1 p-2 border-mysecondary/20 w-fit mr-2 mt-3 rounded-xl shadow-lg shadow-mysecondary/10 bg-mybackground">
                      <Link href="/profile">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-myforeground hover:bg-mysecondary/10 rounded-lg"
                        >
                          Profile
                        </Button>
                      </Link>
                      <hr className="border-mysecondary/15 my-1" />
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-myforeground hover:bg-mysecondary/10 rounded-lg"
                        onClick={logout}
                      >
                        Logout
                      </Button>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <Link href="/login">
                  <Button className="bg-mysecondary hover:bg-mysecondary-hover text-white shadow-md shadow-mysecondary/25 hover:shadow-lg hover:shadow-mysecondary/30">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    )
  );
}
