import type { Metadata } from "next";
import Profile from "@/components/profile/Profile";
import React from "react";

export const metadata: Metadata = {
  title: "Profile | S-Code",
  robots: { index: false, follow: false },
};

function page() {
  return (
    <div className=" flex items-center gap-0 h-[calc(100vh-52px)]">
      <Profile />
    </div>
  );
}

export default page;
