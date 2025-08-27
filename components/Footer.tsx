"use client";

import React from "react";
import { useLayoutVisibility } from "../hooks/useLayoutVisibility"; // Import the hook
import Link from "next/link";
import Logo from "./Logo";
import FooterLinkList from "./Footer/FooterLinkList";
import FooterTextSection from "./Footer/FooterTextSection";
import FooterBottomSection from "./Footer/FooterBottomSection";

// import FooterLinkList from "./footer/FooterLinkList"; // Import the new component
// import FooterTextSection from "./footer/FooterTextSection"; // Import the new component
// import FooterBottomSection from "./footer/FooterBottomSection"; // Import the new bottom section component
import {
  supportLinks,
  navigationLinks,
  socialLinks,
} from "@/constants/FooterLinks.ts";

export default function Footer() {
  const showLayout = useLayoutVisibility(); // Use the hook

  return (
    showLayout && (
      <footer className="bg-mybackground text-myforeground  pt-6 pb-4 px-8 md:px-10 lg:px-12 xlg:px-20 border-t border-mysecondary relative">
        <div className="pb-4 ml-6 scale-150 w-fit">
          <Link href="/">
            <Logo />
          </Link>
        </div>
        <div className="flex pl-4  justify-between gap-8 font-mysecondary">
          <div className=" flex w-full  gap-8 lg:gap-4 justify-around">
            {/* Support */}
            <FooterLinkList title="Support" links={supportLinks} />

            {/* Navigation Links */}
            <FooterLinkList title="Navigation Links" links={navigationLinks} />

            {/* Social Links */}
            <FooterLinkList title="Social Links" links={socialLinks} />

            {/* Use the new component */}
          </div>
          <FooterTextSection />
        </div>

        {/* Bottom Section */}
        <FooterBottomSection />
      </footer>
    )
  );
}
