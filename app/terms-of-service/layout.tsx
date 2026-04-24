import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | S-Code",
  description:
    "Review the terms of service for S-Code. Understand the rules, guidelines, and policies governing your use of our coding platform.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
