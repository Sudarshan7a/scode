import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Email Change | S-Code",
  robots: { index: false, follow: false },
};

export default function VerifyEmailChangeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
