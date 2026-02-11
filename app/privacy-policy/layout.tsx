import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | S-Code",
  description:
    "Read S-Code's privacy policy. Learn how we handle, protect, and store your data on our collaborative coding platform.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
