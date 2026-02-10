import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Error Boundary Test | S-Code",
  robots: { index: false, follow: false },
};

export default function TestErrorBoundariesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
