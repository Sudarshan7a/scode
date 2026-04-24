import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Rooms | S-Code",
  description:
    "Browse and join collaborative coding rooms. Find pair programming sessions, mock interviews, and open coding spaces on S-Code.",
  alternates: { canonical: "/explore" },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
