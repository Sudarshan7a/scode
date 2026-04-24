import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | S-Code",
  description:
    "Learn about S-Code – the collaborative coding platform designed for pair programming, real-time code sync, and AI-powered assistance.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
