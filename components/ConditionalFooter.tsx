"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function ConditionalFooter() {
  const pathname = usePathname();
  const isProfilePage = pathname?.startsWith("/profile");

  // Don't show footer on profile pages
  if (isProfilePage) {
    return null;
  }

  return <Footer />;
}
