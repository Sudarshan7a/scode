"use client";

import React from "react";

interface TermsAndPrivacyProps {
  text: string;
}

export function TermsAndPrivacy({ text }: TermsAndPrivacyProps) {
  return (
    <div className="text-xs text-center text-mybackground/70">
      {text}{" "}
      <a href="#" className="text-mysecondary hover:underline">
        Terms of Service
      </a>{" "}
      and{" "}
      <a href="#" className="text-mysecondary hover:underline">
        Privacy Policy
      </a>
    </div>
  );
}

export default TermsAndPrivacy;
